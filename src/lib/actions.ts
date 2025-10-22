'use server';

import {
  estimateRepairCostFromDamageSketch,
  type EstimateRepairCostInput,
} from '@/ai/flows/estimate-repair-cost-from-damage-sketch';
import {
  updateRepairCostEstimates,
  type UpdateRepairCostEstimatesInput,
} from '@/ai/flows/update-repair-cost-estimates-with-current-data';

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
