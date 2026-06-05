import SwiftUI
import SwiftData

struct EvidenceTimelineView: View {
    let entries: [EvidenceEntry]
    let totalCount: Int
    let onLogFirst: () -> Void

    private static let previewLimit = 5

    private var sortedEntries: [EvidenceEntry] {
        entries.sorted { $0.createdAt > $1.createdAt }
    }

    private var displayedEntries: [EvidenceEntry] {
        Array(sortedEntries.prefix(Self.previewLimit))
    }

    private var hasMore: Bool { totalCount > Self.previewLimit }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .firstTextBaseline) {
                Text("Your evidence")
                    .font(.mTitle)
                    .foregroundStyle(Color.meridianOffWhite)
                Spacer()
                Text("most recent first")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey)
            }
            .padding(.bottom, MSpacing.lg)

            if entries.isEmpty {
                emptyState
            } else {
                ForEach(Array(displayedEntries.enumerated()), id: \.element.id) { index, entry in
                    EvidenceEntryRow(
                        entry: entry,
                        isMostRecent: index == 0,
                        isLast: index == displayedEntries.count - 1 && !hasMore
                    )
                }

                if hasMore {
                    Button {
                    } label: {
                        HStack(spacing: MSpacing.xs) {
                            Text("View all \(totalCount) entries")
                                .font(.system(size: 13.5, weight: .semibold))
                            Image(systemName: "arrow.right")
                                .font(.system(size: 12, weight: .semibold))
                        }
                        .foregroundStyle(Color.meridianGold)
                    }
                    .padding(.leading, MSpacing.xl + MSpacing.xs)
                    .padding(.top, MSpacing.xs)
                }
            }
        }
        .padding(.horizontal, MSpacing.base)
    }

    private var emptyState: some View {
        VStack(spacing: MSpacing.lg) {
            ZStack {
                LinearGradient(
                    colors: [Color.threadStart.opacity(0.3), Color.clear],
                    startPoint: .top,
                    endPoint: .bottom
                )
                .frame(width: 1, height: 80)

                Circle()
                    .strokeBorder(
                        Color.threadStart.opacity(0.4),
                        style: StrokeStyle(lineWidth: 1, dash: [3, 4])
                    )
                    .frame(width: 10, height: 10)
                    .offset(y: -40)
            }

            VStack(spacing: MSpacing.sm) {
                Text("Your thread begins here.")
                    .font(.mSubhead)
                    .foregroundStyle(Color.meridianWarmGrey)
                    .multilineTextAlignment(.center)

                Button(action: onLogFirst) {
                    Text("Log first evidence →")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundStyle(Color.meridianGold)
                }
            }
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, MSpacing.xl)
    }
}
