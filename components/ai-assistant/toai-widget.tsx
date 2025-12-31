"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function TOAIWidget() {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("toai-widget-is-open");
      return saved === "true";
    }
    return false;
  });
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("toai-widget-messages");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Convert timestamp strings back to Date objects
          return parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        } catch (e) {
          // If parsing fails, return default
        }
      }
    }
    return [
      {
        id: "1",
        text: "Hello! I'm TOAI, your AI assistant. I can help you with vineyard operations, alerts, and insights. Try asking: 'Any risk today?' or 'Which barrels need CO₂?'",
        sender: "ai",
        timestamp: new Date(),
      },
    ];
  });
  const [input, setInput] = useState("");
  
  // Button position (draggable)
  const [buttonPosition, setButtonPosition] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("toai-widget-button-position");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { x: parsed.x, y: parsed.y };
      }
      // Default: bottom-right (24px from bottom, 24px from right) for closed button
      // Button size is 64px (w-16 h-16)
      return { x: window.innerWidth - 64 - 24, y: window.innerHeight - 64 - 24 };
    }
    return { x: 0, y: 0 };
  });
  
  // Chatbox position (draggable)
  const [chatboxPosition, setChatboxPosition] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("toai-widget-chatbox-position");
      if (saved) {
        const parsed = JSON.parse(saved);
        return { x: parsed.x, y: parsed.y };
      }
      // Default: right side, 24px from right, centered vertically
      const chatboxWidth = 384; // w-96 = 24rem = 384px
      const chatboxHeight = 600; // h-96 + header + padding ≈ 600px
      return {
        x: window.innerWidth - chatboxWidth - 24,
        y: (window.innerHeight - chatboxHeight) / 2,
      };
    }
    return { x: 0, y: 0 };
  });
  
  const [isDraggingChatbox, setIsDraggingChatbox] = useState(false);
  const [chatboxDragOffset, setChatboxDragOffset] = useState({ x: 0, y: 0 });
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);
  const chatboxRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousMessagesCountRef = useRef(messages.length);
  const hasRestoredScrollRef = useRef(false);

  // Initialize button position on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("toai-widget-button-position");
      if (!saved) {
        // Default: bottom-right (24px from bottom, 24px from right) for closed button
        // Button size is 64px (w-16 h-16)
        setButtonPosition({
          x: window.innerWidth - 64 - 24,
          y: window.innerHeight - 64 - 24,
        });
      }
    }
  }, []);

  // Save button position to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && buttonPosition.x !== 0 && buttonPosition.y !== 0) {
      localStorage.setItem("toai-widget-button-position", JSON.stringify(buttonPosition));
    }
  }, [buttonPosition]);

  // Save widget open state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("toai-widget-is-open", String(isOpen));
    }
  }, [isOpen]);

  // Save messages to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("toai-widget-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Save chatbox position to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && chatboxPosition.x !== 0 && chatboxPosition.y !== 0) {
      localStorage.setItem("toai-widget-chatbox-position", JSON.stringify(chatboxPosition));
    }
  }, [chatboxPosition]);

  // Save scroll position
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || !isOpen) return;

    const handleScroll = () => {
      if (typeof window !== "undefined") {
        localStorage.setItem("toai-widget-scroll-position", String(container.scrollTop));
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  // Restore scroll position when widget opens (only once per open)
  useEffect(() => {
    if (!isOpen || !messagesContainerRef.current || hasRestoredScrollRef.current) return;

    const savedScroll = localStorage.getItem("toai-widget-scroll-position");
    
    // Restore saved scroll position when opening widget
    if (savedScroll) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = Number(savedScroll);
        }
      }, 150);
    }
    
    hasRestoredScrollRef.current = true;
  }, [isOpen]);

  // Reset restore flag when widget closes
  useEffect(() => {
    if (!isOpen) {
      hasRestoredScrollRef.current = false;
    }
  }, [isOpen]);

  // Auto-scroll to bottom only when new message is added
  useEffect(() => {
    if (!isOpen || !messagesContainerRef.current) return;

    const currentMessagesCount = messages.length;
    const previousMessagesCount = previousMessagesCountRef.current;

    // Only scroll if a new message was actually added (not on initial load)
    if (currentMessagesCount > previousMessagesCount && previousMessagesCount > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    // Update previous count only after checking
    if (currentMessagesCount !== previousMessagesCount) {
      previousMessagesCountRef.current = currentMessagesCount;
    }
  }, [messages.length, isOpen]);

  // Constrain button position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (buttonRef.current) {
        const maxX = window.innerWidth - 64;
        const maxY = window.innerHeight - 64;
        setButtonPosition((prev) => ({
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY)),
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Constrain chatbox position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (chatboxRef.current) {
        const chatboxWidth = 384;
        const chatboxHeight = 600;
        const maxX = window.innerWidth - chatboxWidth;
        const maxY = window.innerHeight - chatboxHeight;
        setChatboxPosition((prev) => ({
          x: Math.max(0, Math.min(prev.x, maxX)),
          y: Math.max(0, Math.min(prev.y, maxY)),
        }));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle chatbox dragging
  useEffect(() => {
    if (!isDraggingChatbox || !isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();

      const newX = e.clientX - chatboxDragOffset.x;
      const newY = e.clientY - chatboxDragOffset.y;

      // Constrain to viewport
      const chatboxWidth = 384;
      const chatboxHeight = 600;
      const maxX = window.innerWidth - chatboxWidth;
      const maxY = window.innerHeight - chatboxHeight;

      setChatboxPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDraggingChatbox(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    // Prevent text selection and set cursor
    document.body.style.cursor = 'pointer';
    document.body.style.userSelect = 'none';

    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });
    document.addEventListener("mouseleave", handleMouseUp, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDraggingChatbox, chatboxDragOffset, isOpen]);

  const handleChatboxMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from header, not from input or buttons
    const target = e.target as HTMLElement;
    if (target.closest('input') || target.closest('button') || target.closest('[role="textbox"]')) {
      return;
    }

    if (isOpen && chatboxRef.current) {
      e.preventDefault();
      const rect = chatboxRef.current.getBoundingClientRect();
      setChatboxDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDraggingChatbox(true);
    }
  };

  // Handle dragging (only for button when closed)
  useEffect(() => {
    if (!isDragging || isOpen) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      // Check if mouse moved significantly (more than 5px) to consider it a drag
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - dragStartPos.x, 2) + 
        Math.pow(e.clientY - dragStartPos.y, 2)
      );
      
      if (moveDistance > 5) {
        setHasDragged(true);
      }

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const maxX = window.innerWidth - 64;
      const maxY = window.innerHeight - 64;

      setButtonPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = (e: MouseEvent) => {
      e.preventDefault();
      setIsDragging(false);
      // Reset cursor
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      // Delay resetting hasDragged to allow click handler to check it
      setTimeout(() => {
        setHasDragged(false);
      }, 200);
    };

    // Prevent text selection and set cursor
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    document.addEventListener("mousemove", handleMouseMove, { passive: false });
    document.addEventListener("mouseup", handleMouseUp, { passive: false });
    document.addEventListener("mouseleave", handleMouseUp, { passive: false });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset, dragStartPos, isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isOpen && buttonRef.current) {
      e.preventDefault();
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      // Store initial mouse position to detect movement
      setDragStartPos({
        x: e.clientX,
        y: e.clientY,
      });
      setIsDragging(true);
      setHasDragged(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const queryText = input;
    setInput("");

    // Show loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "Thinking...",
      sender: "ai",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Query the database via API
      const { aiService } = await import('@/api');
      const aiResponse = await aiService.query(queryText);
      
      // Remove loading message and add actual response
      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => msg.id !== loadingMessage.id);
        const aiMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        };
        return [...withoutLoading, aiMessage];
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
      // Remove loading message and show error
      setMessages((prev) => {
        const withoutLoading = prev.filter((msg) => msg.id !== loadingMessage.id);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: "Sorry, I'm having trouble connecting to the database. Please try again later.",
          sender: "ai",
          timestamp: new Date(),
        };
        return [...withoutLoading, errorMessage];
      });
    }
  };

  if (!isOpen) {
    return (
      <div
        ref={buttonRef}
        className="fixed z-50 cursor-pointer rounded-full w-16 h-16 shadow-lg"
        style={{
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
        }}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          // Only open if it was a click, not a drag
          if (!hasDragged && !isDragging) {
            e.stopPropagation();
            setIsOpen(true);
          }
        }}
      >
        <Image
          src="/Toai_gpt_logo.png"
          alt="TOAI Assistant"
          width={64}
          height={64}
          className="w-full h-full object-cover pointer-events-none rounded-full"
          draggable={false}
        />
      </div>
    );
  }

  return (
    <>
      {/* Button (hidden but keeps position) */}
      <div
        ref={buttonRef}
        className="fixed z-50 rounded-full w-16 h-16 shadow-lg"
        style={{
          left: `${buttonPosition.x}px`,
          top: `${buttonPosition.y}px`,
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <Image
          src="/Toai_gpt_logo.png"
          alt="TOAI Assistant"
          width={64}
          height={64}
          className="w-full h-full object-cover rounded-full"
          draggable={false}
        />
      </div>
      
      {/* Chatbox (draggable) */}
      <div
        ref={chatboxRef}
        className="fixed z-50 w-96 cursor-pointer"
        style={{
          left: `${chatboxPosition.x}px`,
          top: `${chatboxPosition.y}px`,
        }}
        onMouseDown={handleChatboxMouseDown}
      >
        <Card className="shadow-2xl">
          <CardHeader className="pb-3 cursor-pointer">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image
                src="/Toai_gpt_logo.png"
                alt="TOAI"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
              />
              TOAI Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsOpen(false);
                // Clear the saved open state when user explicitly closes
                if (typeof window !== "undefined") {
                  localStorage.setItem("toai-widget-is-open", "false");
                }
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 flex flex-col">
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask TOAI anything..."
                  className="flex-1 px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button onClick={handleSend} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </>
  );
}

