import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

const words = ["Design", "Create", "Inspire"];

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  const hasCompleted = useRef(false);

  // Keep ref current to avoid stale closures
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Rotating words: cycle every 900ms, stop at last word
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => {
        if (prev >= words.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Counter: 000 → 100 over 2.7s using requestAnimationFrame
  useEffect(() => {
    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const pct = Math.min((elapsed / 2700) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafId = requestAnimationFrame(animate);
      } else if (!hasCompleted.current) {
        hasCompleted.current = true;
        // Wait 400ms after hitting 100, then fire onComplete
        setTimeout(() => {
          onCompleteRef.current();
        }, 400);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const cubicEase = [0.4, 0, 0.2, 1] as const;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "#0a0a0a" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [...cubicEase] }}
    >
      {/* Element 1: "Portfolio" label — top-left */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span
          className="text-xs md:text-sm uppercase"
          style={{
            color: "#888888",
            letterSpacing: "0.3em",
          }}
        >
          Portfolio
        </span>
      </motion.div>

      {/* Element 2: Rotating words — center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic"
            style={{ color: "rgba(245, 245, 245, 0.8)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [...cubicEase] }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Element 3: Counter — bottom-right */}
      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <span
          className="text-6xl md:text-8xl lg:text-9xl font-display tabular-nums"
          style={{ color: "#f5f5f5" }}
        >
          {Math.round(progress).toString().padStart(3, "0")}
        </span>
      </motion.div>

      {/* Element 4: Progress bar — bottom edge */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "3px", backgroundColor: "rgba(31, 31, 31, 0.5)" }}
      >
        <motion.div
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)",
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
