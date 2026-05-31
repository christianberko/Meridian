import SwiftUI
import SwiftData

// MARK: - ThreadVisualizationView

struct ThreadVisualizationView: View {
    let entries: [EvidenceEntry]
    var variant: ThreadVariant = .hero
    var isActive: Bool = true
    var animated: Bool = true

    @State private var drawProgress: CGFloat = 0

    private var sorted: [EvidenceEntry] {
        entries.sorted { $0.createdAt < $1.createdAt }
    }

    var body: some View {
        GeometryReader { geo in
            let size = geo.size
            let positions = threadNodePositions(entries: sorted, size: size, variant: variant)

            ZStack {
                if positions.isEmpty {
                    seedNode(in: size)
                } else {
                    threadCanvas(positions: positions, size: size)
                    if let last = positions.last {
                        LatestNodeView(
                            radius: variant.latestNodeRadius,
                            glowRadius: variant.glowRadius,
                            isActive: isActive
                        )
                        .position(last)
                    }
                }
            }
            .opacity(isActive ? 1.0 : 0.4)
            .onAppear {
                if animated {
                    withAnimation(MAnimation.thread) { drawProgress = 1.0 }
                } else {
                    drawProgress = 1.0
                }
            }
        }
    }

    // MARK: - Canvas

    @ViewBuilder
    private func threadCanvas(positions: [CGPoint], size: CGSize) -> some View {
        Canvas { ctx, canvasSize in
            drawLine(into: &ctx, positions: positions, canvasSize: canvasSize)
            drawPastNodes(into: &ctx, positions: positions)
        }
    }

    private func drawLine(
        into ctx: inout GraphicsContext,
        positions: [CGPoint],
        canvasSize: CGSize
    ) {
        guard positions.count >= 2 else { return }

        let pts = catmullRomTessellation(through: positions, steps: 30, upTo: drawProgress)
        guard pts.count >= 2 else { return }

        var path = Path()
        path.move(to: pts[0])
        for pt in pts.dropFirst() { path.addLine(to: pt) }

        let gradStart = variant.isVertical
            ? CGPoint(x: canvasSize.width / 2, y: canvasSize.height)
            : CGPoint(x: 0, y: canvasSize.height / 2)
        let gradEnd = variant.isVertical
            ? CGPoint(x: canvasSize.width / 2, y: 0)
            : CGPoint(x: canvasSize.width, y: canvasSize.height / 2)

        ctx.stroke(
            path,
            with: .linearGradient(
                Gradient(stops: threadGradientStops),
                startPoint: gradStart,
                endPoint: gradEnd
            ),
            style: StrokeStyle(
                lineWidth: variant.lineWidth,
                lineCap: .round,
                lineJoin: .round
            )
        )
    }

    private func drawPastNodes(into ctx: inout GraphicsContext, positions: [CGPoint]) {
        // .tiny shows only the latest node — skip past nodes entirely
        guard variant != .tiny else { return }
        let total = positions.count
        guard total > 1 else { return }

        for i in 0..<(total - 1) {
            let t = CGFloat(i) / CGFloat(total - 1)
            let r = variant.nodeRadius
            let pos = positions[i]
            let rect = CGRect(x: pos.x - r, y: pos.y - r, width: r * 2, height: r * 2)
            ctx.fill(Path(ellipseIn: rect), with: .color(threadNodeColor(at: t)))
        }
    }

    // MARK: - Empty State

    @ViewBuilder
    private func seedNode(in size: CGSize) -> some View {
        Circle()
            .fill(Color.threadStart.opacity(0.30))
            .frame(width: variant.nodeRadius * 2, height: variant.nodeRadius * 2)
            .position(x: size.width / 2, y: size.height / 2)
    }
}

// MARK: - Preview

#Preview("Thread — all variants") {
    let now = Date()
    let goalId = UUID()

    func makeEntries(count: Int, daySpan: Double) -> [EvidenceEntry] {
        let moods = ["neutral", "good", "strong", "fire"]
        return (0..<count).map { i in
            let e = EvidenceEntry(
                goalId: goalId,
                content: "Entry \(i + 1). Worked on this for 45 minutes.",
                mood: moods[i % moods.count],
                wordCount: 30,
                createdAt: now.addingTimeInterval(-daySpan * 86400 * Double(count - i) / Double(count))
            )
            return e
        }
    }

    let full   = makeEntries(count: 10, daySpan: 18)
    let sparse = makeEntries(count: 4,  daySpan: 30)

    return ScrollView {
        VStack(alignment: .leading, spacing: MSpacing.xl) {

            label("Hero (10 entries)")
            ThreadVisualizationView(entries: full, variant: .hero)
                .frame(height: 180)
                .background(Color.meridianSurface)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))

            label("Mini (10 entries)")
            ThreadVisualizationView(entries: full, variant: .mini)
                .frame(height: 64)
                .background(Color.meridianSurface)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.md))

            label("Tiny (10 entries)")
            ThreadVisualizationView(entries: full, variant: .tiny)
                .frame(height: 44)
                .background(Color.meridianSurface)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.sm))

            label("Vertical (Thread Wall, 4 goals)")
            HStack(alignment: .bottom, spacing: MSpacing.xl) {
                ForEach(0..<4, id: \.self) { i in
                    VStack(spacing: MSpacing.xs) {
                        ThreadVisualizationView(
                            entries: i < 3 ? full : sparse,
                            variant: .vertical,
                            isActive: i < 3
                        )
                        .frame(width: 60, height: 260)
                        .background(Color.meridianSurface)
                        .clipShape(RoundedRectangle(cornerRadius: MRadius.md))
                    }
                }
            }

            label("Inactive (gone cold)")
            ThreadVisualizationView(entries: full, variant: .hero, isActive: false)
                .frame(height: 180)
                .background(Color.meridianSurface)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))

            label("Zero entries (seed node)")
            ThreadVisualizationView(entries: [], variant: .hero)
                .frame(height: 120)
                .background(Color.meridianSurface)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
        }
        .padding(MSpacing.base)
    }
    .background(Color.meridianCharcoal)
}

private func label(_ text: String) -> some View {
    Text(text.uppercased())
        .font(.mLabel)
        .foregroundStyle(Color.meridianWarmGrey)
        .kerning(1.5)
}
