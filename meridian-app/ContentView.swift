import SwiftUI
import SwiftData

enum MeridianTab {
    case home, progress, goals, profile
}

struct ContentView: View {
    @Query private var profiles: [UserProfile]
    @State private var selectedTab: MeridianTab = .home

    private var showOnboarding: Bool {
        profiles.isEmpty || !(profiles.first?.hasCompletedOnboarding ?? false)
    }

    var body: some View {
        if showOnboarding {
            OnboardingFlow()
        } else {
            tabView
        }
    }

    private var tabView: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label(AppConstants.Copy.TabBar.home, systemImage: "house.fill")
                }
                .tag(MeridianTab.home)

            ProgressView()
                .tabItem {
                    Label(AppConstants.Copy.TabBar.progress, systemImage: "chart.line.uptrend.xyaxis")
                }
                .tag(MeridianTab.progress)

            GoalsView()
                .tabItem {
                    Label(AppConstants.Copy.TabBar.goals, systemImage: "target")
                }
                .tag(MeridianTab.goals)

            ProfileView()
                .tabItem {
                    Label(AppConstants.Copy.TabBar.profile, systemImage: "person.fill")
                }
                .tag(MeridianTab.profile)
        }
        .tint(.meridianGold)
    }
}

#Preview {
    ContentView()
        .modelContainer(for: [Goal.self, EvidenceEntry.self, UserProfile.self], inMemory: true)
}
