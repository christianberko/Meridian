import SwiftUI

struct FirstGoalScreen: View {
    @Binding var goalName: String
    @Binding var goalCategory: String
    @Binding var goalIntention: String
    let onContinue: () -> Void

    @FocusState private var nameFocused: Bool

    private let suggestions = ["Fitness", "Writing", "Learning", "Career", "Creative"]
    private let categories = ["Craft", "Body", "Mind", "Career", "Creative", "Life"]

    private var canContinue: Bool { !goalName.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()

            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: MSpacing.xl) {
                    Spacer(minLength: MSpacing.lg)

                    Text("What do you want\nto achieve?")
                        .font(.fraunces(size: 34))
                        .foregroundStyle(Color.meridianOffWhite)
                        .fixedSize(horizontal: false, vertical: true)
                        .padding(.horizontal, MSpacing.xl)

                    VStack(alignment: .leading, spacing: MSpacing.base) {
                        nameInput
                            .padding(.horizontal, MSpacing.xl)

                        suggestionChips
                            .padding(.horizontal, MSpacing.xl)

                        intentionInput
                            .padding(.horizontal, MSpacing.xl)
                    }

                    continueButton
                        .padding(.horizontal, MSpacing.xl)

                    Spacer(minLength: MSpacing.hero)
                }
            }
        }
        .onAppear { nameFocused = true }
    }

    private var nameInput: some View {
        ZStack(alignment: .bottom) {
            TextField("", text: $goalName, prompt:
                Text("Run my first marathon…")
                    .font(.fraunces(size: 22))
                    .foregroundStyle(Color(hex: "#6C6862"))
            )
            .font(.fraunces(size: 22))
            .foregroundStyle(Color.meridianOffWhite)
            .focused($nameFocused)
            .padding(.bottom, MSpacing.md)

            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(Color.meridianBorderDark)
                    .frame(height: 1)
                if nameFocused || !goalName.isEmpty {
                    Rectangle()
                        .fill(LinearGradient(
                            colors: [Color.meridianGold, Color.meridianGold.opacity(0.4)],
                            startPoint: .leading, endPoint: .trailing
                        ))
                        .frame(height: 1.5)
                }
            }
            .animation(MAnimation.quick, value: nameFocused)
        }
    }

    private var suggestionChips: some View {
        VStack(alignment: .leading, spacing: MSpacing.sm) {
            Text("QUICK IDEAS")
                .font(.mLabel)
                .kerning(1.2)
                .foregroundStyle(Color.meridianWarmGrey.opacity(0.6))

            FlowLayout(spacing: MSpacing.xs) {
                ForEach(suggestions, id: \.self) { suggestion in
                    Button(action: { goalName = suggestion }) {
                        Text(suggestion)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundStyle(Color.meridianWarmGrey)
                            .padding(.horizontal, MSpacing.sm)
                            .padding(.vertical, 5)
                            .background(Color.meridianSurface)
                            .clipShape(Capsule())
                            .overlay(Capsule().strokeBorder(Color.meridianBorderDark, lineWidth: 0.5))
                    }
                }
            }
        }
    }

    private var intentionInput: some View {
        VStack(alignment: .leading, spacing: MSpacing.sm) {
            Text("WHAT DOES DOING THE WORK LOOK LIKE?")
                .font(.mLabel)
                .kerning(1.2)
                .foregroundStyle(Color(hex: "#A8A19A"))

            ZStack(alignment: .bottom) {
                TextField("", text: $goalIntention, prompt:
                    Text("30 mins every morning before work…")
                        .font(.system(size: 15))
                        .foregroundStyle(Color(hex: "#6C6862"))
                )
                .font(.system(size: 15))
                .foregroundStyle(Color.meridianOffWhite)
                .padding(.bottom, MSpacing.md)

                Rectangle()
                    .fill(Color.meridianBorderDark)
                    .frame(height: 1)
            }
        }
    }

    private var continueButton: some View {
        Button(action: { if canContinue { onContinue() } }) {
            Text("Create my first thread →")
                .font(.system(size: 17, weight: .semibold))
                .foregroundStyle(canContinue ? Color.meridianCharcoal : Color.meridianWarmGrey)
                .frame(maxWidth: .infinity)
                .frame(height: 54)
                .background(
                    canContinue
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
                    Capsule().strokeBorder(Color.meridianBorderDark, lineWidth: canContinue ? 0 : 0.5)
                )
                .shadow(
                    color: canContinue ? Color.meridianGold.opacity(0.3) : .clear,
                    radius: 12, x: 0, y: 6
                )
        }
        .disabled(!canContinue)
        .animation(MAnimation.quick, value: canContinue)
    }
}

// Simple flow layout for suggestion chips
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var height: CGFloat = 0
        var rowWidth: CGFloat = 0
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if rowWidth + size.width > maxWidth && rowWidth > 0 {
                height += rowHeight + spacing
                rowWidth = 0
                rowHeight = 0
            }
            rowWidth += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        height += rowHeight
        return CGSize(width: maxWidth, height: height)
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX
        var y = bounds.minY
        var rowHeight: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX && x > bounds.minX {
                y += rowHeight + spacing
                x = bounds.minX
                rowHeight = 0
            }
            subview.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}
