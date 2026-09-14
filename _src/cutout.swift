// Вырезает животное из фото по контуру (Apple Vision, macOS 14+).
// swift src/cutout.swift вход.jpg выход.png [индекс_объекта]
// Без индекса берёт объект, который ближе всего к центру кадра.
import Foundation
import Vision
import CoreImage
import CoreImage.CIFilterBuiltins
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count >= 3 else { print("usage: cutout in out [instance]"); exit(1) }
let url = URL(fileURLWithPath: args[1])
guard let src = CGImageSourceCreateWithURL(url as CFURL, nil),
      let cg = CGImageSourceCreateImageAtIndex(src, 0, nil) else { print("не открыть"); exit(1) }

let req = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(cgImage: cg, options: [:])
try handler.perform([req])
guard let obs = req.results?.first else { print("объект не найден"); exit(2) }

var chosen = obs.allInstances
if args.count >= 4, let i = Int(args[3]) {
    chosen = IndexSet(integer: i)
} else if obs.allInstances.count > 1 {
    // берём экземпляр с наибольшей площадью маски
    var best = 0, bestArea = 0
    for i in obs.allInstances {
        let m = try obs.generateScaledMaskForImage(forInstances: IndexSet(integer: i), from: handler)
        CVPixelBufferLockBaseAddress(m, .readOnly)
        let w = CVPixelBufferGetWidth(m), h = CVPixelBufferGetHeight(m)
        let p = CVPixelBufferGetBaseAddress(m)!.assumingMemoryBound(to: Float32.self)
        var area = 0
        for k in stride(from: 0, to: w * h, by: 7) where p[k] > 0.5 { area += 1 }
        CVPixelBufferUnlockBaseAddress(m, .readOnly)
        if area > bestArea { bestArea = area; best = i }
    }
    chosen = IndexSet(integer: best)
}
print("объектов:", obs.allInstances.count, "взял:", Array(chosen))

let masked = try obs.generateMaskedImage(ofInstances: chosen, from: handler, croppedToInstancesExtent: true)
let ci = CIImage(cvPixelBuffer: masked)
let ctx = CIContext()
guard let outCG = ctx.createCGImage(ci, from: ci.extent) else { exit(3) }
let dest = CGImageDestinationCreateWithURL(URL(fileURLWithPath: args[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dest, outCG, nil)
CGImageDestinationFinalize(dest)
print("ok", outCG.width, outCG.height)
