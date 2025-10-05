'use client';
import React from 'react';
import dynamic from 'next/dynamic';

// Ensure proper SVG namespace handling
function SafeSVGInternal({ children, viewBox = "0 0 100 100", ...props }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={viewBox}
      {...props}
    >
      {/* Wrap children in a group for consistent rendering */}
      <g>{children}</g>
    </svg>
  );
}

// Proper ForeignContent implementation to avoid hydration errors
export function ForeignContent({ children, x = 0, y = 0, width = "100%", height = "100%" }) {
  return (
    <foreignObject 
      x={x} 
      y={y} 
      width={width} 
      height={height} 
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <div xmlns="http://www.w3.org/1999/xhtml">{children}</div>
    </foreignObject>
  );
}

// Use client-only rendering to avoid hydration mismatches
export default dynamic(() => Promise.resolve(SafeSVGInternal), { ssr: false });
