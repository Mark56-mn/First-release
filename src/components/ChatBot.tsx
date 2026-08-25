import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Mic, Square } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { cn } from "../lib/utils";

export function ChatBot() {
  const { token, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || !token) return;
    
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: text, history })
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setMessages(prev => [...prev, { role: "model", text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        setIsLoading(true);
        try {
          const res = await fetch("/api/ai/transcribe", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });
          const data = await res.json();
          if (res.ok && data.text) {
            setInput(prev => prev + (prev ? " " : "") + data.text);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-primary text-gray-900 rounded-full shadow-lg flex items-center justify-center hover:bg-primary-dark transition-all z-40",
          isOpen && "hidden"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-96 h-[80vh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          <div className="p-4 bg-primary flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-gray-900" />
              <span className="font-bold text-gray-900">Memo AI Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-900 hover:bg-black/10 p-1 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 my-8">
                <p>Hi {user.name.split(" ")[0]}! How can I help you today?</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                  m.role === "user" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-800"
                )}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 rounded-2xl px-4 py-2 text-sm flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2 pb-safe">
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={cn(
                "p-2 rounded-full flex-shrink-0",
                isRecording ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask anything..."
              className="flex-1 bg-gray-100 border-transparent rounded-full px-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-primary outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="p-2 bg-primary text-gray-900 rounded-full hover:bg-primary-dark disabled:opacity-50 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
