import Link from 'next/link';
import Image from 'next/image';
import { vehicles } from '@/lib/data';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlusCircle } from 'lucide-react';

export default function FleetPage() {
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
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
        ))}
      </div>
    </>
  );
}