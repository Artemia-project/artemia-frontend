import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { X, Copy, Share2, ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { isLongMessage, getMessagePreview } from '@/utils/text';
import { useMessageSharing } from '@/hooks/useMessageSharing';
import { Message } from '@/types';

interface SavedMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedMessages: Message[];
}

export const SavedMessagesModal: React.FC<SavedMessagesModalProps> = ({
  isOpen,
  onClose,
  savedMessages
}) => {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const {
    handleShareMessage,
    handleCopyMessage,
    handleShareAllMessages,
    handleCopyAllMessages,
  } = useMessageSharing();

  const toggleMessageExpansion = (messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="w-full h-full bg-background overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <div className="text-center flex-1">
            <h2 className="text-xl md:text-2xl font-medium text-left">저장된 메시지</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages content */}
        <div className="p-4 md:p-6 overflow-y-auto" style={{height: 'calc(100vh - 160px)'}}>
          <div className="space-y-4 max-w-4xl mx-auto">
            {savedMessages.length > 0 ? (
              savedMessages.map((msg) => {
                const isExpanded = expandedMessages.has(msg.id);
                const isLong = isLongMessage(msg.content);
                const contentToShow = isLong && !isExpanded 
                  ? getMessagePreview(msg.content) 
                  : msg.content;
                
                return (
                  <div
                    key={msg.id}
                    className={`border rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 ${
                      isLong && !isExpanded 
                        ? 'p-3 md:p-4' 
                        : 'p-4 md:p-6'
                    }`}
                  >
                    <div className={isLong && !isExpanded ? "relative" : ""}>
                      <MarkdownRenderer
                        content={contentToShow}
                        className={isLong && !isExpanded ? "text-xs md:text-sm" : "text-sm md:text-base"}
                      />
                      {isLong && !isExpanded && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                      )}
                    </div>
                    
                    {isLong && (
                      <div className="mt-3 flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMessageExpansion(msg.id)}
                          className="text-xs hover:bg-gray-100 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-3 h-3 mr-1" />
                              접기
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              더보기
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center justify-between text-xs md:text-sm text-muted-foreground border-t pt-3">
                      <span>{new Date(msg.timestamp).toLocaleString('ko-KR')}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyMessage(msg)}
                          className="text-xs hover:bg-green-50 hover:text-green-600"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          복사
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareMessage(msg)}
                          className="text-xs hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          공유
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground text-lg mb-2">
                  저장된 메시지가 없습니다
                </p>
                <p className="text-muted-foreground/60 text-sm">
                  AI 응답에서 ❤️ 버튼을 눌러 메시지를 저장해보세요
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {savedMessages.length > 0 && (
          <div className="border-t p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-2 justify-center max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={() => handleCopyAllMessages(savedMessages)}
                className="flex-1 md:flex-none hover:bg-green-50 hover:text-green-600 hover:border-green-300"
              >
                <Copy className="w-4 h-4 mr-2" />
                전체 복사
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShareAllMessages(savedMessages)}
                className="flex-1 md:flex-none hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                전체 공유
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};