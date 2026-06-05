import SwiftUI

struct CoachNudgeCard: View {
    let nudgeText: String
    let onAccept: () -> Void
    let onDismiss: () -> Void
    var isLoading: Bool = false

    @State private var pulseOpacity: Double = 1.0

    var body: some View {
        ZStack(alignment: .topTrailing) {
            LinearGradient(
                colors: [Color.meridianSurface, Color(hex: "#1F1E1B")],
                startPoint: .top,
                endPoint: .bottom
            )

            RadialGradient(
                gradient: Gradient(colors: [
                    Color.meridianGold.opacity(0.18),
                    Color.clear
                ]),
                center: .center,
                startRadius: 0,
                endRadius: 80
            )
            .frame(width: 160, height: 160)
            .offset(x: 40, y: -40)
            .allowsHitTesting(false)

            VStack(alignment: .leading, spacing: MSpacing.md) {
                HStack(spacing: MSpacing.sm) {
                    ZStack {
                        Circle()
                            .fill(Color.meridianGold10)
                            .frame(width: 22, height: 22)
                        Text("✦")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundStyle(Color.meridianGold)
                    }
                    Text("COACH")
                        .font(.mLabel)
                        .kerning(1.5)
                        .foregroundStyle(Color.meridianGold)
                    Spacer()
                    Text("now")
                        .font(.mCaption)
                        .foregroundStyle(Color.meridianWarmGrey.opacity(0.6))
                }

                if isLoading {
                    VStack(alignment: .leading, spacing: MSpacing.sm) {
                        RoundedRectangle(cornerRadius: MRadius.xs)
                            .fill(Color.meridianWarmGrey.opacity(0.2))
                            .frame(maxWidth: .infinity)
                            .frame(height: 12)
                        RoundedRectangle(cornerRadius: MRadius.xs)
                            .fill(Color.meridianWarmGrey.opacity(0.2))
                            .frame(maxWidth: 200)
                            .frame(height: 12)
                    }
                    .opacity(pulseOpacity)
                    .onAppear {
                        withAnimation(.easeInOut(duration: 0.9).repeatForever(autoreverses: true)) {
                            pulseOpacity = 0.35
                        }
                    }
                } else {
                    Text(nudgeText)
                        .font(.mBody)
                        .foregroundStyle(Color.meridianOffWhite)
                        .lineSpacing(4)
                        .fixedSize(horizontal: false, vertical: true)
                }

                HStack(spacing: MSpacing.base) {
                    Button(action: onAccept) {
                        HStack(spacing: MSpacing.xs) {
                            Text("Accept the nudge")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundStyle(Color.meridianOffWhite)
                            Text("→")
                                .foregroundStyle(Color.meridianGold)
                        }
                    }
                    Button("Not today", action: onDismiss)
                        .font(.system(size: 13, weight: .medium))
                        .foregroundStyle(Color.meridianWarmGrey)
                }
            }
            .padding(MSpacing.base)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .clipShape(RoundedRectangle(cornerRadius: MRadius.xl))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.xl)
                .strokeBorder(Color.meridianGold20, lineWidth: 0.5)
        )
    }
}

#Preview {
    CoachNudgeCard(
        nudgeText: "Last session you wrote 420 words on the essay before breakfast. Today — protect the same window: 7:00 to 7:40. One paragraph counts.",
        onAccept: {},
        onDismiss: {}
    )
    .padding(MSpacing.base)
    .background(Color.meridianCharcoal)
}
