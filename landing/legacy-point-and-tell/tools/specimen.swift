// Product specimen: the Fovea Bar render cut out of its ground via macOS Vision (subject lifting),
// CoreImage only, no external deps. The object lands on the museum black (#1A1512), so the matte is
// eroded, not dilated as the hero's is: any surviving pixel of the render's white ground reads as a
// bright rim. Then softened by half a pixel, optionally faded out along the bottom edge (the render
// is cropped there), masked, and trimmed to the alpha bounding box.
// usage: swift tools/specimen.swift <src.png> <out.png> [--mask <mask.png>] [--erode 1] [--blur .5]
//        [--fade-bottom 0] [--margin 2] [--key 0] [--width 0] [--crop x,y,w,h] [--min-width 1360]
//   --mask <png>      also write the finished matte, grey, for inspection
//   --erode N         shrink the matte by N px (CIMorphologyMinimum radius N; 1 = PIL's MinFilter(3), 2 = MinFilter(5))
//   --blur R          gaussian radius on the matte after the erode; .5 takes the staircase off curves
//   --fade-bottom N   multiply the alpha by a ramp over the last N source px, so the cropped bottom
//                     edge dissolves into the black instead of ending on a hard cut (try 240)
//   --margin N        transparent px kept around the silhouette when trimming
//   --key T           key the ground: pixels of luminance ≥ T (0–1) that connect to the frame's edge
//                     are ground; united with Vision's matte when Vision finds a subject, used alone
//                     when it does not (then T defaults to .975: this render's ground is 252–254, its
//                     bezel about 192). 0 = Vision only, unless Vision finds nothing
//   --width W         lanczos-downscale the finished cutout to exactly W px wide (1360 = 2× the 680px
//                     display) if the PNG is too heavy; 0 = keep the source pixels (~1490 here)
//   --crop x,y,w,h    crop the source before Vision, in source pixels, rows from the top (the history's
//                     iPhone is a crop of a keynote photograph)
//   --min-width N     warn when the output is narrower than N px (1360 for the product; 0 silences it)
// Prints the input size, the instances found, the matte's coverage, the alpha bounding box and the
// output size, and warns when the output is under 1360 px wide — which is also the tell that Vision
// lifted only the bar, or only the screen.
import Foundation
import CoreGraphics
import CoreImage
import CoreImage.CIFilterBuiltins
import Vision

// Arguments — a flag given twice keeps the last value, so make-specimen.sh can pass defaults first
let argv = Array(CommandLine.arguments.dropFirst())
var maskPath: String? = nil
var erode = 1.0, blur = 0.5, fade = 0.0, key = 0.0
var margin = 2, width = 0, minWidth = 1360
var cropRect: CGRect? = nil
var positional: [String] = []
func usage() -> Never {
  FileHandle.standardError.write("usage: swift tools/specimen.swift <src.png> <out.png> [--mask <mask.png>] [--erode 1] [--blur .5] [--fade-bottom 0] [--margin 2] [--key 0] [--width 0] [--crop x,y,w,h] [--min-width 1360]\n".data(using: .utf8)!)
  exit(2)
}
var i = 0
while i < argv.count {
  let a = argv[i]
  let v = i + 1 < argv.count ? argv[i + 1] : nil
  switch a {
  case "--mask":        guard let v = v else { usage() }; maskPath = v; i += 2
  case "--erode":       guard let v = v else { usage() }; erode = Double(v) ?? erode; i += 2
  case "--blur":        guard let v = v else { usage() }; blur = Double(v) ?? blur; i += 2
  case "--fade-bottom": guard let v = v else { usage() }; fade = Double(v) ?? fade; i += 2
  case "--margin":      guard let v = v else { usage() }; margin = Int(v) ?? margin; i += 2
  case "--key":         guard let v = v else { usage() }; key = Double(v) ?? key; i += 2
  case "--width":       guard let v = v else { usage() }; width = Int(v) ?? width; i += 2
  case "--min-width":   guard let v = v else { usage() }; minWidth = Int(v) ?? minWidth; i += 2
  case "--crop":
    guard let v = v else { usage() }
    let p = v.split(separator: ",").compactMap { Double($0.trimmingCharacters(in: .whitespaces)) }
    guard p.count == 4, p[2] > 0, p[3] > 0 else { usage() }
    cropRect = CGRect(x: p[0], y: p[1], width: p[2], height: p[3]); i += 2
  default: positional.append(a); i += 1
  }
}
guard positional.count == 2 else { usage() }
let inputURL = URL(fileURLWithPath: positional[0])
let outputURL = URL(fileURLWithPath: positional[1])
try FileManager.default.createDirectory(at: outputURL.deletingLastPathComponent(), withIntermediateDirectories: true)

guard var src = CIImage(contentsOf: inputURL) else { fatalError("cannot read \(inputURL.path)") }
if let c = cropRect {
  // Rows from the top, like every number this tool prints. CoreImage's origin is bottom-left, so the crop's
  // CI y is the source height minus the crop's bottom row. Translated back to the origin, so Vision and the
  // bitmap scans below see a plain w × h image.
  let full = src.extent
  let ci = CGRect(x: full.minX + c.minX, y: full.minY + (full.height - (c.minY + c.height)), width: c.width, height: c.height).intersection(full)
  guard !ci.isEmpty else { fatalError("--crop lies outside the \(Int(full.width))x\(Int(full.height)) image") }
  src = src.cropped(to: ci).transformed(by: CGAffineTransform(translationX: -ci.minX, y: -ci.minY))
  print("crop x \(Int(c.minX)) y \(Int(c.minY)) w \(Int(ci.width)) h \(Int(ci.height)) (rows from the top) of \(Int(full.width))x\(Int(full.height))")
}
let cs = src.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CIContext(options: [.workingColorSpace: cs, .outputColorSpace: cs])
let extent = src.extent
let W = Int(extent.width), H = Int(extent.height)
print("input \(W)x\(H), colour space \(cs.name.map { String($0) } ?? "untagged → sRGB")")

// Share of the frame a matte covers (its green channel, which is what blendWithMask reads). A sanity
// number for the log: this render's object is about 66% of the frame.
func coverage(_ m: CIImage) -> Double {
  let f = CIFilter.areaAverage(); f.inputImage = m; f.extent = extent
  var px = [UInt8](repeating: 0, count: 4)
  ctx.render(f.outputImage!, toBitmap: &px, rowBytes: 4, bounds: CGRect(x: 0, y: 0, width: 1, height: 1), format: .RGBA8, colorSpace: cs)
  return Double(px[1]) / 255
}

// 1. Vision: foreground instance mask, all instances united (the bar and the monitor may come back as
//    two). Vision can also find nothing at all — a screen-filling object on a plain ground reads as a
//    background to it — and then the key below carries the whole matte.
var visionMatte: CIImage? = nil
let handler = VNImageRequestHandler(ciImage: src, orientation: .up, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
if let obs = request.results?.first, !obs.allInstances.isEmpty {
  print("vision: \(obs.allInstances.count) instance(s)")
  // 2. Full-resolution soft matte (single channel), scaled to the source
  let matteBuffer = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
  var m = CIImage(cvPixelBuffer: matteBuffer)
  if m.extent.size != extent.size {
    m = m.transformed(by: CGAffineTransform(scaleX: extent.width / m.extent.width, y: extent.height / m.extent.height))
  }
  visionMatte = m.cropped(to: extent)
  print(String(format: "vision matte covers %.1f%% of the frame", coverage(visionMatte!) * 100))
} else {
  print("vision: no foreground subject — keying the ground instead")
}

// 3. The key: the ground is whatever is near-white AND connected to the frame's edge. Luminance is
//    thresholded at --key, then flood-filled from the border, so a bright patch inside the screen
//    stays object and the bezel's silver (about 192) stays object; only the render's ground (252–254)
//    goes. Used alone when Vision found nothing, united with Vision's matte when --key is set.
func keyMatte(threshold t: Double) -> CIImage {
  guard let cg = ctx.createCGImage(src, from: extent) else { fatalError("render failed") }
  var rgba = [UInt8](repeating: 0, count: W * H * 4)
  let c = CGContext(data: &rgba, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4,
                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
  c.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
  let thr = t * 255
  var light = [Bool](repeating: false, count: W * H)
  for p in 0..<(W * H) {
    let r = Double(rgba[p * 4]), g = Double(rgba[p * 4 + 1]), b = Double(rgba[p * 4 + 2])
    light[p] = 0.2126 * r + 0.7152 * g + 0.0722 * b >= thr
  }
  var ground = [Bool](repeating: false, count: W * H)
  var queue = [Int](); queue.reserveCapacity(W * H / 4)
  func seed(_ p: Int) { if light[p] && !ground[p] { ground[p] = true; queue.append(p) } }
  for x in 0..<W { seed(x); seed((H - 1) * W + x) }
  for y in 0..<H { seed(y * W); seed(y * W + W - 1) }
  var head = 0
  while head < queue.count {
    let p = queue[head]; head += 1
    let x = p % W, y = p / W
    if x > 0 { seed(p - 1) }
    if x < W - 1 { seed(p + 1) }
    if y > 0 { seed(p - W) }
    if y < H - 1 { seed(p + W) }
  }
  var gray = [UInt8](repeating: 255, count: W * H)
  for p in 0..<(W * H) where ground[p] { gray[p] = 0 }
  let gc = CGContext(data: &gray, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W,
                     space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue)!
  return CIImage(cgImage: gc.makeImage()!).cropped(to: extent)
}
var matte: CIImage
if let v = visionMatte, key <= 0 {
  matte = v
} else {
  let t = key > 0 ? key : 0.975
  let k = keyMatte(threshold: t)
  print(String(format: "key matte (luminance ≥ %.3f, flood-filled from the border, is ground) covers %.1f%% of the frame", t, coverage(k) * 100))
  if let v = visionMatte {
    let u = CIFilter.maximumCompositing(); u.inputImage = k; u.backgroundImage = v
    matte = u.outputImage!.cropped(to: extent)
    print(String(format: "union with vision covers %.1f%% of the frame", coverage(matte) * 100))
  } else {
    matte = k
  }
}

// 4. Erode: the object lands on near-black, so the matte shrinks by --erode px and the ground never
//    survives in a partial pixel. clampedToExtent first: outside the frame CoreImage is transparent,
//    and an unclamped minimum would also eat the rows where the object meets the frame's edge.
if erode > 0 {
  let f = CIFilter.morphologyMinimum(); f.inputImage = matte.clampedToExtent(); f.radius = Float(erode)
  matte = f.outputImage!.cropped(to: extent)
}

// 5. Soften the cut by half a pixel so the silhouette is not stair-stepped
if blur > 0 {
  let f = CIFilter.gaussianBlur(); f.inputImage = matte.clampedToExtent(); f.radius = Float(blur)
  matte = f.outputImage!.cropped(to: extent)
}

// 6. Optional bottom fade. CoreImage's origin is bottom-left, so the PNG's bottom edge is y = extent.minY.
//    A vertical ramp: 0 there, 1 at --fade-bottom px up, 1 beyond (a linear gradient holds its end colours),
//    multiplied into the matte so both the cutout and the inspection matte carry it.
if fade > 0 {
  let g = CIFilter.linearGradient()
  g.point0 = CGPoint(x: extent.minX, y: extent.minY);        g.color0 = CIColor.black
  g.point1 = CGPoint(x: extent.minX, y: extent.minY + fade); g.color1 = CIColor.white
  let ramp = g.outputImage!.cropped(to: extent)
  let m = CIFilter.multiplyCompositing(); m.inputImage = matte; m.backgroundImage = ramp
  matte = m.outputImage!.cropped(to: extent)
}

// 7. Cutout = source masked by the matte (blendWithMask over an empty image: colour × matte, alpha =
//    matte). The PNG writer stores straight alpha, so the file holds the source colour with the matte as
//    alpha and the browser does the multiply at composite time; the erode above is what keeps the ground
//    out of the partial pixels.
let cut = CIFilter.blendWithMask(); cut.inputImage = src; cut.backgroundImage = CIImage.empty(); cut.maskImage = matte
var out = cut.outputImage!.cropped(to: extent)

// 8. Alpha bounding box: render to a CGImage, draw it into an RGBA8 bitmap (probe.swift's layout: row 0
//    is the top of the picture) and scan the alpha channel. Under 2/255 counts as empty, so blur dust
//    does not widen the box.
guard let cg = ctx.createCGImage(out, from: extent) else { fatalError("render failed") }
var data = [UInt8](repeating: 0, count: W * H * 4)
let bmp = CGContext(data: &data, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4,
                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
bmp.draw(cg, in: CGRect(x: 0, y: 0, width: W, height: H))
var minX = W, maxX = -1, minRow = H, maxRow = -1
for row in 0..<H {
  for x in 0..<W where data[(row * W + x) * 4 + 3] >= 2 {
    if x < minX { minX = x }; if x > maxX { maxX = x }
    if row < minRow { minRow = row }; if row > maxRow { maxRow = row }
  }
}
guard maxX >= 0 else { fatalError("the cutout is empty: nothing above alpha 2/255") }
print("alpha box: x \(minX)..\(maxX), y \(minRow)..\(maxRow) (rows from the top; this render's object: x 28..1513, y 261..1023)")

// 9. Trim with --margin px of air, clamped to the frame. CoreImage's y runs upward, so rows flip.
let x0 = max(0, minX - margin), x1 = min(W - 1, maxX + margin)
let r0 = max(0, minRow - margin), r1 = min(H - 1, maxRow + margin)
let box = CGRect(x: extent.minX + CGFloat(x0), y: extent.minY + CGFloat(H - 1 - r1),
                 width: CGFloat(x1 - x0 + 1), height: CGFloat(r1 - r0 + 1))
let toOrigin = CGAffineTransform(translationX: -box.minX, y: -box.minY)
out = out.cropped(to: box).transformed(by: toOrigin)
var maskOut = matte.cropped(to: box).transformed(by: toOrigin)

// 10. Optional downscale to exactly --width px (Lanczos), for the file size
if width > 0 && width != Int(box.width) {
  let s = Float(width) / Float(box.width)
  let target = CGRect(x: 0, y: 0, width: CGFloat(width), height: (box.height * CGFloat(s)).rounded())
  func scaled(_ i: CIImage) -> CIImage {
    let f = CIFilter.lanczosScaleTransform(); f.inputImage = i; f.scale = s; f.aspectRatio = 1
    return f.outputImage!.cropped(to: target)
  }
  out = scaled(out); maskOut = scaled(maskOut)
}

func write(_ image: CIImage, _ url: URL) throws {
  let rect = image.extent.integral
  try ctx.writePNGRepresentation(of: image.cropped(to: rect), to: url, format: .RGBA8, colorSpace: cs)
  let bytes = (try? FileManager.default.attributesOfItem(atPath: url.path)[.size] as? Int) ?? 0
  print("wrote \(url.lastPathComponent) \(Int(rect.width))x\(Int(rect.height)) \(bytes / 1024) KB")
}
try write(out, outputURL)
if let m = maskPath { try write(maskOut, URL(fileURLWithPath: m)) }

let outW = Int(out.extent.integral.width)
if minWidth > 0 && outW < minWidth {
  FileHandle.standardError.write("warning: \(outW) px wide; the display wants \(minWidth) or more. Vision may have lifted only part of the subject: look at the mask, try --key .975, or check the source.\n".data(using: .utf8)!)
}
