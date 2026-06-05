import Foundation

class AnthropicService {
    static let shared = AnthropicService()
    private init() {}

    private var apiKey: String? {
        guard let key = Bundle.main.infoDictionary?["ANTHROPIC_API_KEY"] as? String,
              !key.isEmpty else { return nil }
        return key
    }

    func getNextStep(for goal: Goal, recentEntries: [EvidenceEntry]) async throws -> String {
        guard let apiKey else { throw APIError.missingKey }

        let entryTexts = recentEntries.prefix(3).map(\.content).joined(separator: "\n\n")
        let userMessage = """
        Goal: \(goal.name)
        What the user commits to: \(goal.intention)

        Recent evidence entries:
        \(entryTexts.isEmpty ? "(no entries yet)" : entryTexts)
        """

        let body: [String: Any] = [
            "model": AppConstants.API.anthropicModel,
            "max_tokens": 100,
            "system": AppConstants.Copy.Coach.systemPrompt,
            "messages": [["role": "user", "content": userMessage]]
        ]

        var request = URLRequest(url: URL(string: AppConstants.API.anthropicBaseURL)!)
        request.httpMethod = "POST"
        request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.setValue(AppConstants.API.anthropicVersion, forHTTPHeaderField: "anthropic-version")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        request.timeoutInterval = 15

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw APIError.badResponse
        }

        guard
            let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
            let content = json["content"] as? [[String: Any]],
            let text = content.first?["text"] as? String
        else {
            throw APIError.parseError
        }

        return text.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    enum APIError: LocalizedError {
        case missingKey, badResponse, parseError

        var errorDescription: String? {
            switch self {
            case .missingKey:   return "ANTHROPIC_API_KEY not set in build settings"
            case .badResponse:  return "Anthropic API returned an error"
            case .parseError:   return "Could not parse API response"
            }
        }
    }
}
