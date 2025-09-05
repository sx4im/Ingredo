import React from 'react';
import PixelBlast from './PixelBlast';

interface ThemeAwarePixelBlastProps {
  variant?: 'square' | 'circle' | 'triangle' | 'diamond';
  pixelSize?: number;
  patternScale?: number;
  patternDensity?: number;
  pixelSizeJitter?: number;
  enableRipples?: boolean;
  rippleSpeed?: number;
  rippleThickness?: number;
  rippleIntensityScale?: number;
  liquid?: boolean;
  liquidStrength?: number;
  liquidRadius?: number;
  liquidWobbleSpeed?: number;
  speed?: number;
  edgeFade?: number;
  transparent?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ThemeAwarePixelBlast(props: ThemeAwarePixelBlastProps) {
  // Always use warm brown color since we only have dark theme now
  const color = '#99744A'; // Warm brown for dark theme

  return (
    <PixelBlast
      {...props}
      color={color}
    />
  );
}
