import SwiftUI
import SwiftData

struct GoalsView: View {
    var body: some View {
        NavigationStack {
            AllThreadsView()
        }
    }
}

#Preview {
    GoalsView()
        .modelContainer(for: [Goal.self, EvidenceEntry.self, UserProfile.self], inMemory: true)
}
