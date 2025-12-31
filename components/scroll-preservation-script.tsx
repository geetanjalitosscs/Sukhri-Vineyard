"use client";

import { useEffect } from "react";

export function ScrollPreservationScript() {
  useEffect(() => {
    // Disable browser scroll restoration
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Prevent Next.js from scrolling on navigation
    const preventAutoScroll = () => {
      const mainElement = document.querySelector('main');
      if (mainElement) {
        const pathname = window.location.pathname;
        const savedScroll = sessionStorage.getItem(`scroll-${pathname}`);
        if (savedScroll !== null) {
          const scrollPosition = parseInt(savedScroll, 10);
          (mainElement as HTMLElement).scrollTop = scrollPosition;
        }
      }
    };

    // Run immediately and on various events
    preventAutoScroll();
    window.addEventListener('load', preventAutoScroll);
    window.addEventListener('popstate', preventAutoScroll);

    // Watch for scroll changes and restore
    let lastPathname = window.location.pathname;
    const checkPathname = setInterval(() => {
      const currentPathname = window.location.pathname;
      if (currentPathname !== lastPathname) {
        lastPathname = currentPathname;
        setTimeout(preventAutoScroll, 0);
        setTimeout(preventAutoScroll, 10);
        setTimeout(preventAutoScroll, 50);
        setTimeout(preventAutoScroll, 100);
      }
    }, 50);

    return () => {
      window.removeEventListener('load', preventAutoScroll);
      window.removeEventListener('popstate', preventAutoScroll);
      clearInterval(checkPathname);
    };
  }, []);

  return null;
}

