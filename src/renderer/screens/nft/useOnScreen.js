// @flow
import { useState, useEffect } from "react";

const useOnScreen = (ref: any) => {
  // State and setter for storing whether element is visible
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update our state when observer callback fires
        setIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: "0px",
      },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    const target = ref.current;
    return () => {
      observer.unobserve(target);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return isIntersecting;
};

export default useOnScreen;
