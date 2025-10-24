'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Vehicle } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card key={vehicle.id} className="flex flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>
          {vehicle.make} {vehicle.model}
        </CardTitle>
        <CardDescription>
          {vehicle.year} - {vehicle.vin}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col">
        <div className="relative mb-4 aspect-video w-full">
          <Image
            src={vehicle.imageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="vehicle image"
            priority
          />
        </div>
        <div className="mt-auto">
          <Button asChild className="w-full">
            <Link href={`/vehicles/${vehicle.id}`}>
              Assess Damage
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function VehicleGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="flex flex-col overflow-hidden">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex flex-grow flex-col">
            <Skeleton className="mb-4 aspect-video w-full rounded-md" />
            <div className="mt-auto">
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FleetPage() {
  const { firestore, user } = useFirebase();

  // Assuming a single 'default_fleet' for simplicity
  const fleetId = 'default_fleet';

  const vehiclesQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(
      collection(firestore, `/users/${user.uid}/fleets/${fleetId}/vehicles`),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, user]);

  const {
    data: vehicles,
    isLoading,
    error,
  } = useCollection<Vehicle>(vehiclesQuery);

  return (
    <>
      <div className="mb-6 flex items-center justify-end">
        <Button asChild>
          <Link href="/vehicles/new">
            <PlusCircle className="mr-2" />
            Create Vehicle
          </Link>
        </Button>
      </div>

      {isLoading && <VehicleGridSkeleton />}

      {error && (
        <Card className="bg-destructive/10 text-destructive-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle /> Error Loading Vehicles
            </CardTitle>
            <CardDescription className="text-destructive-foreground/80">
              Could not load your vehicle data. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!isLoading && !error && vehicles && (
        <>
          {vehicles.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-4 p-12 text-center">
                <h3 className="text-xl font-medium">No Vehicles Yet</h3>
                <p className="text-muted-foreground">
                  Get started by adding the first vehicle to your fleet.
                </p>
                <Button asChild>
                  <Link href="/vehicles/new">
                    <PlusCircle className="mr-2" />
                    Add Your First Vehicle
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
}
