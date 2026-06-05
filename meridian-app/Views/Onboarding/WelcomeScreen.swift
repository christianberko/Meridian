import SwiftUI

struct WelcomeScreen: View {
    let onContinue: () -> Void

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            RadialGradient(
                gradient: Gradient(colors: [Color.meridianGold.opacity(0.12), Color.clear]),
                center: .center,
                startRadius: 0,
                endRadius: 260
            )
            .ignoresSafeArea()
            .allowsHitTesting(false)

            VStack(spacing: 0) {
                Spacer()

                VStack(spacing: MSpacing.base) {
                    threadMark

                    Text("Meridian")
                        .font(.fraunces(size: 48))
                        .foregroundStyle(Color.meridianGold)
                        .shadow(color: Color.meridianGold.opacity(0.3), radius: 20)

                    Text("Your goals. Your evidence.\nYour highest point.")
                        .font(.system(size: 17))
                        .foregroundStyle(Color.meridianWarmGrey)
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                }

                Spacer()

                VStack(spacing: MSpacing.md) {
                    Button(action: onContinue) {
                        Text("Get started")
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

                    Button(action: {}) {
                        Text("Already have an account? Sign in")
                            .font(.system(size: 13))
                            .foregroundStyle(Color.meridianWarmGrey.opacity(0.7))
                    }
                }
                .padding(.horizontal, MSpacing.xl)
                .padding(.bottom, MSpacing.hero)
            }
        }
    }

    private var threadMark: some View {
        ZStack {
            Circle()
                .fill(Color.meridianGold.opacity(0.08))
                .frame(width: 80, height: 80)
            Circle()
                .fill(Color.meridianGold.opacity(0.15))
                .frame(width: 52, height: 52)
            Circle()
                .fill(Color.meridianGold)
                .shadow(color: Color.meridianGold.opacity(0.7), radius: 16)
                .frame(width: 20, height: 20)
        }
    }
}
