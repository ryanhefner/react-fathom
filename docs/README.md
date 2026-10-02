# Documentation site

## Open Graph image capture

`/og-image` is a dedicated **1200 × 630** page for OpenGraphs screenshots.
It uses the site's Suisse font kit and Chakra theme, with a fixed black/white
palette independent of system color mode. Navigation, footers, analytics, and
the event stream are intentionally absent.

Capture `https://react-fathom.com/og-image` after deployment, using a 1200 × 630
viewport. The local preview is `http://react-fathom.test/og-image`.
A hosted capture service needs a publicly reachable URL; `.test` domains are
for local review only. Wait for `[data-og-ready="true"]` before capturing (or
allow a short capture delay). This signals that the current copy has hydrated,
web fonts have settled, and the wordmark has decoded. The font kit must allow
the capture page's hostname.

Optional `title` and `description` query parameters customize the copy:

```text
/og-image?title=React%20Native&description=Privacy-focused%20analytics%20for%20native%20apps.
```

Whitespace is normalized, blank values use the defaults, and titles/descriptions
are limited to 100/200 Unicode code points with visual line clamping. Values are
rendered as plain text. The default card also renders without JavaScript;
query overrides require JavaScript, so capture after hydration.

The capture route is excluded from the sitemap and marked `noindex`.
Existing Open Graph metadata still points at `/og-image.svg`. Once you generate
a PNG or JPEG (or have an OpenGraphs image URL), update `app/layout.tsx` and
`lib/site-metadata.ts` to use the actual image URL—not the HTML capture page.
