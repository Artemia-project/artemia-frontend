import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Trophy, Crown, MapPin, Calendar, Sparkles, Eye, Share2, Route, RotateCcw } from 'lucide-react';
import { type Exhibition } from '@/data/exhibitions';
import { useToast } from '@/hooks/use-toast';
import heroArtwork from '@/assets/hero-artwork.jpg';

interface ExhibitionWorldCupProps {
  exhibitions: Exhibition[];
  onClose: () => void;
  onSendMessage?: (message: string) => void;
}

interface Match {
  id: string;
  exhibition1: Exhibition;
  exhibition2: Exhibition;
  winner: Exhibition | null;
  round: number;
}

export const ExhibitionWorldCup: React.FC<ExhibitionWorldCupProps> = ({ 
  exhibitions, 
  onClose,
  onSendMessage
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [champion, setChampion] = useState<Exhibition | null>(null);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [nextRoundName, setNextRoundName] = useState('');
  const { toast } = useToast();

  // Initialize tournament with Round of 16
  useEffect(() => {
    if (exhibitions.length >= 16) {
      const round1Matches: Match[] = [];
      
      // Create 8 matches for Round of 16
      for (let i = 0; i < 16; i += 2) {
        round1Matches.push({
          id: `r1-m${i/2 + 1}`,
          exhibition1: exhibitions[i],
          exhibition2: exhibitions[i + 1],
          winner: null,
          round: 1
        });
      }
      
      setAllMatches(round1Matches);
      console.log('🏆 Tournament initialized with', round1Matches.length, 'matches');
    }
  }, [exhibitions]);

  const getCurrentMatch = () => {
    const currentRoundMatches = allMatches.filter(m => m.round === currentRound);
    return currentRoundMatches[currentMatchIndex] || null;
  };

  const selectWinner = (winner: Exhibition) => {
    const currentMatch = getCurrentMatch();
    if (!currentMatch) return;

    console.log(`🎯 Winner selected: ${winner.title}`);

    // Update the match with winner
    const updatedMatches = allMatches.map(match => 
      match.id === currentMatch.id 
        ? { ...match, winner }
        : match
    );
    setAllMatches(updatedMatches);

    // Check if current round is complete
    const currentRoundMatches = updatedMatches.filter(m => m.round === currentRound);
    const completedMatches = currentRoundMatches.filter(m => m.winner);

    if (completedMatches.length === currentRoundMatches.length) {
      // Round complete!
      console.log(`✅ Round ${currentRound} complete!`);
      
      if (currentRound === 4) {
        // Tournament complete - we have a champion!
        setChampion(winner);
        setIsComplete(true);
        console.log('🏆 Tournament complete! Champion:', winner.title);
      } else {
        // Show round transition effect before advancing
        const nextRound = currentRound + 1;
        setNextRoundName(getRoundName(nextRound));
        setShowRoundTransition(true);
        
        setTimeout(() => {
          setShowRoundTransition(false);
          advanceToNextRound(updatedMatches);
        }, 2500);
      }
    } else {
      // Move to next match in current round
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };

  const restartTournament = () => {
    setCurrentRound(1);
    setCurrentMatchIndex(0);
    setIsComplete(false);
    setChampion(null);
    setShowRoundTransition(false);
    setNextRoundName('');
    
    // Re-initialize tournament with Round of 16
    const round1Matches: Match[] = [];
    for (let i = 0; i < 16; i += 2) {
      round1Matches.push({
        id: `r1-m${i/2 + 1}`,
        exhibition1: exhibitions[i],
        exhibition2: exhibitions[i + 1],
        winner: null,
        round: 1
      });
    }
    setAllMatches(round1Matches);
  };

  const advanceToNextRound = (matches: Match[]) => {
    const winners = matches
      .filter(m => m.round === currentRound && m.winner)
      .map(m => m.winner!);

    console.log(`🚀 Advancing to round ${currentRound + 1} with winners:`, winners.map(w => w.title));

    const nextRoundMatches: Match[] = [];
    for (let i = 0; i < winners.length; i += 2) {
      if (winners[i + 1]) { // Make sure we have a pair
        nextRoundMatches.push({
          id: `r${currentRound + 1}-m${i/2 + 1}`,
          exhibition1: winners[i],
          exhibition2: winners[i + 1],
          winner: null,
          round: currentRound + 1
        });
      }
    }

    setAllMatches([...matches, ...nextRoundMatches]);
    setCurrentRound(currentRound + 1);
    setCurrentMatchIndex(0);
  };

  const getRoundName = (round: number) => {
    switch(round) {
      case 1: return '16강전';
      case 2: return '8강전';
      case 3: return '준결승';
      case 4: return '결승전';
      default: return `${round}라운드`;
    }
  };

  const getProgress = () => {
    const totalMatches = 15; // 8 + 4 + 2 + 1
    const completedMatches = allMatches.filter(m => m.winner).length;
    return Math.round((completedMatches / totalMatches) * 100);
  };

  const handleShare = async () => {
    if (!champion) return;
    
    const shareData = {
      title: `${champion.title} - 전시회 월드컵 우승작`,
      text: `전시회 월드컵에서 "${champion.title}"이 우승했습니다!`,
      url: champion.link
    };
    
    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast({
          title: "공유 완료!",
          description: "우승작이 성공적으로 공유되었습니다.",
        });
      } else {
        // Fallback to clipboard
        const shareText = `전시회 월드컵 우승작: ${champion.title}\n${champion.description}\n자세히 보기: ${champion.link}`;
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "공유 완료!",
          description: "우승작 정보가 클립보드에 복사되었습니다.",
        });
      }
    } catch (err) {
      toast({
        title: "공유 실패",
        description: "공유에 실패했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleCourseRecommendation = () => {
    if (!champion) return;
    
    const message = `${champion.title} 관련 코스 추천해줘`;
    
    if (onSendMessage) {
      onSendMessage(message);
    }
    onClose(); // Close the tournament module
  };

  const ExhibitionCard = ({ exhibition, onSelect }: {
    exhibition: Exhibition;
    onSelect: () => void;
  }) => (
    <Card 
      className="group cursor-pointer transition-elegant hover:scale-[1.02] hover:shadow-gallery border-2 hover:border-accent overflow-hidden h-full flex flex-col"
      onClick={onSelect}
    >
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        <img
          src={exhibition.image}
          alt={exhibition.title}
          className="w-full h-full object-cover transition-elegant group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const placeholder = target.parentElement?.querySelector('.image-placeholder');
            if (placeholder) {
              (placeholder as HTMLElement).style.display = 'flex';
            }
          }}
        />
        <div className="image-placeholder absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 hidden items-center justify-center">
          <div className="text-center">
            <Eye className="w-12 h-12 mx-auto text-accent-foreground mb-2" />
            <div className="text-sm text-accent-foreground font-medium">전시 이미지</div>
          </div>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-elegant" />
      </div>
      
      <CardContent className="p-6 space-y-3 flex-1 flex flex-col">
        <h3 className="font-medium text-xl leading-tight text-card-foreground group-hover:text-accent-foreground transition-colors min-h-[3.5rem] flex items-start">
          <span className="line-clamp-2" style={{ whiteSpace: 'pre-line' }}>{exhibition.title}</span>
        </h3>
        
        <p className="text-base text-muted-foreground leading-relaxed min-h-[2.5rem] flex items-start">
          <span className="line-clamp-2">{exhibition.description}</span>
        </p>
        
        <div className="flex items-center gap-2 text-base text-muted-foreground min-h-[1.25rem]">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{exhibition.location}</span>
        </div>
        
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex items-center gap-2">
            {exhibition.theme && (
              <Badge variant="outline" className="text-sm">
                {exhibition.theme}
              </Badge>
            )}
            <Badge variant="secondary" className="text-sm bg-accent/10 text-accent-foreground">
              {exhibition.cost}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {exhibition.start} - {exhibition.end}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Champion Screen
  if (isComplete && champion) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[95vh] overflow-auto shadow-gallery relative">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <CardContent className="p-8 space-y-8">
            <div className="text-center">
              <div className="relative aspect-[3/4] w-[32rem] mx-auto rounded-xl overflow-hidden shadow-gallery mb-8">
                <img
                  src={champion.image}
                  alt={champion.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.parentElement?.querySelector('.image-placeholder');
                    if (placeholder) {
                      (placeholder as HTMLElement).style.display = 'flex';
                    }
                  }}
                />
                <div className="image-placeholder absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 hidden items-center justify-center">
                  <div className="text-center">
                    <Crown className="w-16 h-16 mx-auto text-yellow-500 mb-3" />
                    <div className="text-lg text-accent-foreground font-medium">우승 전시</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-3 mb-4">
                <Crown className="w-8 h-8 text-yellow-500" />
                <h2 className="text-4xl font-normal text-foreground text-center" style={{ whiteSpace: 'pre-line' }}>{champion.title}</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                {champion.description}
              </p>
              
              <div className="flex items-center justify-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{champion.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{champion.start} - {champion.end}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Button variant="default" size="lg" className="px-8" asChild>
                <a href={champion.link} target="_blank" rel="noopener noreferrer">
                  <Trophy className="w-5 h-5 mr-2" />
                  상세보기
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-8" onClick={handleShare}>
                <Share2 className="w-5 h-5 mr-2" />
                공유하기
              </Button>
              <Button variant="outline" size="lg" className="px-8" onClick={handleCourseRecommendation}>
                <Route className="w-5 h-5 mr-2" />
                코스추천
              </Button>
              <Button variant="secondary" size="lg" className="px-8" onClick={restartTournament}>
                <RotateCcw className="w-5 h-5 mr-2" />
                다시하기
              </Button>
              <Button variant="ghost" size="lg" className="px-8" onClick={onClose}>
                종료
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentMatch = getCurrentMatch();

  // Round Transition Screen
  if (showRoundTransition) {
    return (
      <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-light text-primary animate-pulse">
              {nextRoundName}
            </h1>
            <p className="text-xl text-muted-foreground">
              다음 라운드로 진출합니다
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          
          {/* Celebration Effects */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${10 + i * 10}%`,
                  top: `${20 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.5s',
                }}
              >
                <Sparkles className="w-8 h-8 text-yellow-400 opacity-70" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-auto shadow-gallery">
        {/* Tournament Header with Hero Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
          <div className="absolute inset-0">
            <img
              src={heroArtwork}
              alt="Hero artwork"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
          </div>
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 py-8 text-primary-foreground">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-3xl font-light">전시회 월드컵: 당신을 위한 전시는?</CardTitle>
                <p className="text-primary-foreground/80 mt-1">
                  {getRoundName(currentRound)} • {currentMatchIndex + 1}번째 매치
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-primary-foreground/90">
                  {getProgress()}% 완료
                </div>
                <div className="w-32 h-3 bg-primary-foreground/20 rounded-full overflow-hidden mt-1 backdrop-blur-sm">
                  <div 
                    className="h-full bg-primary-foreground transition-all duration-700 ease-out rounded-full"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-8 space-y-8">
          {currentMatch ? (
            <>

              <div className="grid grid-cols-2 gap-8 items-start">
                <ExhibitionCard
                  exhibition={currentMatch.exhibition1}
                  onSelect={() => selectWinner(currentMatch.exhibition1)}
                />

                <ExhibitionCard
                  exhibition={currentMatch.exhibition2}
                  onSelect={() => selectWinner(currentMatch.exhibition2)}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">다음 라운드 준비 중</h3>
                <p className="text-muted-foreground">잠시만 기다려 주세요...</p>
              </div>
            </div>
          )}

          {/* Tournament Progress - Single Line */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-center gap-4 text-center">
              {[1, 2, 3, 4].map((round, index) => {
                const roundMatches = allMatches.filter(m => m.round === round);
                const completedRoundMatches = roundMatches.filter(m => m.winner);
                const matchesCount = Math.pow(2, 4 - round);
                
                return (
                  <div key={round} className="flex items-center gap-2">
                    <div className={`text-base font-medium ${
                      round === currentRound ? 'text-primary' : 
                      round < currentRound ? 'text-primary' : 'text-muted-foreground'
                    }`}>
                      {getRoundName(round)}
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: matchesCount }).map((_, barIndex) => (
                        <div 
                          key={barIndex}
                          className={`w-3 h-3 rounded transition-all duration-300 ${
                            barIndex < completedRoundMatches.length
                              ? 'bg-primary' 
                              : round === currentRound && barIndex === currentMatchIndex
                                ? 'bg-gallery-gold opacity-75' 
                                : 'bg-muted'
                          }`}
                          style={{
                            backgroundColor: barIndex < completedRoundMatches.length
                              ? 'hsl(220, 30%, 25%)' 
                              : round === currentRound && barIndex === currentMatchIndex
                                ? 'hsl(45, 100%, 50%)'
                                : undefined
                          }}
                        />
                      ))}
                    </div>
                    {index < 3 && (
                      <div className="text-muted-foreground text-sm px-2">→</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};