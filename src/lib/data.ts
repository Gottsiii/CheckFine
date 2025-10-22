import type { Vehicle } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const getImage = (id: string) =>
  PlaceHolderImages.find((img) => img.id === id)?.imageUrl || '';

export const vehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2022,
    vin: '12345ABCDE67890',
    imageUrl: getImage('vehicle-1'),
  },
  {
    id: '2',
    make: 'Ford',
    model: 'Explorer',
    year: 2023,
    vin: 'FGHIJ12345KLMNO',
    imageUrl: getImage('vehicle-2'),
  },
  {
    id: '3',
    make: 'Porsche',
    model: '911',
    year: 2021,
    vin: 'PQRST67890UVWXY',
    imageUrl: getImage('vehicle-3'),
  },
  {
    id: '4',
    make: 'Chevrolet',
    model: 'Silverado',
    year: 2020,
    vin: 'ZABCD12345EFGHI',
    imageUrl: getImage('vehicle-4'),
  },
];
