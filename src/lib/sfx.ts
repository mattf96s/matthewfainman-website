/**
 * Tiny procedural sound-effects engine. Every sound is synthesised at
 * runtime with the Web Audio API — no audio files, no dependencies, no
 * network. The chiptune-ish "pew / ding / splash" palette suits the
 * low-poly meme aesthetic and keeps the bundle weightless.
 *
 * To use real samples later, swap the bodies of the `play()` cases for
 * buffer playback — the public API (`play`, `resume`, mute helpers) stays
 * the same, so call sites never change.
 */

export type SfxName =
  | 'shoot'
  | 'hitConfirm'
  | 'kill'
  | 'hurt'
  | 'death'
  | 'splash'
  | 'pickup'
  | 'nearMiss'

const MUTE_KEY = 'ae:sfx-muted'
const MASTER_VOLUME = 0.32

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noiseBuffer: AudioBuffer | null = null
let muted = false

if (typeof window !== 'undefined') {
  muted = window.localStorage.getItem(MUTE_KEY) === '1'
}

function ensureContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const w = window as unknown as { webkitAudioContext?: typeof AudioContext }
    const Ctor = window.AudioContext ?? w.webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    master = ctx.createGain()
    master.gain.value = MASTER_VOLUME
    master.connect(ctx.destination)
  }
  return ctx
}

/** One reusable buffer of white noise, generated on first use. */
function getNoise(context: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    const len = Math.floor(context.sampleRate * 0.5)
    noiseBuffer = context.createBuffer(1, len, context.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  }
  return noiseBuffer
}

/** A gain node shaped as a quick attack → exponential release envelope. */
function envGain(
  context: AudioContext,
  peak: number,
  attack: number,
  release: number,
  startAt: number,
): GainNode {
  const g = context.createGain()
  g.gain.setValueAtTime(0.0001, startAt)
  g.gain.exponentialRampToValueAtTime(peak, startAt + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, startAt + attack + release)
  return g
}

interface ToneOpts {
  type: OscillatorType
  from: number
  to: number
  peak: number
  attack: number
  release: number
  startAt: number
}

function tone(context: AudioContext, dest: AudioNode, o: ToneOpts): void {
  const osc = context.createOscillator()
  osc.type = o.type
  osc.frequency.setValueAtTime(o.from, o.startAt)
  if (o.to !== o.from) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(1, o.to),
      o.startAt + o.attack + o.release,
    )
  }
  const g = envGain(context, o.peak, o.attack, o.release, o.startAt)
  osc.connect(g)
  g.connect(dest)
  osc.start(o.startAt)
  osc.stop(o.startAt + o.attack + o.release + 0.02)
}

interface NoiseOpts {
  peak: number
  attack: number
  release: number
  startAt: number
  filterType: BiquadFilterType
  freq: number
  q?: number
}

function noiseHit(context: AudioContext, dest: AudioNode, o: NoiseOpts): void {
  const src = context.createBufferSource()
  src.buffer = getNoise(context)
  const filt = context.createBiquadFilter()
  filt.type = o.filterType
  filt.frequency.value = o.freq
  if (o.q) filt.Q.value = o.q
  const g = envGain(context, o.peak, o.attack, o.release, o.startAt)
  src.connect(filt)
  filt.connect(g)
  g.connect(dest)
  src.start(o.startAt)
  src.stop(o.startAt + o.attack + o.release + 0.05)
}

/** Play a named sound effect. No-op when muted or pre-audio-context. */
export function play(name: SfxName): void {
  if (muted) return
  const context = ensureContext()
  if (!context || !master) return
  if (context.state === 'suspended') void context.resume().catch(() => {})
  const t = context.currentTime

  switch (name) {
    case 'shoot':
      noiseHit(context, master, { peak: 0.5, attack: 0.001, release: 0.1, startAt: t, filterType: 'lowpass', freq: 1600, q: 1 })
      tone(context, master, { type: 'square', from: 220, to: 60, peak: 0.25, attack: 0.001, release: 0.09, startAt: t })
      break
    case 'hitConfirm':
      tone(context, master, { type: 'sine', from: 900, to: 1300, peak: 0.3, attack: 0.001, release: 0.07, startAt: t })
      break
    case 'kill':
      tone(context, master, { type: 'square', from: 660, to: 990, peak: 0.26, attack: 0.001, release: 0.1, startAt: t })
      tone(context, master, { type: 'square', from: 990, to: 1320, peak: 0.2, attack: 0.001, release: 0.12, startAt: t + 0.08 })
      break
    case 'hurt':
      tone(context, master, { type: 'sawtooth', from: 300, to: 120, peak: 0.3, attack: 0.001, release: 0.14, startAt: t })
      break
    case 'death':
      tone(context, master, { type: 'sawtooth', from: 300, to: 70, peak: 0.32, attack: 0.002, release: 0.5, startAt: t })
      break
    case 'splash':
      noiseHit(context, master, { peak: 0.45, attack: 0.005, release: 0.4, startAt: t, filterType: 'bandpass', freq: 900, q: 0.7 })
      tone(context, master, { type: 'sine', from: 600, to: 200, peak: 0.15, attack: 0.01, release: 0.35, startAt: t })
      break
    case 'pickup':
      tone(context, master, { type: 'square', from: 660, to: 660, peak: 0.24, attack: 0.001, release: 0.08, startAt: t })
      tone(context, master, { type: 'square', from: 880, to: 880, peak: 0.24, attack: 0.001, release: 0.1, startAt: t + 0.07 })
      tone(context, master, { type: 'square', from: 1320, to: 1320, peak: 0.2, attack: 0.001, release: 0.12, startAt: t + 0.14 })
      break
    case 'nearMiss':
      noiseHit(context, master, { peak: 0.28, attack: 0.02, release: 0.25, startAt: t, filterType: 'bandpass', freq: 1200, q: 4 })
      break
  }
}

/** Resume the audio context — call once from a user-gesture handler so
 * browsers allow sound to play. */
export function resume(): void {
  const context = ensureContext()
  if (context && context.state === 'suspended') {
    void context.resume().catch(() => {})
  }
}

export function isMuted(): boolean {
  return muted
}

export function setMuted(value: boolean): void {
  muted = value
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(MUTE_KEY, value ? '1' : '0')
  }
}

export function toggleMuted(): boolean {
  setMuted(!muted)
  return muted
}
