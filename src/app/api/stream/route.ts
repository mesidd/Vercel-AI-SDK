import { cohere } from "@ai-sdk/cohere";
import { streamText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      model: cohere("command-r-plus"),
      prompt,
    });

    result.usage.then((usage)=>{
      console.log({
        input: usage.inputTokens,
        output: usage.outputTokens,
        total: usage.totalTokens
      })
    })

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error: ", error);
    return new Response("Failed to stream", { status: 500 });
  }
}