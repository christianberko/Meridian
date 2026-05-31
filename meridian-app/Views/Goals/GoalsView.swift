import SwiftUI

struct GoalsView: View {
    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()
            Text(AppConstants.Copy.TabBar.goals)
                .font(.mHeading)
                .foregroundStyle(Color.meridianOffWhite)
        }
    }
}

#Preview {
    GoalsView()
}
