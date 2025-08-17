import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { CHAT_CONSTANTS } from '@/constants';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="p-2 sm:p-3 lg:p-4 border-t border-border bg-gradient-to-r from-background to-accent/5">
      <div className="flex gap-1 sm:gap-2 max-w-3xl mx-auto">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={CHAT_CONSTANTS.INPUT_PLACEHOLDER}
          className="flex-1 text-xs"
          disabled={isLoading}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          variant="curator"
          size="icon"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};