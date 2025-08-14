import { cohere } from "@ai-sdk/cohere";
import { generateObject } from "ai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const result = await generateObject({
      model: cohere("command-r-plus"),
      output: "enum",
      enum: ["positive", "negative", "neutral"],
      prompt: `Classify the sentiment in this text: "${text}"`,
    });

    return result.toJsonResponse();
  } catch (error) {
    console.error("Error generating sentiment: ", error);
    return new Response("Failed to generate sentiment", { status: 500 });
  }
}
