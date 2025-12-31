"use client";

import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Send, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("toai-assistant-page-messages");
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Check if user is at bottom of chat and show scroll button
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      setShowScrollButton(false);
      return;
    }

    const checkScrollPosition = () => {
      if (messages.length === 0) {
        setShowScrollButton(false);
        return;
      }

      // Wait for next frame to ensure layout is calculated
      requestAnimationFrame(() => {
        // Ensure we have valid measurements
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const scrollTop = container.scrollTop;

        // Check if container is scrollable (with small threshold for rounding)
        const canScroll = scrollHeight > clientHeight + 5;
        
        if (!canScroll) {
          setShowScrollButton(false);
          return;
        }

        // Check if user is at bottom (with 50px threshold)
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        const isAtBottom = distanceFromBottom < 50;
        
        // Show button if we can scroll and user is not at bottom
        setShowScrollButton(!isAtBottom);
      });
    };

    // Check multiple times to ensure DOM is ready
    const checkWithDelay = () => {
      checkScrollPosition();
      setTimeout(checkScrollPosition, 50);
      setTimeout(checkScrollPosition, 100);
      setTimeout(checkScrollPosition, 200);
      setTimeout(checkScrollPosition, 300);
      setTimeout(checkScrollPosition, 500);
    };

    checkWithDelay();
    
    // Also check when messages array changes
    const messageCheckTimeout = setTimeout(checkScrollPosition, 100);

    container.addEventListener("scroll", checkScrollPosition);
    
    // Also check when container resizes
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkScrollPosition, 100);
    });
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      resizeObserver.disconnect();
      clearTimeout(messageCheckTimeout);
    };
  }, [messages.length]);

  const scrollToInput = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const suggestedQueries = [
    "Any risk today?",
    "Which barrels need CO₂?",
    "Show low stock items",
    "What's the temperature trend?",
    "Attendance summary for this week",
  ];

  const generateAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("risk") || lowerQuery.includes("alert")) {
      return "I've detected 2 overdue CO₂ barrels (CO2-003, CO2-005) and 3 low stock items requiring immediate attention. Temperature is within normal range. Would you like me to generate a detailed report?";
    }

    if (lowerQuery.includes("co2") || lowerQuery.includes("barrel")) {
      return "There are 2 overdue CO₂ barrels: CO2-003 (due Jan 17) and CO2-005 (due Jan 16). Both are at critical capacity levels (15% and 20%). I recommend immediate refilling.";
    }

    if (lowerQuery.includes("stock") || lowerQuery.includes("inventory")) {
      return "Low stock items: Fertilizer NPK (45 kg, min 100), Pesticide Organic (25L, min 50L), and Pruning Shears (15 pieces, min 20). I suggest placing orders for these items.";
    }

    if (lowerQuery.includes("temperature") || lowerQuery.includes("weather")) {
      return "Current average temperature is 24.8°C. Today's readings show 3 warning alerts between 11 AM - 3 PM with temperatures reaching 30.1°C. Humidity is at 82% during peak hours.";
    }

    if (lowerQuery.includes("attendance") || lowerQuery.includes("staff")) {
      return "Today's attendance: 42 present, 8 absent, 3 late, and 5 on leave. Overall attendance rate is 84%. All check-ins are via QR code system.";
    }

    return "I can help you with vineyard operations, CO₂ management, inventory, temperature monitoring, and attendance. What would you like to know?";
  };

  // Save messages to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && messages.length > 0) {
      localStorage.setItem("toai-assistant-page-messages", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new message is added
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || messages.length <= 1) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    // Only auto-scroll if user is already at bottom
    if (isAtBottom) {
      setTimeout(() => {
        if (container) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSuggestedQuery = (query: string) => {
    // Auto-send the suggested query without setting it in input
    const userMessage: Message = {
      id: Date.now().toString(),
      text: query,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input field

    setTimeout(() => {
      const aiResponse = generateAIResponse(query);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
        <div className="pb-1 flex-shrink-0">
          <h1 className="text-xl font-semibold text-foreground">TOAI Assistant</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Get intelligent insights and answers about your vineyard operations
          </p>
        </div>

        <Card className="border-border/50 shadow-sm flex-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-3 flex-shrink-0">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              TOAI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
            {/* Conversation Section - Scrollable */}
            <div className="flex-1 relative min-h-0">
              <div 
                ref={messagesContainerRef}
                className={`h-full p-4 space-y-4 ${
                  messages.length > 0 
                    ? "overflow-y-auto scrollbar-hide" 
                    : "overflow-hidden"
                }`}
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
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
              </div>

              {/* Scroll to Bottom Button - Inside conversation section */}
              {showScrollButton && (
                <Button
                  onClick={scrollToInput}
                  size="icon"
                  className="absolute bottom-4 right-4 z-50 rounded-full w-10 h-10 bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center"
                  aria-label="Scroll to input"
                >
                  <ChevronDown className="w-5 h-5 text-white" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Input Area - Static outside conversation section */}
        <div className="border-t border-border bg-background p-4 flex-shrink-0">
          {/* Suggested Queries - Always visible above input */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {suggestedQueries.map((query, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuery(query)}
                  className="px-3 py-1.5 text-xs rounded-md border border-border/30 bg-background hover:bg-accent/30 transition-colors text-foreground"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask TOAI anything..."
              className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

