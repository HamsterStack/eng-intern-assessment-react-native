import { useEffect, useMemo, useRef, useState } from "react";

export interface Stopwatch {
  milliseconds: number;
  laps: number[];
  minLapTime: number | null;
  maxLapTime: number | null;
  isPaused: boolean;
  resume: () => void;
  pause: () => void;
  reset: () => void;
  lap: () => void;
}

export function useStopwatch(): Stopwatch {
  const [milliseconds, setMilliseconds] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [laps, setLaps] = useState<number[]>([]);

  const lastTime = useRef(Date.now());
  const accumulatedTime = useRef(0);

  function resume() {
    if (!isPaused) return;
    setIsPaused(false);
    lastTime.current = Date.now();
  }

  function pause() {
    if (isPaused) return;
    setIsPaused(true);
    const currentTime = Date.now();
    accumulatedTime.current += currentTime - lastTime.current;
    lastTime.current = currentTime;
  }

  function reset() {
    setIsPaused(true);
    lastTime.current = Date.now();
    setMilliseconds(0);
    setLaps([]);
    accumulatedTime.current = 0;
  }

  function lap() {
    const lapTime = milliseconds - accumulatedTime.current;
    setLaps((laps) => {
      return [...laps, lapTime];
    });
  }

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      const currentTime = Date.now();
      const timePassed = currentTime - lastTime.current;
      setMilliseconds(timePassed+accumulatedTime.current);
    }, 10);

    return () => clearInterval(interval);
  }, [isPaused]);

  return {
    milliseconds,
    laps,
    isPaused,
    resume,
    pause,
    reset,
    lap,
  };
}
