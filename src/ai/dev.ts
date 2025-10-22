import { config } from 'dotenv';
config();

import '@/ai/flows/estimate-repair-cost-from-damage-sketch.ts';
import '@/ai/flows/update-repair-cost-estimates-with-current-data.ts';