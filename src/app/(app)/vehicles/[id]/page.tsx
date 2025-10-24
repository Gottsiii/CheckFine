'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DamageSketch } from '@/components/damage-sketch';
import { getDamageEstimate } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, AlertTriangle } from 'lucide-react';
import type { EstimateRepairCostOutput } from '@/ai/flows/estimate-repair-cost-from-damage-sketch';
import { Skeleton } from '@/components/ui/skeleton';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import type { Vehicle } from '@/lib/types';
import { doc } from 'firebase/firestore';

export default function VehicleDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const { firestore, user } = useFirebase();

  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const fleetId = 'default_fleet';

  const vehicleRef = useMemoFirebase(() => {
    if (!firestore || !user || !vehicleId) return null;
    return doc(firestore, `/users/${user.uid}/fleets/${fleetId}/vehicles/${vehicleId}`);
  }, [firestore, user, vehicleId]);

  const { data: vehicle, isLoading: isVehicleLoading, error: vehicleError } = useDoc<Vehicle>(vehicleRef);

  const [damagedAreas, setDamagedAreas] = useState<string[]>([]);
  const [damageSketchDataUri, setDamageSketchDataUri] = useState<string>('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState<EstimateRepairCostOutput | null>(
    null
  );

  const handleDamageChange = useCallback((areas: string[], sketchUri: string) => {
    setDamagedAreas(areas);
    setDamageSketchDataUri(sketchUri);
  }, []);

  const handleEstimate = async () => {
    if (!vehicle) return;
    if (damagedAreas.length === 0) {
      toast({
        title: 'No Damage Selected',
        description: 'Please select at least one damaged area on the sketch.',
        variant: 'destructive',
      });
      return;
    }

    setIsEstimating(true);
    setEstimate(null);

    const result = await getDamageEstimate({
      vehicleMake: vehicle.make,
      vehicleYear: vehicle.year.toString(),
      damagedAreas,
      damageSketchDataUri,
    });

    setIsEstimating(false);

    if (result.success && result.data) {
      setEstimate(result.data);
    } else {
      toast({
        title: 'Estimation Error',
        description:
          result.error || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (isVehicleLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="mt-2 h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full rounded-lg" />
          </CardContent>
        </Card>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (vehicleError) {
     return (
        <Card className="bg-destructive/10 text-destructive-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle /> Error Loading Vehicle
            </CardTitle>
            <CardDescription className="text-destructive-foreground/80">
              Could not load the vehicle data. It might not exist or you may not have permission to view it.
            </CardDescription>
          </CardHeader>
        </Card>
      );
  }


  if (!vehicle) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Vehicle not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {vehicle.make} {vehicle.model}
          </CardTitle>
          <CardDescription>
            {vehicle.year} - {vehicle.vin}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            width={600}
            height={400}
            className="rounded-lg object-cover"
            data-ai-hint="vehicle image"
            priority
          />
        </CardContent>
      </Card>

      <DamageSketch onDamageChange={handleDamageChange} />

      <div className="flex justify-end">
        <Button
          onClick={handleEstimate}
          disabled={isEstimating || damagedAreas.length === 0}
          size="lg"
        >
          {isEstimating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2" />
          )}
          Estimate Repair Cost
        </Button>
      </div>

      {isEstimating && (
        <Card>
          <CardHeader>
            <CardTitle>Generating AI Estimate...</CardTitle>
            <CardDescription>
              Our AI is analyzing the damage. This may take a moment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      )}

      {estimate && (
        <Card>
          <CardHeader>
            <CardTitle>AI-Generated Repair Estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Estimated Cost
              </p>
              <p className="text-4xl font-bold text-primary">
                $
                {estimate.estimatedCost.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold">Cost Breakdown</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {estimate.costBreakdown
                  .split('\n')
                  .map(
                    (item, index) =>
                      item.trim() && (
                        <li key={index}>
                          {item.replace(/^-|^\*/, '').trim()}
                        </li>
                      )
                  )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
