import { convertToModelMessages, streamText, UIMessage } from "ai";
import { cohere } from "@ai-sdk/cohere";
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    const result = streamText({
      model: cohere("command-r-plus"),
      messages: [
        {
          role: "system",
          content: "You are a simple teacher. Explain using analogy and keep the word limit as 60 maximum."
        },
       ...convertToModelMessages(messages)
      ]
    });

    result.usage.then((usage)=> {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens
      })
    })
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion ", error);
    return new Response("Failed to stream chat completion", {status: 500})
  }
}
