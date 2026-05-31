import Foundation
import SwiftData

@Model
class UserProfile {
    @Attribute(.unique) var id: UUID
    var name: String
    var hasCompletedOnboarding: Bool
    var aiCoachEnabled: Bool
    var dailyReminderTime: Date?
    var notificationStyle: String
    var createdAt: Date

    init(
        id: UUID = UUID(),
        name: String = "",
        hasCompletedOnboarding: Bool = false,
        aiCoachEnabled: Bool = true,
        dailyReminderTime: Date? = nil,
        notificationStyle: String = "nudge",
        createdAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.hasCompletedOnboarding = hasCompletedOnboarding
        self.aiCoachEnabled = aiCoachEnabled
        self.dailyReminderTime = dailyReminderTime
        self.notificationStyle = notificationStyle
        self.createdAt = createdAt
    }
}
