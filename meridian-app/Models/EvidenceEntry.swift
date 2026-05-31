import Foundation
import SwiftData

@Model
class EvidenceEntry {
    @Attribute(.unique) var id: UUID
    var goalId: UUID
    var content: String
    var mood: String
    var wordCount: Int
    var createdAt: Date
    var goal: Goal?

    init(
        id: UUID = UUID(),
        goalId: UUID,
        content: String,
        mood: String,
        wordCount: Int,
        createdAt: Date = Date(),
        goal: Goal? = nil
    ) {
        self.id = id
        self.goalId = goalId
        self.content = content
        self.mood = mood
        self.wordCount = wordCount
        self.createdAt = createdAt
        self.goal = goal
    }
}
