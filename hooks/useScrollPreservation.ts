"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function useScrollPreservation(elementRef: React.RefObject<HTMLElement>) {
  const pathname = usePathname();
  const isRestoring = useRef(false);
  const scrollPositions = useRef<Map<string, number>>(new Map());
  const previousPathname = useRef<string | null>(null);
  const targetScrollPosition = useRef<number | null>(null);

  // Save scroll position before pathname changes
  useEffect(() => {
    if (previousPathname.current && previousPathname.current !== pathname) {
      const element = elementRef.current;
      if (element) {
        const scrollPos = element.scrollTop;
        scrollPositions.current.set(previousPathname.current, scrollPos);
        sessionStorage.setItem(`scroll-${previousPathname.current}`, scrollPos.toString());
      }
    }
    previousPathname.current = pathname;
  }, [pathname, elementRef]);

  // Restore scroll position after pathname changes
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !pathname) return;

    const savedScroll = sessionStorage.getItem(`scroll-${pathname}`);
    if (savedScroll !== null) {
      const scrollPosition = parseInt(savedScroll, 10);
      targetScrollPosition.current = scrollPosition;
      isRestoring.current = true;

      // Immediately set scroll position
      element.scrollTop = scrollPosition;

      // Aggressive restoration with multiple attempts
      const restore = () => {
        if (elementRef.current && isRestoring.current && targetScrollPosition.current !== null) {
          elementRef.current.scrollTop = targetScrollPosition.current;
        }
      };

      // Multiple restoration attempts
      restore();
      requestAnimationFrame(restore);
      requestAnimationFrame(() => requestAnimationFrame(restore));
      
      const timeouts = [0, 1, 5, 10, 25, 50, 100, 200, 300, 500, 750, 1000];
      timeouts.forEach((delay) => {
        setTimeout(restore, delay);
      });

      // Watch and force scroll position for 2 seconds
      const watchInterval = setInterval(() => {
        if (elementRef.current && isRestoring.current && targetScrollPosition.current !== null) {
          const current = elementRef.current.scrollTop;
          if (Math.abs(current - targetScrollPosition.current) > 1) {
            elementRef.current.scrollTop = targetScrollPosition.current;
          }
        }
      }, 5);

      setTimeout(() => {
        clearInterval(watchInterval);
        isRestoring.current = false;
        targetScrollPosition.current = null;
      }, 2000);
    } else {
      element.scrollTop = 0;
      isRestoring.current = false;
      targetScrollPosition.current = null;
    }
  }, [pathname, elementRef]);

  // Save scroll position on scroll
  useEffect(() => {
    const element = elementRef.current;
    if (!element || !pathname || isRestoring.current) return;

    const handleScroll = () => {
      if (!isRestoring.current && element) {
        const scrollPos = element.scrollTop;
        scrollPositions.current.set(pathname, scrollPos);
        sessionStorage.setItem(`scroll-${pathname}`, scrollPos.toString());
      }
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, elementRef]);

  // Prevent window scroll during restoration
  useEffect(() => {
    if (!isRestoring.current) return;

    const preventWindowScroll = (e: Event) => {
      if (isRestoring.current && targetScrollPosition.current !== null) {
        const element = elementRef.current;
        if (element && Math.abs(element.scrollTop - targetScrollPosition.current) > 1) {
          element.scrollTop = targetScrollPosition.current;
        }
      }
    };

    window.addEventListener("scroll", preventWindowScroll, { passive: false, capture: true });
    return () => {
      window.removeEventListener("scroll", preventWindowScroll, { capture: true });
    };
  }, [isRestoring.current, elementRef]);
}

