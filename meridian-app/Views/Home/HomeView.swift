import SwiftUI
import SwiftData

struct HomeView: View {
    @Query(sort: \Goal.createdAt, order: .reverse) private var allGoals: [Goal]
    @Query private var profiles: [UserProfile]
    @State private var showLogEvidence = false
    @State private var showNewGoal = false
    @State private var nudgeDismissed = false
    @State private var coachVM = AICoachViewModel()
    @State private var showStreakBroken = false
    @State private var showStreakMilestone = false
    @State private var milestoneDays = 0

    private var goals: [Goal] { allGoals.filter { !$0.isCompleted } }

    private var userName: String { profiles.first?.name ?? "there" }

    private var greetingPeriod: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12: return "morning"
        case 12..<17: return "afternoon"
        default: return "evening"
        }
    }

    private var dateLabel: String {
        let f = DateFormatter()
        f.dateFormat = "EEEE · d MMM"
        return f.string(from: Date()).uppercased()
    }

    var body: some View {
        NavigationStack {
            ZStack(alignment: .topTrailing) {
                Color.meridianCharcoal.ignoresSafeArea()

                RadialGradient(
                    gradient: Gradient(colors: [Color.meridianGold.opacity(0.06), Color.clear]),
                    center: .center,
                    startRadius: 0,
                    endRadius: 180
                )
                .frame(width: 360, height: 360)
                .offset(x: 120, y: -120)
                .allowsHitTesting(false)

                if goals.isEmpty {
                    emptyState
                } else {
                    scrollContent
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .safeAreaInset(edge: .bottom) {
                logEvidenceButton
            }
        }
        .sheet(isPresented: $showLogEvidence) {
            logEvidencePlaceholder
        }
        .sheet(isPresented: $showNewGoal) {
            NewGoalView()
        }
        .fullScreenCover(isPresented: $showStreakBroken) {
            StreakBrokenView(
                onLog: { showStreakBroken = false; showLogEvidence = true },
                onDismiss: { showStreakBroken = false }
            )
        }
        .fullScreenCover(isPresented: $showStreakMilestone) {
            StreakMilestoneView(days: milestoneDays) { showStreakMilestone = false }
        }
        .task {
            checkStreakState()
        }
    }

    private func checkStreakState() {
        let milestones = [7, 30, 60, 90]
        let best = goals.map(\.currentStreak).max() ?? 0
        if milestones.contains(best) {
            milestoneDays = best
            showStreakMilestone = true
            return
        }
        let cal = Calendar.current
        if let lastEntryDate = goals.compactMap(\.lastEntry).map(\.createdAt).max() {
            let daysAgo = cal.dateComponents([.day], from: lastEntryDate, to: Date()).day ?? 0
            if daysAgo > 1 && daysAgo < 14 {
                showStreakBroken = true
            }
        }
    }

    // MARK: - Scroll Content

    private var scrollContent: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 0) {
                headerRow
                    .padding(.horizontal, MSpacing.base)
                    .padding(.top, MSpacing.base)
                    .padding(.bottom, MSpacing.lg)

                if !nudgeDismissed {
                    CoachNudgeCard(
                        nudgeText: coachVM.nudgeText.isEmpty ? "Your thread is ready for today. Show your work." : coachVM.nudgeText,
                        onAccept: { showLogEvidence = true },
                        onDismiss: {
                            withAnimation(MAnimation.quick) { nudgeDismissed = true }
                        },
                        isLoading: coachVM.isLoading
                    )
                    .padding(.horizontal, MSpacing.base)
                    .padding(.bottom, MSpacing.lg)
                    .task(id: goals.first?.id) {
                        if let goal = goals.first {
                            await coachVM.fetchNudge(for: goal)
                        }
                    }
                }

                threadsSection

                Spacer(minLength: MSpacing.xxl)
            }
        }
    }

    // MARK: - Header

    private var headerRow: some View {
        HStack(alignment: .top) {
            VStack(alignment: .leading, spacing: MSpacing.sm) {
                Text(dateLabel)
                    .font(.mLabel)
                    .kerning(1.5)
                    .foregroundStyle(Color.meridianWarmGrey)

                Text("Good \(greetingPeriod),\n\(userName).")
                    .font(.mHeading)
                    .foregroundStyle(Color.meridianOffWhite)
            }

            Spacer()

            NavigationLink {
                ProfileView()
            } label: {
                ZStack {
                    Circle()
                        .fill(Color.meridianSurface)
                        .overlay(
                            Circle().strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
                        )
                    Image(systemName: "person.fill")
                        .font(.system(size: 15))
                        .foregroundStyle(Color.meridianWarmGrey)
                }
                .frame(width: 38, height: 38)
            }
            .padding(.top, MSpacing.lg)
        }
    }

    // MARK: - Threads Section

    private var threadsSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .firstTextBaseline) {
                Text("Your threads")
                    .font(.fraunces(size: 22))
                    .foregroundStyle(Color.meridianOffWhite)
                Spacer()
                Button(action: { showNewGoal = true }) {
                    Image(systemName: "plus")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundStyle(Color.meridianGold)
                        .frame(width: 30, height: 30)
                }
                NavigationLink {
                    GoalsView()
                } label: {
                    HStack(spacing: MSpacing.xs) {
                        Text("All \(goals.count)")
                        Image(systemName: "chevron.right")
                            .font(.system(size: 11, weight: .medium))
                    }
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(Color.meridianWarmGrey)
                }
            }
            .padding(.horizontal, MSpacing.base)
            .padding(.bottom, MSpacing.md)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: MSpacing.md) {
                    ForEach(goals) { goal in
                        GoalCardView(goal: goal)
                    }
                    Spacer().frame(width: MSpacing.xs)
                }
                .padding(.horizontal, MSpacing.base)
                .padding(.vertical, MSpacing.xs)
            }
        }
    }

    // MARK: - Empty State

    private var emptyState: some View {
        VStack(spacing: MSpacing.lg) {
            Spacer()

            VStack(spacing: MSpacing.base) {
                ZStack {
                    Circle()
                        .fill(Color.meridianSurface)
                        .overlay(
                            Circle().strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
                        )
                        .frame(width: 56, height: 56)
                    Circle()
                        .fill(Color.threadStart.opacity(0.4))
                        .frame(width: 14, height: 14)
                }

                VStack(spacing: MSpacing.sm) {
                    Text("Your first thread is waiting.")
                        .font(.mSubhead)
                        .foregroundStyle(Color.meridianWarmGrey)
                        .multilineTextAlignment(.center)

                    Text("Every great goal starts with a single entry.")
                        .font(.mBody)
                        .foregroundStyle(Color.meridianWarmGrey.opacity(0.6))
                        .multilineTextAlignment(.center)
                }
            }
            .padding(MSpacing.xl)
            .background(Color.meridianSurface)
            .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
            .overlay(
                RoundedRectangle(cornerRadius: MRadius.lg)
                    .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
            )
            .padding(.horizontal, MSpacing.base)

            Button(action: { showLogEvidence = true }) {
                Text("Create your first thread →")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(Color.meridianCharcoal)
                    .frame(maxWidth: .infinity)
                    .frame(height: 54)
                    .background(Color.meridianGold)
                    .clipShape(Capsule())
            }
            .padding(.horizontal, MSpacing.base)

            Spacer()
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Log Evidence Button

    private var logEvidenceButton: some View {
        VStack(spacing: 0) {
            LinearGradient(
                colors: [Color.meridianCharcoal.opacity(0), Color.meridianCharcoal],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 48)
            .allowsHitTesting(false)

            Button(action: { showLogEvidence = true }) {
                HStack(spacing: MSpacing.sm) {
                    Image(systemName: "plus")
                        .font(.system(size: 17, weight: .semibold))
                    Text(AppConstants.Copy.logEvidenceButton)
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundStyle(Color.meridianCharcoal)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "#F8B547"), Color.meridianGold],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .clipShape(Capsule())
                .shadow(color: Color.meridianGold.opacity(0.32), radius: 16, x: 0, y: 8)
            }
            .padding(.horizontal, MSpacing.base)
            .padding(.bottom, MSpacing.sm)
            .background(Color.meridianCharcoal)
        }
    }

    // MARK: - Log Evidence Placeholder Sheet

    private var logEvidencePlaceholder: some View {
        ZStack {
            Color.meridianSurface.ignoresSafeArea()
            VStack(spacing: MSpacing.md) {
                RoundedRectangle(cornerRadius: MRadius.full)
                    .fill(Color.meridianWarmGrey.opacity(0.3))
                    .frame(width: 36, height: 4)
                    .padding(.top, MSpacing.md)
                Spacer()
                Text(AppConstants.Copy.logEvidenceButton)
                    .font(.mTitle)
                    .foregroundStyle(Color.meridianOffWhite)
                Text("Coming in BIL-11")
                    .font(.mBody)
                    .foregroundStyle(Color.meridianWarmGrey)
                Spacer()
            }
        }
    }
}

#Preview("With goals") {
    let container = try! ModelContainer(
        for: Goal.self, EvidenceEntry.self, UserProfile.self,
        configurations: ModelConfiguration(isStoredInMemoryOnly: true)
    )
    let goal = Goal(name: "Daily writing", category: "Craft", intention: "Write 500 words", cadence: "daily")
    let goal2 = Goal(name: "Strength", category: "Body", intention: "Gym 4x/week", cadence: "weekly")
    container.mainContext.insert(goal)
    container.mainContext.insert(goal2)
    return HomeView()
        .modelContainer(container)
}

#Preview("Empty state") {
    HomeView()
        .modelContainer(
            try! ModelContainer(
                for: Goal.self, EvidenceEntry.self, UserProfile.self,
                configurations: ModelConfiguration(isStoredInMemoryOnly: true)
            )
        )
}
