// Track which ads have been initialized
const initializedAds = new Set();

export const isAdInitialized = (id) => initializedAds.has(id);

export const markAdInitialized = (id) => {
  initializedAds.add(id);
  console.log(`Ad ${id} marked as initialized`);
};

// Wait for the page to be fully loaded before initializing ads
export const safelyInitializeAds = (adId, callback) => {
  if (typeof window === 'undefined') return;
  
  // If already initialized, don't initialize again
  if (initializedAds.has(adId)) return;
  
  // Function to actually initialize the ad
  const initAd = () => {
    try {
      markAdInitialized(adId);
      callback();
    } catch (error) {
      console.error(`Error initializing ad ${adId}:`, error);
    }
  };
  
  // Check if document is already complete
  if (document.readyState === 'complete') {
    // Page is already loaded, initialize immediately
    setTimeout(initAd, 100);
  } else {
    // Wait for page to finish loading
    window.addEventListener('load', () => {
      setTimeout(initAd, 100);
    }, { once: true });
  }
};

// Clear tracking on navigation/cleanup
export const resetAdTracking = () => {
  initializedAds.clear();
  console.log('Ad tracking reset');
};
