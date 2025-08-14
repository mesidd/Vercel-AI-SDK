import { streamObject } from "ai";
import { cohere } from "@ai-sdk/cohere";
import { recipeSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { dish } = await req.json();
    const result = streamObject({
      model: cohere("command-r-plus"),
      schema: recipeSchema,
      prompt: `Generate a dish for ${dish}`,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating reciped: ", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}
