import SwiftUI
import SwiftData

struct EvidenceEntryRow: View {
    let entry: EvidenceEntry
    let isMostRecent: Bool
    let isLast: Bool

    private var dateLabel: String {
        let cal = Calendar.current
        let formatter = DateFormatter()
        formatter.dateFormat = "h:mm a"
        let timeStr = formatter.string(from: entry.createdAt).uppercased()

        if cal.isDateInToday(entry.createdAt) {
            return "TODAY · \(timeStr)"
        } else if cal.isDateInYesterday(entry.createdAt) {
            return "YESTERDAY · \(timeStr)"
        } else {
            formatter.dateFormat = "EEE, MMM d"
            let dayStr = formatter.string(from: entry.createdAt).uppercased()
            return "\(dayStr) · \(timeStr)"
        }
    }

    private var moodEmoji: String {
        AppConstants.Mood.emoji[entry.mood] ?? "😐"
    }

    private var metaText: String? {
        guard entry.wordCount > 0 else { return nil }
        return "\(entry.wordCount) words"
    }

    var body: some View {
        HStack(alignment: .top, spacing: MSpacing.md) {
            nodeColumn
            contentColumn
        }
    }

    // MARK: - Left gutter: node + connecting line

    private var nodeColumn: some View {
        VStack(spacing: 0) {
            Spacer().frame(height: MSpacing.sm)

            ZStack {
                if isMostRecent {
                    Circle()
                        .fill(Color.meridianGold.opacity(0.25))
                        .frame(width: 20, height: 20)
                }
                Circle()
                    .fill(isMostRecent ? Color.meridianGold : Color.meridianGold.opacity(0.45))
                    .frame(width: 10, height: 10)
            }
            .frame(width: 18)

            if !isLast {
                LinearGradient(
                    colors: [
                        Color.meridianGold.opacity(0.4),
                        Color.meridianBorderDark
                    ],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(width: 1)
                .frame(minHeight: 40)
                .padding(.top, MSpacing.xs)
            }
        }
        .frame(width: 18)
    }

    // MARK: - Right content

    private var contentColumn: some View {
        VStack(alignment: .leading, spacing: MSpacing.sm) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: MSpacing.sm) {
                    Text(dateLabel)
                        .font(.mLabel)
                        .kerning(1.0)
                        .foregroundStyle(Color.meridianWarmGrey)

                    Text(entry.content)
                        .font(.mBody)
                        .foregroundStyle(Color.meridianOffWhite)
                        .lineSpacing(3)

                    if let meta = metaText {
                        Text(meta)
                            .font(.mCaption)
                            .foregroundStyle(Color.meridianWarmGrey)
                    }
                }
                Spacer()
                ZStack {
                    Circle()
                        .fill(Color.white.opacity(0.03))
                        .overlay(
                            Circle().strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
                        )
                    Text(moodEmoji)
                        .font(.system(size: 17))
                }
                .frame(width: 34, height: 34)
            }
        }
        .padding(.bottom, isLast ? MSpacing.sm : MSpacing.lg)
    }
}

#Preview {
    let entry = EvidenceEntry(
        goalId: UUID(),
        content: "Wrote 420 words on the essay before breakfast. The opening still feels off — circling the real argument. Better to keep moving than fix it now.",
        mood: "good",
        wordCount: 420
    )
    return VStack(spacing: 0) {
        EvidenceEntryRow(entry: entry, isMostRecent: true, isLast: false)
        EvidenceEntryRow(entry: entry, isMostRecent: false, isLast: true)
    }
    .padding(MSpacing.base)
    .background(Color.meridianCharcoal)
}
