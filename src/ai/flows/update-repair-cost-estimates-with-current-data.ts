'use server';
/**
 * @fileOverview Updates repair cost estimates with current data for parts and labor.
 *
 * - updateRepairCostEstimates - A function that updates the repair cost estimates.
 * - UpdateRepairCostEstimatesInput - The input type for the updateRepairCostEstimates function.
 * - UpdateRepairCostEstimatesOutput - The return type for the updateRepairCostEstimates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateRepairCostEstimatesInputSchema = z.object({
  partName: z.string().describe('The name of the part to update the cost for.'),
  laborHours: z.number().describe('The number of labor hours required for the repair.'),
  partCost: z.number().describe('The cost of the part.'),
  laborRate: z.number().describe('The hourly labor rate.'),
});
export type UpdateRepairCostEstimatesInput = z.infer<typeof UpdateRepairCostEstimatesInputSchema>;

const UpdateRepairCostEstimatesOutputSchema = z.object({
  estimatedCost: z.number().describe('The estimated cost of the repair.'),
});
export type UpdateRepairCostEstimatesOutput = z.infer<typeof UpdateRepairCostEstimatesOutputSchema>;

export async function updateRepairCostEstimates(input: UpdateRepairCostEstimatesInput): Promise<UpdateRepairCostEstimatesOutput> {
  return updateRepairCostEstimatesFlow(input);
}

const updateRepairCostEstimatesFlow = ai.defineFlow(
  {
    name: 'updateRepairCostEstimatesFlow',
    inputSchema: UpdateRepairCostEstimatesInputSchema,
    outputSchema: UpdateRepairCostEstimatesOutputSchema,
  },
  async input => {
    const estimatedCost = input.partCost + (input.laborHours * input.laborRate);
    return { estimatedCost };
  }
);
