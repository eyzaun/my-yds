import dynamic from 'next/dynamic';

// Import the hydration-safe SVG component properly
const HydrationSafeSvg = dynamic(() => import('./HydrationSafeSvg'), { ssr: false });
// Fix require() with proper import syntax
import { ForeignHtml } from './HydrationSafeSvg';

function SomeComponentWithSVG() {
  return (
    <div>
      {/* Replace any SVG elements with the safe version */}
      <HydrationSafeSvg viewBox="0 0 100 100" width="200" height="200">
        <circle cx="50" cy="50" r="40" fill="red" />
        
        {/* If you need HTML inside SVG, use ForeignHtml */}
        <ForeignHtml x="10" y="10" width="80" height="80">
          <div>This is HTML content inside SVG</div>
        </ForeignHtml>
      </HydrationSafeSvg>
    </div>
  );
}

// Export as client component for safety
export default dynamic(() => Promise.resolve(SomeComponentWithSVG), { ssr: false });