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
  defaultTitle: 'Matthew Fainman',
  description:
    'I build software in Amsterdam.',
  /** Production URL. Update if the canonical domain changes. */
  url: 'https://matthewfainman.dev',
  locale: 'en_GB',
  twitterHandle: '',
  /** Path under public/ to a 1200×630 social preview image. */
  ogImage: '/og-image.png',
  /** Intrinsic size of the OG image. Lets scrapers render the card without downloading first. */
  ogImageWidth: 1200,
  ogImageHeight: 630,
  /** Accessible description of the OG image, shown by screen readers on link previews. */
  ogImageAlt: 'Illustration of Amsterdam canal houses reflected in the water',
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
      { name: 'theme-color', content: SITE.themeColor },
      ...(SITE.twitterHandle
        ? [
            { name: 'twitter:site', content: SITE.twitterHandle },
            { name: 'twitter:creator', content: SITE.twitterHandle },
          ]
        : []),
    ],
  }
}

type SeoMeta = {
  title?: string
  description?: string
  image?: string
  /** Alt text for a per-page `image` override. Falls back to the site default. */
  imageAlt?: string
  path?: string
}

/** Per-page meta + canonical. Call from every route's `head()`. */
export function seo({ title, description, image, imageAlt, path }: SeoMeta = {}) {
  const fullTitle = title ? `${title} — ${SITE.titleSuffix}` : SITE.defaultTitle
  const desc = description ?? SITE.description
  const ogImg = absoluteUrl(image ?? SITE.ogImage)
  const ogAlt = imageAlt ?? SITE.ogImageAlt
  const canonical = absoluteUrl(path ?? '/')
  // Width/height only apply to the default image; a per-page override may differ.
  const isDefaultImage = !image

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: desc },

      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: desc },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImg },
      { property: 'og:image:alt', content: ogAlt },
      ...(isDefaultImage
        ? [
            { property: 'og:image:width', content: String(SITE.ogImageWidth) },
            { property: 'og:image:height', content: String(SITE.ogImageHeight) },
          ]
        : []),

      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: ogImg },
      { name: 'twitter:image:alt', content: ogAlt },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  }
}