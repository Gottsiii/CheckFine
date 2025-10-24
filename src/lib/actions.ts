'use server';

import {
  estimateRepairCostFromDamageSketch,
  type EstimateRepairCostInput,
} from '@/ai/flows/estimate-repair-cost-from-damage-sketch';
import {
  updateRepairCostEstimates,
  type UpdateRepairCostEstimatesInput,
} from '@/ai/flows/update-repair-cost-estimates-with-current-data';
import type { Vehicle } from '@/lib/types';
import { FieldValue } from 'firebase-admin/firestore';
import { auth } from '@genkit-ai/next/auth';
import { getAdminDB } from './firebase-admin';

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
  vehicleData: Omit<Vehicle, 'id' | 'imageUrl' | 'createdAt'> & { imageUrl?: string }
) {
  try {
    const user = auth();
    if (!user) {
      throw new Error('You must be logged in to create a vehicle.');
    }

    const fleetId = 'default_fleet';

    const db = getAdminDB();
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
        vehicleData.imageUrl ||
        `https://picsum.photos/seed/${newVehicleRef.id}/600/400`,
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
