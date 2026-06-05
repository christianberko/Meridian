import SwiftUI

struct StreakMilestoneView: View {
    let days: Int
    let onContinue: () -> Void

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            RadialGradient(
                gradient: Gradient(colors: [Color.meridianGold.opacity(0.16), Color.clear]),
                center: .center,
                startRadius: 0,
                endRadius: 280
            )
            .ignoresSafeArea()
            .allowsHitTesting(false)

            VStack(spacing: 0) {
                Spacer()

                VStack(spacing: MSpacing.sm) {
                    ZStack {
                        RadialGradient(
                            gradient: Gradient(colors: [Color.meridianGold.opacity(0.25), Color.clear]),
                            center: .center,
                            startRadius: 0,
                            endRadius: 120
                        )
                        .frame(width: 240, height: 240)

                        VStack(spacing: 0) {
                            Text("\(days)")
                                .font(.fraunces(size: 96))
                                .foregroundStyle(Color.meridianGold)
                                .shadow(color: Color.meridianGold.opacity(0.4), radius: 24)
                            Text("days of showing up.")
                                .font(.fraunces(size: 22))
                                .foregroundStyle(Color.meridianOffWhite)
                        }
                    }
                }

                Spacer()

                VStack(spacing: MSpacing.md) {
                    Button(action: onContinue) {
                        Text("Keep building →")
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

                    Button(action: onContinue) {
                        Text("Share")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(Color.meridianWarmGrey)
                    }
                }
                .padding(.horizontal, MSpacing.xl)
                .padding(.bottom, MSpacing.hero)
            }
        }
    }
}
