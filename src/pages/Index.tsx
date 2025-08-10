import React, { useState } from 'react';
import { ChatModule, type Message } from '@/components/ChatModule';
import { ComparisonView } from '@/components/ComparisonView';
import { ExhibitionWorldCup } from '@/components/ExhibitionWorldCup';
import { ExhibitionGallery } from '@/components/ExhibitionGallery';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Sparkles, Frame, Eye, Heart, ArrowLeftRight, Trophy, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { exhibitionsData, type Exhibition } from '@/data/exhibitions';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import heroArtwork from '@/assets/hero-artwork.jpg';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
  image: string;
  tags: string[];
  price?: string;
}

const Index = () => {
  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>([]);
  const [comparisonArtworks, setComparisonArtworks] = useState<Artwork[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showWorldCup, setShowWorldCup] = useState(false);
  const [showExhibitionGallery, setShowExhibitionGallery] = useState(false);
  const [externalChatMessage, setExternalChatMessage] = useState<string>('');
  const [savedMessagesCount, setSavedMessagesCount] = useState(0);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());

  const exhibitions = exhibitionsData;

  function handleSaveArtwork(artwork: Artwork) {
    setSavedArtworks(prev => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) {
        return prev.filter(item => item.id !== artwork.id);
      }
      return [...prev, artwork];
    });
  }

  const handleCompareArtwork = (artwork: Artwork) => {
    setComparisonArtworks(prev => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) {
        return prev.filter(item => item.id !== artwork.id);
      }
      if (prev.length >= 2) {
        return prev;
      }
      const newComparison = [...prev, artwork];
      if (newComparison.length === 2) {
        setShowComparison(true);
      }
      return newComparison;
    });
  };

  const handleWorldCupClick = () => {
    console.log('🏆 World Cup button clicked!');
    console.log('📊 Exhibitions ready:', exhibitions.length);
    
    if (exhibitions.length >= 16) {
      alert(`🎉 Tournament ready! ${exhibitions.length} exhibitions loaded.`);
      setShowWorldCup(true);
    } else {
      alert(`⚠️ Need 16 exhibitions for tournament. Currently have: ${exhibitions.length}`);
    }
  };

  const handleStartExploring = () => {
    setShowExhibitionGallery(true);
  };

  const handleSendMessageToChat = (message: string) => {
    setExternalChatMessage(message);
  };

  const handleChatMessageSent = () => {
    setExternalChatMessage('');
  };

  const handleSavedMessagesChange = (count: number, messages: Message[]) => {
    setSavedMessagesCount(count);
    setSavedMessages(messages);
  };

  const handleShareMessage = async (message: Message) => {
    const shareText = `Artemia AI 추천:\n\n${message.content}\n\n전시 추천 서비스 - Artemia: Art Curator AI`;
    
    try {
      if (navigator.share && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: 'Artemia AI 전시 추천',
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        // You could add a toast notification here
        alert('메시지가 클립보드에 복사되었습니다!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('메시지가 클립보드에 복사되었습니다!');
      } catch (clipboardErr) {
        console.error('Clipboard copy failed:', clipboardErr);
      }
    }
  };

  const handleShareAllMessages = async () => {
    if (savedMessages.length === 0) return;
    
    const allMessagesText = savedMessages
      .map((msg, index) => `${index + 1}. ${msg.content}`)
      .join('\n\n');
    
    const shareText = `Artemia AI 저장된 추천들:\n\n${allMessagesText}\n\n전시 추천 서비스 - Artemia: Art Curator AI`;
    
    try {
      if (navigator.share && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: `Artemia AI 저장된 메시지 ${savedMessages.length}개`,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('모든 메시지가 클립보드에 복사되었습니다!');
      }
    } catch (err) {
      console.error('Share failed:', err);
      try {
        await navigator.clipboard.writeText(shareText);
        alert('모든 메시지가 클립보드에 복사되었습니다!');
      } catch (clipboardErr) {
        console.error('Clipboard copy failed:', clipboardErr);
      }
    }
  };

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

  const getMessagePreview = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const isLongMessage = (content: string) => content.length > 200;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0">
          <img
            src={heroArtwork}
            alt="Hero artwork"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        
        <div className="relative container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-12">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-4">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary-foreground" />
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light leading-tight">
                Artemia: Art Curator AI
              </h1>
            </div>
            

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base flex items-center bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                onClick={handleWorldCupClick}
              >
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">내 전시 월드컵</span>
                <span className="sm:hidden">월드컵</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base flex items-center bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                onClick={handleStartExploring}
              >
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                둘러보기
              </Button>
                          
              <Button
                variant="outline"
                size="sm"
                className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base flex items-center bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-200"
                onClick={() => setShowSavedModal(true)}
              >
                <Heart className={`w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2 ${savedMessagesCount > 0 ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{savedMessagesCount} 저장된 메세지</span>
                <span className="sm:hidden">{savedMessagesCount} 저장</span>
              </Button>
            </div>
          </div>
        </div>
      </section>


      {/* Main Content - Chat fills all remaining space */}
      <section className="flex-1 min-h-0">
        <ChatModule 
          onArtworkRecommendation={handleSaveArtwork}
          externalMessage={externalChatMessage}
          onMessageSent={handleChatMessageSent}
          onSavedMessagesChange={handleSavedMessagesChange}
        />
      </section>

      {/* Comparison Modal */}
      {showComparison && comparisonArtworks.length === 2 && (
        <ComparisonView
          artworks={comparisonArtworks}
          onClose={() => {
            setShowComparison(false);
            setComparisonArtworks([]);
          }}
        />
      )}

      {/* Exhibition World Cup Modal */}
      {showWorldCup && (
        <ExhibitionWorldCup
          exhibitions={exhibitions.slice(0, 16)}
          onClose={() => setShowWorldCup(false)}
          onSendMessage={handleSendMessageToChat}
        />
      )}

      {/* Exhibition Gallery Modal */}
      {showExhibitionGallery && (
        <ExhibitionGallery
          exhibitions={exhibitions}
          onClose={() => setShowExhibitionGallery(false)}
        />
      )}

      {/* Saved Messages Modal - Fullscreen */}
      <Dialog open={showSavedModal} onOpenChange={setShowSavedModal}>
        <DialogContent className="max-w-none w-full h-full max-h-none p-0 gap-0">
          <DialogHeader className="p-4 sm:p-6 border-b text-center">
            <DialogTitle className="text-xl sm:text-2xl font-medium text-center">저장된 메시지</DialogTitle>
            <DialogDescription className="text-center">
              즐겨찾기로 저장한 메시지들을 확인하고 공유할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
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
                      className={`border rounded-xl bg-gradient-to-r from-card to-accent/5 shadow-sm transition-all duration-300 ${
                        isLong && !isExpanded 
                          ? 'p-3 sm:p-4' 
                          : 'p-4 sm:p-6'
                      }`}
                    >
                      <MarkdownRenderer
                        content={contentToShow}
                        className={isLong && !isExpanded ? "text-xs sm:text-sm" : "text-sm sm:text-base"}
                      />
                      
                      {isLong && (
                        <div className="mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMessageExpansion(msg.id)}
                            className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
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
                      
                      <div className="mt-4 flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                        <span>{new Date(msg.timestamp).toLocaleString('ko-KR')}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShareMessage(msg)}
                          className="text-xs"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          공유
                        </Button>
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

          <DialogFooter className="p-4 sm:p-6 border-t">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full justify-center">
              {savedMessages.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleShareAllMessages}
                  className="flex-1 sm:flex-none"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  모든 메시지 공유하기
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={() => setShowSavedModal(false)}
                className="flex-1 sm:flex-none"
              >
                닫기
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;