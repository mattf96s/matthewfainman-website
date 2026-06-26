import { describe, expect, it } from 'vitest'

import { absoluteUrl, seo, SITE } from './seo'

describe('absoluteUrl', () => {
  it('prefixes a root-relative path with the site URL', () => {
    expect(absoluteUrl('/og.png')).toBe(`${SITE.url}/og.png`)
  })

  it('adds a missing leading slash', () => {
    expect(absoluteUrl('og.png')).toBe(`${SITE.url}/og.png`)
  })

  it('passes absolute URLs through untouched', () => {
    expect(absoluteUrl('https://cdn.example.com/x.png')).toBe(
      'https://cdn.example.com/x.png',
    )
  })
})

describe('seo', () => {
  const propsOf = (r: ReturnType<typeof seo>) =>
    r.meta.map((m) => ('property' in m ? m.property : undefined))

  it('suffixes a page title but uses the bare default when none is given', () => {
    expect(seo({ title: 'About' }).meta.find((m) => 'title' in m)).toEqual({
      title: `About — ${SITE.titleSuffix}`,
    })
    expect(seo().meta.find((m) => 'title' in m)).toEqual({
      title: SITE.defaultTitle,
    })
  })

  it('emits OG image dimensions only for the default image', () => {
    expect(propsOf(seo())).toContain('og:image:width')
    expect(propsOf(seo({ image: '/custom.png' }))).not.toContain('og:image:width')
  })

  it('sets a canonical link from the path', () => {
    expect(seo({ path: '/about' }).links).toContainEqual({
      rel: 'canonical',
      href: `${SITE.url}/about`,
    })
  })
})
