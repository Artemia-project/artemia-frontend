import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, MapPin, Calendar, ExternalLink, Eye } from 'lucide-react';
import { type Exhibition } from '@/data/exhibitions';

interface ExhibitionGalleryProps {
  exhibitions: Exhibition[];
  onClose: () => void;
}

export const ExhibitionGallery: React.FC<ExhibitionGalleryProps> = ({ 
  exhibitions, 
  onClose 
}) => {
  const ExhibitionCard = ({ exhibition }: { exhibition: Exhibition }) => (
    <Card className="group cursor-pointer transition-elegant hover:scale-[1.02] hover:shadow-gallery border-2 hover:border-accent overflow-hidden h-full flex flex-col">
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
        
        {/* View Details Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-elegant">
          <Button variant="secondary" size="sm" asChild>
            <a href={exhibition.link} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              상세보기
            </a>
          </Button>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-3 flex-1 flex flex-col">
        <h3 className="font-medium text-xl leading-tight text-card-foreground min-h-[3.5rem] flex items-start">
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-light text-foreground mb-2">전시회 갤러리</h1>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-foreground hover:bg-muted"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Exhibition Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {exhibitions.map((exhibition) => (
                <ExhibitionCard key={exhibition.id} exhibition={exhibition} />
              ))}
            </div>

            {/* Footer */}
            <div className="mt-12 text-center">
              <Button variant="outline" onClick={onClose} className="px-8">
                돌아가기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};