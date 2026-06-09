import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_CHARSET = 'AIUXBRAND0123456789视觉产品设计';

function shouldSkipAnimation() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

export default function ShuffleTitle({
  as: Tag = 'h2',
  text,
  className = '',
  scrambleCharset = DEFAULT_CHARSET,
  triggerOnce = true,
  startDelay = 760,
}) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [displayChars, setDisplayChars] = useState(chars);
  const [isActive, setIsActive] = useState(false);
  const [runId, setRunId] = useState(0);
  const rootRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const play = () => {
    if (shouldSkipAnimation()) {
      setDisplayChars(chars);
      return;
    }

    clearTimers();
    setIsActive(true);
    setRunId((current) => current + 1);

    const totalFrames = 10;
    const frameDuration = 42;
    const settleDelay = 18;

    for (let frame = 0; frame <= totalFrames; frame += 1) {
      const timer = window.setTimeout(() => {
        setDisplayChars(
          chars.map((char, index) => {
            if (char.trim() === '') return char;
            const settleFrame = Math.min(totalFrames, Math.floor(index * 0.22) + 4);
            if (frame >= settleFrame) return char;
            const randomIndex = Math.floor(Math.random() * scrambleCharset.length);
            return scrambleCharset[randomIndex] ?? char;
          }),
        );
      }, frame * frameDuration + settleDelay);
      timersRef.current.push(timer);
    }

    const finishTimer = window.setTimeout(() => {
      setDisplayChars(chars);
      setIsActive(false);
      hasPlayedRef.current = true;
    }, totalFrames * frameDuration + 180);
    timersRef.current.push(finishTimer);
  };

  useEffect(() => {
    setDisplayChars(chars);
  }, [chars]);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (triggerOnce && hasPlayedRef.current) return;
        const timer = window.setTimeout(play, startDelay);
        timersRef.current.push(timer);
      },
      { threshold: 0.22, rootMargin: '-80px 0px' },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearTimers();
    };
  }, [chars, startDelay, triggerOnce]);

  return (
    <Tag
      ref={rootRef}
      className={`shuffle-title ${isActive ? 'is-shuffling' : ''} ${className}`.trim()}
      onMouseEnter={play}
    >
      {displayChars.map((char, index) => (
        <span
          className="shuffle-title-char"
          key={`${runId}-${index}-${char}`}
          style={{ '--shuffle-index': index }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
}
