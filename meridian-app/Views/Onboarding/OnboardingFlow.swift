import SwiftUI
import SwiftData

struct OnboardingFlow: View {
    @Environment(\.modelContext) private var context
    @Query private var profiles: [UserProfile]

    @State private var page = 0
    @State private var goalName = ""
    @State private var goalCategory = "Craft"
    @State private var goalIntention = ""

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $page) {
                WelcomeScreen(onContinue: { advance() })
                    .tag(0)

                ConceptScreen(onContinue: { advance() })
                    .tag(1)

                FirstGoalScreen(
                    goalName: $goalName,
                    goalCategory: $goalCategory,
                    goalIntention: $goalIntention,
                    onContinue: { advance() }
                )
                .tag(2)

                ReadyScreen(
                    goalName: goalName,
                    onComplete: { complete() }
                )
                .tag(3)
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .ignoresSafeArea()
            .animation(MAnimation.sheet, value: page)

            if page > 0 && page < 3 {
                dotIndicator
                    .padding(.bottom, MSpacing.xl)
            } else if page == 3 {
                allFilledDots
                    .padding(.bottom, MSpacing.xl)
            }
        }
    }

    private var dotIndicator: some View {
        HStack(spacing: MSpacing.sm) {
            ForEach(0..<4) { i in
                Capsule()
                    .fill(i <= page ? Color.meridianGold : Color.meridianWarmGrey.opacity(0.3))
                    .frame(width: i == page ? 20 : 6, height: 6)
                    .animation(MAnimation.standard, value: page)
            }
        }
    }

    private var allFilledDots: some View {
        HStack(spacing: MSpacing.sm) {
            ForEach(0..<4) { _ in
                Capsule()
                    .fill(Color.meridianGold)
                    .frame(width: 6, height: 6)
            }
        }
    }

    private func advance() {
        withAnimation(MAnimation.sheet) {
            page = min(page + 1, 3)
        }
    }

    private func complete() {
        let trimmedName = goalName.trimmingCharacters(in: .whitespaces)
        if !trimmedName.isEmpty {
            let goal = Goal(
                name: trimmedName,
                category: goalCategory,
                intention: goalIntention.trimmingCharacters(in: .whitespaces),
                cadence: "daily"
            )
            context.insert(goal)
        }

        if let profile = profiles.first {
            profile.hasCompletedOnboarding = true
        } else {
            let profile = UserProfile()
            profile.hasCompletedOnboarding = true
            context.insert(profile)
        }

        Task {
            await NotificationService.shared.requestPermission()
        }
    }
}
