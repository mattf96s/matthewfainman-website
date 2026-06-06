import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react'

/** The optimized illustration, served from public/ — only loads on /about. */
const SKYLINE_SRC = '/amsterdam-canal.svg'

/**
 * Full-bleed Amsterdam illustration backdrop. The art is flat/unlayered,
 * so the motion lives in a slow idle drift, a gentle mouse parallax, and a
 * couple of clouds drifting across the sky.
 */
export function BackdropParallaxSvg() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 45, damping: 18 })
  const sy = useSpring(my, { stiffness: 45, damping: 18 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1)
    my.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const imgX = useTransform(sx, [-1, 1], [18, -18])
  const imgY = useTransform(sy, [-1, 1], [12, -12])
  const cloudX = useTransform(sx, [-1, 1], [40, -40])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg,#aac2e6 0%,#d6e2ef 100%)',
      }}
    >
      {/* slow idle "breathing" drift */}
      <motion.div
        animate={{ scale: [1, 1.035, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* the illustration, covering the whole viewport; extra size gives
            the mouse parallax room to move without exposing an edge */}
        <motion.img
          src={SKYLINE_SRC}
          alt="A low-poly illustration of Amsterdam canal houses"
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center bottom',
            // zoom a touch so the mouse parallax (±18px) can shift the
            // image without ever exposing an edge of the container
            scale: 1.12,
            x: imgX,
            y: imgY,
            willChange: 'transform',
          }}
        />
      </motion.div>

      {/* drifting clouds over the sky */}
      <motion.div
        style={{ position: 'absolute', inset: 0, x: cloudX, pointerEvents: 'none' }}
      >
        <DriftCloud top="7%" dur={75} delay={0} opacity={0.5} />
        <DriftCloud top="15%" dur={54} delay={-28} opacity={0.35} />
      </motion.div>
    </div>
  )
}

function DriftCloud({
  top,
  dur,
  delay,
  opacity,
}: {
  top: string
  dur: number
  delay: number
  opacity: number
}) {
  return (
    <motion.div
      initial={{ x: '-15%' }}
      animate={{ x: '115%' }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top, opacity }}
    >
      <svg viewBox="0 0 140 56" width="180" height="72" aria-hidden>
        <g fill="#ffffff">
          <ellipse cx="48" cy="36" rx="42" ry="18" />
          <ellipse cx="82" cy="28" rx="32" ry="22" />
          <ellipse cx="108" cy="38" rx="28" ry="16" />
        </g>
      </svg>
    </motion.div>
  )
}
