'use server';
/**
 * @fileOverview Estimates repair costs based on a damage sketch and specified damaged areas.
 *
 * - estimateRepairCostFromDamageSketch - A function that estimates repair costs based on a damage sketch.
 * - EstimateRepairCostInput - The input type for the estimateRepairCostFromDamageSketch function.
 * - EstimateRepairCostOutput - The return type for the estimateRepairCostFromDamageSketch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateRepairCostInputSchema = z.object({
  damageSketchDataUri: z
    .string()
    .describe(
      "A sketch of the vehicle damage, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  damagedAreas: z
    .array(z.string())
    .describe(
      'An array of strings specifying the damaged areas of the vehicle (e.g., windshield, bumper, door).'
    ),
  vehicleMake: z.string().describe('The make of the vehicle (e.g., Toyota).'),
  vehicleYear: z.string().describe('The year of the vehicle (e.g., 2018).'),
});
export type EstimateRepairCostInput = z.infer<typeof EstimateRepairCostInputSchema>;

const EstimateRepairCostOutputSchema = z.object({
  estimatedCost: z
    .number()
    .describe('The estimated repair cost based on the damage sketch and damaged areas.'),
  costBreakdown: z
    .string()
    .describe(
      'A breakdown of the estimated cost, including parts and labor, using list format.'
    ),
});
export type EstimateRepairCostOutput = z.infer<typeof EstimateRepairCostOutputSchema>;

export async function estimateRepairCostFromDamageSketch(
  input: EstimateRepairCostInput
): Promise<EstimateRepairCostOutput> {
  return estimateRepairCostFromDamageSketchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateRepairCostFromDamageSketchPrompt',
  input: {schema: EstimateRepairCostInputSchema},
  output: {schema: EstimateRepairCostOutputSchema},
  prompt: `You are an expert auto body damage estimator.

  Based on the provided damage sketch, damaged areas, vehicle make, and vehicle year, estimate the repair cost.

  The estimated cost should consider both parts and labor.

  Provide a detailed cost breakdown, including the cost of each part and the estimated labor hours, in a list format.

  Damage Sketch: {{media url=damageSketchDataUri}}
  Damaged Areas: {{#each damagedAreas}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Vehicle Make: {{{vehicleMake}}}
  Vehicle Year: {{{vehicleYear}}}

  Respond with JSON format.  \n  Ensure that the \"estimatedCost\" field is a number representing the total estimated cost.  \n  The \"costBreakdown\" should be a string with a detailed breakdown of costs in a bulleted list.
`,
});

const estimateRepairCostFromDamageSketchFlow = ai.defineFlow(
  {
    name: 'estimateRepairCostFromDamageSketchFlow',
    inputSchema: EstimateRepairCostInputSchema,
    outputSchema: EstimateRepairCostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
