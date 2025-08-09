import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, Bot, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isSaved?: boolean;
}

interface ChatModuleProps {
  onArtworkRecommendation?: (artwork: any) => void;
  externalMessage?: string;
  onMessageSent?: () => void;
}

export const ChatModule: React.FC<ChatModuleProps> = ({ onArtworkRecommendation, externalMessage, onMessageSent }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content:
        "Hello! I'm your personal art curator. I can help you discover artworks, plan exhibitions, and understand different art movements. What kind of art experience are you looking for today?",
      timestamp: new Date(),
      suggestions: [
        "I'm new to art, where should I start?",
        'Help me plan a modern art exhibition',
        "What's trending in contemporary art?",
        'Compare impressionist vs expressionist styles'
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (externalMessage) {
      const sendExternalMessage = async () => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: externalMessage,
          timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsLoading(true);

        setTimeout(() => {
          const responses = [
            `${externalMessage}에 대한 맞춤형 코스를 추천해드릴게요! 이 전시회와 연관된 주변 갤러리와 박물관을 포함한 문화 코스를 계획해보세요. 근처 카페나 레스토랑도 함께 추천해드릴까요?`,
            `훌륭한 선택이네요! ${externalMessage.split(' ')[0]} 전시회를 중심으로 한 하루 코스를 짜보겠습니다. 비슷한 작품들을 볼 수 있는 다른 장소들과 함께 문화적 경험을 극대화할 수 있는 루트를 제안해드릴게요.`,
            `${externalMessage.split(' ')[0]} 전시회와 테마가 연결되는 다른 문화 공간들을 찾아보겠습니다. 미술관, 갤러리, 그리고 관련 문화시설들을 포함한 종합적인 코스를 계획해서 알려드릴게요!`
          ];

          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            suggestions: [
              '상세한 코스 일정 짜줘',
              '교통편 정보도 알려줘',
              '비슷한 다른 전시 추천해줘',
              '근처 맛집도 알려줘'
            ]
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setIsLoading(false);
        }, 1500);
      };

      sendExternalMessage();
      
      if (onMessageSent) {
        onMessageSent();
      }
    }
  }, [externalMessage]);

  const savedMessages = messages.filter((msg) => msg.isSaved);
  const savedCount = savedMessages.length;

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "Based on your interest in modern art, I'd recommend starting with works by Picasso and Matisse. Their bold use of color and form revolutionized 20th-century art. Would you like me to show you some specific pieces?",
        "For a contemporary exhibition, consider themes like 'Digital Identity' or 'Climate Change Through Art.' I can help you select pieces that create a cohesive narrative. What's your exhibition space like?",
        'Currently, digital art and NFTs are creating new conversations in the art world, while there\'s also a resurgence of interest in textile arts and community-based practices. What aspect interests you most?',
        'Impressionists like Monet focused on light and atmosphere with loose brushstrokes, while Expressionists like Van Gogh emphasized emotion through bold colors and dramatic forms. Both movements broke from traditional academic painting in fascinating ways.'
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        suggestions: [
          'Show me some examples',
          'Tell me more about this style',
          'How do I start collecting?',
          'Plan an exhibition for me'
        ]
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: suggestion,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const responses = [
        "Based on your interest in modern art, I'd recommend starting with works by Picasso and Matisse. Their bold use of color and form revolutionized 20th-century art. Would you like me to show you some specific pieces?",
        "For a contemporary exhibition, consider themes like 'Digital Identity' or 'Climate Change Through Art.' I can help you select pieces that create a cohesive narrative. What's your exhibition space like?",
        'Currently, digital art and NFTs are creating new conversations in the art world, while there\'s also a resurgence of interest in textile arts and community-based practices. What aspect interests you most?',
        'Impressionists like Monet focused on light and atmosphere with loose brushstrokes, while Expressionists like Van Gogh emphasized emotion through bold colors and dramatic forms. Both movements broke from traditional academic painting in fascinating ways.'
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        suggestions: [
          'Show me some examples',
          'Tell me more about this style',
          'How do I start collecting?',
          'Plan an exhibition for me'
        ]
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSaveMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isSaved: !msg.isSaved } : msg
      )
    );

    const message = messages.find((msg) => msg.id === messageId);
    if (message) {
      toast({
        title: message.isSaved ? 'Message unsaved' : 'Message saved!',
        description: message.isSaved
          ? 'Removed from your favorites'
          : 'Added to your favorites'
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col shadow-gallery bg-gradient-to-br from-card via-card to-accent/5 border border-border/50">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
              <h2 className="font-medium text-card-foreground">
                Art Curator AI
              </h2>
            </div>

            {/* Saved badge */}
            <Badge
              variant="secondary"
              className="text-sm px-3 py-1 flex items-center cursor-pointer"
              onClick={() => setIsSavedModalOpen(true)}
            >
              <Heart className="w-4 h-4 mr-1 fill-current" />
              {savedCount} Saved
            </Badge>
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
                className={`flex gap-3 ${
                  message.type === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}

                <div className="max-w-[80%]">
                  <div
                    className={`p-4 rounded-xl transition-elegant relative ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-elegant'
                        : 'bg-gradient-to-r from-card to-accent/5 border border-border shadow-gallery hover:shadow-elegant'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>

                    {message.type === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveMessage(message.id)}
                        className={`absolute bottom-2 right-2 transition-elegant h-8 w-8 ${
                          message.isSaved
                            ? 'text-red-500 bg-red-50/50'
                            : 'text-muted-foreground hover:text-red-500 hover:bg-red-50/30'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            message.isSaved ? 'fill-current' : ''
                          }`}
                        />
                      </Button>
                    )}
                  </div>

                  {message.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleSuggestionClick(suggestion)
                          }
                          className="text-xs h-7 px-2 hover:bg-accent/20 transition-smooth"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
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
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
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
              placeholder="***예시 프롬프트 넣기***"
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

      {/* Saved Messages Modal */}
      <Dialog open={isSavedModalOpen} onOpenChange={setIsSavedModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Saved Messages</DialogTitle>
            <DialogDescription>
              These are the messages you’ve marked as favorite.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {savedMessages.length > 0 ? (
              savedMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-3 border rounded-lg bg-accent/5 text-sm relative"
                >
                  {msg.content}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500"
                    onClick={() => handleSaveMessage(msg.id)}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No saved messages yet.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsSavedModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
