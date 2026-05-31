import SwiftUI

struct ProgressView: View {
    var body: some View {
        ZStack {
            Color.meridianCharcoal.ignoresSafeArea()
            Text(AppConstants.Copy.TabBar.progress)
                .font(.mHeading)
                .foregroundStyle(Color.meridianOffWhite)
        }
    }
}

#Preview {
    ProgressView()
}
