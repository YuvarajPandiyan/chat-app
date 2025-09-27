import { useRef } from "react";
import { useEffect } from "react";

export const useScrollEnd = ({ elementRef }) => {
  const thisRef = useRef({ resizeObserverInstance: undefined });

  useEffect(() => {
    if (!thisRef.current.resizeObserverInstance) {
      const resizeObserverInstance = new ResizeObserver((entries = []) => {
        entries?.map((sizeChangedElement) => {
          sizeChangedElement?.target?.parentElement?.scrollTo(
            0,
            sizeChangedElement?.target?.getBoundingClientRect()?.height
          );
        });
      });
      thisRef.current.resizeObserverInstance = resizeObserverInstance;
    }

    if (elementRef instanceof HTMLElement) {
      thisRef.current?.resizeObserverInstance?.observe(elementRef);
    }
  }, [elementRef]);
};
