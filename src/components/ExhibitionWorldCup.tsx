import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getRoundName } from "@/lib/roundNames";
import { useToast } from "@/components/ui/use-toast";
import { Eye } from "lucide-react";

interface Exhibition {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  theme?: string;
  cost: string;
  start: string;
  end: string;
}

interface Match {
  id: string;
  exhibition1: Exhibition;
  exhibition2: Exhibition;
  winner: Exhibition | null;
  round: number;
}

interface ExhibitionWorldCupProps {
  exhibitions: Exhibition[];
  onClose: () => void;
  onSendMessage?: (msg: string) => void;
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
  const [nextRoundName, setNextRoundName] = useState("");
  const { toast } = useToast();

  /** Initialize tournament when exhibitions change */
  useEffect(() => {
    if (!exhibitions || exhibitions.length < 2) {
      resetTournament([]);
      return;
    }
    startTournament(exhibitions);
  }, [exhibitions]);

  const startTournament = (list: Exhibition[]) => {
    const size = Math.min(16, list.length);
    const matches: Match[] = [];
    for (let i = 0; i < size; i += 2) {
      matches.push({
        id: `r1-m${i / 2 + 1}`,
        exhibition1: list[i],
        exhibition2: list[i + 1] ?? list[i],
        winner: null,
        round: 1
      });
    }
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
    if (list.length >= 2) startTournament(list);
  };

  const getCurrentMatch = (): Match | null => {
    const currentRoundMatches = allMatches.filter(m => m.round === currentRound);
    return currentRoundMatches[currentMatchIndex] || null;
  };

  const selectWinner = (winner: Exhibition) => {
    const current = getCurrentMatch();
    if (!current) return;

    setAllMatches(prevMatches => {
      const updated = prevMatches.map(m =>
        m.id === current.id ? { ...m, winner } : m
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
                id: `r${nextRound}-m${i / 2 + 1}`,
                exhibition1: winners[i],
                exhibition2: winners[i + 1],
                winner: null,
                round: nextRound
              });
            } else {
              nextRoundMatches.push({
                id: `r${nextRound}-m${i / 2 + 1}`,
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
        }, 800);
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
  }) => (
    <Card
      className="cursor-pointer hover:scale-[1.02] transition-elegant overflow-hidden"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4]">
        <img
          src={exhibition.image}
          alt={exhibition.title}
          className="w-full h-full object-cover"
          onError={e => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        <div className="absolute bottom-0 w-full bg-black/60 text-white p-2 text-sm">
          {exhibition.title}
        </div>
      </div>
    </Card>
  );

  /** Champion screen */
  if (isComplete && champion) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <Card className="w-[90%] max-w-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">🏆 최종 우승</h2>
          <img
            src={champion.image}
            alt={champion.title}
            className="w-full h-auto rounded mb-4"
          />
          <h3 className="text-xl font-semibold">{champion.title}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {champion.description}
          </p>
          <div className="mt-4 flex gap-2 justify-center">
            <Button onClick={() => onSendMessage?.(`${champion.title} 전시에 대해 알려줘`)}>
              챗으로 물어보기
            </Button>
            <Button variant="secondary" onClick={() => resetTournament(exhibitions)}>
              다시하기
            </Button>
            <Button variant="ghost" onClick={onClose}>
              닫기
            </Button>
          </div>
        </Card>
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
  const currentMatch = getCurrentMatch();
  if (!currentMatch) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="w-[95%] max-w-5xl bg-white rounded p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-bold">{getRoundName(currentRound)}</h2>
          <Button variant="ghost" onClick={onClose}>
            닫기
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ExhibitionCard
            exhibition={currentMatch.exhibition1}
            onClick={() => selectWinner(currentMatch.exhibition1)}
          />
          <ExhibitionCard
            exhibition={currentMatch.exhibition2}
            onClick={() => selectWinner(currentMatch.exhibition2)}
          />
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {currentMatchIndex + 1} / {allMatches.filter(m => m.round === currentRound).length}
        </div>
      </div>
    </div>
  );
};
