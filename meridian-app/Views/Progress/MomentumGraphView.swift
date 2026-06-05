import SwiftUI
import Charts

struct MomentumGraphView: View {
    let goals: [Goal]

    private struct WeekPoint: Identifiable {
        let id: Int
        let label: String
        let count: Int
    }

    private var weeklyData: [WeekPoint] {
        let now = Date()
        let cal = Calendar.current
        return (0..<8).map { i in
            let startOffset = (7 - i) * 7
            let start = cal.date(byAdding: .day, value: -startOffset, to: now)!
            let end = cal.date(byAdding: .day, value: 7, to: start)!
            let count = goals.flatMap(\.entries).filter {
                $0.createdAt >= start && $0.createdAt < end
            }.count
            let f = DateFormatter()
            f.dateFormat = "d MMM"
            return WeekPoint(id: i, label: f.string(from: start), count: count)
        }
    }

    private var maxCount: Int { max(weeklyData.map(\.count).max() ?? 0, 1) }

    var body: some View {
        VStack(alignment: .leading, spacing: MSpacing.md) {
            HStack {
                Text("MOMENTUM")
                    .font(.mLabel)
                    .kerning(1.5)
                    .foregroundStyle(Color.meridianWarmGrey)
                Spacer()
                Text("8 weeks")
                    .font(.mCaption)
                    .foregroundStyle(Color.meridianWarmGrey.opacity(0.5))
            }

            Chart {
                ForEach(weeklyData) { point in
                    AreaMark(
                        x: .value("Week", point.id),
                        y: .value("Entries", point.count)
                    )
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color.meridianGold.opacity(0.20), Color.clear],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .interpolationMethod(.catmullRom)

                    LineMark(
                        x: .value("Week", point.id),
                        y: .value("Entries", point.count)
                    )
                    .foregroundStyle(
                        LinearGradient(
                            colors: [Color.meridianSilver, Color.meridianGold],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .lineStyle(StrokeStyle(lineWidth: 2))
                    .interpolationMethod(.catmullRom)
                }

                if let last = weeklyData.last {
                    PointMark(
                        x: .value("Week", last.id),
                        y: .value("Entries", last.count)
                    )
                    .foregroundStyle(Color.meridianGold.opacity(0.25))
                    .symbolSize(220)

                    PointMark(
                        x: .value("Week", last.id),
                        y: .value("Entries", last.count)
                    )
                    .foregroundStyle(Color.meridianGold)
                    .symbolSize(55)
                }
            }
            .chartXAxis {
                AxisMarks(values: weeklyData.map(\.id)) { value in
                    if let idx = value.as(Int.self),
                       let point = weeklyData.first(where: { $0.id == idx }),
                       idx == 0 || idx == 3 || idx == 7 {
                        AxisValueLabel {
                            Text(point.label)
                                .font(.system(size: 10))
                                .foregroundStyle(
                                    idx == 7
                                        ? Color.meridianGold
                                        : Color.meridianWarmGrey.opacity(0.5)
                                )
                        }
                    }
                }
            }
            .chartYAxis {
                AxisMarks(position: .trailing, values: [0, maxCount]) { value in
                    AxisValueLabel {
                        if let v = value.as(Int.self) {
                            Text("\(v)")
                                .font(.system(size: 10))
                                .foregroundStyle(Color.meridianWarmGrey.opacity(0.45))
                        }
                    }
                }
            }
            .chartYScale(domain: 0...(maxCount + 1))
            .frame(height: 140)
        }
        .padding(MSpacing.base)
        .background(Color.meridianSurface)
        .clipShape(RoundedRectangle(cornerRadius: MRadius.xl))
        .overlay(
            RoundedRectangle(cornerRadius: MRadius.xl)
                .strokeBorder(Color.meridianBorderDark, lineWidth: 0.5)
        )
    }
}
