import SwiftUI
import SwiftData

struct GoalDetailView: View {
    let goal: Goal

    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()
            VStack(spacing: MSpacing.md) {
                Text(goal.category.uppercased())
                    .font(.mLabel)
                    .kerning(1.5)
                    .foregroundStyle(Color.meridianGold)
                Text(goal.name)
                    .font(.mHeading)
                    .foregroundStyle(Color.meridianOffWhite)
                    .multilineTextAlignment(.center)
                Text("Goal detail — BIL-10")
                    .font(.mBody)
                    .foregroundStyle(Color.meridianWarmGrey)
            }
            .padding(MSpacing.base)
        }
        .toolbar(.hidden, for: .navigationBar)
    }
}
