interface KbdProps {
  children: React.ReactNode
}

/** A keycap pill for inline control hints. */
export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="mx-px inline-block rounded-md border border-white/25 bg-white/16 px-1.5 py-px font-[inherit] text-xs font-semibold">
      {children}
    </kbd>
  )
}
