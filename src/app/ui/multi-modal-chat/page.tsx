'use client'

import { useRef, useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai";
import Image from "next/image";

export default function MultiModalChatPage() {
  const [input, setInput] = useState('')
  const [files, setFiles] = useState<FileList | undefined>(undefined)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/multi-modal-chat'
    })
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage({ text: input, files })
    setInput('')
    setFiles(undefined);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col w-full max-w-md pt-12 pb-36 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {
        messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="font-semibold">{message.role === 'user' ? 'You: ' : "AI: "}</div>
            {
              message.parts.map((part, index) => {
                switch (part.type) {
                  case "text":
                    return <div
                      key={`${message.id}-${index}`}
                      className="whitespace-pre-wrap"
                    >
                      {part.text}
                    </div>
                  case "file":
                    if (part.mediaType?.startsWith("image/")) {
                      return ( <Image
                          key={`${message.id} - ${index}`}
                          src={part.url}
                          alt={part.filename ?? `attachment - ${index}`}
                          width={500}
                          height={500}
                        />
                      )
                    };
                    return null
                  default:
                    return null
                }
              })
            }
          </div>
        ))
      }

      {
        (status === "submitted" || status === "streaming") && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
            </div>
          </div>
        )
      }

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg">
        <div className="flex flex-col gap-3">
          <div>
            <label htmlFor="file-upload"
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-50 cursor-pointer"
            >
              <svg width='10%' height="10%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21.1525 10.8995L12.1369 19.9151C10.0866 21.9653 6.7625 21.9653 4.71225 19.9151C2.662 17.8648 2.662 14.5407 4.71225 12.4904L13.7279 3.47483C15.0947 2.108 17.3108 2.108 18.6776 3.47483C20.0444 4.84167 20.0444 7.05775 18.6776 8.42458L10.0156 17.0866C9.33213 17.7701 8.22409 17.7701 7.54068 17.0866C6.85726 16.4032 6.85726 15.2952 7.54068 14.6118L15.1421 7.01037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {
                files?.length ?
                  `${files.length} file(s) attached` :
                  `Attach Files`
              }
            </label>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={(event) => {
                if (event.target.files) {
                  setFiles(event.target.files)
                }
              }}
              multiple
              ref={fileInputRef}
            />
          </div>
          <div className="flex gap-2 max-w-xl">
            <input
              className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
              placeholder="How can I help you?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {
              status === "submitted" || status === "streaming" ? (
                <button
                  onClick={stop}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer transition-colors"
                >Stop</button>
              ) : (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer transition-colors"
                  disabled={status !== 'ready'}
                >Send</button>
              )
            }

          </div>
        </div>
      </form>
    </div>
  )
}