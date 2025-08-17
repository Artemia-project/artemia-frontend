import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { callBackend } from '@/utils/api';
import { CHAT_CONSTANTS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';
import { Message } from '@/types';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'assistant',
      content: CHAT_CONSTANTS.WELCOME_MESSAGE,
      timestamp: new Date(),
      suggestions: CHAT_CONSTANTS.DEFAULT_SUGGESTIONS
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const createUserMessage = useCallback((content: string): Message => ({
    id: Date.now().toString(),
    type: 'user',
    content,
    timestamp: new Date(),
  }), []);

  const createAssistantMessage = useCallback((content: string, suggestions?: string[]): Message => ({
    id: (Date.now() + 1).toString(),
    type: 'assistant',
    content,
    timestamp: new Date(),
    suggestions,
  }), []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage = createUserMessage(content);
    const nextHistory = [...messages, userMessage];
    
    setMessages(nextHistory);
    setIsLoading(true);

    try {
      const data = await callBackend(nextHistory);
      const assistantMessage = createAssistantMessage(
        data.final_answer,
        ['근처 무료 전시 알려줘']
      );
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      toast({
        title: ERROR_MESSAGES.BACKEND_ERROR,
        description: err instanceof Error ? err.message : ERROR_MESSAGES.REQUEST_ERROR,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, createUserMessage, createAssistantMessage]);

  const sendExternalMessage = useCallback(async (content: string) => {
    if (!content) return;

    setIsLoading(true);

    setMessages(prevMessages => {
      const userMessage = createUserMessage(content);
      const nextHistory = [...prevMessages, userMessage];

      // Fire-and-forget async call
      (async () => {
        try {
          const data = await callBackend(nextHistory);
          const assistantMessage = createAssistantMessage(
            data.final_answer,
            CHAT_CONSTANTS.FOLLOW_UP_SUGGESTIONS
          );
          setMessages(prev => [...prev, assistantMessage]);
        } catch (err: unknown) {
          toast({
            title: ERROR_MESSAGES.BACKEND_ERROR,
            description: err instanceof Error ? err.message : ERROR_MESSAGES.REQUEST_ERROR,
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      })();

      return nextHistory;
    });
  }, [createUserMessage, createAssistantMessage]);

  const toggleSaveMessage = useCallback((id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, isSaved: !m.isSaved } : m))
    );
    
    const message = messages.find(m => m.id === id);
    toast({
      title: message?.isSaved ? '저장 해제' : '즐겨찾기',
      description: message?.isSaved
        ? SUCCESS_MESSAGES.MESSAGE_UNSAVED
        : SUCCESS_MESSAGES.MESSAGE_SAVED
    });
  }, [messages]);

  const savedMessages = messages.filter(msg => msg.isSaved);

  return {
    messages,
    isLoading,
    sendMessage,
    sendExternalMessage,
    toggleSaveMessage,
    savedMessages,
  };
}