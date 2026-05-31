import SwiftUI

// MARK: - Node Color Interpolation

/// Returns the interpolated thread color at normalized position t ∈ [0, 1].
/// 0 = oldest entry (silver), 1 = newest entry (gold).
func threadNodeColor(at t: CGFloat) -> Color {
    struct Stop {
        let position: CGFloat
        let r: CGFloat; let g: CGFloat; let b: CGFloat
    }
    let stops: [Stop] = [
        Stop(position: 0.00, r: 196/255, g: 196/255, b: 196/255),  // #C4C4C4
        Stop(position: 0.33, r: 216/255, g: 140/255, b:  26/255),  // #D88C1A
        Stop(position: 0.67, r: 238/255, g: 158/255, b:  32/255),  // #EE9E20
        Stop(position: 1.00, r: 245/255, g: 166/255, b:  35/255),  // #F5A623
    ]

    let clamped = min(1, max(0, t))
    for i in 0..<stops.count - 1 {
        let s0 = stops[i], s1 = stops[i + 1]
        if clamped <= s1.position {
            let f = (clamped - s0.position) / (s1.position - s0.position)
            return Color(
                red:   s0.r + (s1.r - s0.r) * f,
                green: s0.g + (s1.g - s0.g) * f,
                blue:  s0.b + (s1.b - s0.b) * f
            )
        }
    }
    return .threadEnd
}

// MARK: - Latest Node View

/// The animated latest-entry node: glowing aura ring + solid gold core.
struct LatestNodeView: View {
    let radius: CGFloat
    let glowRadius: CGFloat
    let isActive: Bool

    @State private var glowOpacity: Double = 0.22
    @State private var glowScale: CGFloat  = 1.0

    var body: some View {
        ZStack {
            if isActive {
                Circle()
                    .fill(Color.meridianGold.opacity(glowOpacity))
                    .frame(width: glowRadius * 2, height: glowRadius * 2)
                    .scaleEffect(glowScale)
            }
            Circle()
                .fill(Color.threadEnd)
                .frame(width: radius * 2, height: radius * 2)
        }
        .onAppear {
            guard isActive else { return }
            withAnimation(.easeInOut(duration: 1.5).repeatForever(autoreverses: true)) {
                glowOpacity = 0.06
                glowScale   = 1.38
            }
        }
    }
}
