import Foundation

enum AppConstants {
    enum API {
        static let anthropicBaseURL = "https://api.anthropic.com/v1/messages"
        static let anthropicModel   = "claude-sonnet-4-20250514"
        static let anthropicVersion = "2023-06-01"
    }

    enum Category {
        static let options = ["Craft", "Body", "Mind", "Career", "Creative", "Life"]
    }

    enum Mood {
        static let options = ["neutral", "good", "strong", "fire"]
        static let emoji: [String: String] = [
            "neutral": "😐",
            "good":    "🙂",
            "strong":  "💪",
            "fire":    "🔥"
        ]
    }

    enum Cadence {
        static let options = ["daily", "weekly", "custom"]
    }

    enum Notification {
        static let styles = ["nudge", "strict", "off"]
    }

    enum Copy {
        static let logEvidencePrompt     = "What did you do today toward this goal?"
        static let threadContinues       = "Your thread continues."
        static let addNode               = "This adds a node to your thread."
        static let showWork              = "Show your work."
        static let logEvidencePlaceholder = "Write what you actually did..."
        static let newGoalButton         = "New goal"
        static let logEvidenceButton     = "Log evidence"
        static let saveButton            = "Save"
        static let cancelButton          = "Cancel"
        static let doneButton            = "Done"

        enum TabBar {
            static let home     = "Home"
            static let progress = "Progress"
            static let goals    = "Goals"
            static let profile  = "Profile"
        }

        enum Sections {
            static let activeGoals    = "ACTIVE GOALS"
            static let recentEvidence = "RECENT EVIDENCE"
            static let yourGoals      = "YOUR GOALS"
        }

        enum Coach {
            static let systemPrompt = """
You are the AI coach inside Meridian, a goal tracking app.
The user has logged evidence entries for their goal.
Read their recent entries and suggest ONE specific, actionable next step.
Be direct and warm. Never generic. Reference what they actually wrote.
Keep your response to 1-2 sentences maximum.
Format: "Last time you [what they did]. Today — [specific next step]."
"""
        }
    }
}
