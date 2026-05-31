import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 255, 255, 255)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }

    // Core palette
    static let meridianGold         = Color(hex: "#F5A623")
    static let meridianCharcoal     = Color(hex: "#1A1917")
    static let meridianOffWhite     = Color(hex: "#FAFAF8")
    static let meridianWarmGrey     = Color(hex: "#8A8580")
    static let meridianSilver       = Color(hex: "#C4C4C4")

    // Surfaces
    static let meridianSurface      = Color(hex: "#242320")
    static let meridianSurface2     = Color(hex: "#2E2C29")
    static let meridianSurfaceLight = Color(hex: "#F0EFEC")

    // Gold opacity variants
    static let meridianGold80       = Color(hex: "#F5A623").opacity(0.8)
    static let meridianGold40       = Color(hex: "#F5A623").opacity(0.4)
    static let meridianGold20       = Color(hex: "#F5A623").opacity(0.2)
    static let meridianGold10       = Color(hex: "#F5A623").opacity(0.1)
    static let meridianGold06       = Color(hex: "#F5A623").opacity(0.06)

    // Thread gradient stops (silver → gold journey)
    static let threadStart          = Color(hex: "#C4C4C4")
    static let threadMid1           = Color(hex: "#D88C1A")
    static let threadMid2           = Color(hex: "#EE9E20")
    static let threadEnd            = Color(hex: "#F5A623")

    // Borders
    static let meridianBorderDark   = Color.white.opacity(0.07)
    static let meridianBorderLight  = Color.black.opacity(0.08)
}

extension Font {
    static func fraunces(size: CGFloat, weight: Font.Weight = .light) -> Font {
        .custom("Fraunces-Italic", size: size)
    }

    static let mDisplay  = Font.fraunces(size: 56)
    static let mHeading  = Font.fraunces(size: 32)
    static let mSubhead  = Font.fraunces(size: 20)
    static let mTitle    = Font.fraunces(size: 24)
    static let mBodyLg   = Font.system(size: 17)
    static let mBody     = Font.system(size: 15)
    static let mLabel    = Font.system(size: 11, weight: .medium)
    static let mCaption  = Font.system(size: 11)
}

enum MSpacing {
    static let xs:   CGFloat = 4
    static let sm:   CGFloat = 8
    static let md:   CGFloat = 12
    static let base: CGFloat = 16
    static let lg:   CGFloat = 24
    static let xl:   CGFloat = 32
    static let xxl:  CGFloat = 48
    static let huge: CGFloat = 64
    static let hero: CGFloat = 80
}

enum MRadius {
    static let xs:   CGFloat = 6
    static let sm:   CGFloat = 8
    static let md:   CGFloat = 12
    static let lg:   CGFloat = 16
    static let xl:   CGFloat = 24
    static let xxl:  CGFloat = 32
    static let full: CGFloat = 9999
}

enum MAnimation {
    static let quick    = Animation.easeInOut(duration: 0.2)
    static let standard = Animation.spring(response: 0.35, dampingFraction: 0.7)
    static let thread   = Animation.spring(response: 0.6, dampingFraction: 0.75)
    static let sheet    = Animation.easeInOut(duration: 0.4)
}
