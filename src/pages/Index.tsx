import React, { useState } from 'react';
import { ChatModule } from '@/components/ChatModule';
import { ArtworkGrid } from '@/components/ArtworkGrid';
import { ComparisonView } from '@/components/ComparisonView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Sparkles, Palette, Eye, Heart, ArrowLeftRight } from 'lucide-react';
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

  const handleSaveArtwork = (artwork: Artwork) => {
    setSavedArtworks(prev => {
      const exists = prev.find(item => item.id === artwork.id);
      if (exists) {
        return prev.filter(item => item.id !== artwork.id);
      }
      return [...prev, artwork];
    });
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="absolute inset-0">
          <img
            src={heroArtwork}
            alt="Hero artwork"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/60" />
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center text-primary-foreground">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Art Curation</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-light mb-6 leading-tight">
              Discover Art That
              <span className="block text-gradient font-normal">Speaks to You</span>
            </h1>
            
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Your personal AI curator helps you explore, understand, and curate art exhibitions tailored to your taste and knowledge level.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="px-8">
                <Palette className="w-5 h-5 mr-2" />
                Start Exploring Art
              </Button>
              <Button variant="outline" size="lg" className="px-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20">
                <Eye className="w-5 h-5 mr-2" />
                View Collections
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 border-b border-border bg-gradient-to-r from-card to-accent/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Heart className="w-4 h-4 mr-1 fill-current" />
                {savedArtworks.length} Saved
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <ArrowLeftRight className="w-4 h-4 mr-1" />
                {comparisonArtworks.length}/2 Selected
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chat Module - Main Focus */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 h-[600px]">
                <ChatModule onArtworkRecommendation={handleSaveArtwork} />
              </div>
            </div>

            {/* Artwork Grid */}
            <div className="lg:col-span-1">
              <ArtworkGrid 
                onSaveArtwork={handleSaveArtwork}
                onCompareArtwork={handleCompareArtwork}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-accent/5 to-accent/10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-normal text-foreground mb-4">
              Curate Like a Professional
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI understands art history, movements, and individual preferences to provide personalized curation guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center shadow-elegant transition-elegant hover:shadow-gallery">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">AI-Powered Insights</h3>
              <p className="text-muted-foreground">
                Get personalized recommendations based on art movements, techniques, and your preferences.
              </p>
            </Card>

            <Card className="p-6 text-center shadow-elegant transition-elegant hover:shadow-gallery">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ArrowLeftRight className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Compare & Contrast</h3>
              <p className="text-muted-foreground">
                Analyze artworks side-by-side to understand artistic evolution and stylistic differences.
              </p>
            </Card>

            <Card className="p-6 text-center shadow-elegant transition-elegant hover:shadow-gallery">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Build Collections</h3>
              <p className="text-muted-foreground">
                Save your favorite pieces and create themed collections for future exhibitions.
              </p>
            </Card>
          </div>
        </div>
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
    </div>
  );
};

export default Index;