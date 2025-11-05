import { ReactNode } from 'react';

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

export const features: Feature[] = [
  {
    title: "Kategorize Edilmiş",
    description: "9 farklı kategoride düzenlenmiş YDS kelimeleri",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2m14 0V9a2 2 0 0 0-2-2M5 11V9a2 2 0 0 1 2-2m0 0V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2M7 7h10" />
      </svg>
    )
  },
  // ... other features ...
];
