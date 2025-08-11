import React, { useState, useMemo } from 'react';
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
import { Sparkles, Frame, Eye, Heart, ArrowLeftRight, Trophy, Share2, ChevronDown, ChevronUp, X, Copy } from 'lucide-react';
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
  
  // Memoize the sliced exhibitions to prevent infinite re-renders
  const worldCupExhibitions = useMemo(() => exhibitions.slice(0, 16), [exhibitions]);

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
    if (exhibitions.length >= 16) {
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
        alert('메시지가 클립보드에 복사되었습니다! 📋');
      }
    } catch (err) {
      console.error('Share failed:', err);
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('메시지가 클립보드에 복사되었습니다! 📋');
      } catch (clipboardErr) {
        console.error('Clipboard copy failed:', clipboardErr);
      }
    }
  };

  const handleCopyMessage = async (message: Message) => {
    try {
      await navigator.clipboard.writeText(message.content);
      alert('메시지가 클립보드에 복사되었습니다! 📋');
    } catch (err) {
      console.error('Copy failed:', err);
      alert('복사에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleShareAllMessages = async () => {
    if (savedMessages.length === 0) return;
    
    const allMessagesText = savedMessages
      .map((msg, index) => `📝 ${index + 1}. ${msg.content}`)
      .join('\n\n');
    
    const shareText = `✨ Artemia AI 저장된 전시 추천 ${savedMessages.length}개\n\n${allMessagesText}\n\n🎨 전시 추천 서비스 - Artemia: Art Curator AI`;
    
    try {
      if (navigator.share && navigator.canShare({ text: shareText })) {
        await navigator.share({
          title: `Artemia AI 저장된 메시지 ${savedMessages.length}개`,
          text: shareText
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert(`${savedMessages.length}개의 메시지가 클립보드에 복사되었습니다! 📋✨`);
      }
    } catch (err) {
      console.error('Share failed:', err);
      try {
        await navigator.clipboard.writeText(shareText);
        alert(`${savedMessages.length}개의 메시지가 클립보드에 복사되었습니다! 📋✨`);
      } catch (clipboardErr) {
        console.error('Clipboard copy failed:', clipboardErr);
      }
    }
  };

  const handleCopyAllMessages = async () => {
    if (savedMessages.length === 0) return;
    
    const allMessagesText = savedMessages
      .map((msg, index) => `${index + 1}. ${msg.content}`)
      .join('\n\n');
    
    try {
      await navigator.clipboard.writeText(allMessagesText);
      alert(`${savedMessages.length}개의 메시지가 클립보드에 복사되었습니다! 📋`);
    } catch (err) {
      console.error('Copy failed:', err);
      alert('복사에 실패했습니다. 다시 시도해주세요.');
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
          exhibitions={worldCupExhibitions}
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
      {showSavedModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="w-full h-full bg-background overflow-hidden">
            {/* Header with title and close button */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b">
              <div className="text-center flex-1">
                <h2 className="text-xl md:text-2xl font-medium">저장된 메시지</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  즐겨찾기로 저장한 메시지들을 확인하고 공유할 수 있습니다.
                </p>
              </div>
              <button
                onClick={() => setShowSavedModal(false)}
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

            {/* Footer with actions */}
            {savedMessages.length > 0 && (
              <div className="border-t p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-2 justify-center max-w-4xl mx-auto">
                  <Button
                    variant="outline"
                    onClick={handleCopyAllMessages}
                    className="flex-1 md:flex-none hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    전체 복사
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleShareAllMessages}
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
      )}
    </div>
  );
};

export default Index;