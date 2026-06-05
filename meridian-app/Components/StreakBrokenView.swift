import SwiftUI

struct StreakBrokenView: View {
    let onLog: () -> Void
    let onDismiss: () -> Void

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                VStack(spacing: MSpacing.xl) {
                    gapVisualization

                    VStack(spacing: MSpacing.md) {
                        Text("Your thread continues.")
                            .font(.fraunces(size: 30))
                            .foregroundStyle(Color.meridianOffWhite)
                            .multilineTextAlignment(.center)

                        Text("You missed yesterday. The gap is part\nof the story too.")
                            .font(.mBody)
                            .foregroundStyle(Color.meridianWarmGrey)
                            .multilineTextAlignment(.center)
                            .lineSpacing(4)
                    }
                }

                Spacer()

                VStack(spacing: MSpacing.md) {
                    Button(action: onLog) {
                        Text("Log today's evidence →")
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

                    Text("Gaps don't break threads. Quitting does.")
                        .font(.system(size: 12))
                        .foregroundStyle(Color.meridianWarmGrey.opacity(0.5))

                    Button(action: onDismiss) {
                        Text("Continue to home")
                            .font(.system(size: 13))
                            .foregroundStyle(Color.meridianWarmGrey.opacity(0.7))
                    }
                }
                .padding(.horizontal, MSpacing.xl)
                .padding(.bottom, MSpacing.hero)
            }
        }
    }

    private var gapVisualization: some View {
        Canvas { ctx, size in
            let y = size.height / 2
            let nodeR: CGFloat = 7
            let gapStart = size.width * 0.4
            let gapEnd = size.width * 0.6
            let padL = nodeR + 4
            let padR = size.width - nodeR - 4

            // Solid line before gap (silver)
            var pre = Path()
            pre.move(to: CGPoint(x: padL, y: y))
            pre.addLine(to: CGPoint(x: gapStart, y: y))
            ctx.stroke(pre, with: .color(Color.meridianSilver.opacity(0.6)), lineWidth: 2)

            // Dotted bridge across gap
            var phase: CGFloat = 0
            while phase < (gapEnd - gapStart) {
                let x = gapStart + phase
                var dot = Path()
                dot.addEllipse(in: CGRect(x: x - 1.5, y: y - 1.5, width: 3, height: 3))
                ctx.fill(dot, with: .color(Color.meridianWarmGrey.opacity(0.35)))
                phase += 7
            }

            // Solid line after gap (gold)
            var post = Path()
            post.move(to: CGPoint(x: gapEnd, y: y))
            post.addLine(to: CGPoint(x: padR, y: y))
            ctx.stroke(post, with: .color(Color.meridianGold.opacity(0.7)), lineWidth: 2)

            // Left silver node
            var leftNode = Path()
            leftNode.addEllipse(in: CGRect(x: padL - nodeR, y: y - nodeR, width: nodeR * 2, height: nodeR * 2))
            ctx.fill(leftNode, with: .color(Color.meridianSilver.opacity(0.8)))

            // Right gold node (glowing)
            var rightGlow = Path()
            rightGlow.addEllipse(in: CGRect(x: padR - 16, y: y - 16, width: 32, height: 32))
            ctx.fill(rightGlow, with: .color(Color.meridianGold.opacity(0.15)))

            var rightNode = Path()
            rightNode.addEllipse(in: CGRect(x: padR - nodeR, y: y - nodeR, width: nodeR * 2, height: nodeR * 2))
            ctx.fill(rightNode, with: .color(Color.meridianGold))
        }
        .frame(height: 40)
        .padding(.horizontal, MSpacing.xl)
    }
}
