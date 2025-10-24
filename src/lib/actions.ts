'use server';

import {
  estimateRepairCostFromDamageSketch,
  type EstimateRepairCostInput,
} from '@/ai/flows/estimate-repair-cost-from-damage-sketch';
import {
  updateRepairCostEstimates,
  type UpdateRepairCostEstimatesInput,
} from '@/ai/flows/update-repair-cost-estimates-with-current-data';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { Vehicle } from '@/lib/types';
import { auth } from 'genkit/next/auth';

export async function getDamageEstimate(input: EstimateRepairCostInput) {
  try {
    const result = await estimateRepairCostFromDamageSketch(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get damage estimate.' };
  }
}

export async function getSimpleCostEstimate(
  input: UpdateRepairCostEstimatesInput
) {
  try {
    const result = await updateRepairCostEstimates(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Failed to get cost estimate.' };
  }
}

export async function createVehicle(
  vehicleData: Omit<Vehicle, 'id' | 'imageUrl'> & { imageUrl?: string }
) {
  try {
    const user = auth();
    if (!user) {
      throw new Error('You must be logged in to create a vehicle.');
    }

    // For now, we'll assume a single fleet per user.
    // In a real app, you would select or create a fleet.
    const fleetId = 'default_fleet';

    const db = getFirestore();
    const vehiclesCollection = db.collection(
      `/users/${user.uid}/fleets/${fleetId}/vehicles`
    );

    const newVehicleRef = vehiclesCollection.doc();

    const newVehicle: Vehicle = {
      id: newVehicleRef.id,
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      vin: vehicleData.vin,
      imageUrl:
        vehicleData.imageUrl || 'https://picsum.photos/seed/placeholder/600/400', // Default placeholder
      createdAt: FieldValue.serverTimestamp(),
    };

    await newVehicleRef.set(newVehicle);

    return { success: true, data: { id: newVehicleRef.id } };
  } catch (error: any) {
    console.error('Error creating vehicle:', error);
    return {
      success: false,
      error: error.message || 'Failed to create vehicle.',
    };
  }
}