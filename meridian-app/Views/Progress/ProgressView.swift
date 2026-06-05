import SwiftUI
import SwiftData

struct ProgressView: View {
    @Query(sort: \Goal.createdAt, order: .reverse) private var allGoals: [Goal]

    private var activeGoals: [Goal] { allGoals.filter { !$0.isCompleted } }

    private var totalEntries: Int { activeGoals.reduce(0) { $0 + $1.entryCount } }

    private var bestStreak: Int { activeGoals.map(\.currentStreak).max() ?? 0 }

    private var dateLabel: String {
        let f = DateFormatter()
        f.dateFormat = "MMM yyyy"
        return f.string(from: Date()).uppercased()
    }

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            RadialGradient(
                gradient: Gradient(colors: [Color.meridianGold.opacity(0.05), Color.clear]),
                center: .top,
                startRadius: 0,
                endRadius: 240
            )
            .ignoresSafeArea()
            .allowsHitTesting(false)

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: MSpacing.lg) {
                    progressHeader
                    statChips
                    threadWallSection
                    progressBarsSection
                    MomentumGraphView(goals: activeGoals)
                    Spacer(minLength: MSpacing.xxl)
                }
                .padding(.horizontal, MSpacing.base)
                .padding(.top, MSpacing.base)
            }
        }
    }

    // MARK: - Header

    private var progressHeader: some View {
        VStack(alignment: .leading, spacing: MSpacing.sm) {
            Text(dateLabel)
                .font(.mLabel)
                .kerning(1.5)
                .foregroundStyle(Color.meridianWarmGrey)
            Text("Your momentum.")
                .font(.mHeading)
                .foregroundStyle(Color.meridianOffWhite)
        }
    }

    // MARK: - Stat Chips

    private var statChips: some View {
        HStack(spacing: MSpacing.sm) {
            StatChip(value: "\(activeGoals.count)", label: "threads")
            StatChip(value: "\(totalEntries)", label: "entries")
            StatChip(value: "\(bestStreak)d", label: "streak")
        }
    }

    // MARK: - Thread Wall

    @ViewBuilder
    private var threadWallSection: some View {
        if !activeGoals.isEmpty {
            ThreadWallView(goals: activeGoals)
        } else {
            emptyThreadWall
        }
    }

    private var emptyThreadWall: some View {
        VStack(spacing: MSpacing.base) {
            Text("No threads yet.")
                .font(.mBody)
                .foregroundStyle(Color.meridianWarmGrey)
            Text("Create a goal to see your thread wall.")
                .font(.mCaption)
                .foregroundStyle(Color.meridianWarmGrey.opacity(0.6))
        }
        .frame(maxWidth: .infinity)
        .padding(MSpacing.xl)
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.xl))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.xl)
                .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
        )
    }

    // MARK: - Progress Bars

    @ViewBuilder
    private var progressBarsSection: some View {
        if !activeGoals.isEmpty {
            VStack(alignment: .leading, spacing: MSpacing.md) {
                Text("PROGRESS")
                    .font(.mLabel)
                    .kerning(1.5)
                    .foregroundStyle(Color.meridianWarmGrey)
                    .padding(.horizontal, MSpacing.xs)

                VStack(spacing: 0) {
                    ForEach(Array(activeGoals.enumerated()), id: \.element.id) { idx, goal in
                        GoalProgressRow(goal: goal)
                        if idx < activeGoals.count - 1 {
                            Divider()
                                .background(Color.meridianBorderDark)
                                .padding(.horizontal, MSpacing.base)
                        }
                    }
                }
                .background(Color.meridianSurface)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.xl))
                .overlay(
                    RoundedRectangle(cornerRadius: MRadius.xl)
                        .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
                )
            }
        }
    }
}

// MARK: - Stat Chip

private struct StatChip: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: MSpacing.xs) {
            Text(value)
                .font(.fraunces(size: 22))
                .foregroundStyle(Color.meridianOffWhite)
            Text(label)
                .font(.mCaption)
                .foregroundStyle(Color.meridianWarmGrey)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, MSpacing.md)
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.lg)
                .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
        )
    }
}

// MARK: - Goal Progress Row

private struct GoalProgressRow: View {
    let goal: Goal

    private var progress: Double {
        let target = 30.0
        return min(Double(goal.entryCount) / target, 1.0)
    }

    private var percentage: Int { Int(progress * 100) }

    private var lastLoggedLabel: String {
        guard let last = goal.lastEntry else { return "Never" }
        let days = Calendar.current.dateComponents([.day], from: last.createdAt, to: Date()).day ?? 0
        switch days {
        case 0: return "Today"
        case 1: return "Yesterday"
        default: return "\(days)d ago"
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: MSpacing.sm) {
            HStack {
                Text(goal.name)
                    .font(.fraunces(size: 16))
                    .foregroundStyle(Color.meridianOffWhite)
                    .lineLimit(1)
                Spacer()
                Text("\(percentage)%")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundStyle(Color.meridianGold)
            }

            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: MRadius.full)
                        .fill(Color.meridianBorderDark)
                        .frame(height: 4)
                    RoundedRectangle(cornerRadius: MRadius.full)
                        .fill(
                            LinearGradient(
                                colors: [Color.meridianSilver, Color.meridianGold],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: max(8, geo.size.width * progress), height: 4)
                }
            }
            .frame(height: 4)

            HStack {
                Text("\(goal.entryCount) entries")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey)
                Spacer()
                Text(lastLoggedLabel)
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey.opacity(0.6))
            }
        }
        .padding(MSpacing.base)
    }
}

#Preview {
    let container = try! ModelContainer(
        for: Goal.self, EvidenceEntry.self, UserProfile.self,
        configurations: ModelConfiguration(isStoredInMemoryOnly: true)
    )
    let goal1 = Goal(name: "Daily writing", category: "Craft", intention: "Write 500 words", cadence: "daily")
    let goal2 = Goal(name: "Strength training", category: "Body", intention: "Gym 4x/week", cadence: "weekly")
    let goal3 = Goal(name: "Cold showers", category: "Mind", intention: "Start each morning cold", cadence: "daily")
    [goal1, goal2, goal3].forEach { container.mainContext.insert($0) }
    return ProgressView()
        .modelContainer(container)
}
