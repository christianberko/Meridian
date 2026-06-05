import Foundation
import Observation
import SwiftData

@Observable
class AICoachViewModel {
    var nudgeText: String = ""
    var isLoading: Bool = false

    private let fallback = "Keep building toward your goal."

    func fetchNudge(for goal: Goal) async {
        let cacheKey = cacheKey(for: goal)

        if let cached = UserDefaults.standard.string(forKey: cacheKey), !cached.isEmpty {
            nudgeText = cached
            return
        }

        isLoading = true
        defer { isLoading = false }

        let sorted = goal.entries.sorted { $0.createdAt > $1.createdAt }
        do {
            let text = try await AnthropicService.shared.getNextStep(
                for: goal,
                recentEntries: Array(sorted.prefix(3))
            )
            nudgeText = text
            UserDefaults.standard.set(text, forKey: cacheKey)
        } catch {
            nudgeText = fallback
        }
    }

    private func cacheKey(for goal: Goal) -> String {
        let day = Calendar.current.dateComponents([.year, .month, .day], from: Date())
        return "nudge_\(goal.id)_\(day.year ?? 0)-\(day.month ?? 0)-\(day.day ?? 0)"
    }
}
