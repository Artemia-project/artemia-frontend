import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, User, Bot } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatModuleProps {
  onArtworkRecommendation?: (artwork: any) => void;
}

export const ChatModule: React.FC<ChatModuleProps> = ({ onArtworkRecommendation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your personal art curator. I can help you discover artworks, plan exhibitions, and understand different art movements. What kind of art experience are you looking for today?",
      timestamp: new Date(),
      suggestions: [
        "I'm new to art, where should I start?",
        "Help me plan a modern art exhibition",
        "What's trending in contemporary art?",
        "Compare impressionist vs expressionist styles"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your interest in modern art, I'd recommend starting with works by Picasso and Matisse. Their bold use of color and form revolutionized 20th-century art. Would you like me to show you some specific pieces?",
        "For a contemporary exhibition, consider themes like 'Digital Identity' or 'Climate Change Through Art.' I can help you select pieces that create a cohesive narrative. What's your exhibition space like?",
        "Currently, digital art and NFTs are creating new conversations in the art world, while there's also a resurgence of interest in textile arts and community-based practices. What aspect interests you most?",
        "Impressionists like Monet focused on light and atmosphere with loose brushstrokes, while Expressionists like Van Gogh emphasized emotion through bold colors and dramatic forms. Both movements broke from traditional academic painting in fascinating ways."
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        suggestions: [
          "Show me some examples",
          "Tell me more about this style",
          "How do I start collecting?",
          "Plan an exhibition for me"
        ]
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col shadow-gallery">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-card to-accent/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent-foreground" />
          <h2 className="font-medium text-card-foreground">Art Curator AI</h2>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal guide to art and exhibitions
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`p-3 rounded-lg transition-elegant ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground shadow-elegant'
                      : 'bg-card border border-border shadow-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-7 px-2 hover:bg-accent/20 transition-smooth"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1 order-1">
                  <User className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="bg-card border border-border p-3 rounded-lg shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border bg-gradient-to-r from-background to-accent/5">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about art, exhibitions, or get personalized recommendations..."
            className="flex-1 transition-smooth focus:shadow-elegant"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            variant="curator"
            size="icon"
            className="transition-elegant hover:scale-105"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};