import React from 'react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { Bot, Heart } from 'lucide-react';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  onSave: (id: string) => void;
  onSuggestionClick: (suggestion: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onSave,
  onSuggestionClick
}) => {
  const isUser = message.type === 'user';
  const isWelcome = message.id === 'welcome';

  return (
    <div className={`flex gap-2 sm:gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1 border-2 border-primary/20">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
      )}

      <div className="max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
        {/* Message bubble */}
        <div
          className={`p-2 sm:p-3 lg:p-4 rounded-xl relative ${
            isUser
              ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-elegant'
              : 'bg-gradient-to-r from-card to-accent/5 border border-border shadow-gallery'
          }`}
        >
          {!isUser ? (
            <MarkdownRenderer
              content={message.content}
              className="text-xs leading-relaxed"
            />
          ) : (
            <p className="text-xs leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          )}

          {!isUser && !isWelcome && (
            <div className="flex justify-center mt-2 pt-2 border-t border-border/20">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave(message.id)}
                className={`h-6 px-2 text-xs ${
                  message.isSaved
                    ? 'text-red-500 bg-red-50/50'
                    : 'text-muted-foreground hover:text-red-500 hover:bg-red-50/30'
                }`}
              >
                <Heart
                  className={`w-3 h-3 mr-1 ${
                    message.isSaved ? 'fill-current' : ''
                  }`}
                />
                {message.isSaved ? '저장됨' : '저장'}
              </Button>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {message.suggestions && (
          <div className="mt-1 sm:mt-2 flex flex-wrap gap-1">
            {message.suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onSuggestionClick(suggestion)}
                className="text-xs h-5 sm:h-6 px-1 sm:px-2"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};