import SwiftUI

struct EvidenceSuccessOverlay: View {
    let mood: String
    let onDismiss: () -> Void

    @State private var nodeScale: CGFloat = 0
    @State private var glowOpacity: Double = 0
    @State private var textOpacity: Double = 0

    private let moodEmoji: [String: String] = [
        "neutral": "😐", "good": "🙂", "strong": "💪", "fire": "🔥"
    ]

    var body: some View {
        ZStack {
            Color.meridianCharcoal.opacity(0.96)
                .ignoresSafeArea()

            RadialGradient(
                gradient: Gradient(colors: [Color.meridianGold.opacity(0.18), Color.clear]),
                center: .center,
                startRadius: 0,
                endRadius: 200
            )
            .ignoresSafeArea()
            .allowsHitTesting(false)
            .opacity(glowOpacity)

            VStack(spacing: MSpacing.xl) {
                ZStack {
                    Circle()
                        .fill(Color.meridianGold.opacity(0.15))
                        .frame(width: 80, height: 80)
                        .opacity(glowOpacity)
                    Circle()
                        .fill(Color.meridianGold.opacity(0.3))
                        .frame(width: 50, height: 50)
                        .opacity(glowOpacity)
                    Circle()
                        .fill(Color.meridianGold)
                        .shadow(color: Color.meridianGold.opacity(0.7), radius: 20)
                        .frame(width: 20, height: 20)
                        .scaleEffect(nodeScale)
                }

                VStack(spacing: MSpacing.sm) {
                    Text("NODE ADDED")
                        .font(.mLabel)
                        .kerning(2.0)
                        .foregroundStyle(Color.meridianWarmGrey)

                    Text("Evidence logged.")
                        .font(.fraunces(size: 28))
                        .foregroundStyle(Color.meridianGold)

                    Text("Your thread grows stronger.")
                        .font(.mBody)
                        .foregroundStyle(Color.meridianWarmGrey)
                }
                .opacity(textOpacity)

                Text(moodEmoji[mood] ?? "💪")
                    .font(.system(size: 48))
                    .opacity(textOpacity)
            }
        }
        .onTapGesture { onDismiss() }
        .onAppear {
            withAnimation(MAnimation.standard.delay(0.1)) {
                nodeScale = 1.0
                glowOpacity = 1.0
            }
            withAnimation(MAnimation.quick.delay(0.3)) {
                textOpacity = 1.0
            }
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                onDismiss()
            }
        }
    }
}
