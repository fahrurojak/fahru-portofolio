import { useEffect, useState } from 'react';

export default function useSceneVisibility(ref) {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);
  useEffect(() => {
    let visible = false;
    const sync = () => setActive(visible && !document.hidden);
    if (!('IntersectionObserver' in window)) {
      visible = true;
      setReady(true); sync();
      document.addEventListener('visibilitychange', sync);
      return () => document.removeEventListener('visibilitychange', sync);
    }
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setReady(true); preload.disconnect(); }
    }, { rootMargin: '160px' });
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting; sync();
    });
    preload.observe(ref.current);
    observer.observe(ref.current);
    document.addEventListener('visibilitychange', sync);
    return () => {
      preload.disconnect(); observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, [ref]);
  return { ready, active };
}
