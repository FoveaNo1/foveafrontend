// Analyse the mockup: background gradient column, text/button extents, hardware bounding box.
// usage: swift tools/probe.swift assets/hero-source.png
import Foundation
import CoreGraphics
import ImageIO

let path = CommandLine.arguments[1]
guard let source = CGImageSourceCreateWithURL(URL(fileURLWithPath: path) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(source, 0, nil) else { fatalError("cannot read \(path)") }
let w = img.width, h = img.height
var data = [UInt8](repeating: 0, count: w * h * 4)
let ctx = CGContext(data: &data, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
                    space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))
@inline(__always) func px(_ x: Int, _ y: Int) -> (Int, Int, Int) { let i = (y * w + x) * 4; return (Int(data[i]), Int(data[i + 1]), Int(data[i + 2])) }
@inline(__always) func lum(_ p: (Int, Int, Int)) -> Int { (p.0 * 299 + p.1 * 587 + p.2 * 114) / 1000 }
@inline(__always) func sat(_ p: (Int, Int, Int)) -> Int { max(p.0, p.1, p.2) - min(p.0, p.1, p.2) }

print("size \(w)x\(h)")
print("background column at x=40 (y%: rgb):")
for pct in stride(from: 0, through: 100, by: 5) { let y = min(h - 1, pct * (h - 1) / 100); print("  \(pct)%  y=\(y)  \(px(40, y))") }
print("background row at y=6 (x%: rgb):")
for pct in stride(from: 0, through: 100, by: 25) { let x = min(w - 1, pct * (w - 1) / 100); print("  \(pct)%  x=\(x)  \(px(x, 6))") }

// Dark rows in the top 65% = headline, subhead, button. Button = rows with a long dark run.
var textTop = -1, textBottom = -1, buttonTop = -1, buttonBottom = -1, buttonL = w, buttonR = 0
for y in 0..<(h * 65 / 100) {
  var dark = 0, runMax = 0, run = 0, firstDark = -1, lastDark = -1
  for x in 0..<w {
    if lum(px(x, y)) < 70 { dark += 1; run += 1; runMax = max(runMax, run); if firstDark < 0 { firstDark = x }; lastDark = x } else { run = 0 }
  }
  if dark > 0 { if textTop < 0 { textTop = y }; textBottom = y }
  if runMax > 120 { if buttonTop < 0 { buttonTop = y }; buttonBottom = y; buttonL = min(buttonL, firstDark); buttonR = max(buttonR, lastDark) }
}
print("dark text rows: \(textTop)..\(textBottom)")
print("button box: x \(buttonL)..\(buttonR), y \(buttonTop)..\(buttonBottom)")

// Hardware: saturated (beige) or dark pixels below 50% height.
var minX = w, maxX = 0, minY = h, maxY = 0
for y in (h / 2)..<h { for x in 0..<w { let p = px(x, y); if sat(p) > 16 || lum(p) < 170 { minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) } } }
print("hardware box: x \(minX)..\(maxX), y \(minY)..\(maxY)")

// Soft shadow / reflection extent: anything visibly non-background below 50% height (luminance < 246).
var sMinX = w, sMaxX = 0, sMinY = h, sMaxY = 0
for y in (h / 2)..<h { for x in 0..<w { if lum(px(x, y)) < 246 { sMinX = min(sMinX, x); sMaxX = max(sMaxX, x); sMinY = min(sMinY, y); sMaxY = max(sMaxY, y) } } }
print("shadow/reflection box (lum<246): x \(sMinX)..\(sMaxX), y \(sMinY)..\(sMaxY)")

// Horizon: largest luminance change along the background column between 40% and 90%.
var bestY = 0, bestD = 0
for y in (h * 40 / 100)..<(h * 90 / 100) { let d = abs(lum(px(40, y)) - lum(px(40, y - 8))); if d > bestD { bestD = d; bestY = y } }
print("strongest background change at y=\(bestY) (\(bestY * 100 / h)%), delta \(bestD)")
