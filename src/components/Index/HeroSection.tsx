import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Eye, Heart } from 'lucide-react';
import heroArtwork from '@/assets/hero-artwork.jpg';

interface HeroSectionProps {
  onWorldCupClick: () => void;
  onGalleryClick: () => void;
  onSavedMessagesClick: () => void;
  savedMessagesCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onWorldCupClick,
  onGalleryClick,
  onSavedMessagesClick,
  savedMessagesCount
}) => {
  return (
    <section className="flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
      <div className="absolute inset-0">
        <img
          src={heroArtwork}
          alt="Hero artwork"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-24 h-24 border border-primary-foreground/10 rounded-full blur-sm opacity-30" />
      <div className="absolute bottom-20 right-20 w-32 h-32 border border-primary-foreground/10 rounded-full blur-sm opacity-20" />
      <div className="absolute top-1/2 right-10 w-16 h-16 border border-primary-foreground/10 rounded-full blur-sm opacity-25" />
      
      <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto text-center text-primary-foreground">
          
          {/* Main Title */}
          <div className="mb-2 sm:mb-3">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extralight tracking-[0.15em]" 
                  style={{fontFamily: '"Poppins", "Playfair Display", serif'}}>
                <span className="bg-gradient-to-r from-primary-foreground via-primary-foreground/95 to-primary-foreground bg-clip-text text-transparent drop-shadow-sm">
                  Artemia
                </span>
              </h1>
            </div>
            
            {/* Subtitle */}
            <div className="space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm font-thin opacity-80 max-w-2xl mx-auto leading-relaxed">
                인공지능이 큐레이션하는 맞춤형 전시 추천 서비스
              </p>
              <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-primary-foreground/40 to-transparent mx-auto animate-pulse" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              className="h-6 group px-2 py-0.5 sm:px-2.5 sm:py-0 text-xs font-light tracking-wide flex items-center bg-primary-foreground/5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground/50 transition-all duration-300 backdrop-blur-sm rounded-full"
              onClick={onWorldCupClick}
            >
              <Trophy className="w-2 h-1 mr-1 sm:mr-1.5 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline">전시 월드컵</span>
              <span className="sm:hidden">월드컵</span>
            </Button>

            <Button
              variant="outline"
              className="h-6 group px-2 py-0.5 sm:px-2.5 sm:py-0 text-xs font-light tracking-wide flex items-center bg-primary-foreground/5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground/50 transition-all duration-300 backdrop-blur-sm rounded-full"
              onClick={onGalleryClick}
            >
              <Eye className="w-2 h-1 mr-1 sm:mr-1.5 group-hover:scale-110 transition-transform duration-300" />
              갤러리
            </Button>
                        
            <Button
              variant="outline"
              className="h-6 group px-2 py-0.5 sm:px-2.5 sm:py-0 text-xs font-light tracking-wide flex items-center bg-primary-foreground/5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15 hover:border-primary-foreground/50 transition-all duration-300 backdrop-blur-sm rounded-full relative"
              onClick={onSavedMessagesClick}
            >
              <Heart className={`w-2 h-1 mr-1 sm:mr-1.5 group-hover:scale-110 transition-transform duration-300 ${savedMessagesCount > 0 ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">저장된 메시지</span>
              <span className="sm:hidden">저장</span>
              {savedMessagesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {savedMessagesCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};