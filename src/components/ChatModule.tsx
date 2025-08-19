/* src/components/ChatModule.tsx
   ─────────────────────────────────────────────────────────
   백엔드 FastAPI(/ask)와 통신해 `final_answer`를 채팅창에 표시하는
   완성형 컴포넌트.  (C) Artemia
*/
import React, { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatModule/ChatMessage';
import { ChatInput } from './ChatModule/ChatInput';
import { LoadingIndicator } from './ChatModule/LoadingIndicator';
import { useChat } from '@/hooks/useChat';
import { UI_CONSTANTS } from '@/constants';
import { ChatModuleProps, Message } from '@/types';

export const ChatModule: React.FC<ChatModuleProps> = ({
  onArtworkRecommendation,
  externalMessage,
  onMessageSent,
  onSavedMessagesChange
}) => {
  const {
    messages,
    isLoading,
    sendMessage,
    sendExternalMessage,
    toggleSaveMessage,
    savedMessages,
  } = useChat();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollElement) {
          scrollElement.scrollTop = scrollElement.scrollHeight;
        }
      }
    };

    const timeoutId = setTimeout(scrollToBottom, UI_CONSTANTS.SCROLL_TIMEOUT);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Handle external messages
  useEffect(() => {
    if (!externalMessage) return;
    
    sendExternalMessage(externalMessage);
    onMessageSent?.();
  }, [externalMessage, onMessageSent, sendExternalMessage]);


  // Notify parent about saved messages changes
  useEffect(() => {
    onSavedMessagesChange?.(savedMessages.length, savedMessages);
  }, [savedMessages, onSavedMessagesChange]);

  const [inputValue, setInputValue] = React.useState('');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    await sendMessage(inputValue);
    setInputValue('');
  };

  const handleSuggestionClick = async (suggestion: string) => {
    await sendMessage(suggestion);
  };

  return (
    <Card className="h-full flex flex-col shadow-none bg-gradient-to-br from-card via-card to-accent/5 border-0 rounded-none lg:mx-4 lg:my-2 lg:rounded-lg lg:border lg:shadow-sm">
      {/* Messages */}
      <ScrollArea className="flex-1 p-2 sm:p-3 lg:p-4" ref={scrollAreaRef}>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSave={toggleSaveMessage}
              onSuggestionClick={handleSuggestionClick}
            />
          ))}

          {isLoading && <LoadingIndicator />}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        isLoading={isLoading}
      />
    </Card>
  );
};
