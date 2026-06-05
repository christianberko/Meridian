import SwiftUI
import SwiftData

struct LogEvidenceSheet: View {
    let goal: Goal
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @State private var content = ""
    @State private var selectedMood = "strong"
    @FocusState private var editorFocused: Bool

    private var wordCount: Int {
        content.trimmingCharacters(in: .whitespaces)
            .components(separatedBy: .whitespaces)
            .filter { !$0.isEmpty }
            .count
    }

    private var canSave: Bool {
        !content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private var goalContextLabel: String {
        let f = DateFormatter()
        f.dateFormat = "MMM d"
        return "\(goal.name.uppercased()) · \(f.string(from: Date()).uppercased())"
    }

    var body: some View {
        ZStack(alignment: .topTrailing) {
            Color.meridianSurface.ignoresSafeArea()

            RadialGradient(
                gradient: Gradient(colors: [Color.meridianGold.opacity(0.10), Color.clear]),
                center: .center,
                startRadius: 0,
                endRadius: 120
            )
            .frame(width: 240, height: 240)
            .offset(x: 60, y: -50)
            .allowsHitTesting(false)

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {
                    dragHandle

                    VStack(alignment: .leading, spacing: MSpacing.lg) {
                        titleBlock
                        coachHint
                        textEditorBlock
                        MoodSelector(selectedMood: $selectedMood)
                        saveSection
                    }
                    .padding(.horizontal, MSpacing.base)
                    .padding(.bottom, MSpacing.xxl)
                }
            }
        }
        .presentationDetents([.large])
        .presentationDragIndicator(.hidden)
        .presentationBackground(Color.meridianSurface)
        .presentationCornerRadius(MRadius.xxl)
    }

    // MARK: - Subviews

    private var dragHandle: some View {
        HStack {
            Spacer()
            RoundedRectangle(cornerRadius: MRadius.full)
                .fill(Color.meridianWarmGrey.opacity(0.3))
                .frame(width: 36, height: 4)
            Spacer()
        }
        .padding(.top, MSpacing.sm)
        .padding(.bottom, MSpacing.md)
    }

    private var titleBlock: some View {
        VStack(alignment: .leading, spacing: MSpacing.sm) {
            Text(AppConstants.Copy.logEvidencePrompt)
                .font(.mTitle)
                .foregroundStyle(Color.meridianOffWhite)

            Text(goalContextLabel)
                .font(.mLabel)
                .kerning(1.8)
                .foregroundStyle(Color.meridianGold)
        }
    }

    private var coachHint: some View {
        VStack(alignment: .leading, spacing: MSpacing.sm) {
            HStack(spacing: MSpacing.sm) {
                ZStack {
                    Circle()
                        .fill(Color.meridianGold10)
                        .frame(width: 20, height: 20)
                    Text("✦")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundStyle(Color.meridianGold)
                }
                Text("COACH")
                    .font(.mLabel)
                    .kerning(1.5)
                    .foregroundStyle(Color.meridianGold)
            }
            Text("Show your work. Write what you actually did — not what you planned.")
                .font(.system(size: 13.5))
                .foregroundStyle(Color.meridianOffWhite)
                .lineSpacing(3)
        }
        .padding(MSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.meridianGold.opacity(0.04))
        .clipShape(RoundedRectangle(cornerRadius: MRadius.md))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.md)
                .strokeBorder(Color.meridianGold.opacity(0.35), lineWidth: 0.5)
        )
    }

    private var textEditorBlock: some View {
        ZStack(alignment: .topLeading) {
            if content.isEmpty {
                Text(AppConstants.Copy.logEvidencePlaceholder)
                    .font(.mBody)
                    .foregroundStyle(Color.meridianWarmGrey.opacity(0.4))
                    .padding(.horizontal, MSpacing.xs)
                    .padding(.vertical, MSpacing.sm)
                    .allowsHitTesting(false)
            }

            TextEditor(text: $content)
                .focused($editorFocused)
                .scrollContentBackground(.hidden)
                .font(.mBody)
                .foregroundStyle(Color.meridianOffWhite)
                .frame(minHeight: 120)
                .tint(Color.meridianGold)

            if wordCount > 0 {
                Text("\(wordCount) words")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey.opacity(0.5))
                    .padding(MSpacing.sm)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
                    .allowsHitTesting(false)
            } else {
                Text("optional")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey.opacity(0.4))
                    .padding(MSpacing.sm)
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomTrailing)
                    .allowsHitTesting(false)
            }
        }
        .padding(MSpacing.md)
        .background(Color.black.opacity(0.22))
        .clipShape(RoundedRectangle(cornerRadius: MRadius.md))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.md)
                .strokeBorder(
                    editorFocused ? Color.meridianGold : Color.meridianBorderDark,
                    lineWidth: editorFocused ? 1.0 : 0.5
                )
        )
        .shadow(color: editorFocused ? Color.meridianGold.opacity(0.12) : Color.clear, radius: 8)
        .animation(MAnimation.quick, value: editorFocused)
    }

    private var saveSection: some View {
        VStack(spacing: MSpacing.md) {
            Button(action: saveEvidence) {
                Text("Save evidence")
                    .font(.system(size: 16, weight: .semibold))
                    .foregroundStyle(canSave ? Color.meridianCharcoal : Color.meridianWarmGrey)
                    .frame(maxWidth: .infinity)
                    .frame(height: 54)
                    .background(
                        canSave
                            ? LinearGradient(
                                colors: [Color(hex: "#F8B547"), Color.meridianGold],
                                startPoint: .top, endPoint: .bottom
                              )
                            : LinearGradient(
                                colors: [Color.meridianSurface2, Color.meridianSurface2],
                                startPoint: .top, endPoint: .bottom
                              )
                    )
                    .clipShape(Capsule())
                    .shadow(
                        color: canSave ? Color.meridianGold.opacity(0.30) : Color.clear,
                        radius: 14, x: 0, y: 6
                    )
            }
            .disabled(!canSave)
            .animation(MAnimation.quick, value: canSave)

            Text(AppConstants.Copy.addNode)
                .font(.mCaption)
                .foregroundStyle(Color.meridianWarmGrey.opacity(0.6))
                .frame(maxWidth: .infinity, alignment: .center)
        }
    }

    // MARK: - Save

    private func saveEvidence() {
        let trimmed = content.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        let entry = EvidenceEntry(
            goalId: goal.id,
            content: trimmed,
            mood: selectedMood,
            wordCount: wordCount
        )
        goal.entries.append(entry)
        dismiss()
    }
}
