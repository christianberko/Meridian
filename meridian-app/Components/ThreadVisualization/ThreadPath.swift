import SwiftUI

// MARK: - Variant

enum ThreadVariant: Equatable {
    case hero
    case mini
    case vertical
    case tiny

    var isVertical: Bool { self == .vertical }

    var lineWidth: CGFloat {
        switch self {
        case .hero, .vertical: return 2.0
        case .mini, .tiny:     return 1.5
        }
    }

    var nodeRadius: CGFloat {
        switch self {
        case .hero, .vertical: return 4.0
        case .mini, .tiny:     return 2.0
        }
    }

    var latestNodeRadius: CGFloat {
        switch self {
        case .hero, .vertical: return 7.0
        case .mini:            return 3.5
        case .tiny:            return 4.0
        }
    }

    var glowRadius: CGFloat {
        switch self {
        case .hero, .vertical: return 18.0
        case .mini:            return 9.0
        case .tiny:            return 11.0
        }
    }

    // Sine wave cycles across the full axis
    var frequency: CGFloat {
        switch self {
        case .vertical: return 2.0
        default:        return 1.5
        }
    }

    var padding: CGFloat {
        switch self {
        case .hero:     return 20
        case .mini:     return 8
        case .vertical: return 20
        case .tiny:     return 6
        }
    }
}

// MARK: - Node Position Computation

/// Returns node positions sorted oldest → newest, distributed on the time axis.
/// Vertical variant: oldest at bottom, newest at top.
/// Horizontal variants: oldest at left, newest at right.
func threadNodePositions(
    entries: [EvidenceEntry],
    size: CGSize,
    variant: ThreadVariant
) -> [CGPoint] {
    guard !entries.isEmpty else { return [] }

    let pad = variant.padding

    if entries.count == 1 {
        let pos = variant.isVertical
            ? CGPoint(x: size.width / 2, y: pad)
            : CGPoint(x: size.width - pad, y: size.height / 2)
        return [pos]
    }

    let minDate = entries.first!.createdAt.timeIntervalSince1970
    let maxDate = entries.last!.createdAt.timeIntervalSince1970
    let span = max(1, maxDate - minDate)

    return entries.map { entry in
        let t = CGFloat((entry.createdAt.timeIntervalSince1970 - minDate) / span)

        if variant.isVertical {
            let halfWidth = size.width / 2
            let amp = (halfWidth - pad) * 0.55
            let y = size.height - pad - t * (size.height - 2 * pad)
            let x = halfWidth + sin(t * .pi * variant.frequency * 2) * amp
            return CGPoint(x: x.clamped(to: pad...(size.width - pad)), y: y)
        } else {
            let halfHeight = size.height / 2
            let amp = (halfHeight - pad) * 0.70
            let x = pad + t * (size.width - 2 * pad)
            let y = halfHeight + sin(t * .pi * variant.frequency * 2) * amp
            return CGPoint(x: x, y: y.clamped(to: pad...(size.height - pad)))
        }
    }
}

// MARK: - Catmull-Rom Tessellation

/// Tessellates a Catmull-Rom spline through `points`, returning sampled positions.
/// `upTo` (0–1) controls how far along the path to tessellate — used for draw-on animation.
func catmullRomTessellation(
    through points: [CGPoint],
    steps: Int = 30,
    upTo progress: CGFloat = 1.0
) -> [CGPoint] {
    guard points.count >= 2 else { return points }

    let clampedProgress = min(1, max(0, progress))
    let totalSegments = points.count - 1
    let totalSteps = totalSegments * steps
    let targetSteps = max(1, Int(CGFloat(totalSteps) * clampedProgress))

    var result: [CGPoint] = []
    result.reserveCapacity(targetSteps + 1)
    result.append(points[0])

    var drawn = 0
    for seg in 0..<totalSegments {
        let p0 = seg > 0 ? points[seg - 1] : mirrorPoint(points[seg + 1], around: points[seg])
        let p1 = points[seg]
        let p2 = points[seg + 1]
        let p3 = seg + 2 < points.count ? points[seg + 2] : mirrorPoint(points[seg], around: points[seg + 1])

        for step in 1...steps {
            drawn += 1
            if drawn > targetSteps { return result }
            let t = CGFloat(step) / CGFloat(steps)
            result.append(catmullRomEval(p0: p0, p1: p1, p2: p2, p3: p3, t: t))
        }
    }
    return result
}

private func catmullRomEval(p0: CGPoint, p1: CGPoint, p2: CGPoint, p3: CGPoint, t: CGFloat) -> CGPoint {
    let t2 = t * t
    let t3 = t2 * t
    let x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t
                   + (2*p0.x - 5*p1.x + 4*p2.x - p3.x) * t2
                   + (-p0.x + 3*p1.x - 3*p2.x + p3.x) * t3)
    let y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t
                   + (2*p0.y - 5*p1.y + 4*p2.y - p3.y) * t2
                   + (-p0.y + 3*p1.y - 3*p2.y + p3.y) * t3)
    return CGPoint(x: x, y: y)
}

private func mirrorPoint(_ a: CGPoint, around b: CGPoint) -> CGPoint {
    CGPoint(x: 2 * b.x - a.x, y: 2 * b.y - a.y)
}

// MARK: - Gradient Stops

let threadGradientStops: [Gradient.Stop] = [
    .init(color: .threadStart, location: 0.00),
    .init(color: .threadMid1,  location: 0.33),
    .init(color: .threadMid2,  location: 0.67),
    .init(color: .threadEnd,   location: 1.00),
]

// MARK: - Comparable Clamp Helper

extension Comparable {
    func clamped(to range: ClosedRange<Self>) -> Self {
        min(max(self, range.lowerBound), range.upperBound)
    }
}
