import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRoundName } from "@/lib/roundNames";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Frame } from "lucide-react";
import { UI_CONSTANTS } from "@/constants";
import { Exhibition, Match, ExhibitionWorldCupProps } from "@/types";

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
  const [nextRoundName, setNextRoundName] = useState("");
  const [championImageError, setChampionImageError] = useState(false);
  const { toast } = useToast();

  /** Initialize tournament when exhibitions change */
  useEffect(() => {
    console.log('🎯 useEffect triggered, exhibitions:', exhibitions?.length);
    if (!exhibitions || exhibitions.length < UI_CONSTANTS.MIN_EXHIBITIONS_FOR_TOURNAMENT) {
      console.log('❌ Not enough exhibitions, resetting');
      resetTournament([]);
      return;
    }
    console.log('✅ Starting tournament with', exhibitions.length, 'exhibitions');
    startTournament(exhibitions);
  }, [exhibitions]);

  const startTournament = (list: Exhibition[]) => {
    const size = Math.min(UI_CONSTANTS.TOURNAMENT_SIZE, list.length);
    const matches: Match[] = [];
    console.log('🏗️ Creating tournament with size:', size);
    for (let i = 0; i < size; i += 2) {
      const match = {
        id: `r1-m${Math.floor(i / 2) + 1}`,
        exhibition1: list[i],
        exhibition2: list[i + 1] ?? list[i],
        winner: null,
        round: 1
      };
      matches.push(match);
      console.log(`📝 Created match ${match.id}:`, match.exhibition1?.title, 'vs', match.exhibition2?.title);
    }
    console.log('🎮 Setting up tournament state, matches:', matches.length);
    setAllMatches(matches);
    setCurrentRound(1);
    setCurrentMatchIndex(0);
    setIsComplete(false);
    setChampion(null);
  };

  const resetTournament = (list: Exhibition[]) => {
    setAllMatches([]);
    setCurrentRound(1);
    setCurrentMatchIndex(0);
    setIsComplete(false);
    setChampion(null);
    setChampionImageError(false);
    if (list.length >= UI_CONSTANTS.MIN_EXHIBITIONS_FOR_TOURNAMENT) startTournament(list);
  };

  // Memoize current match to prevent infinite re-renders
  const currentMatch = useMemo((): Match | null => {
    const currentRoundMatches = allMatches.filter(m => m.round === currentRound);
    const match = currentRoundMatches[currentMatchIndex] || null;
    console.log('🎯 getCurrentMatch:', {
      currentRound,
      currentMatchIndex,
      totalMatches: allMatches.length,
      currentRoundMatches: currentRoundMatches.length,
      match: match ? `${match.exhibition1?.title} vs ${match.exhibition2?.title}` : 'null'
    });
    return match;
  }, [allMatches, currentRound, currentMatchIndex]);

  const selectWinner = (winner: Exhibition) => {
    console.log('👆 Card clicked! Winner:', winner.title);
    console.log('🎯 Current match:', currentMatch ? `${currentMatch.exhibition1?.title} vs ${currentMatch.exhibition2?.title}` : 'null');
    if (!currentMatch) {
      console.log('❌ No current match available');
      return;
    }

    setAllMatches(prevMatches => {
      const updated = prevMatches.map(m =>
        m.id === currentMatch.id ? { ...m, winner } : m
      );

      const currentRoundMatches = updated.filter(m => m.round === currentRound);
      const completedMatches = currentRoundMatches.filter(m => m.winner);

      // If current round finished
      if (completedMatches.length === currentRoundMatches.length) {
        const winners = currentRoundMatches
          .map(m => m.winner!)
          .filter(Boolean);

        const isFinal = winners.length === 1;
        if (isFinal) {
          setChampion(winners[0]);
          setIsComplete(true);
          return updated;
        }

        // Prepare next round
        const nextRound = currentRound + 1;
        setNextRoundName(getRoundName(nextRound));
        setShowRoundTransition(true);

        setTimeout(() => {
          setShowRoundTransition(false);

          const nextRoundMatches: Match[] = [];
          for (let i = 0; i < winners.length; i += 2) {
            if (winners[i + 1]) {
              nextRoundMatches.push({
                id: `r${nextRound}-m${Math.floor(i / 2) + 1}`,
                exhibition1: winners[i],
                exhibition2: winners[i + 1],
                winner: null,
                round: nextRound
              });
            } else {
              nextRoundMatches.push({
                id: `r${nextRound}-m${Math.floor(i / 2) + 1}`,
                exhibition1: winners[i],
                exhibition2: winners[i],
                winner: winners[i],
                round: nextRound
              });
            }
          }

          setAllMatches(prev => [...prev, ...nextRoundMatches]);
          setCurrentRound(nextRound);
          setCurrentMatchIndex(0);
        }, UI_CONSTANTS.ROUND_TRANSITION_DELAY);
      } else {
        // Next match in same round
        setCurrentMatchIndex(prev => prev + 1);
      }

      return updated;
    });
  };

  /** Render helpers */
  const ExhibitionCard: React.FC<{ exhibition: Exhibition; onClick: () => void }> = ({
    exhibition,
    onClick
  }) => {
    const [imageError, setImageError] = useState(false);
    
    const handleClick = () => {
      console.log('🎯 ExhibitionCard clicked:', exhibition.title);
      onClick();
    };
    
    return (
      <Card
        className="cursor-pointer hover:scale-[1.02] transition-elegant overflow-hidden"
        onClick={handleClick}
      >
        <div className="relative aspect-[3/4]">
          {!imageError ? (
            <img
              src={exhibition.image}
              alt={exhibition.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center p-4">
                <Frame className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-xs text-gray-500">이미지를 불러올 수 없습니다</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 w-full bg-black/60 text-white p-2 text-sm">
            {exhibition.title}
          </div>
        </div>
      </Card>
    );
  };

  /** Champion screen */
  if (isComplete && champion) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50">
        <div className="w-full h-full bg-white p-4 text-center overflow-y-auto flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4">🏆 최종 우승</h2>
          {!championImageError ? (
            <img
              src={champion.image}
              alt={champion.title}
              className="w-full h-auto rounded mb-4"
              onError={() => setChampionImageError(true)}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-4 flex items-center justify-center">
              <div className="text-center">
                <Frame className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">이미지를 불러올 수 없습니다</p>
              </div>
            </div>
          )}
          <h3 className="text-xl font-semibold">{champion.title}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {champion.description}
          </p>
          <div className="mt-4 flex flex-col md:flex-row gap-2 md:gap-2 md:justify-center">
            <Button 
              className="w-full md:w-auto" 
              size="sm"
              onClick={() => onSendMessage?.(`${champion.title} 전시에 대해 알려줘`)}
            >
              챗으로 물어보기
            </Button>
            <Button 
              variant="secondary" 
              className="w-full md:w-auto" 
              size="sm"
              onClick={() => resetTournament(exhibitions)}
            >
              다시하기
            </Button>
            <Button 
              variant="ghost" 
              className="w-full md:w-auto" 
              size="sm"
              onClick={onClose}
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /** Round transition screen */
  if (showRoundTransition) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 text-white text-3xl font-bold">
        {nextRoundName} 시작!
      </div>
    );
  }

  /** Match screen */
  if (!currentMatch) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50">
      <div className="w-full h-full bg-white p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-base md:text-lg font-bold">{getRoundName(currentRound)}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            닫기
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2 md:gap-4">
          <div 
            onClick={() => {
              console.log('🖱️ Card 1 clicked:', currentMatch.exhibition1.title);
              selectWinner(currentMatch.exhibition1);
            }}
            className="cursor-pointer hover:scale-[1.02] transition-all duration-200 border rounded-lg overflow-hidden bg-white shadow-md"
          >
            <div className="relative aspect-[3/4]">
              <img
                src={currentMatch.exhibition1.image}
                alt={currentMatch.exhibition1.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div className="absolute bottom-0 w-full bg-black/60 text-white p-2 text-xs md:text-sm">
                {currentMatch.exhibition1.title}
              </div>
            </div>
          </div>
          <div 
            onClick={() => {
              console.log('🖱️ Card 2 clicked:', currentMatch.exhibition2.title);
              selectWinner(currentMatch.exhibition2);
            }}
            className="cursor-pointer hover:scale-[1.02] transition-all duration-200 border rounded-lg overflow-hidden bg-white shadow-md"
          >
            <div className="relative aspect-[3/4]">
              <img
                src={currentMatch.exhibition2.image}
                alt={currentMatch.exhibition2.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
              <div className="absolute bottom-0 w-full bg-black/60 text-white p-2 text-xs md:text-sm">
                {currentMatch.exhibition2.title}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 md:mt-4 text-center text-xs md:text-sm text-muted-foreground">
          {currentMatchIndex + 1} / {allMatches.filter(m => m.round === currentRound).length}
        </div>
      </div>
    </div>
  );
};
