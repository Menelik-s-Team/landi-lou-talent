import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Landi-Lou Talent Agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#06080f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Gold radial glow */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Gold top line */}
        <div style={{ width: 80, height: 2, background: '#c9a84c', marginBottom: 40, display: 'flex' }} />

        {/* Agency name */}
        <div style={{ fontSize: 72, fontWeight: 700, color: '#f0ead8', letterSpacing: 2, marginBottom: 12, display: 'flex' }}>
          Landi-Lou
        </div>
        <div style={{ fontSize: 20, color: '#c9a84c', letterSpacing: 8, textTransform: 'uppercase', marginBottom: 40, display: 'flex' }}>
          Talent Agency
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 24, color: '#9ba9bb', letterSpacing: 1, textAlign: 'center', maxWidth: 700, lineHeight: 1.5, display: 'flex' }}>
          We Curate Talent. We Protect Legacy.
        </div>

        {/* Gold bottom line */}
        <div style={{ width: 80, height: 2, background: '#c9a84c', marginTop: 40, display: 'flex' }} />

        {/* Domain */}
        <div style={{ position: 'absolute', bottom: 40, fontSize: 16, color: '#9ba9bb', letterSpacing: 3, display: 'flex' }}>
          landiloutalentagency.com
        </div>
      </div>
    ),
    { ...size }
  )
}
