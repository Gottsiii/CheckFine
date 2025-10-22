'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import type { VehiclePart } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CarSvg } from '@/components/car-svg';
import { Badge } from '@/components/ui/badge';
import { DamageAreasMap } from '@/lib/types';

type DamageSketchProps = {
  onDamageChange: (parts: string[], sketchUri: string) => void;
};

export function DamageSketch({ onDamageChange }: DamageSketchProps) {
  const [selectedParts, setSelectedParts] = useState<VehiclePart[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const uniqueDamagedAreas = useMemo(() => {
    const areas = selectedParts
      .map((part) => DamageAreasMap[part])
      .filter(Boolean);
    return [...new Set(areas)];
  }, [selectedParts]);

  useEffect(() => {
    if (svgRef.current) {
      const svgString = new XMLSerializer().serializeToString(svgRef.current);
      const dataUri = `data:image/svg+xml;base64,${btoa(
        unescape(encodeURIComponent(svgString))
      )}`;
      onDamageChange(uniqueDamagedAreas, dataUri);
    }
  }, [selectedParts, onDamageChange, uniqueDamagedAreas]);

  const togglePart = (part: VehiclePart) => {
    setSelectedParts((prev) =>
      prev.includes(part) ? prev.filter((p) => p !== part) : [...prev, part]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Damage Sketch</CardTitle>
        <CardDescription>
          Click on the parts of the car to mark them as damaged.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-muted/30 p-4">
          <CarSvg
            ref={svgRef}
            selectedParts={selectedParts}
            onPartClick={togglePart}
            className="mx-auto w-full max-w-2xl"
          />
        </div>
        <div className="mt-6">
          <h3 className="mb-2 font-semibold">Selected Areas:</h3>
          {uniqueDamagedAreas.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {uniqueDamagedAreas.map((area) => (
                <Badge key={area} variant="destructive" className="text-sm">
                  {area}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No areas selected.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
