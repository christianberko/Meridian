import SwiftUI
import SwiftData

struct ThreadWallView: View {
    let goals: [Goal]

    private var displayGoals: [Goal] { Array(goals.prefix(4)) }

    var body: some View {
        VStack(spacing: 0) {
            ZStack(alignment: .top) {
                LinearGradient(
                    colors: [Color.meridianSurface, Color(hex: "#1E1D1A")],
                    startPoint: .top,
                    endPoint: .bottom
                )

                RadialGradient(
                    gradient: Gradient(colors: [Color.meridianGold.opacity(0.14), Color.clear]),
                    center: .top,
                    startRadius: 0,
                    endRadius: 120
                )
                .frame(height: 200)
                .allowsHitTesting(false)

                VStack(spacing: MSpacing.md) {
                    HStack(alignment: .bottom, spacing: 0) {
                        ForEach(displayGoals) { goal in
                            GoalThreadColumn(goal: goal)
                        }
                        if displayGoals.isEmpty {
                            emptyState
                        }
                    }
                    .frame(minHeight: 240, alignment: .bottom)
                    .padding(.horizontal, MSpacing.md)
                    .padding(.top, MSpacing.lg)

                    legendRow
                        .padding(.horizontal, MSpacing.base)
                        .padding(.bottom, MSpacing.md)
                }
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: MRadius.xl))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.xl)
                .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
        )
    }

    private var legendRow: some View {
        HStack(spacing: MSpacing.base) {
            HStack(spacing: MSpacing.xs) {
                Circle()
                    .fill(Color.meridianGold)
                    .shadow(color: Color.meridianGold.opacity(0.6), radius: 4)
                    .frame(width: 6, height: 6)
                Text("Burning")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey)
            }
            Rectangle()
                .fill(Color.meridianBorderDark)
                .frame(width: 0.5, height: 10)
            HStack(spacing: MSpacing.xs) {
                Circle()
                    .fill(Color(hex: "#9C8F6E"))
                    .frame(width: 6, height: 6)
                Text("Cold")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey)
            }
        }
        .frame(maxWidth: .infinity, alignment: .center)
    }

    private var emptyState: some View {
        VStack(spacing: MSpacing.md) {
            Text("No threads yet")
                .font(.mBody)
                .foregroundStyle(Color.meridianWarmGrey)
        }
        .frame(maxWidth: .infinity)
        .padding(MSpacing.xl)
    }
}

private struct GoalThreadColumn: View {
    let goal: Goal

    private var isActive: Bool {
        guard let last = goal.lastEntry else { return false }
        return Date().timeIntervalSince(last.createdAt) < 3 * 24 * 3600
    }

    var body: some View {
        VStack(spacing: MSpacing.sm) {
            ThreadVisualizationView(
                entries: goal.entries,
                variant: .vertical,
                isActive: isActive
            )
            .frame(width: 60, height: 220)

            Rectangle()
                .fill(Color.meridianBorderDark)
                .frame(height: 0.5)
                .padding(.horizontal, MSpacing.sm)

            VStack(spacing: MSpacing.xs) {
                Text(goal.name)
                    .font(.fraunces(size: 13))
                    .foregroundStyle(isActive ? Color.meridianOffWhite : Color.meridianWarmGrey)
                    .multilineTextAlignment(.center)
                    .lineLimit(2)
                Text("\(goal.entryCount)")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey)
            }
            .frame(maxWidth: .infinity)
        }
        .frame(maxWidth: .infinity)
    }
}
