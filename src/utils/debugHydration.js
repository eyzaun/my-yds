/**
 * Helps identify React hydration issues by adding a debug attribute to elements
 */
export const withHydrationDebugging = (Component) => {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    return Component;
  }
  
  return function DebugComponent(props) {
    return (
      <div data-hydration-debug="true">
        <Component {...props} />
      </div>
    );
  };
};

/**
 * Safe client-side only component to avoid hydration mismatches
 */
export const createClientOnlyComponent = (ComponentFn) => {
  return function ClientOnlyWrapper(props) {
    const [mounted, setMounted] = React.useState(false);
    
    React.useEffect(() => {
      setMounted(true);
    }, []);
    
    // Return null during SSR
    if (!mounted) {
      return null;
    }
    
    // Only render the actual component on the client
    return ComponentFn(props);
  };
};
