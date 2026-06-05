import SwiftUI

struct MoodSelector: View {
    @Binding var selectedMood: String

    private let moods: [(value: String, emoji: String)] = [
        ("neutral", "😐"),
        ("good",    "🙂"),
        ("strong",  "💪"),
        ("fire",    "🔥")
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            Text("HOW DID IT FEEL?")
                .font(.mLabel)
                .kerning(1.6)
                .foregroundStyle(Color.meridianWarmGrey)

            HStack(spacing: MSpacing.sm) {
                ForEach(moods, id: \.value) { mood in
                    moodButton(mood: mood)
                }
            }
        }
    }

    private func moodButton(mood: (value: String, emoji: String)) -> some View {
        let selected = selectedMood == mood.value
        return Button(action: {
            withAnimation(MAnimation.quick) { selectedMood = mood.value }
        }) {
            Text(mood.emoji)
                .font(.system(size: 24))
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(selected ? Color.meridianGold.opacity(0.08) : Color.meridianSurface2)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.md))
                .overlay(
                    RoundedRectangle(cornerRadius: MRadius.md)
                        .strokeBorder(
                            selected ? Color.meridianGold : Color.meridianBorderDark,
                            lineWidth: selected ? 1.0 : 0.5
                        )
                )
                .shadow(color: selected ? Color.meridianGold.opacity(0.10) : Color.clear, radius: 8)
                .opacity(selected ? 1.0 : 0.55)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    struct Preview: View {
        @State var mood = "strong"
        var body: some View {
            MoodSelector(selectedMood: $mood)
                .padding(MSpacing.base)
                .background(Color.meridianSurface)
        }
    }
    return Preview()
}
