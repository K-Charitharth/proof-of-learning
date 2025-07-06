export class AITutor {
  private apiKey: string
  private endpoint: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ZEROG_API_KEY || ""
    this.endpoint = "https://api.0g.ai/compute"
  }

  async generateResponse(message: string, courseContext: string): Promise<string> {
    try {
      const response = await fetch(`${this.endpoint}/inference`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b",
          messages: [
            {
              role: "system",
              content: `You are an AI tutor for a course on ${courseContext}. Provide helpful, educational responses that guide the student through learning. Keep responses concise but informative.`,
            },
            {
              role: "user",
              content: message,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("AI Tutor Error:", error)
      return "I'm having trouble connecting to the AI compute network. Please try again."
    }
  }

  async validateQuizAnswer(question: string, answer: string, correctAnswer: string): Promise<boolean> {
    // Use AI to validate more complex quiz answers
    try {
      const response = await fetch(`${this.endpoint}/inference`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b",
          messages: [
            {
              role: "system",
              content:
                'You are a quiz validator. Determine if the student answer is correct. Respond with only "CORRECT" or "INCORRECT".',
            },
            {
              role: "user",
              content: `Question: ${question}\nStudent Answer: ${answer}\nCorrect Answer: ${correctAnswer}`,
            },
          ],
          max_tokens: 10,
        }),
      })

      const data = await response.json()
      return data.choices[0].message.content.includes("CORRECT")
    } catch (error) {
      console.error("Quiz validation error:", error)
      return false
    }
  }
}
