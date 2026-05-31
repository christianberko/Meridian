import SwiftUI

struct ProfileView: View {
    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()
            Text(AppConstants.Copy.TabBar.profile)
                .font(.mHeading)
                .foregroundStyle(Color.meridianOffWhite)
        }
    }
}

#Preview {
    ProfileView()
}
