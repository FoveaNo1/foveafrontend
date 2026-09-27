// Subject cutout + shadow sprites via macOS Vision (subject lifting), no external deps.
// usage: swift tools/cutout.swift <crop.png> <output-dir> [dilate-px=1.5]
// Writes, all on the crop's canvas so CSS layers line up with inset: 0:
//   hardware-cutout.png    RGBA, the objects on transparent
//   hardware-mask.png      grayscale matte (debug / CSS mask)
//   hardware-shadow-6.png  black silhouette, gaussian radius 6  (tight shadow)
//   hardware-shadow-16.png black silhouette, gaussian radius 16 (soft shadow)
import Foundation
import CoreImage
import CoreImage.CIFilterBuiltins
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
  FileHandle.standardError.write("usage: swift tools/cutout.swift <crop.png> <output-dir> [dilate-px]\n".data(using: .utf8)!)
  exit(2)
}
let inputURL = URL(fileURLWithPath: args[1])
let outDir = URL(fileURLWithPath: args[2], isDirectory: true)
let dilate = args.count > 3 ? (Double(args[3]) ?? 1.5) : 1.5
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

guard let src = CIImage(contentsOf: inputURL) else { fatalError("cannot read \(inputURL.path)") }
let cs = src.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CIContext(options: [.workingColorSpace: cs, .outputColorSpace: cs])
let extent = src.extent
print("input \(Int(extent.width))x\(Int(extent.height)), colour space \(cs.name.map { String($0) } ?? "untagged → sRGB")")

// 1. Vision: foreground instance mask
let handler = VNImageRequestHandler(ciImage: src, orientation: .up, options: [:])
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let obs = request.results?.first else { fatalError("Vision found no foreground subject") }
print("instances found: \(obs.allInstances.count)")

// 2. Full-resolution soft matte (single channel), scaled to the source
let matteBuffer = try obs.generateScaledMaskForImage(forInstances: obs.allInstances, from: handler)
var matte = CIImage(cvPixelBuffer: matteBuffer)
if matte.extent.size != extent.size {
  matte = matte.transformed(by: CGAffineTransform(scaleX: extent.width / matte.extent.width, y: extent.height / matte.extent.height))
}
matte = matte.cropped(to: extent)

// 3. Dilate slightly: a white halo is invisible on a white ground, a bitten edge is not
if dilate > 0 {
  let f = CIFilter.morphologyMaximum(); f.inputImage = matte; f.radius = Float(dilate)
  matte = f.outputImage!.cropped(to: extent)
}

func write(_ image: CIImage, _ name: String) throws {
  try ctx.writePNGRepresentation(of: image.cropped(to: extent), to: outDir.appendingPathComponent(name), format: .RGBA8, colorSpace: cs)
  print("wrote \(name)")
}

// 4. Cutout = source masked by the matte (mask luminance → alpha)
let cut = CIFilter.blendWithMask(); cut.inputImage = src; cut.backgroundImage = CIImage.empty(); cut.maskImage = matte
try write(cut.outputImage!, "hardware-cutout.png")
try write(matte, "hardware-mask.png")

// 5. Shadow sprites: black silhouette through the matte, blurred
let black = CIImage(color: CIColor.black).cropped(to: extent)
let sil = CIFilter.blendWithMask(); sil.inputImage = black; sil.backgroundImage = CIImage.empty(); sil.maskImage = matte
let silhouette = sil.outputImage!.cropped(to: extent)
for radius in [6.0, 16.0] {
  let b = CIFilter.gaussianBlur(); b.inputImage = silhouette; b.radius = Float(radius)
  try write(b.outputImage!, "hardware-shadow-\(Int(radius)).png")
}
