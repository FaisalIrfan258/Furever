"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, X } from "lucide-react"
import { chatbotAPI } from "@/lib/api"
import { Loader2 } from "lucide-react"

type Message = {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hi there! How can I help you with pet adoption today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [typingDots, setTypingDots] = useState(".")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Animate typing dots
  useEffect(() => {
    let dotsInterval: NodeJS.Timeout;
    
    if (isLoading) {
      dotsInterval = setInterval(() => {
        setTypingDots(prev => {
          if (prev.length >= 3) return ".";
          return prev + ".";
        });
      }, 500);
    }
    
    return () => {
      if (dotsInterval) clearInterval(dotsInterval);
    };
  }, [isLoading]);

  useEffect(() => {
    scrollToBottom()
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [messages, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Store the message being sent
    const userMessageText = message.trim()
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userMessageText,
      isBot: false,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)
    
    try {
      // Show typing indicator immediately
      scrollToBottom()
      
      // Call the API and wait for response
      const response = await chatbotAPI.sendMessage(userMessageText)
      
      // Process the response after it's received
      const botResponseText = response.data.response || 
        "I'm not sure how to respond to that. Can you try asking something else?";
      
      // Add bot response after a small delay to simulate natural typing
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponseText,
          isBot: true,
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, botMessage])
        setIsLoading(false)
      }, 500);
      
    } catch (error) {
      console.error("Error sending message to chatbot:", error)
      
      // Add error message after a short delay
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I'm having trouble connecting right now. Please try again later.",
          isBot: true,
          timestamp: new Date(),
        }
        
        setMessages(prev => [...prev, errorMessage])
        setIsLoading(false)
      }, 500);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat bubble button */}
      {!isOpen && (
        <Button
          className="h-14 w-14 rounded-full shadow-lg bg-rose-600 hover:bg-rose-700 transition-all"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle size={24} />
        </Button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-[320px] sm:w-[350px] h-[450px] border border-gray-200">
          {/* Chat header */}
          <div className="p-4 border-b flex items-center justify-between bg-rose-600 text-white rounded-t-lg">
            <h3 className="font-medium">Furever Assistant</h3>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-rose-700" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </Button>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isBot ? "justify-start" : "justify-end"} mb-2`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.isBot
                      ? "bg-gray-100 text-gray-800"
                      : "bg-rose-600 text-white"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-[10px] mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-2">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <p className="text-sm">Typing{typingDots}</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSubmit} className="border-t p-2 flex">
            <Input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 focus-visible:ring-rose-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="ml-2 bg-rose-600 hover:bg-rose-700"
              disabled={isLoading || !message.trim()}
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      )}
    </div>
  )
} 