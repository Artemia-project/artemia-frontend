import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, ArrowLeftRight, Share2, Info } from 'lucide-react';
import artwork1 from '@/assets/artwork-1.jpg';
import artwork2 from '@/assets/artwork-2.jpg';
import artwork3 from '@/assets/artwork-3.jpg';

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
  isSaved?: boolean;
}

interface ArtworkGridProps {
  onSaveArtwork?: (artwork: Artwork) => void;
  onCompareArtwork?: (artwork: Artwork) => void;
}

const sampleArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Silent Harmony',
    artist: 'Elena Rodriguez',
    year: '2024',
    medium: 'Marble Sculpture',
    dimensions: '180 × 90 × 60 cm',
    description: 'A contemporary interpretation of classical form, exploring the dialogue between tradition and modernity.',
    image: artwork1,
    tags: ['Contemporary', 'Sculpture', 'Minimalist'],
    price: '$45,000',
  },
  {
    id: '2',
    title: 'Urban Dreams',
    artist: 'Marcus Chen',
    year: '2023',
    medium: 'Acrylic on Canvas',
    dimensions: '120 × 90 cm',
    description: 'Bold strokes capture the energy and chaos of modern city life through vibrant abstract forms.',
    image: artwork2,
    tags: ['Abstract', 'Contemporary', 'Urban'],
    price: '$12,500',
  },
  {
    id: '3',
    title: 'Portrait of a Merchant',
    artist: 'Giovanni Bellacorte',
    year: '1642',
    medium: 'Oil on Canvas',
    dimensions: '76 × 61 cm',
    description: 'A masterful example of Renaissance portraiture, showcasing the wealth and status of 17th-century trade.',
    image: artwork3,
    tags: ['Renaissance', 'Portrait', 'Historical'],
    price: '$850,000',
  }
];

export const ArtworkGrid: React.FC<ArtworkGridProps> = ({ onSaveArtwork, onCompareArtwork }) => {
  const [savedArtworks, setSavedArtworks] = useState<Set<string>>(new Set());
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set());

  const handleSave = (artwork: Artwork) => {
    const newSaved = new Set(savedArtworks);
    if (savedArtworks.has(artwork.id)) {
      newSaved.delete(artwork.id);
    } else {
      newSaved.add(artwork.id);
    }
    setSavedArtworks(newSaved);
    onSaveArtwork?.(artwork);
  };

  const handleCompare = (artwork: Artwork) => {
    const newComparison = new Set(selectedForComparison);
    if (selectedForComparison.has(artwork.id)) {
      newComparison.delete(artwork.id);
    } else if (selectedForComparison.size < 2) {
      newComparison.add(artwork.id);
    }
    setSelectedForComparison(newComparison);
    onCompareArtwork?.(artwork);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-normal text-foreground">Curated Recommendations</h2>
          <p className="text-muted-foreground mt-1">
            Discover artworks tailored to your interests
          </p>
        </div>
        {selectedForComparison.size > 0 && (
          <Badge variant="secondary" className="px-3 py-1">
            {selectedForComparison.size} selected for comparison
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleArtworks.map((artwork) => (
          <Card 
            key={artwork.id} 
            className={`group overflow-hidden transition-elegant hover:shadow-gallery ${
              selectedForComparison.has(artwork.id) ? 'ring-2 ring-accent' : ''
            }`}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={artwork.image}
                alt={artwork.title}
                className="w-full h-full object-cover transition-elegant group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-elegant" />
              
              {/* Action buttons overlay */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-elegant">
                <Button
                  size="icon"
                  variant="save"
                  onClick={() => handleSave(artwork)}
                  className={`w-8 h-8 ${savedArtworks.has(artwork.id) ? 'bg-accent text-accent-foreground' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${savedArtworks.has(artwork.id) ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  size="icon"
                  variant="save"
                  onClick={() => handleCompare(artwork)}
                  disabled={selectedForComparison.size >= 2 && !selectedForComparison.has(artwork.id)}
                  className={selectedForComparison.has(artwork.id) ? 'bg-accent text-accent-foreground' : ''}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Price tag */}
              {artwork.price && (
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-elegant">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {artwork.price}
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-medium text-card-foreground">{artwork.title}</h3>
                <p className="text-sm text-muted-foreground">{artwork.artist}, {artwork.year}</p>
              </div>

              <div className="text-xs text-muted-foreground">
                <p>{artwork.medium}</p>
                <p>{artwork.dimensions}</p>
              </div>

              <p className="text-sm text-card-foreground leading-relaxed line-clamp-2">
                {artwork.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {artwork.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="gallery" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedForComparison.size === 2 && (
        <div className="flex justify-center">
          <Button variant="curator" className="px-8">
            <ArrowLeftRight className="w-4 h-4 mr-2" />
            Compare Selected Artworks
          </Button>
        </div>
      )}
    </div>
  );
};