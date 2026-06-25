import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, type Variants } from 'motion/react'
import { ArrowLeft, Github, Linkedin } from 'lucide-react'

import { BackdropParallaxSvg } from '../components/about/BackdropParallaxSvg'
import { profile } from '../lib/profile'
import { seo } from '../lib/seo'

export const Route = createFileRoute('/about')({
  component: About,
  head: () =>
    seo({
      title: 'About',
      description: 'Matthew Fainman — a software developer in Amsterdam.',
      path: '/about',
    }),
})

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function About() {
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0a1418' }}>
      <BackdropParallaxSvg />

      {/* readability scrim — a shallow wash confined to the bottom-left
        * where the text sits, so the canal houses stay visible. The text
        * leans on its own text-shadow (below) rather than a heavy vignette. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(90deg, rgba(5,11,15,0.6) 0%, rgba(5,11,15,0.26) 26%, rgba(5,11,15,0) 50%), linear-gradient(0deg, rgba(5,11,15,0.68) 0%, rgba(5,11,15,0.16) 28%, rgba(5,11,15,0) 48%)',
        }}
      />

      {/* back to the game */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 no-underline"
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          padding: '8px 14px',
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 600,
          color: '#fff',
          background: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.28)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <ArrowLeft size={16} strokeWidth={2} />
        Back to the game
      </Link>

      {/* content, lower-left, HUD-style over the scene */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          maxWidth: 820,
          padding: '0 clamp(22px, 6vw, 88px) clamp(40px, 9vh, 104px)',
          color: '#fff',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          // crisper, stronger shadow carries legibility now the scrim is
          // lighter — keeps the kicker + headline readable over the houses
          textShadow: '0 2px 10px rgba(0,0,0,0.75), 0 1px 2px rgba(0,0,0,0.6)',
        }}
      >
        <motion.p
          variants={item}
          className="island-kicker"
          style={{ color: '#c9eee7', margin: 0 }}
        >
          Matthew Fainman
        </motion.p>
        <motion.h1
          variants={item}
          className="display-title"
          style={{
            margin: '10px 0 0',
            fontSize: 'clamp(36px, 6.4vw, 66px)',
            lineHeight: 1.04,
            fontWeight: 700,
            maxWidth: 720,
          }}
        >
          I’m a software developer in Amsterdam.
        </motion.h1>

        <motion.div
          variants={item}
          style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', gap: 12 }}
        >
          <SocialLink href={profile.github} label="GitHub">
            <Github size={16} strokeWidth={1.8} />
          </SocialLink>
          <SocialLink href={profile.linkedin} label="LinkedIn">
            <Linkedin size={16} strokeWidth={1.8} />
          </SocialLink>
        </motion.div>
      </motion.div>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold no-underline"
      style={{
        color: '#fff',
        background: 'rgba(255,255,255,0.16)',
        border: '1px solid rgba(255,255,255,0.3)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {children}
      {label}
    </a>
  )
}
