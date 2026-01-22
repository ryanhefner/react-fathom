import { ImageResponse } from 'next/og'
import { getDocBySlug } from '@/lib/docs'

export const runtime = 'nodejs'
export const alt = 'react-fathom documentation'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug = [] } = await params
  const doc = getDocBySlug(slug)

  const title = doc?.frontmatter.title || 'react-fathom'
  const description = doc?.frontmatter.description || 'Privacy-focused analytics for React, Next.js, and React Native'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '80px',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              fontSize: '32px',
              fontWeight: 600,
              color: '#888',
            }}
          >
            react-fathom
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '28px',
            color: '#888',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}
        >
          {description}
        </div>

        {/* Footer gradient line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
