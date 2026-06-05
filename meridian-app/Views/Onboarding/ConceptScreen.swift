import SwiftUI

struct ConceptScreen: View {
    let onContinue: () -> Void

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            VStack(spacing: 0) {
                Spacer()

                VStack(spacing: MSpacing.xl) {
                    conceptThread

                    VStack(spacing: MSpacing.md) {
                        Text("Show your work.")
                            .font(.fraunces(size: 36))
                            .foregroundStyle(Color.meridianOffWhite)
                            .multilineTextAlignment(.center)

                        Text("Most goal apps let you tap \u{201C}done\u{201D} and move on. Meridian makes you prove it.\n\nWrite what you actually did. Build a case file of real evidence over time.")
                            .font(.mBody)
                            .foregroundStyle(Color.meridianWarmGrey)
                            .multilineTextAlignment(.center)
                            .lineSpacing(5)
                            .padding(.horizontal, MSpacing.base)
                    }
                }

                Spacer()

                Button(action: onContinue) {
                    Text("Continue →")
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
    }

    private var conceptThread: some View {
        HStack(spacing: 0) {
            VStack(spacing: MSpacing.xs) {
                Circle()
                    .fill(Color.meridianSilver)
                    .frame(width: 14, height: 14)
                Text("DAY 1")
                    .font(.system(size: 10, weight: .semibold))
                    .kerning(0.8)
                    .foregroundStyle(Color.meridianWarmGrey)
            }

            Spacer()

            Canvas { ctx, size in
                let y = size.height / 2
                var path = Path()
                path.move(to: CGPoint(x: 0, y: y))
                path.addLine(to: CGPoint(x: size.width, y: y))
                ctx.stroke(path, with: .linearGradient(
                    Gradient(colors: [Color.meridianSilver, Color.meridianGold]),
                    startPoint: CGPoint(x: 0, y: y),
                    endPoint: CGPoint(x: size.width, y: y)
                ), lineWidth: 2)
            }
            .frame(height: 14)
            .frame(maxWidth: .infinity)
            .padding(.bottom, MSpacing.lg)

            Spacer()

            VStack(spacing: MSpacing.xs) {
                ZStack {
                    Circle()
                        .fill(Color.meridianGold.opacity(0.2))
                        .frame(width: 24, height: 24)
                    Circle()
                        .fill(Color.meridianGold)
                        .shadow(color: Color.meridianGold.opacity(0.6), radius: 8)
                        .frame(width: 14, height: 14)
                }
                Text("TODAY")
                    .font(.system(size: 10, weight: .semibold))
                    .kerning(0.8)
                    .foregroundStyle(Color.meridianGold)
            }
        }
        .padding(.horizontal, MSpacing.xl)
        .frame(height: 60)
    }
}
