"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type PanInfo } from "motion/react";

const TILT_RANGE = 14; // max degrees of tilt on each axis
const LIFT_SCALE = 1.15;
const RESTING_SHADOW = "0 1px 3px rgba(0,0,0,0.25)";
const LIFTED_SHADOW = "0 20px 30px rgba(0,0,0,0.35)";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

type DraggableStickerProps = {
  children: ReactNode;
  className?: string;
};

export default function DraggableSticker({ children, className }: DraggableStickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 15 });
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 15 });

  const dragProgress = useMotionValue(0);
  const liftProgress = useSpring(dragProgress, { stiffness: 200, damping: 20 });
  const scale = useTransform(liftProgress, [0, 1], [1, LIFT_SCALE]);
  const boxShadow = useTransform(liftProgress, [0, 1], [RESTING_SHADOW, LIFTED_SHADOW]);
  const sheenOpacity = useTransform(liftProgress, [0, 1], [0, 0.55]);
  const sheenAngle = useTransform(springRotateY, [-TILT_RANGE, TILT_RANGE], [60, 120]);
  const sheenBackground = useTransform(
    sheenAngle,
    (angle) => `linear-gradient(${angle}deg, transparent 30%, rgba(255,255,255,0.9) 50%, transparent 70%)`
  );

  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = (info.point.x - (rect.left + rect.width / 2)) / (rect.width / 2);
    const offsetY = (info.point.y - (rect.top + rect.height / 2)) / (rect.height / 2);
    rotateY.set(clamp(offsetX * TILT_RANGE, -TILT_RANGE, TILT_RANGE));
    rotateX.set(clamp(-offsetY * TILT_RANGE, -TILT_RANGE, TILT_RANGE));
  };

  const handleDragEnd = () => {
    dragProgress.set(0);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div className={className} style={{ perspective: 800 }}>
      <motion.div
        ref={ref}
        drag
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
        onDrag={handleDrag}
        onDragStart={() => dragProgress.set(1)}
        onDragEnd={handleDragEnd}
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          borderRadius: "9999px",
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale,
          boxShadow,
          touchAction: "none",
          cursor: "grab",
        }}
        whileTap={{ cursor: "grabbing" }}
      >
        {children}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "9999px",
            background: sheenBackground,
            opacity: sheenOpacity,
            mixBlendMode: "overlay",
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </div>
  );
}
