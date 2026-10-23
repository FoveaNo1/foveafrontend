// Plate derivatives for the page-two demos (demos.js), no external deps.
// usage: swift tools/plates.swift <plate.png> <output-dir> [--quality 0.85] [--blur 7]
// Writes <name>.jpg (the sharp plate the page loads) and, with --blur, <name>-blur.jpg:
// the same plate gaussian-blurred at the given radius and written at half size. The demos
// crossfade the blurred twin in as they zoom (depth of field), so the sharp plate is only
// ever seen downscaled, which is why a JPEG is safe here.
import Foundation
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO

var args = Array(CommandLine.arguments.dropFirst())
var quality = 0.85
var blur: Double? = nil
var positional: [String] = []
while !args.isEmpty {
  let a = args.removeFirst()
  switch a {
  case "--quality": quality = Double(args.removeFirst()) ?? quality
  case "--blur": blur = Double(args.removeFirst()) ?? 7
  default: positional.append(a)
  }
}
guard positional.count == 2 else {
  FileHandle.standardError.write("usage: swift tools/plates.swift <plate.png> <output-dir> [--quality 0.85] [--blur 7]\n".data(using: .utf8)!)
  exit(2)
}
let inputURL = URL(fileURLWithPath: positional[0])
let outDir = URL(fileURLWithPath: positional[1], isDirectory: true)
try FileManager.default.createDirectory(at: outDir, withIntermediateDirectories: true)

guard let src = CIImage(contentsOf: inputURL) else { fatalError("cannot read \(inputURL.path)") }
let cs = src.colorSpace ?? CGColorSpace(name: CGColorSpace.sRGB)!
let ctx = CIContext(options: [.workingColorSpace: cs, .outputColorSpace: cs])
let extent = src.extent
let name = inputURL.deletingPathExtension().lastPathComponent
print("input \(name) \(Int(extent.width))x\(Int(extent.height))")

func writeJPEG(_ image: CIImage, _ file: String, _ q: Double) throws {
  let key = CIImageRepresentationOption(rawValue: kCGImageDestinationLossyCompressionQuality as String)
  try ctx.writeJPEGRepresentation(of: image, to: outDir.appendingPathComponent(file), colorSpace: cs, options: [key: q])
  let bytes = (try? FileManager.default.attributesOfItem(atPath: outDir.appendingPathComponent(file).path)[.size] as? Int) ?? 0
  print("wrote \(file) \(Int(image.extent.width))x\(Int(image.extent.height)) \(bytes / 1024) KB")
}

try writeJPEG(src, name + ".jpg", quality)

if let radius = blur {
  let f = CIFilter.gaussianBlur()
  f.inputImage = src.clampedToExtent()   // no transparent fringe at the edges
  f.radius = Float(radius)
  let blurred = f.outputImage!.cropped(to: extent)
  let half = blurred.transformed(by: CGAffineTransform(scaleX: 0.5, y: 0.5))
  try writeJPEG(half, name + "-blur.jpg", 0.75)
}
