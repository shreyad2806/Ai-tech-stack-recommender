import { useState, useRef, useEffect, useCallback } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatContainer = ({ history, onNewChat, onHistoryClick }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm StackMind AI. What are you building today? I'll help you design the perfect tech stack and architecture for your project."
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessageIndex, setTypingMessageIndex] = useState(-1);
  const [shouldStop, setShouldStop] = useState(false);
  
  const textareaRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const messagesEndRef = useRef(null);

  // API URL
  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Typing animation effect
  const startTypingAnimation = useCallback((messageIndex, fullContent) => {
    if (shouldStop) return;
    
    setIsTyping(true);
    setTypingMessageIndex(messageIndex);
    
    let currentCharIndex = 0;
    
    typingIntervalRef.current = setInterval(() => {
      if (shouldStop) {
        clearInterval(typingIntervalRef.current);
        setMessages(prev => {
          const newMessages = [...prev];
          if (newMessages[messageIndex]) {
            newMessages[messageIndex].content = fullContent;
          }
          return newMessages;
        });
        setIsTyping(false);
        setTypingMessageIndex(-1);
        return;
      }
      
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages[messageIndex] && currentCharIndex < fullContent.length) {
          newMessages[messageIndex].content = fullContent.slice(0, currentCharIndex + 1);
        }
        return newMessages;
      });
      
      currentCharIndex++;
      
      if (currentCharIndex >= fullContent.length) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
        setTypingMessageIndex(-1);
      }
    }, 15); // Speed of typing (15ms per character)
  }, [shouldStop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading || isTyping) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setShouldStop(false);

    // Add loading message
    const loadingMessage = { role: "assistant", loading: true };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea: userMessage.content }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      
      // Diagram URL is now included in the API response
      if (data.diagram_url) {
        console.log("Diagram URL received:", data.diagram_url);
      }

      // Format response
      const responseContent = `Here's your comprehensive tech stack recommendation for **${userMessage.content}**:

${data.architecture ? `**Architecture:** ${data.architecture}\n\n` : ''}
${data.tech_stack ? `**Tech Stack:** I've selected optimal technologies for your project based on modern best practices.\n\n` : ''}
${data.deployment ? `**Deployment:** ${data.deployment}\n\n` : ''}
${data.roadmap ? `**Implementation Roadmap:** I've created a step-by-step plan to get you started.\n\n` : ''}

I've also included cost estimates and detailed reasoning for each technology choice to help you make informed decisions.`;

      // Replace loading message with assistant message
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(msg => msg.loading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            role: "assistant",
            content: "",
            data: data,
            error: data.error
          };
        }
        return newMessages;
      });

      // Start typing animation
      const assistantIndex = messages.length + 1; // Index of the assistant message
      startTypingAnimation(assistantIndex, responseContent);

    } catch (err) {
      console.error("Chat error:", err);
      
      // Replace loading message with error message
      setMessages(prev => {
        const newMessages = [...prev];
        const loadingIndex = newMessages.findIndex(msg => msg.loading);
        if (loadingIndex !== -1) {
          newMessages[loadingIndex] = {
            role: "assistant",
            content: "Sorry, I encountered an error while generating your tech stack recommendation. Please try again.",
            error: true
          };
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stop generation
  const handleStopGeneration = () => {
    setShouldStop(true);
    setIsLoading(false);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm StackMind AI. What are you building today? I'll help you design the perfect tech stack and architecture for your project."
      }
    ]);
    setInput("");
    setIsLoading(false);
    setIsTyping(false);
    setShouldStop(false);
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
    onNewChat();
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.05]">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-semibold text-white">StackMind AI</h1>
          </div>
          <button
            onClick={handleNewChat}
            className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-xl text-sm font-medium text-gray-200 transition-all duration-300 hover:scale-[1.05] shadow-lg hover:shadow-xl"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              isLast={index === messages.length - 1}
              isTyping={isTyping && index === typingMessageIndex}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onStopGeneration={handleStopGeneration}
        isLoading={isLoading}
        isTyping={isTyping}
      />
    </div>
  );
};

export default ChatContainer;
