# Meridian — Claude Code Project Brief

You are building **Meridian**, a premium iOS goal tracking app. Read this entire file before writing any code. Every decision here is intentional — follow it precisely and consistently across all sessions.

---

## What Meridian Is

Meridian is an evidence-based goal tracker with an AI coaching layer. The core insight: every other goal app lets you tap "done" and move on. Meridian makes you **prove it**. Users write actual evidence of what they did — a few sentences describing their real progress — which builds into a personal case file over time.

The AI layer reads a user's logged evidence and suggests their exact next step — not generic advice, but contextual guidance based on what they actually wrote last time.

The signature visual is **The Thread** — a 3D animated path that grows with each evidence entry, transitioning from silver at the start to glowing gold at the most recent node. Every screen in the app uses this visual in some form.

**Target user:** Young builders, students, ambitious people in their 20s who want a central, elegant place for their goals. Not Notion's complexity. Not a generic habit tracker.

**Sector:** Productivity & Utility

---

## Tech Stack

- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI (no UIKit unless absolutely unavoidable)
- **Storage:** SwiftData (no CoreData, no third party databases)
- **Minimum iOS:** iOS 17.0
- **AI:** Anthropic API (`claude-sonnet-4-20250514`) via URLSession — no third party AI SDKs
- **Build tool:** XcodeBuildMCP — use this to build and verify after every significant change
- **Third party dependencies:** None unless absolutely necessary. Use native frameworks first — Swift Charts for graphs, SwiftUI animations for motion, SceneKit or RealityKit only if needed for 3D thread

---

## Project Structure

```
Meridian/
├── CLAUDE.md                          ← this file
├── design/                            ← JSX design references from Claude Design
│   ├── home.jsx
│   ├── goal-detail.jsx
│   ├── log-sheet.jsx
│   ├── thread.jsx
│   └── Onboarding.html
├── Meridian/
│   ├── MeridianApp.swift              ← app entry point
│   ├── ContentView.swift              ← root navigation
│   ├── Constants/
│   │   ├── DesignTokens.swift         ← ALL colors, fonts, spacing — single source of truth
│   │   └── AppConstants.swift         ← strings, config values
│   ├── Models/
│   │   ├── Goal.swift                 ← SwiftData model
│   │   ├── EvidenceEntry.swift        ← SwiftData model
│   │   └── UserProfile.swift          ← SwiftData model
│   ├── Views/
│   │   ├── Home/
│   │   │   ├── HomeView.swift
│   │   │   ├── GoalCardView.swift
│   │   │   └── CoachNudgeCard.swift
│   │   ├── GoalDetail/
│   │   │   ├── GoalDetailView.swift
│   │   │   ├── EvidenceTimelineView.swift
│   │   │   └── EvidenceEntryRow.swift
│   │   ├── LogEvidence/
│   │   │   ├── LogEvidenceSheet.swift
│   │   │   └── MoodSelector.swift
│   │   ├── Progress/
│   │   │   ├── ProgressView.swift
│   │   │   ├── ThreadWallView.swift
│   │   │   └── MomentumGraphView.swift
│   │   ├── Onboarding/
│   │   │   ├── OnboardingFlow.swift
│   │   │   ├── WelcomeScreen.swift
│   │   │   ├── ConceptScreen.swift
│   │   │   ├── FirstGoalScreen.swift
│   │   │   └── ReadyScreen.swift
│   │   ├── NewGoal/
│   │   │   └── NewGoalView.swift
│   │   └── Profile/
│   │       └── ProfileView.swift
│   ├── Components/
│   │   ├── ThreadVisualization/
│   │   │   ├── ThreadVisualizationView.swift    ← hero component
│   │   │   ├── ThreadNode.swift
│   │   │   └── ThreadPath.swift
│   │   ├── MeridianButton.swift
│   │   ├── MeridianCard.swift
│   │   └── MeridianTextField.swift
│   ├── ViewModels/
│   │   ├── HomeViewModel.swift
│   │   ├── GoalDetailViewModel.swift
│   │   ├── LogEvidenceViewModel.swift
│   │   └── AICoachViewModel.swift
│   └── Services/
│       └── AnthropicService.swift     ← AI API calls
```

---

## Design Tokens — Single Source of Truth

**Never hardcode a color, font, or spacing value inline. Always use these tokens.**

### Colors — `DesignTokens.swift`

```swift
extension Color {
    // Core palette
    static let meridianGold        = Color(hex: "#F5A623")
    static let meridianCharcoal    = Color(hex: "#1A1917")
    static let meridianOffWhite    = Color(hex: "#FAFAF8")
    static let meridianWarmGrey    = Color(hex: "#8A8580")
    static let meridianSilver      = Color(hex: "#C4C4C4")

    // Surfaces
    static let meridianSurface     = Color(hex: "#242320")
    static let meridianSurface2    = Color(hex: "#2E2C29")
    static let meridianSurfaceLight = Color(hex: "#F0EFEC")

    // Gold opacity variants
    static let meridianGold80      = Color(hex: "#F5A623").opacity(0.8)
    static let meridianGold40      = Color(hex: "#F5A623").opacity(0.4)
    static let meridianGold20      = Color(hex: "#F5A623").opacity(0.2)
    static let meridianGold10      = Color(hex: "#F5A623").opacity(0.1)
    static let meridianGold06      = Color(hex: "#F5A623").opacity(0.06)

    // Thread gradient stops (silver → gold journey)
    static let threadStart         = Color(hex: "#C4C4C4")
    static let threadMid1          = Color(hex: "#D88C1A")
    static let threadMid2          = Color(hex: "#EE9E20")
    static let threadEnd           = Color(hex: "#F5A623")

    // Borders
    static let meridianBorderDark  = Color.white.opacity(0.07)
    static let meridianBorderLight = Color.black.opacity(0.08)
}
```

### Typography

```swift
extension Font {
    // Fraunces — display, headlines, goal names
    static func fraunces(size: CGFloat, weight: Font.Weight = .light) -> Font {
        .custom("Fraunces-Italic", size: size)
    }

    // Meridian type scale
    static let mDisplay   = Font.fraunces(size: 56)  // hero headlines
    static let mHeading   = Font.fraunces(size: 32)  // section headers
    static let mSubhead   = Font.fraunces(size: 20)  // card titles, goal names
    static let mTitle     = Font.fraunces(size: 24)  // sheet titles
    static let mBodyLg    = Font.system(size: 17)    // large body text
    static let mBody      = Font.system(size: 15)    // standard body
    static let mLabel     = Font.system(size: 11, weight: .medium)  // uppercase labels
    static let mCaption   = Font.system(size: 11)    // timestamps, metadata
}
```

### Spacing — 8pt grid

```swift
enum MSpacing {
    static let xs:   CGFloat = 4
    static let sm:   CGFloat = 8
    static let md:   CGFloat = 12
    static let base: CGFloat = 16
    static let lg:   CGFloat = 24
    static let xl:   CGFloat = 32
    static let xxl:  CGFloat = 48
    static let huge: CGFloat = 64
    static let hero: CGFloat = 80
}
```

### Corner Radius

```swift
enum MRadius {
    static let xs:   CGFloat = 6    // chips, badges
    static let sm:   CGFloat = 8    // small elements
    static let md:   CGFloat = 12   // inputs
    static let lg:   CGFloat = 16   // cards
    static let xl:   CGFloat = 24   // goal cards
    static let xxl:  CGFloat = 32   // bottom sheets
    static let full: CGFloat = 9999 // buttons, pills
}
```

### Animation

```swift
enum MAnimation {
    static let quick    = Animation.easeInOut(duration: 0.2)
    static let standard = Animation.spring(response: 0.35, dampingFraction: 0.7)
    static let thread   = Animation.spring(response: 0.6, dampingFraction: 0.75)
    static let sheet    = Animation.easeInOut(duration: 0.4)
}
```

---

## SwiftData Models

Define these exactly. Do not add or remove properties without updating this file.

```swift
// Goal.swift
@Model
class Goal {
    var id: UUID
    var name: String
    var category: String           // "Craft", "Body", "Mind", "Career", "Creative", "Life"
    var intention: String          // what "doing the work" looks like
    var cadence: String            // "daily", "weekly", "custom"
    var createdAt: Date
    var deadline: Date?
    var isCompleted: Bool
    var completedAt: Date?
    @Relationship(deleteRule: .cascade)
    var entries: [EvidenceEntry]

    // Computed
    var entryCount: Int { entries.count }
    var lastEntry: EvidenceEntry? { entries.sorted { $0.createdAt > $1.createdAt }.first }
    var currentStreak: Int         // calculated from entries
    var progressPercentage: Double // 0.0 to 1.0, user-defined or time-based
}

// EvidenceEntry.swift
@Model
class EvidenceEntry {
    var id: UUID
    var goalId: UUID
    var content: String            // the actual written evidence
    var mood: String               // "neutral", "good", "strong", "fire"
    var wordCount: Int
    var createdAt: Date
    var goal: Goal?
}

// UserProfile.swift
@Model
class UserProfile {
    var id: UUID
    var name: String
    var hasCompletedOnboarding: Bool
    var aiCoachEnabled: Bool
    var dailyReminderTime: Date?
    var notificationStyle: String  // "nudge", "strict", "off"
    var createdAt: Date
}
```

---

## Thread Visualization — Core Component

This is the most important component in the app. Every screen uses it. Build it first, build it right.

**What it represents:**
- Each evidence entry = one circular node on the thread
- The thread is a curved spline path connecting all nodes
- Silver `#C4C4C4` at the first node (oldest entry)
- Progressively warms through `#D88C1A` → `#EE9E20` → `#F5A623` at the most recent node
- The most recent node is larger than others and has a glowing radial aura
- Inactive goals (no entry in 3+ days): entire thread dimmed to 40% opacity, top node barely glows

**Variants:**
- `.hero` — full width, tall, large nodes (12pt), full glow animation. Used on Goal Detail
- `.mini` — small horizontal strip, simplified nodes (4pt). Used on Home goal cards
- `.vertical` — full height, vertical orientation, nodes stacked. Used on Thread Wall
- `.tiny` — just the gradient line + peak node. Used in widgets

**Props:**
```swift
struct ThreadVisualizationView: View {
    let entries: [EvidenceEntry]
    var variant: ThreadVariant = .hero
    var isActive: Bool = true      // dims if goal gone cold
    var animated: Bool = true
}
```

**Implementation notes:**
- Use SwiftUI `Path` or `Canvas` for the thread line
- Use `TimelineView` or `withAnimation` for the glow pulse on the latest node
- The thread path is a Catmull-Rom spline through the node positions
- Node positions are distributed along the path — not evenly spaced by index, but spread across the time axis so gaps in logging are visually apparent as gaps in the thread
- The gradient on the line uses `LinearGradient` from silver to gold
- The glow on the latest node: a larger circle with `meridianGold20` opacity that pulses with `MAnimation.thread`
- Reference `/design/MeridianDesignFiles/thread.jsx` for the exact visual
- Reference `/design/MeridianDesignFiles/screens`

---

## Navigation Architecture

```swift
// Tab bar structure
enum MeridianTab {
    case home
    case progress
    case goals
    case profile
}

// Navigation flows
Home → GoalDetail (push)
GoalDetail → LogEvidence (sheet, .large presentation)
GoalDetail → EvidenceFullList (push)
Home → NewGoal (sheet, .large presentation)
Goals → GoalDetail (push)
Goals → NewGoal (sheet)
```

---

## AI Coaching — Anthropic API

```swift
// AnthropicService.swift
// Use claude-sonnet-4-20250514
// Endpoint: https://api.anthropic.com/v1/messages
// Auth: x-api-key header — read from Info.plist, never hardcode

// System prompt for next step suggestions:
let coachSystemPrompt = """
You are the AI coach inside Meridian, a goal tracking app.
The user has logged evidence entries for their goal.
Read their recent entries and suggest ONE specific, actionable next step.
Be direct and warm. Never generic. Reference what they actually wrote.
Keep your response to 1-2 sentences maximum.
Format: "Last time you [what they did]. Today — [specific next step]."
"""

// Call this when:
// 1. User opens a Goal Detail screen
// 2. User opens the Log Evidence sheet (for the pre-fill nudge)
// Cache the response per goal per day — don't call the API every time
```

---

## UI Conventions

**Every screen follows these rules:**

1. **Dark first** — background is always `meridianCharcoal` (`#1A1917`)
2. **Cards** use `meridianSurface` (`#242320`) with `meridianBorderDark` border
3. **Section labels** — SF Pro, 11pt, uppercase, letter-spacing 0.15em, `meridianWarmGrey`
4. **Goal names** — always Fraunces italic, never SF Pro
5. **Primary CTA** — full width gold pill button, `meridianGold` background, `meridianCharcoal` text, weight .semibold
6. **Secondary action** — ghost style, `meridianGold` text, `meridianGold40` border
7. **Destructive action** — red tint background, never gold
8. **Tab bar** — `meridianCharcoal` background with blur, active tab in `meridianGold`
9. **Bottom sheets** — `meridianSurface` background, 32pt top corner radius, drag handle at top
10. **Never use** `.systemBackground`, `.label`, or any semantic iOS colors — always use Meridian tokens

---

## Voice & Tone — All Copy

The app speaks like a coach who respects your intelligence. Direct, warm, never cheesy.

- ✅ "What did you do today toward this goal?"
- ✅ "Your thread continues." (after a missed day)
- ✅ "This adds a node to your thread."
- ✅ "Show your work."
- ❌ "Great job! Keep it up! 🎉"
- ❌ "Don't forget to log today!"
- ❌ "You're crushing it!"

Never use: "failed", "broken streak", "you missed". Always forward-looking.

---

## XcodeBuildMCP Usage

**Source:** https://github.com/getsentry/XcodeBuildMCP
**What it is:** An MCP server that gives Claude Code direct access to Xcode build tools — build, run, debug, and inspect the project without leaving the agent loop.

### What Claude Code can do with it

- **Build for simulator** — build the Meridian scheme and get structured output including errors and warnings
- **Run on simulator** — launch the app on a target simulator directly
- **Capture build output** — structured compiler warnings fed directly back into context (critical for catching SwiftData and SwiftUI issues early)
- **List available simulators** — find the right target device
- **Check for build errors** — verify the project compiles cleanly before moving to the next issue

### Meridian project config
Scheme:    Meridian
Simulator: iPhone 16 Pro
Project:   Meridian.xcodeproj

### When to use it

- **After every file is created or modified** — run a build to catch errors immediately, not at the end
- **After completing each Linear issue** — full clean build before marking done
- **Never leave a broken build** — if the build fails, fix it before touching anything else
- **Before running the ios-code-audit skill** — the audit uses XcodeBuildMCP to capture compiler warnings as canonical input

### CLI commands (if needed outside MCP)

```bash
# Build for simulator
xcodebuildmcp simulator build --scheme Meridian --project-path ./Meridian.xcodeproj

# List tools available
xcodebuildmcp tools

# Check for updates
xcodebuildmcp upgrade --check
```

### Rules
- Do NOT skip builds to save time — a broken build compounds into a broken app
- Do NOT proceed to the next task if there are compiler errors
- Warnings are acceptable temporarily but log them — don't ignore them
- If XcodeBuildMCP fails to connect, fall back to `xcodebuild` in bash
---

## What NOT To Do

- **No UIKit** — SwiftUI only. No UIViewRepresentable unless there is absolutely no SwiftUI alternative
- **No third party charting libraries** — use Swift Charts for graphs
- **No third party networking** — use URLSession for the Anthropic API
- **No magic numbers** — every value comes from `MSpacing`, `MRadius`, or `DesignTokens`
- **No hardcoded strings** — UI copy goes in `AppConstants.swift`
- **No purple** — Meridian has one accent color: amber gold `#F5A623`
- **No generic SF Symbols** — use the icons from `/design/icons.jsx` as reference for custom icons where needed
- **No checkbox completion** — users cannot mark evidence as "done" without writing text
- **No streak punishment** — never show red, never say "failed", never guilt the user

---

## Current Build State

Update this section at the end of every Claude Code session.

| Component | Status | Notes |
|---|---|---|
| Project setup | ⬜ Not started | |
| DesignTokens.swift | ⬜ Not started | |
| SwiftData models | ⬜ Not started | |
| ThreadVisualizationView | ⬜ Not started | Most critical component |
| Navigation shell + tab bar | ⬜ Not started | |
| HomeView | ⬜ Not started | |
| GoalCardView | ⬜ Not started | |
| CoachNudgeCard | ⬜ Not started | |
| GoalDetailView | ⬜ Not started | |
| EvidenceTimelineView | ⬜ Not started | |
| LogEvidenceSheet | ⬜ Not started | |
| MoodSelector | ⬜ Not started | |
| AnthropicService | ⬜ Not started | |
| ProgressView | ⬜ Not started | |
| ThreadWallView | ⬜ Not started | |
| OnboardingFlow | ⬜ Not started | |
| NewGoalView | ⬜ Not started | |
| ProfileView | ⬜ Not started | |
| Empty states | ⬜ Not started | |
| Animations + polish | ⬜ Not started | |
| Notifications | ⬜ Not started | |

---

## Linear Project

All issues tracked at: `linear.app/billion-dolla-ideas`
Project: **Meridian**
Design specs: `linear.app/billion-dolla-ideas/document/meridian-screen-design-specifications-b5aeb37ebccf`
Brand doc: `linear.app/billion-dolla-ideas/document/meridian-brand-and-visual-identity-9b4d74c42fd2`

Work through one Linear issue per Claude Code session. Mark the issue complete and update the build state table above before ending the session.


## Installed Skills

Three Claude Code skills are installed in this project. Use them proactively — don't wait to be asked.

---

### 1. `swift-architecture-skill`
**Source:** https://github.com/efremidze/swift-architecture-skill
**Trigger:** `/swift-architecture-skill` or natural language

Routes to the right Swift architecture pattern for any given feature. Covers MVVM, MVI, TCA, Clean Architecture, MVP, VIPER, Coordinator, and Reactive. Includes per-pattern playbooks with code examples, anti-pattern fixes, testing strategy, and PR checklists.

**When to use it:**
- Before scaffolding any new view or feature — confirm the right architecture first
- If a ViewModel is growing too large or doing too much (routing + formatting + business logic)
- When deciding whether to use MVVM or something lighter for a simple screen
- For Meridian: consult this skill before building GoalDetailViewModel, AICoachViewModel, or any complex state management

**Example:**
> Use `swift-architecture-skill` to recommend architecture for the AI coaching state management layer.

---

### 2. `swiftdata-pro`
**Source:** https://github.com/twostraws/SwiftData-Agent-Skill
**Trigger:** `/swiftdata-pro` or natural language

Expert SwiftData guidance from Paul Hudson (Hacking with Swift). Covers `@Model`, `@Query`, predicates, indexes, migrations, relationships, iCloud sync — specifically targeting the mistakes LLMs actually make with SwiftData. Does NOT reteach basics; focuses on edge cases and traps.

**When to use it:**
- Before writing any SwiftData model — check for common mistakes first
- When setting up `@Query` predicates for filtering evidence entries by date or goal
- If SwiftData migrations are needed as the schema evolves
- Any time a SwiftData operation behaves unexpectedly — this skill knows the traps
- For Meridian: critical for M1 (models) and any session touching Goal, EvidenceEntry, or UserProfile

**Example:**
> /swiftdata-pro Check my Goal and EvidenceEntry models for common mistakes.

---

### 3. `ios-code-audit`
**Source:** https://github.com/jazzychad/ios-code-audit
**Trigger:** `/ios-code-audit` or natural language ("run a code audit", "find tech debt")

Produces a comprehensive `CODE_AUDIT.md` at the repo root — read-only, never modifies code. Covers bugs, dead code, Swift concurrency issues, deprecated APIs, security, performance, SwiftUI quality. Every Critical/High finding is cited to `file.swift:LINE`. Groups findings by root cause.

**When to use it:**
- After completing each milestone (M1 through M9) — run an audit before moving on
- Before any App Store submission — mandatory
- If something feels off but you can't pinpoint it
- After the AI coaching layer is built (M6) — security audit for API key handling
- Do NOT use mid-feature — finish the feature first, then audit

**Example:**
> /ios-code-audit

**Note:** This skill requires the Xcode native MCP server for best results. XcodeBuildMCP is already installed. If your project has SwiftUI views (it does), the skill will also invoke `swiftui-expert-skill` if installed.

---

### Skill Usage Rules
- **Architecture skill:** consult BEFORE building any new view model or complex feature
- **SwiftData skill:** consult BEFORE and AFTER any SwiftData model or query work
- **Code audit skill:** run AFTER each milestone, and BEFORE App Store submission
- Skills burn tokens — invoke them purposefully, not constantly
