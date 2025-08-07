import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, ArrowLeftRight, Palette, Calendar, Ruler } from 'lucide-react';

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

interface ComparisonViewProps {
  artworks: Artwork[];
  onClose: () => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ artworks, onClose }) => {
  if (artworks.length !== 2) return null;

  const [artwork1, artwork2] = artworks;

  const compareField = (label: string, value1: string, value2: string, icon?: React.ReactNode) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-card border border-border">
          <p className="text-sm">{value1}</p>
        </div>
        <div className="p-3 rounded-lg bg-card border border-border">
          <p className="text-sm">{value2}</p>
        </div>
      </div>
    </div>
  );

  const compareTags = () => {
    const commonTags = artwork1.tags.filter(tag => artwork2.tags.includes(tag));
    const uniqueTags1 = artwork1.tags.filter(tag => !artwork2.tags.includes(tag));
    const uniqueTags2 = artwork2.tags.filter(tag => !artwork1.tags.includes(tag));

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Palette className="w-4 h-4" />
          <span>Art Categories</span>
        </div>
        
        {commonTags.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Common themes:</p>
            <div className="flex flex-wrap gap-1">
              {commonTags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Unique to {artwork1.title}:</p>
            <div className="flex flex-wrap gap-1">
              {uniqueTags1.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {uniqueTags1.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Unique to {artwork2.title}:</p>
            <div className="flex flex-wrap gap-1">
              {uniqueTags2.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {uniqueTags2.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto shadow-gallery">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <ArrowLeftRight className="w-5 h-5 text-accent-foreground" />
            <CardTitle className="text-xl">Artwork Comparison</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Artwork Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[artwork1, artwork2].map((artwork, index) => (
              <div key={artwork.id} className="space-y-3">
                <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-elegant">
                  <img
                    src={artwork.image}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{artwork.title}</h3>
                  <p className="text-muted-foreground">{artwork.artist}, {artwork.year}</p>
                  {artwork.price && (
                    <Badge variant="secondary" className="mt-1">{artwork.price}</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Comparison Details */}
          <div className="space-y-6">
            {compareField(
              'Artist & Period',
              `${artwork1.artist} (${artwork1.year})`,
              `${artwork2.artist} (${artwork2.year})`,
              <Calendar className="w-4 h-4" />
            )}

            {compareField(
              'Medium & Technique',
              artwork1.medium,
              artwork2.medium,
              <Palette className="w-4 h-4" />
            )}

            {compareField(
              'Dimensions',
              artwork1.dimensions,
              artwork2.dimensions,
              <Ruler className="w-4 h-4" />
            )}

            {compareTags()}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <span>Descriptions</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm leading-relaxed">{artwork1.description}</p>
                </div>
                <div className="p-4 rounded-lg bg-card border border-border">
                  <p className="text-sm leading-relaxed">{artwork2.description}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Analysis */}
          <div className="bg-gradient-to-r from-accent/10 to-accent/5 p-4 rounded-lg border border-accent/20">
            <h4 className="font-medium text-accent-foreground mb-2">AI Curator Insights</h4>
            <p className="text-sm text-card-foreground leading-relaxed">
              These works represent fascinating contrasts in artistic expression. While {artwork1.title} embodies {artwork1.tags[0]?.toLowerCase()} principles with its {artwork1.medium.toLowerCase()}, {artwork2.title} explores {artwork2.tags[0]?.toLowerCase()} themes through {artwork2.medium.toLowerCase()}. The temporal difference of {Math.abs(parseInt(artwork1.year) - parseInt(artwork2.year))} years showcases the evolution of artistic techniques and cultural perspectives. Both pieces would create an engaging dialogue in an exhibition focused on artistic innovation across periods.
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <Button variant="curator">
              Create Exhibition with These Works
            </Button>
            <Button variant="gallery">
              Get More Similar Recommendations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};