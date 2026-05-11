/**
 * Central SEO config + helpers.
 *
 * - `siteHead()` is used once by `__root.tsx` for non-page-specific meta
 *   (open graph type, site name, twitter card, locale, ...).
 * - `seo()` is called from every route's `head()` to set the page-specific
 *   title, description, OG/Twitter overrides, and canonical URL.
 *
 * Every route should call `seo()`; without it, the page will fall back to
 * the site defaults set in the root but won't have a canonical URL.
 */

export const SITE = {
  name: 'Matthew Fainman',
  /** Used for `<title>` suffixing, e.g. `About — Matthew Fainman`. */
  titleSuffix: 'Matthew Fainman',
  /** Default <title> shown when no per-route title is set. */
  defaultTitle: 'Matthew Fainman — Amsterdam Explorer',
  description:
    'Personal site of Matthew Fainman. Walk around a low-poly Amsterdam in the browser — dodge cyclists, trams, and the canals.',
  /** Production URL. Update if the canonical domain changes. */
  url: 'https://matthewfainman.com',
  locale: 'en_GB',
  twitterHandle: '',
  /** Path under public/ to a 1200×630 social preview image. */
  ogImage: '/og-image.png',
  themeColor: '#0e1f24',
} as const

export function absoluteUrl(path: string) {
  if (path.startsWith('http')) return path
  return `${SITE.url.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

/** Site-wide meta that doesn't change between pages. Spread into root head(). */
export function siteHead() {
  return {
    meta: [
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:locale', content: SITE.locale },
      { name: 'twitter:card', content: 'summary_large_image' },
      ...(SITE.twitterHandle
        ? [
            { name: 'twitter:site', content: SITE.twitterHandle },
            { name: 'twitter:creator', content: SITE.twitterHandle },
          ]
        : []),
    ],
  }
}

type SeoMeta = { title?: string; description?: string; image?: string; path?: string }

/** Per-page meta + canonical. Call from every route's `head()`. */
export function seo({ title, description, image, path }: SeoMeta = {}) {
  const fullTitle = title ? `${title} — ${SITE.titleSuffix}` : SITE.defaultTitle
  const desc = description ?? SITE.description
  const ogImg = absoluteUrl(image ?? SITE.ogImage)
  const canonical = absoluteUrl(path ?? '/')

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: desc },

      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImg },

      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: ogImg },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  }
}
