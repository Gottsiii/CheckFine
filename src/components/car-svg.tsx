'use client';

import * as React from 'react';
import type { VehiclePart } from '@/lib/types';
import { cn } from '@/lib/utils';

type CarSvgProps = {
  selectedParts: VehiclePart[];
  onPartClick: (part: VehiclePart) => void;
  className?: string;
};

export const CarSvg = React.forwardRef<SVGSVGElement, CarSvgProps>(
  ({ selectedParts, onPartClick, className }, ref) => {
    const isPartSelected = (part: VehiclePart) => selectedParts.includes(part);
    const partClasses = (part: VehiclePart) =>
      cn(
        'fill-gray-300 stroke-gray-500 stroke-[0.5] transition-colors cursor-pointer hover:fill-accent/30',
        isPartSelected(part) &&
          'fill-destructive/70 hover:fill-destructive/80'
      );
    const bodyClasses =
      'fill-gray-200 stroke-gray-600 stroke-[0.5] transition-colors';

    return (
      <svg
        ref={ref}
        viewBox="0 0 200 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <g>
          <path className={bodyClasses} d="M 50,5 H 150 C 155,5 155,10 150,10 L 160,20 L 165,25 V 75 L 160,80 L 150,90 C 155,90 155,95 150,95 H 50 C 45,95 45,90 50,90 L 40,80 L 35,75 V 25 L 40,20 L 50,10 C 45,10 45,5 50,5 Z" />

          <path id="hood" className={partClasses('hood')} onClick={() => onPartClick('hood')} d="M 55,12 H 145 L 155,22 H 45 Z" />
          <path id="windshield" className={partClasses('windshield')} onClick={() => onPartClick('windshield')} d="M 155,23 H 45 L 50,33 H 150 Z" />
          <path id="roof" className={partClasses('roof')} onClick={() => onPartClick('roof')} d="M 51,34 H 149 L 146,66 H 54 Z" />
          <path id="trunk" className={partClasses('trunk')} onClick={() => onPartClick('trunk')} d="M 55,67 H 145 L 140,77 H 60 Z" />

          <path id="front_bumper" className={partClasses('front_bumper')} onClick={() => onPartClick('front_bumper')} d="M 50,5 H 150 C 155,5 155,10 150,10 H 50 C 45,10 45,5 50,5 Z" />
          <path id="rear_bumper" className={partClasses('rear_bumper')} onClick={() => onPartClick('rear_bumper')} d="M 50,95 H 150 C 155,95 155,90 150,90 H 50 C 45,90 45,95 50,95 Z" />
          
          <path id="front_left_door" className={partClasses('front_left_door')} onClick={() => onPartClick('front_left_door')} d="M 44,23 L 38,26 V 48 L 51,49 V 33 Z" />
          <path id="rear_left_door" className={partClasses('rear_left_door')} onClick={() => onPartClick('rear_left_door')} d="M 38,50 V 74 L 44,77 L 54,76 V 50 Z" />
          <path id="front_right_door" className={partClasses('front_right_door')} onClick={() => onPartClick('front_right_door')} d="M 156,23 L 162,26 V 48 L 149,49 V 33 Z" />
          <path id="rear_right_door" className={partClasses('rear_right_door')} onClick={() => onPartClick('rear_right_door')} d="M 162,50 V 74 L 156,77 L 146,76 V 50 Z" />

          <path id="front_left_headlight" className={partClasses('front_left_headlight')} onClick={() => onPartClick('front_left_headlight')} d="M 40,11 H 50 V 19 H 42 Z" />
          <path id="front_right_headlight" className={partClasses('front_right_headlight')} onClick={() => onPartClick('front_right_headlight')} d="M 160,11 H 150 V 19 H 158 Z" />
          <path id="rear_left_headlight" className={partClasses('rear_left_headlight')} onClick={() => onPartClick('rear_left_headlight')} d="M 40,89 H 50 V 81 H 42 Z" />
          <path id="rear_right_headlight" className={partClasses('rear_right_headlight')} onClick={() => onPartClick('rear_right_headlight')} d="M 160,89 H 150 V 81 H 158 Z" />

          <circle id="front_left_tire" className={partClasses('front_left_tire')} onClick={() => onPartClick('front_left_tire')} cx="33" cy="25" r="5" />
          <circle id="front_right_tire" className={partClasses('front_right_tire')} onClick={() => onPartClick('front_right_tire')} cx="167" cy="25" r="5" />
          <circle id="rear_left_tire" className={partClasses('rear_left_tire')} onClick={() => onPartClick('rear_left_tire')} cx="33" cy="75" r="5" />
          <circle id="rear_right_tire" className={partClasses('rear_right_tire')} onClick={() => onPartClick('rear_right_tire')} cx="167" cy="75" r="5" />
        </g>
      </svg>
    );
  }
);
CarSvg.displayName = 'CarSvg';
