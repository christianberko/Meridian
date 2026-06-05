import SwiftUI

struct ReadyScreen: View {
    let goalName: String
    let onComplete: () -> Void

    @State private var drawProgress: CGFloat = 0

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            RadialGradient(
                gradient: Gradient(colors: [Color.meridianGold.opacity(0.10), Color.clear]),
                center: .center,
                startRadius: 0,
                endRadius: 240
            )
            .ignoresSafeArea()
            .allowsHitTesting(false)

            VStack(spacing: 0) {
                Spacer()

                VStack(spacing: MSpacing.xl) {
                    threadAnimation
                        .frame(height: 80)
                        .padding(.horizontal, MSpacing.xl)

                    VStack(spacing: MSpacing.md) {
                        Text("Your first thread\nis ready.")
                            .font(.fraunces(size: 36))
                            .foregroundStyle(Color.meridianOffWhite)
                            .multilineTextAlignment(.center)

                        if !goalName.isEmpty {
                            Text("\"\(goalName)\"")
                                .font(.fraunces(size: 18))
                                .foregroundStyle(Color.meridianGold)
                        }

                        Text("Every entry you log is a node on your thread.\nShow your work — keep building.")
                            .font(.mBody)
                            .foregroundStyle(Color.meridianWarmGrey)
                            .multilineTextAlignment(.center)
                            .lineSpacing(4)
                            .padding(.horizontal, MSpacing.base)
                    }
                }

                Spacer()

                Button(action: onComplete) {
                    Text("Start building →")
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundStyle(Color.meridianCharcoal)
                        .frame(maxWidth: .infinity)
                        .frame(height: 54)
                        .background(
                            LinearGradient(
                                colors: [Color(hex: "#F8B547"), Color.meridianGold],
                                startPoint: .top, endPoint: .bottom
                            )
                        )
                        .clipShape(Capsule())
                        .shadow(color: Color.meridianGold.opacity(0.35), radius: 16, x: 0, y: 8)
                }
                .padding(.horizontal, MSpacing.xl)
                .padding(.bottom, MSpacing.hero)
            }
        }
        .onAppear {
            withAnimation(MAnimation.thread.delay(0.3)) {
                drawProgress = 1.0
            }
        }
    }

    private var threadAnimation: some View {
        Canvas { ctx, size in
            let nodeRadius: CGFloat = 6
            let padding = nodeRadius + 4
            let y = size.height / 2
            let startX = padding
            let endX = size.width - padding

            let gradientStops = [
                Gradient.Stop(color: Color.meridianSilver, location: 0),
                Gradient.Stop(color: Color.meridianGold, location: 1)
            ]

            // Draw line
            let lineEnd = startX + (endX - startX) * drawProgress
            if lineEnd > startX {
                var line = Path()
                line.move(to: CGPoint(x: startX, y: y))
                line.addLine(to: CGPoint(x: lineEnd, y: y))
                ctx.stroke(line, with: .linearGradient(
                    Gradient(stops: gradientStops),
                    startPoint: CGPoint(x: startX, y: y),
                    endPoint: CGPoint(x: endX, y: y)
                ), lineWidth: 2)
            }

            // Start node (silver)
            var startNode = Path()
            startNode.addEllipse(in: CGRect(x: startX - nodeRadius, y: y - nodeRadius, width: nodeRadius * 2, height: nodeRadius * 2))
            ctx.fill(startNode, with: .color(Color.meridianSilver.opacity(0.8)))

            // End node (gold, with glow)
            if drawProgress > 0.9 {
                let glowRadius: CGFloat = 14
                var glow = Path()
                glow.addEllipse(in: CGRect(x: endX - glowRadius, y: y - glowRadius, width: glowRadius * 2, height: glowRadius * 2))
                ctx.fill(glow, with: .color(Color.meridianGold.opacity(0.2)))

                var endNode = Path()
                endNode.addEllipse(in: CGRect(x: endX - nodeRadius, y: y - nodeRadius, width: nodeRadius * 2, height: nodeRadius * 2))
                ctx.fill(endNode, with: .color(Color.meridianGold))
            }

        }
    }
}
