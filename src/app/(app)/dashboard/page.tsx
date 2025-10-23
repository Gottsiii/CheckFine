'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Building, ShoppingCart, User } from 'lucide-react';

const fleetTypes = [
  {
    id: 'rental',
    title: 'Car Rental',
    description: 'Manage a fleet of rental vehicles.',
    icon: Building,
  },
  {
    id: 'sales',
    title: 'Car Sales',
    description: 'Manage a dealership inventory for sales.',
    icon: ShoppingCart,
  },
  {
    id: 'personal',
    title: 'Personal Management',
    description: 'Manage your own personal vehicles.',
    icon: User,
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [selectedFleetType, setSelectedFleetType] = useState<string | null>(
    null
  );

  const handleSelectFleetType = (fleetType: string) => {
    // In a real app, this would be saved to the user's profile.
    // For now, we'll just navigate to a placeholder page.
    setSelectedFleetType(fleetType);
    console.log(`Selected fleet type: ${fleetType}`);
    router.push(`/dashboard/fleet`);
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="mb-8 max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to FlotaValuador
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Please select your fleet management type to get started.
        </p>
      </div>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        {fleetTypes.map((type) => (
          <Card
            key={type.id}
            className="flex transform cursor-pointer flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            onClick={() => handleSelectFleetType(type.id)}
          >
            <CardHeader className="items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                <type.icon className="h-8 w-8" />
              </div>
              <CardTitle>{type.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col text-center">
              <p className="flex-grow text-muted-foreground">
                {type.description}
              </p>
              <Button variant="ghost" className="mt-4 w-full">
                Select
                <ArrowRight className="ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}