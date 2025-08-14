'use client'

import { useCompletion } from "@ai-sdk/react"
import { useState } from "react"

export default function streamPage() {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop }
    = useCompletion({
      api: '/api/stream'
    })

  const [lastInput, setLastInput] = useState('');

  return (
    <div className="flex flex-col w-full max-w-md mx-auto  py-24 stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {
        isLoading && !completion && <div>Loading...</div>
      }
      {lastInput && (
        <div className="whitespace-pre-wrap">
          <div className="text-white text-right"><span className="font-bold text-teal-600">You: </span>{lastInput}</div>
          {completion && <div className="text-white px-4 py-2 rounded-lg max-w-[60%] break-words "><span className="font-bold text-teal-600">Cohere: </span>{completion}</div>}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const snapshot = input;
          setLastInput(snapshot);
          setInput("")
          handleSubmit(e);
        }}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything...."
          />
          {
            isLoading ?
              <button className="bg-red-400 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={stop}>Stop</button>
              : (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Send
                </button>
              )
          }
        </div>
      </form>
    </div>
  )
}