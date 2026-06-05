import SwiftUI
import SwiftData

struct ProfileView: View {
    @Query private var profiles: [UserProfile]
    @Query(sort: \Goal.createdAt) private var allGoals: [Goal]
    @State private var showEditName = false
    @State private var editedName = ""

    private var profile: UserProfile? { profiles.first }
    private var activeGoals: [Goal] { allGoals.filter { !$0.isCompleted } }

    private var totalEntries: Int { allGoals.reduce(0) { $0 + $1.entryCount } }

    private var bestStreak: Int { allGoals.map(\.currentStreak).max() ?? 0 }

    private var buildingSince: String {
        guard let first = allGoals.sorted(by: { $0.createdAt < $1.createdAt }).first else {
            return "today"
        }
        let f = DateFormatter()
        f.dateFormat = "MMM d, yyyy"
        return f.string(from: first.createdAt)
    }

    private var last7DaysDots: [Bool] {
        let now = Date()
        let cal = Calendar.current
        let allEntryDates = allGoals.flatMap(\.entries).map {
            cal.startOfDay(for: $0.createdAt)
        }
        return (0..<7).reversed().map { daysAgo in
            let day = cal.startOfDay(for: cal.date(byAdding: .day, value: -daysAgo, to: now)!)
            return allEntryDates.contains(day)
        }
    }

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(spacing: MSpacing.xl) {
                    profileHeader
                    statsRow
                    streakDots
                    settingsSection
                    accountSection
                    footer
                }
                .padding(.horizontal, MSpacing.base)
                .padding(.top, MSpacing.xl)
                .padding(.bottom, MSpacing.hero)
            }
        }
    }

    // MARK: - Profile Header

    private var profileHeader: some View {
        VStack(spacing: MSpacing.md) {
            ZStack {
                Circle()
                    .fill(Color.meridianGold.opacity(0.12))
                    .frame(width: 56, height: 56)
                Circle()
                    .fill(Color.meridianGold)
                    .shadow(color: Color.meridianGold.opacity(0.5), radius: 12)
                    .frame(width: 20, height: 20)
            }

            VStack(spacing: MSpacing.xs) {
                Button(action: {
                    editedName = profile?.name ?? ""
                    showEditName = true
                }) {
                    Text(profile?.name.isEmpty == false ? profile!.name : "Your name")
                        .font(.fraunces(size: 28))
                        .foregroundStyle(profile?.name.isEmpty == false ? Color.meridianOffWhite : Color.meridianWarmGrey)
                }

                Text("Building since \(buildingSince)")
                    .font(.mBody)
                    .foregroundStyle(Color.meridianWarmGrey)
            }
        }
        .frame(maxWidth: .infinity)
        .alert("Edit name", isPresented: $showEditName) {
            TextField("Your name", text: $editedName)
            Button("Save") {
                if let profile {
                    profile.name = editedName
                } else {
                    let p = UserProfile(name: editedName, hasCompletedOnboarding: true)
                    // modelContext is not directly available in SwiftData Views without environment
                }
            }
            Button("Cancel", role: .cancel) {}
        }
    }

    // MARK: - Stats Row

    private var statsRow: some View {
        HStack(spacing: 0) {
            statItem("\(activeGoals.count)", "threads")
            Divider()
                .frame(height: 28)
                .background(Color.meridianBorderDark)
            statItem("\(totalEntries)", "entries")
            Divider()
                .frame(height: 28)
                .background(Color.meridianBorderDark)
            statItem("\(bestStreak)d", "streak")
        }
        .padding(.vertical, MSpacing.md)
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
        .overlay(RoundedRectangle(cornerRadius: MRadius.lg).strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
    }

    private func statItem(_ value: String, _ label: String) -> some View {
        VStack(spacing: MSpacing.xs) {
            Text(value)
                .font(.fraunces(size: 22))
                .foregroundStyle(Color.meridianOffWhite)
            Text(label)
                .font(.mCaption)
                .foregroundStyle(Color.meridianWarmGrey)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - 7-Day Streak Dots

    private var streakDots: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            Text("LAST 7 DAYS")
                .font(.mLabel)
                .kerning(1.5)
                .foregroundStyle(Color.meridianWarmGrey)

            HStack(spacing: MSpacing.sm) {
                ForEach(Array(last7DaysDots.enumerated()), id: \.offset) { idx, logged in
                    VStack(spacing: MSpacing.xs) {
                        Circle()
                            .fill(logged ? Color.meridianGold : Color.clear)
                            .overlay(
                                Circle().strokeBorder(
                                    logged ? Color.clear : Color.meridianBorderDark.opacity(2),
                                    lineWidth: 1
                                )
                            )
                            .shadow(color: logged ? Color.meridianGold.opacity(0.5) : .clear, radius: 4)
                            .frame(width: 28, height: 28)

                        Text(weekDayLabel(daysAgo: 6 - idx))
                            .font(.system(size: 9, weight: .medium))
                            .foregroundStyle(Color.meridianWarmGrey.opacity(0.5))
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .padding(MSpacing.base)
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
        .overlay(RoundedRectangle(cornerRadius: MRadius.lg).strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
    }

    // MARK: - Settings

    private var settingsSection: some View {
        VStack(spacing: 0) {
            settingsRow(icon: "brain", label: "AI Coach", trailing: AnyView(
                Toggle("", isOn: Binding(
                    get: { profile?.aiCoachEnabled ?? true },
                    set: { profile?.aiCoachEnabled = $0 }
                ))
                .tint(Color.meridianGold)
                .labelsHidden()
            ))
            Divider().background(Color.meridianBorderDark).padding(.leading, 44)
            settingsRow(icon: "bell", label: "Daily reminder", trailing: AnyView(
                Text(reminderTimeLabel)
                    .font(.system(size: 13))
                    .foregroundStyle(Color.meridianWarmGrey)
            ))
            Divider().background(Color.meridianBorderDark).padding(.leading, 44)
            settingsRow(icon: "moon", label: "Appearance", trailing: AnyView(
                Text("Dark")
                    .font(.system(size: 13))
                    .foregroundStyle(Color.meridianWarmGrey)
            ))
        }
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
        .overlay(RoundedRectangle(cornerRadius: MRadius.lg).strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
    }

    // MARK: - Account

    private var accountSection: some View {
        VStack(spacing: 0) {
            accountRow(icon: "pencil", label: "Edit profile")
            Divider().background(Color.meridianBorderDark).padding(.leading, 44)
            accountRow(icon: "square.and.arrow.up", label: "Export my evidence")
            Divider().background(Color.meridianBorderDark).padding(.leading, 44)
            accountRow(icon: "rectangle.portrait.and.arrow.right", label: "Sign out", destructive: true)
        }
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
        .overlay(RoundedRectangle(cornerRadius: MRadius.lg).strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
    }

    // MARK: - Footer

    private var footer: some View {
        Text("Made for people who do the work.")
            .font(.system(size: 12))
            .foregroundStyle(Color.meridianWarmGrey.opacity(0.35))
            .frame(maxWidth: .infinity, alignment: .center)
            .padding(.top, MSpacing.sm)
    }

    // MARK: - Helpers

    private func settingsRow(icon: String, label: String, trailing: AnyView) -> some View {
        HStack(spacing: MSpacing.md) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(Color.meridianWarmGrey)
                .frame(width: 20)
            Text(label)
                .font(.mBody)
                .foregroundStyle(Color.meridianOffWhite)
            Spacer()
            trailing
        }
        .padding(.horizontal, MSpacing.base)
        .padding(.vertical, MSpacing.md)
    }

    private func accountRow(icon: String, label: String, destructive: Bool = false) -> some View {
        HStack(spacing: MSpacing.md) {
            Image(systemName: icon)
                .font(.system(size: 15))
                .foregroundStyle(destructive ? Color.red.opacity(0.7) : Color.meridianWarmGrey)
                .frame(width: 20)
            Text(label)
                .font(.mBody)
                .foregroundStyle(destructive ? Color.red.opacity(0.8) : Color.meridianOffWhite)
            Spacer()
            Image(systemName: "chevron.right")
                .font(.system(size: 12, weight: .medium))
                .foregroundStyle(Color.meridianWarmGrey.opacity(0.4))
        }
        .padding(.horizontal, MSpacing.base)
        .padding(.vertical, MSpacing.md)
    }

    private var reminderTimeLabel: String {
        guard let time = profile?.dailyReminderTime else { return "Off" }
        let f = DateFormatter()
        f.dateStyle = .none
        f.timeStyle = .short
        return f.string(from: time)
    }

    private func weekDayLabel(daysAgo: Int) -> String {
        let date = Calendar.current.date(byAdding: .day, value: -daysAgo, to: Date()) ?? Date()
        let f = DateFormatter()
        f.dateFormat = "EEE"
        return String(f.string(from: date).prefix(1)).uppercased()
    }
}
