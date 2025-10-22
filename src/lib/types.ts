export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  imageUrl: string;
};

export const VehiclePartIds = [
  'hood',
  'windshield',
  'roof',
  'trunk',
  'front_bumper',
  'rear_bumper',
  'front_left_door',
  'front_right_door',
  'rear_left_door',
  'rear_right_door',
  'front_left_headlight',
  'front_right_headlight',
  'rear_left_headlight',
  'rear_right_headlight',
  'front_left_tire',
  'front_right_tire',
  'rear_left_tire',
  'rear_right_tire',
] as const;

export type VehiclePart = (typeof VehiclePartIds)[number];

export const DamageAreasMap: Record<string, string> = {
  hood: 'Hood',
  windshield: 'Windshield',
  trunk: 'Trunk',
  front_bumper: 'Front Bumper',
  rear_bumper: 'Rear Bumper',
  front_left_door: 'Doors',
  front_right_door: 'Doors',
  rear_left_door: 'Doors',
  rear_right_door: 'Doors',
  front_left_headlight: 'Headlights',
  front_right_headlight: 'Headlights',
  rear_left_headlight: 'Taillights',
  rear_right_headlight: 'Taillights',
  front_left_tire: 'Tires',
  front_right_tire: 'Tires',
  rear_left_tire: 'Tires',
  rear_right_tire: 'Tires',
};
