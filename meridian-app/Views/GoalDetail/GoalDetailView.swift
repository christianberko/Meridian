import SwiftUI
import SwiftData

struct GoalDetailView: View {
    let goal: Goal
    @Environment(\.dismiss) private var dismiss
    @State private var showLogEvidence = false
    @State private var nudgeDismissed = false

    private var sinceLabel: String {
        let f = DateFormatter()
        f.dateFormat = "MMM d"
        return f.string(from: goal.createdAt)
    }

    private var monthAxisLabels: [String] {
        let cal = Calendar.current
        let now = Date()
        let start = goal.createdAt
        guard let months = cal.dateComponents([.month], from: start, to: now).month else {
            return []
        }
        let f = DateFormatter()
        f.dateFormat = "MMM"
        return (0...min(months, 4)).compactMap { offset in
            cal.date(byAdding: .month, value: offset, to: start).map { f.string(from: $0).uppercased() }
        }
    }

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {
                    goalHeader
                    threadCard
                    coachSection
                    evidenceSection
                    Spacer(minLength: MSpacing.hero)
                }
            }

            VStack {
                Spacer()
                logEvidenceCTA
            }
        }
        .toolbar(.hidden, for: .navigationBar)
        .navigationBarBackButtonHidden(true)
        .sheet(isPresented: $showLogEvidence) {
            logEvidencePlaceholder
        }
    }

    // MARK: - Goal Header

    private var goalHeader: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Button(action: { dismiss() }) {
                    ZStack {
                        Circle()
                            .fill(Color.meridianSurface)
                            .overlay(Circle().strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
                        Image(systemName: "chevron.left")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundStyle(Color.meridianOffWhite)
                    }
                    .frame(width: 38, height: 38)
                }
                Spacer()
                Button {
                } label: {
                    ZStack {
                        Circle()
                            .fill(Color.meridianSurface)
                            .overlay(Circle().strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
                        Image(systemName: "ellipsis")
                            .font(.system(size: 15, weight: .medium))
                            .foregroundStyle(Color.meridianOffWhite)
                    }
                    .frame(width: 38, height: 38)
                }
            }
            .padding(.horizontal, MSpacing.base)
            .padding(.bottom, MSpacing.md)

            VStack(alignment: .leading, spacing: MSpacing.sm) {
                Text(goal.category.uppercased())
                    .font(.mLabel)
                    .kerning(1.8)
                    .foregroundStyle(Color.meridianGold)

                Text(goal.name)
                    .font(.fraunces(size: 40))
                    .foregroundStyle(Color.meridianOffWhite)
                    .fixedSize(horizontal: false, vertical: true)

                HStack(spacing: MSpacing.xs) {
                    Image(systemName: "flame.fill")
                        .font(.system(size: 13))
                        .foregroundStyle(Color.meridianGold)
                    Text("\(goal.currentStreak) day streak")
                        .foregroundStyle(Color.meridianOffWhite)
                    Text("·")
                        .foregroundStyle(Color.meridianWarmGrey.opacity(0.5))
                    Text("\(goal.entryCount) entries")
                        .foregroundStyle(Color.meridianOffWhite)
                    Text("·")
                        .foregroundStyle(Color.meridianWarmGrey.opacity(0.5))
                    Text("since \(sinceLabel)")
                        .foregroundStyle(Color.meridianWarmGrey)
                }
                .font(.system(size: 13.5))
            }
            .padding(.horizontal, MSpacing.base)
            .padding(.bottom, MSpacing.lg)
        }
        .padding(.top, MSpacing.base)
    }

    // MARK: - Hero Thread Card

    private var threadCard: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
                LinearGradient(
                    colors: [Color.meridianSurface, Color(hex: "#1E1D1A")],
                    startPoint: .top,
                    endPoint: .bottom
                )

                RadialGradient(
                    gradient: Gradient(colors: [Color.meridianGold.opacity(0.16), Color.clear]),
                    center: .center,
                    startRadius: 0,
                    endRadius: 130
                )
                .frame(width: 260, height: 260)
                .offset(x: 80, y: -60)
                .allowsHitTesting(false)

                VStack(alignment: .leading, spacing: MSpacing.xs) {
                    HStack {
                        Text("THE THREAD")
                            .font(.mLabel)
                            .kerning(1.6)
                            .foregroundStyle(Color.meridianWarmGrey)
                        Spacer()
                        Text("\(goal.entryCount) nodes")
                            .font(.mCaption)
                            .foregroundStyle(Color.meridianWarmGrey)
                    }
                    .padding(.horizontal, MSpacing.sm)
                    .padding(.bottom, MSpacing.xs)

                    ThreadVisualizationView(
                        entries: goal.entries,
                        variant: .hero,
                        isActive: goalIsActive
                    )
                    .frame(height: 200)
                }
                .padding(MSpacing.base)
            }
            .clipShape(RoundedRectangle(cornerRadius: MRadius.xl))
            .overlay(
                RoundedRectangle(cornerRadius: MRadius.xl)
                    .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
            )
            .padding(.horizontal, MSpacing.base)

            if !monthAxisLabels.isEmpty {
                HStack {
                    ForEach(Array(monthAxisLabels.enumerated()), id: \.offset) { index, month in
                        Text(month)
                            .font(.system(size: 10.5, weight: .medium))
                            .kerning(1.2)
                            .foregroundStyle(
                                index == monthAxisLabels.count - 1
                                    ? Color.meridianGold
                                    : Color.meridianWarmGrey.opacity(0.5)
                            )
                        if index < monthAxisLabels.count - 1 { Spacer() }
                    }
                }
                .padding(.horizontal, MSpacing.xl)
                .padding(.top, MSpacing.sm)
                .padding(.bottom, MSpacing.lg)
            } else {
                Spacer().frame(height: MSpacing.lg)
            }
        }
    }

    // MARK: - Coach Section

    @ViewBuilder
    private var coachSection: some View {
        if !nudgeDismissed {
            CoachNudgeCard(
                nudgeText: "Your thread is ready for another entry. Show your work.",
                onAccept: { showLogEvidence = true },
                onDismiss: {
                    withAnimation(MAnimation.quick) { nudgeDismissed = true }
                }
            )
            .padding(.horizontal, MSpacing.base)
            .padding(.bottom, MSpacing.lg)
        }
    }

    // MARK: - Evidence Section

    private var evidenceSection: some View {
        EvidenceTimelineView(
            entries: goal.entries,
            totalCount: goal.entryCount,
            onLogFirst: { showLogEvidence = true }
        )
        .padding(.bottom, MSpacing.lg)
    }

    // MARK: - Log Evidence CTA

    private var logEvidenceCTA: some View {
        VStack(spacing: 0) {
            LinearGradient(
                colors: [Color.meridianCharcoal.opacity(0), Color.meridianCharcoal],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 56)
            .allowsHitTesting(false)

            Button(action: { showLogEvidence = true }) {
                HStack(spacing: MSpacing.sm) {
                    Image(systemName: "plus")
                        .font(.system(size: 17, weight: .semibold))
                    Text(AppConstants.Copy.logEvidenceButton)
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundStyle(Color.meridianCharcoal)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "#F8B547"), Color.meridianGold],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
                .clipShape(Capsule())
                .shadow(color: Color.meridianGold.opacity(0.32), radius: 16, x: 0, y: 8)
            }
            .padding(.horizontal, MSpacing.base)
            .padding(.bottom, MSpacing.sm)
            .background(Color.meridianCharcoal)
        }
    }

    // MARK: - Placeholder Sheet

    private var logEvidencePlaceholder: some View {
        ZStack {
            Color.meridianSurface.ignoresSafeArea()
            VStack(spacing: MSpacing.md) {
                RoundedRectangle(cornerRadius: MRadius.full)
                    .fill(Color.meridianWarmGrey.opacity(0.3))
                    .frame(width: 36, height: 4)
                    .padding(.top, MSpacing.md)
                Spacer()
                Text(AppConstants.Copy.logEvidenceButton)
                    .font(.mTitle)
                    .foregroundStyle(Color.meridianOffWhite)
                Text("Coming in BIL-11")
                    .font(.mBody)
                    .foregroundStyle(Color.meridianWarmGrey)
                Spacer()
            }
        }
    }

    // MARK: - Helpers

    private var goalIsActive: Bool {
        guard let last = goal.lastEntry else { return false }
        return Date().timeIntervalSince(last.createdAt) < 3 * 24 * 3600
    }
}
