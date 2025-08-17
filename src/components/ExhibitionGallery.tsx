import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, X } from "lucide-react";
import { Exhibition, ExhibitionGalleryProps } from "@/types";

const ExhibitionCard = React.memo(function ExhibitionCard({
  exhibition,
  onSelect
}: {
  exhibition: Exhibition;
  onSelect: () => void;
}) {
  const handleClick = () => {
    // Open the exhibition link in a new tab
    window.open(exhibition.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card
      className="group cursor-pointer transition-elegant hover:scale-[1.02] hover:shadow-gallery border-2 hover:border-accent overflow-hidden h-full flex flex-col"
      onClick={handleClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden flex-shrink-0">
        <img
          src={exhibition.image}
          alt={exhibition.title}
          className="w-full h-full object-cover transition-elegant group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const placeholder = target.parentElement?.querySelector(
              ".image-placeholder"
            );
            if (placeholder)
              (placeholder as HTMLElement).style.display = "flex";
          }}
        />
        <div className="image-placeholder absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 hidden items-center justify-center">
          <div className="text-center">
            <Eye className="w-12 h-12 mx-auto text-accent-foreground mb-2" />
            <div className="text-sm text-accent-foreground font-medium">
              전시 이미지
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-elegant" />
      </div>

      <CardContent className="p-3 md:p-6 space-y-2 md:space-y-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm md:text-xl leading-tight text-card-foreground min-h-[2.5rem] md:min-h-[3.5rem] flex items-start">
          <span className="line-clamp-2" style={{ whiteSpace: "pre-line" }}>
            {exhibition.title}
          </span>
        </h3>

        <p className="text-xs md:text-base text-muted-foreground leading-relaxed min-h-[1.5rem] md:min-h-[2.5rem] flex items-start">
          <span className="line-clamp-2">{exhibition.description}</span>
        </p>

        <div className="flex items-center gap-2 text-xs md:text-base text-muted-foreground min-h-[1rem] md:min-h-[1.25rem]">
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
            <Badge
              variant="secondary"
              className="text-sm bg-accent/10 text-accent-foreground"
            >
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
});

export const ExhibitionGallery: React.FC<ExhibitionGalleryProps> = ({
  exhibitions,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="w-full h-full bg-background overflow-hidden">
        {/* Header with title and close button */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-medium">전시 갤러리</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Gallery content */}
        <div className="p-4 md:p-6 overflow-y-auto" style={{height: 'calc(100vh - 80px)'}}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {exhibitions.map((ex) => (
              <ExhibitionCard
                key={ex.id}
                exhibition={ex}
                onSelect={() => {}} // No longer needed since we're opening links directly
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
