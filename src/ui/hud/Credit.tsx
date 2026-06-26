import { Link } from '@tanstack/react-router'
import { Github, Linkedin } from 'lucide-react'

import { profile } from '../../lib/profile'

/** Bottom-right signature + about/socials. Always on except during touch play. */
export function Credit() {
  return (
    <div className="hud-text pointer-events-none absolute bottom-3.5 right-4 flex items-center gap-2.5 text-xs opacity-[0.82]">
      <span className="font-semibold">Matthew Fainman</span>
      <Link
        to="/about"
        className="pointer-events-auto font-semibold text-white no-underline opacity-85"
      >
        about
      </Link>
      <a
        href={profile.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="pointer-events-auto inline-flex text-white opacity-85"
      >
        <Github size={15} />
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="pointer-events-auto inline-flex text-white opacity-85"
      >
        <Linkedin size={15} />
      </a>
    </div>
  )
}
