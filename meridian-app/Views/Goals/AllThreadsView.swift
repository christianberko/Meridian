import SwiftUI
import SwiftData

struct AllThreadsView: View {
    @Query(sort: \Goal.createdAt, order: .reverse) private var allGoals: [Goal]
    @State private var showNewGoal = false

    private var activeGoals: [Goal] { allGoals.filter { !$0.isCompleted } }
    private var completedGoals: [Goal] { allGoals.filter { $0.isCompleted } }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            Color.meridianCharcoal.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: MSpacing.xl) {
                    Text("All threads.")
                        .font(.fraunces(size: 32))
                        .foregroundStyle(Color.meridianOffWhite)
                        .padding(.horizontal, MSpacing.base)
                        .padding(.top, MSpacing.base)

                    if !activeGoals.isEmpty {
                        activeSection
                    }

                    if !completedGoals.isEmpty {
                        completedSection
                    }

                    if allGoals.isEmpty {
                        emptyState
                    }

                    Spacer(minLength: MSpacing.hero)
                }
            }

            Button(action: { showNewGoal = true }) {
                Image(systemName: "plus")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundStyle(Color.meridianCharcoal)
                    .frame(width: 56, height: 56)
                    .background(Color.meridianGold)
                    .clipShape(Circle())
                    .shadow(color: Color.meridianGold.opacity(0.4), radius: 16, x: 0, y: 8)
            }
            .padding(.trailing, MSpacing.base)
            .padding(.bottom, MSpacing.xl)
        }
        .sheet(isPresented: $showNewGoal) {
            NewGoalView()
        }
    }

    // MARK: - Active Section

    private var activeSection: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            Text("ACTIVE")
                .font(.mLabel)
                .kerning(1.5)
                .foregroundStyle(Color.meridianWarmGrey)
                .padding(.horizontal, MSpacing.base)

            VStack(spacing: MSpacing.sm) {
                ForEach(activeGoals) { goal in
                    NavigationLink {
                        GoalDetailView(goal: goal)
                    } label: {
                        GoalThreadRow(goal: goal, isCompleted: false)
                    }
                }
            }
            .padding(.horizontal, MSpacing.base)
        }
    }

    // MARK: - Completed Section

    private var completedSection: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            Text("COMPLETE")
                .font(.mLabel)
                .kerning(1.5)
                .foregroundStyle(Color.meridianWarmGrey)
                .padding(.horizontal, MSpacing.base)

            VStack(spacing: MSpacing.sm) {
                ForEach(completedGoals) { goal in
                    NavigationLink {
                        GoalDetailView(goal: goal)
                    } label: {
                        GoalThreadRow(goal: goal, isCompleted: true)
                    }
                }
            }
            .padding(.horizontal, MSpacing.base)
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: MSpacing.base) {
            Text("No threads yet.")
                .font(.mSubhead)
                .foregroundStyle(Color.meridianWarmGrey)
            Text("Tap + to create your first goal.")
                .font(.mBody)
                .foregroundStyle(Color.meridianWarmGrey.opacity(0.6))
        }
        .frame(maxWidth: .infinity)
        .padding(MSpacing.xl)
    }
}

// MARK: - Goal Thread Row

private struct GoalThreadRow: View {
    let goal: Goal
    let isCompleted: Bool

    private var isActive: Bool {
        guard let last = goal.lastEntry else { return false }
        return Date().timeIntervalSince(last.createdAt) < 3 * 24 * 3600
    }

    var body: some View {
        HStack(spacing: 0) {
            Rectangle()
                .fill(
                    isCompleted
                        ? LinearGradient(colors: [Color.meridianGold, Color.meridianGold], startPoint: .top, endPoint: .bottom)
                        : LinearGradient(colors: [Color.meridianSilver, Color.meridianGold], startPoint: .top, endPoint: .bottom)
                )
                .frame(width: 3)
                .clipShape(Capsule())
                .padding(.vertical, MSpacing.sm)

            HStack {
                VStack(alignment: .leading, spacing: MSpacing.xs) {
                    HStack(spacing: MSpacing.sm) {
                        Text(goal.category.uppercased())
                            .font(.system(size: 10, weight: .semibold))
                            .kerning(1.2)
                            .foregroundStyle(Color.meridianGold)

                        if isCompleted {
                            Text("COMPLETE")
                                .font(.system(size: 9, weight: .bold))
                                .kerning(1.0)
                                .foregroundStyle(Color.meridianCharcoal)
                                .padding(.horizontal, MSpacing.xs)
                                .padding(.vertical, 2)
                                .background(Color.meridianGold)
                                .clipShape(Capsule())
                        }
                    }

                    Text(goal.name)
                        .font(.fraunces(size: 18))
                        .foregroundStyle(Color.meridianOffWhite)
                        .lineLimit(1)

                    HStack(spacing: MSpacing.sm) {
                        Text("\(goal.entryCount) entries")
                        Text("·")
                            .foregroundStyle(Color.meridianWarmGrey.opacity(0.4))
                        HStack(spacing: MSpacing.xs) {
                            Image(systemName: "flame.fill")
                                .font(.system(size: 11))
                                .foregroundStyle(isActive ? Color.meridianGold : Color.meridianWarmGrey)
                            Text("\(goal.currentStreak)d")
                        }
                    }
                    .font(.system(size: 12))
                    .foregroundStyle(Color.meridianWarmGrey)
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(Color.meridianWarmGrey.opacity(0.4))
            }
            .padding(MSpacing.base)
        }
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.lg)
                .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
        )
    }
}
