import SwiftUI

struct HomeView: View {
    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()
            Text(AppConstants.Copy.TabBar.home)
                .font(.mHeading)
                .foregroundStyle(Color.meridianOffWhite)
        }
    }
}

#Preview {
    HomeView()
}
