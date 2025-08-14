import { cohere } from "@ai-sdk/cohere";
import { generateText } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const { text } = await generateText({
      model: cohere("command-r-plus"),
      prompt,
    });
    return Response.json({ text });
  } catch (error) {
    console.error("Error generating text: ", error)
    return Response.json({error: "Failed to generate text"}, {status: 500})
  }
}
