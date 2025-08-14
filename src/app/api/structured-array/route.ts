import { cohere } from "@ai-sdk/cohere";
import { streamObject } from "ai";
import { pokemonSchema } from "./schema";

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    const result = streamObject({
      model: cohere("command-r-plus"),
      output: "array",
      schema: pokemonSchema,
      prompt: `Generate a list of 5 ${type} pokemon`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating pokemon: ", error);
    return new Response("Failed to generate pokemon", { status: 500 });
  }
}
