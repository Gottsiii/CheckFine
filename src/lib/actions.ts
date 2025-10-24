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
import { auth as adminAuth } from 'firebase-admin';
import { getAdminDB } from './firebase-admin';
import { headers } from 'next/headers';

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

async function getAuthenticatedUser() {
  const authorization = headers().get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      const decodedToken = await adminAuth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying ID token:', error);
      return null;
    }
  }
  return null;
}

export async function createVehicle(
  vehicleData: Omit<Vehicle, 'id' | 'imageUrl' | 'createdAt'> & {
    imageUrl?: string;
  }
) {
  try {
    const user = await getAuthenticatedUser();
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
