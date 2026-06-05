import SwiftUI
import SwiftData

struct GoalCardView: View {
    let goal: Goal

    private var isActive: Bool {
        guard let last = goal.lastEntry else { return false }
        return Date().timeIntervalSince(last.createdAt) < 3 * 24 * 3600
    }

    private var lastLoggedLabel: String {
        guard let last = goal.lastEntry else { return "no entries" }
        let days = Calendar.current.dateComponents([.day], from: last.createdAt, to: Date()).day ?? 0
        switch days {
        case 0: return "today"
        case 1: return "yesterday"
        default: return "\(days)d ago"
        }
    }

    var body: some View {
        NavigationLink {
            GoalDetailView(goal: goal)
        } label: {
            cardContent
        }
        .buttonStyle(GoalCardButtonStyle())
    }

    private var cardContent: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            VStack(alignment: .leading, spacing: MSpacing.xs) {
                Text(goal.category.uppercased())
                    .font(.mLabel)
                    .kerning(1.5)
                    .foregroundStyle(Color.meridianGold)
                    .padding(.horizontal, MSpacing.sm)
                    .padding(.vertical, MSpacing.xs)
                    .overlay(
                        RoundedRectangle(cornerRadius: MRadius.xs)
                            .strokeBorder(Color.meridianGold40, lineWidth: 0.5)
                    )

                Text(goal.name)
                    .font(.mSubhead)
                    .foregroundStyle(Color.meridianOffWhite)
                    .lineLimit(2)
            }

            ThreadVisualizationView(entries: goal.entries, variant: .mini, isActive: isActive)
                .frame(height: 64)

            VStack(spacing: 0) {
                Rectangle()
                    .fill(Color.meridianBorderDark)
                    .frame(height: 0.5)

                HStack(spacing: 0) {
                    VStack(alignment: .leading, spacing: MSpacing.xs) {
                        Text("\(goal.entryCount)")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundStyle(Color.meridianOffWhite)
                        Text("entries")
                            .font(.mCaption)
                            .foregroundStyle(Color.meridianWarmGrey)
                    }
                    .padding(.trailing, MSpacing.md)

                    Rectangle()
                        .fill(Color.meridianBorderDark)
                        .frame(width: 0.5, height: 26)
                        .padding(.trailing, MSpacing.md)

                    VStack(alignment: .leading, spacing: MSpacing.xs) {
                        HStack(spacing: MSpacing.xs) {
                            Image(systemName: "flame.fill")
                                .font(.system(size: 13))
                                .foregroundStyle(Color.meridianGold)
                            Text("\(goal.currentStreak)")
                                .font(.system(size: 18, weight: .medium))
                                .foregroundStyle(Color.meridianOffWhite)
                        }
                        Text("day streak")
                            .font(.mCaption)
                            .foregroundStyle(Color.meridianWarmGrey)
                    }

                    Spacer()

                    Text(lastLoggedLabel)
                        .font(.mCaption)
                        .foregroundStyle(Color.meridianWarmGrey)
                }
                .padding(.top, MSpacing.sm)
            }
        }
        .padding(MSpacing.base)
        .frame(width: 240)
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.xl))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.xl)
                .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
        )
    }
}

private struct GoalCardButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.97 : 1.0)
            .animation(MAnimation.quick, value: configuration.isPressed)
    }
}

#Preview {
    let goal = Goal(
        name: "Daily writing",
        category: "Craft",
        intention: "Write 500 words every morning",
        cadence: "daily"
    )
    NavigationStack {
        ScrollView(.horizontal) {
            HStack {
                GoalCardView(goal: goal)
            }
            .padding(MSpacing.base)
        }
    }
    .background(Color.meridianCharcoal)
}
