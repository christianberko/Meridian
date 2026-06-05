import SwiftUI
import SwiftData

struct NewGoalView: View {
    @Environment(\.modelContext) private var context
    @Environment(\.dismiss) private var dismiss

    @State private var path = NavigationPath()
    @State private var name = ""
    @State private var selectedCategory = "Craft"
    @State private var intention = ""
    @State private var cadence = "daily"
    @State private var deadline: Date? = nil
    @State private var showDatePicker = false
    @FocusState private var nameFieldFocused: Bool
    @FocusState private var intentionFieldFocused: Bool

    private let categories = ["Craft", "Body", "Mind", "Career", "Creative", "Life"]
    private let cadenceOptions: [(id: String, label: String, description: String)] = [
        ("daily",  "Daily",  "Every single day"),
        ("weekly", "Weekly", "A few times a week"),
        ("custom", "Custom", "Your own rhythm"),
    ]

    private var canCreate: Bool { !name.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        NavigationStack(path: $path) {
            ZStack {
                Color.meridianCharcoal.ignoresSafeArea()

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: MSpacing.xl) {
                        headerRow
                        nameSection
                        categorySection
                        intentionSection
                        cadenceSection
                        deadlineSection
                        createButton
                    }
                    .padding(.horizontal, MSpacing.base)
                    .padding(.top, MSpacing.base)
                    .padding(.bottom, MSpacing.hero)
                }
            }
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(for: Goal.self) { goal in
                GoalDetailView(goal: goal)
            }
        }
        .onAppear { nameFieldFocused = true }
    }

    // MARK: - Header

    private var headerRow: some View {
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

            Text("New thread")
                .font(.fraunces(size: 20))
                .foregroundStyle(Color.meridianOffWhite)

            Spacer()

            Color.clear.frame(width: 38, height: 38)
        }
    }

    // MARK: - Name Section

    private var nameSection: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            sectionLabel("WHAT DO YOU WANT TO ACHIEVE?")

            ZStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: MSpacing.sm) {
                    TextField("", text: $name, prompt:
                        Text("Write every morning…")
                            .font(.fraunces(size: 24))
                            .foregroundStyle(Color(hex: "#6C6862"))
                    )
                    .font(.fraunces(size: 24))
                    .foregroundStyle(Color.meridianOffWhite)
                    .focused($nameFieldFocused)
                    .submitLabel(.next)
                    .onSubmit { intentionFieldFocused = true }
                }
                .padding(.bottom, MSpacing.md)

                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color.meridianBorderDark)
                        .frame(height: 1)
                    if nameFieldFocused || !name.isEmpty {
                        Rectangle()
                            .fill(LinearGradient(
                                colors: [Color.meridianGold, Color.meridianGold.opacity(0.4)],
                                startPoint: .leading, endPoint: .trailing
                            ))
                            .frame(height: 1.5)
                            .transition(.opacity)
                    }
                }
                .animation(MAnimation.quick, value: nameFieldFocused)
            }
        }
    }

    // MARK: - Category Section

    private var categorySection: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            sectionLabel("CATEGORY")

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: MSpacing.sm) {
                    ForEach(categories, id: \.self) { cat in
                        Button(action: { selectedCategory = cat }) {
                            Text(cat)
                                .font(.system(size: 13, weight: .medium))
                                .foregroundStyle(selectedCategory == cat ? Color.meridianCharcoal : Color.meridianGold)
                                .padding(.horizontal, MSpacing.md)
                                .padding(.vertical, MSpacing.sm)
                                .background(
                                    selectedCategory == cat
                                        ? Color.meridianGold
                                        : Color.clear
                                )
                                .clipShape(Capsule())
                                .overlay(
                                    Capsule()
                                        .strokeBorder(Color.meridianGold.opacity(0.55), lineWidth: 1)
                                        .opacity(selectedCategory == cat ? 0 : 1)
                                )
                        }
                        .animation(MAnimation.quick, value: selectedCategory)
                    }
                }
            }
        }
    }

    // MARK: - Intention Section

    private var intentionSection: some View {
        VStack(alignment: .leading, spacing: MSpacing.xs) {
            sectionLabel("WHAT DOES DOING THE WORK LOOK LIKE?")

            Text("This helps your AI coach give better suggestions")
                .font(.system(size: 12))
                .foregroundStyle(Color(hex: "#6C6862"))
                .padding(.bottom, MSpacing.xs)

            ZStack(alignment: .bottom) {
                TextField("", text: $intention, prompt:
                    Text("500 words before 9 AM, no exceptions…")
                        .font(.system(size: 15))
                        .foregroundStyle(Color(hex: "#6C6862"))
                )
                .font(.system(size: 15))
                .foregroundStyle(Color.meridianOffWhite)
                .focused($intentionFieldFocused)
                .padding(.bottom, MSpacing.md)

                ZStack(alignment: .leading) {
                    Rectangle()
                        .fill(Color.meridianBorderDark)
                        .frame(height: 1)
                    if intentionFieldFocused || !intention.isEmpty {
                        Rectangle()
                            .fill(LinearGradient(
                                colors: [Color.meridianGold, Color.meridianGold.opacity(0.4)],
                                startPoint: .leading, endPoint: .trailing
                            ))
                            .frame(height: 1.5)
                            .transition(.opacity)
                    }
                }
                .animation(MAnimation.quick, value: intentionFieldFocused)
            }
        }
    }

    // MARK: - Cadence Section

    private var cadenceSection: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            sectionLabel("HOW OFTEN?")

            HStack(spacing: MSpacing.sm) {
                ForEach(cadenceOptions, id: \.id) { option in
                    Button(action: { cadence = option.id }) {
                        VStack(spacing: MSpacing.xs) {
                            Text(option.label)
                                .font(.fraunces(size: 16))
                                .foregroundStyle(Color.meridianOffWhite)
                            Text(option.description)
                                .font(.system(size: 11))
                                .foregroundStyle(Color.meridianWarmGrey)
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, MSpacing.md)
                        .background(
                            cadence == option.id
                                ? Color.meridianGold.opacity(0.08)
                                : Color.meridianSurface
                        )
                        .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
                        .overlay(
                            RoundedRectangle(cornerRadius: MRadius.lg)
                                .strokeBorder(
                                    cadence == option.id ? Color.meridianGold : Color.meridianBorderDark,
                                    lineWidth: cadence == option.id ? 1 : 0.5
                                )
                        )
                    }
                    .animation(MAnimation.quick, value: cadence)
                }
            }
        }
    }

    // MARK: - Deadline Section

    private var deadlineSection: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            HStack(spacing: MSpacing.sm) {
                sectionLabel("END DATE")
                Text("optional")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundStyle(Color(hex: "#6C6862"))
                    .italic()
            }

            Button(action: { showDatePicker.toggle() }) {
                HStack {
                    Image(systemName: "calendar")
                        .font(.system(size: 14))
                        .foregroundStyle(Color.meridianWarmGrey)
                    Text(deadline.map { datePill($0) } ?? "No deadline")
                        .font(.system(size: 14))
                        .foregroundStyle(deadline != nil ? Color.meridianOffWhite : Color.meridianWarmGrey)
                    Spacer()
                    if deadline != nil {
                        Button(action: { deadline = nil }) {
                            Image(systemName: "xmark")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundStyle(Color.meridianWarmGrey)
                        }
                    }
                }
                .padding(.horizontal, MSpacing.md)
                .padding(.vertical, MSpacing.sm)
                .background(Color.meridianSurface)
                .clipShape(Capsule())
                .overlay(Capsule().strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
            }

            if showDatePicker {
                DatePicker(
                    "",
                    selection: Binding(
                        get: { deadline ?? Date().addingTimeInterval(30 * 24 * 3600) },
                        set: { deadline = $0 }
                    ),
                    in: Date()...,
                    displayedComponents: .date
                )
                .datePickerStyle(.graphical)
                .tint(Color.meridianGold)
                .background(Color.meridianSurface)
                .clipShape(RoundedRectangle(cornerRadius: MRadius.lg))
            }
        }
    }

    // MARK: - Create Button

    private var createButton: some View {
        VStack(spacing: MSpacing.sm) {
            Button(action: saveGoal) {
                HStack(spacing: MSpacing.sm) {
                    Text("Create thread")
                        .font(.system(size: 16, weight: .semibold))
                    Text("→")
                        .font(.system(size: 16, weight: .semibold))
                }
                .foregroundStyle(canCreate ? Color.meridianCharcoal : Color.meridianWarmGrey)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(
                    canCreate
                        ? LinearGradient(
                            colors: [Color(hex: "#F8B547"), Color.meridianGold],
                            startPoint: .top, endPoint: .bottom
                          )
                        : LinearGradient(
                            colors: [Color.meridianSurface, Color.meridianSurface],
                            startPoint: .top, endPoint: .bottom
                          )
                )
                .clipShape(Capsule())
                .overlay(
                    Capsule().strokeBorder(Color.meridianBorderDark, lineWidth: canCreate ? 0 : 0.5)
                )
                .shadow(
                    color: canCreate ? Color.meridianGold.opacity(0.3) : .clear,
                    radius: 12, x: 0, y: 6
                )
            }
            .disabled(!canCreate)
            .animation(MAnimation.quick, value: canCreate)

            Text("You can edit these settings anytime")
                .font(.system(size: 12))
                .foregroundStyle(Color.meridianWarmGrey.opacity(0.5))
                .frame(maxWidth: .infinity, alignment: .center)
        }
    }

    // MARK: - Helpers

    private func sectionLabel(_ text: String) -> some View {
        Text(text)
            .font(.mLabel)
            .kerning(1.5)
            .foregroundStyle(Color(hex: "#A8A19A"))
    }

    private func datePill(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "d MMM yyyy"
        return f.string(from: date)
    }

    private func saveGoal() {
        guard canCreate else { return }
        let goal = Goal(
            name: name.trimmingCharacters(in: .whitespaces),
            category: selectedCategory,
            intention: intention.trimmingCharacters(in: .whitespaces),
            cadence: cadence,
            deadline: deadline
        )
        context.insert(goal)
        path.append(goal)
    }
}
