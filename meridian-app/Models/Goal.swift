import Foundation
import SwiftData

@Model
class Goal {
    @Attribute(.unique) var id: UUID
    var name: String
    var category: String
    var intention: String
    var cadence: String
    var createdAt: Date
    var deadline: Date?
    var isCompleted: Bool
    var completedAt: Date?
    @Relationship(deleteRule: .cascade)
    var entries: [EvidenceEntry]

    var entryCount: Int { entries.count }
    var lastEntry: EvidenceEntry? { entries.sorted { $0.createdAt > $1.createdAt }.first }

    var currentStreak: Int {
        let sortedDates = entries.map { $0.createdAt }.sorted(by: >)
        guard !sortedDates.isEmpty else { return 0 }
        let calendar = Calendar.current
        var streak = 1
        var checkDate = calendar.startOfDay(for: sortedDates[0])
        for i in 1..<sortedDates.count {
            let entryDate = calendar.startOfDay(for: sortedDates[i])
            guard let dayBefore = calendar.date(byAdding: .day, value: -1, to: checkDate) else { break }
            if entryDate == dayBefore {
                streak += 1
                checkDate = entryDate
            } else {
                break
            }
        }
        return streak
    }

    var progressPercentage: Double {
        guard let deadline = deadline else {
            return min(1.0, Double(entries.count) / 100.0)
        }
        let total = deadline.timeIntervalSince(createdAt)
        guard total > 0 else { return 1.0 }
        let elapsed = Date().timeIntervalSince(createdAt)
        return min(1.0, max(0.0, elapsed / total))
    }

    init(
        id: UUID = UUID(),
        name: String,
        category: String,
        intention: String,
        cadence: String,
        createdAt: Date = Date(),
        deadline: Date? = nil,
        isCompleted: Bool = false,
        completedAt: Date? = nil,
        entries: [EvidenceEntry] = []
    ) {
        self.id = id
        self.name = name
        self.category = category
        self.intention = intention
        self.cadence = cadence
        self.createdAt = createdAt
        self.deadline = deadline
        self.isCompleted = isCompleted
        self.completedAt = completedAt
        self.entries = entries
    }
}
