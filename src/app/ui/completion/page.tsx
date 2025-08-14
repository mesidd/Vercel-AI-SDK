'use client'
import { useState } from "react"

export default function CompletionPage() {
  const [prompt, setPrompt] = useState('') // User Input
  const [completion, setCompletion] = useState('') // AI Response
  const [isLoading, setIsLoading] = useState(false) //loading
  const [error, setError] = useState<string | null>(null)

  const complete = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setPrompt('');

    try {
      const response = await fetch('/api/completion', {
        method: 'POST',
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ prompt })
      })
      const data = await response.json()

      if(!response.ok){
        throw new Error(data.error || "Something went wrong")
      }
      setCompletion(data.text)
    }
    catch(error){
      console.error("Error: ",error)
      setError(
        error instanceof Error 
        ? error.message
        : "Something went wrong! Please try again."
      )
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md mx-auto  py-24 stretch">
      {
        error && <div className="text-red-400 mb-4">{error}</div>
      }
      
      {
        isLoading ? (
          <div>
            Loading...
          </div>
        ) : completion ? (
          <div className="whitespace-pre-wrap">{completion}</div>
        ) : null
      }
      <form
        onSubmit={complete}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How can I help you?"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}