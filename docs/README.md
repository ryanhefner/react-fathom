# Documentation site

## Open Graph image capture

`/og-image` is a dedicated **1200 × 630** page for OpenGraphs screenshots.
It uses the site's Suisse font kit and Chakra theme, with a fixed black/white
palette independent of system color mode. Navigation, footers, analytics, and
the event stream are intentionally absent.

Capture `https://react-fathom.dev/og-image` after deployment, using a 1200 × 630
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

### Page-specific social images

The static export generates extensionless HTML capture routes for every
published page, using the matching page's title and description:

```text
/social-image                          -> home capture
/docs/social-image                     -> Introduction capture
/docs/getting-started/social-image     -> Getting Started capture
/docs/nextjs/app-router/social-image    -> App Router capture
/withoss/social-image                  -> Open-source credits capture
```

Equivalent internal templates live at `/og-image/<page-route>`, such as
`/og-image/docs/nextjs/app-router`. The root `/og-image` and `/social-image`
retain the site's marketing headline. Query overrides work on every template.
Draft, hidden, and unknown pages do not produce capture files. All templates
are marked `noindex, nofollow` and omit analytics, navigation, footers, and the
event stream. New documentation pages automatically receive both capture
paths on the next build.

For the OpenGraphs flow, use `/<page>/social-image.png` as the template URL in
the renderer integration. OpenGraphs captures the corresponding extensionless
HTML route and serves the resulting PNG. This site does not generate PNG bytes
or serve HTML as a `.png` file. Existing image metadata remains unchanged until
the public renderer is configured.

No Next rewrites or running Next server are required: deploy the `out/`
directory and configure the static host to resolve extensionless paths to their
exported `.html` files (for example,
`/docs/nextjs/app-router/social-image.html`). Unknown paths and `.png` requests
must return 404 rather than an SPA fallback. If supported, add
`X-Robots-Tag: noindex, nofollow` response headers for the capture paths too;
Next response headers are not available with `output: 'export'`.
