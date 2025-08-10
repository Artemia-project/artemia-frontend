/* src/components/ChatModule.tsx
   ─────────────────────────────────────────────────────────
   백엔드 FastAPI(/ask)와 통신해 `final_answer`를 채팅창에 표시하는
   완성형 컴포넌트.  (C) Artemia
*/
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Sparkles, Bot, Heart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

/* ---- 타입 --------------------------------------------------------- */
export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isSaved?: boolean;
}

interface ChatModuleProps {
  onArtworkRecommendation?: (artwork: unknown) => void;
  externalMessage?: string;
  onMessageSent?: () => void;
  onSavedMessagesChange?: (count: number, messages: Message[]) => void;
}

/* ---- 환경변수: API End-Point -------------------------------------- */
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

/* ---- 유틸: 백엔드 호출 ------------------------------------------- */
type BackendResponse = { final_answer: string; cards: unknown[] };

const MAX_TURNS = 8; // 과도한 페이로드 방지

async function callBackend(history: Message[]): Promise<BackendResponse> {
  // 프론트의 Message[] → 백엔드가 기대하는 {messages:[{role,content}], meta:{…}}
  const payload = {
    messages: history.slice(-MAX_TURNS).map(m => ({
      role: m.type === 'user' ? 'user' : 'assistant',
      content: m.content,
    })),
    meta: {
      client: 'artful-muse-chat',
      ts: new Date().toISOString(),
    },
  };

  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  if (!res.ok) {
    // FastAPI의 오류 메시지(detail)를 최대한 보여주자
    try {
      const j = JSON.parse(text);
      throw new Error(`Backend error ${res.status}: ${j.detail ?? text}`);
    } catch {
      throw new Error(`Backend error ${res.status}: ${text}`);
    }
  }
  return JSON.parse(text) as BackendResponse;
}

/* =================================================================== */
/*                        ChatModule 컴포넌트                           */
/* =================================================================== */
export const ChatModule: React.FC<ChatModuleProps> = ({
  onArtworkRecommendation,
  externalMessage,
  onMessageSent,
  onSavedMessagesChange
}) => {
  /* ---------------- state --------------------------------------- */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content:
        "안녕하세요! 저는 전시·예술 큐레이터 AI예요. 궁금한 점을 질문해 보세요 😉",
      timestamp: new Date(),
      suggestions: [
        '이번 주말 볼 만한 전시 추천해줘',
        '전통 미술과 현대 미술 차이 알려줘',
        '서울 무료 전시 알려줘'
      ]
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  /* ---------------- auto-scroll --------------------------------- */
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToBottom, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  /* ---------------- external message handling ------------------- */
  useEffect(() => {
    if (externalMessage) {
      const sendExternalMessage = async () => {
        const userMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: externalMessage,
          timestamp: new Date()
        };

        const nextHistory = [...messages, userMessage];
        setMessages(nextHistory);
        setIsLoading(true);

        try {
          const data = await callBackend(nextHistory);
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: 'assistant',
            content: data.final_answer,
            timestamp: new Date(),
            suggestions: [
              '상세한 코스 일정 짜줘',
              '교통편 정보도 알려줘',
              '비슷한 다른 전시 추천해줘',
              '근처 맛집도 알려줘'
            ]
          };
          setMessages(prev => [...prev, assistantMessage]);
        } catch (err: unknown) {
          toast({
            title: '백엔드 오류',
            description: err instanceof Error ? err.message : '요청 중 오류가 발생했어요.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };

      sendExternalMessage();
      
      if (onMessageSent) {
        onMessageSent();
      }
    }
  }, [externalMessage, messages, onMessageSent]);

  /* ---------------- 파생 ------------------------------ */
  const savedMessages = messages.filter((msg) => msg.isSaved);
  const savedCount = savedMessages.length;

  useEffect(() => {
    if (onSavedMessagesChange) {
      onSavedMessagesChange(savedCount, savedMessages);
    }
  }, [savedCount, savedMessages, onSavedMessagesChange]);

  /* ---------------- handlers --------------------------- */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await callBackend(nextHistory);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.final_answer,
        timestamp: new Date(),
        suggestions: [
          '비슷한 코스 더 추천',
          '아이 동선만 짧게 요약해줘',
          '근처 무료 전시 알려줘',
          '지도 링크도 같이 줘',
        ],
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      toast({
        title: '백엔드 오류',
        description: err instanceof Error ? err.message : '요청 중 오류가 발생했어요.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

const handleSuggestionClick = async (suggestion: string) => {
  if (isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    type: 'user',
    content: suggestion,
    timestamp: new Date(),
  };

  const nextHistory = [...messages, userMessage];
  setMessages(nextHistory);
  setIsLoading(true);

  try {
    const data = await callBackend(nextHistory);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: data.final_answer,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
  } catch (err: any) {
    toast({
      title: '백엔드 오류',
      description: err instanceof Error ? err.message : '요청 중 오류가 발생했어요.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleSaveMessage = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isSaved: !m.isSaved } : m))
    );
    const msg = messages.find((m) => m.id === id);
    toast({
      title: msg?.isSaved ? '저장 해제' : '즐겨찾기',
      description: msg?.isSaved
        ? '메시지가 즐겨찾기에서 제거되었습니다.'
        : '메시지를 즐겨찾기에 추가했어요.'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* ---------------- Render ----------------------------- */
  return (
    <>
      {/* === 메인 카드 =================================== */}
      <Card className="h-full flex flex-col shadow-gallery bg-gradient-to-br from-card via-card to-accent/5 border border-border/50">

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${
                  m.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.type === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}

                <div className="max-w-[80%]">
                  {/* bubble */}
                  <div
                    className={`p-4 rounded-xl relative ${
                      m.type === 'user'
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-elegant'
                        : 'bg-gradient-to-r from-card to-accent/5 border border-border shadow-gallery'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {m.content}
                    </p>

                    {m.type === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveMessage(m.id)}
                        className={`absolute bottom-2 right-2 h-8 w-8 ${
                          m.isSaved
                            ? 'text-red-500 bg-red-50/50'
                            : 'text-muted-foreground hover:text-red-500 hover:bg-red-50/30'
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            m.isSaved ? 'fill-current' : ''
                          }`}
                        />
                      </Button>
                    )}
                  </div>

                  {/* (선택) suggestions */}
                  {m.suggestions && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {m.suggestions.map((s, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(s)}
                          className="text-xs h-7 px-2"
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 로딩 애니메이션 */}
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
              placeholder="궁금한 전시·예술 정보를 입력하세요"
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="curator"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Saved Modal */}
      <Dialog open={isSavedModalOpen} onOpenChange={setIsSavedModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Saved Messages</DialogTitle>
            <DialogDescription>
              즐겨찾기한 메시지 목록입니다.
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
                저장된 메시지가 없습니다.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsSavedModalOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
