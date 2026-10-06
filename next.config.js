// Permite las imágenes viejas guardadas en el disco del backend (/uploads/...),
// tomando el host de NEXT_PUBLIC_UPLOADS_URL para que funcione también en producción.
const uploadsUrl = new URL(process.env.NEXT_PUBLIC_UPLOADS_URL ?? 'http://localhost:3000');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/uploads/**' },
      {
        protocol: uploadsUrl.protocol.replace(':', ''),
        hostname: uploadsUrl.hostname,
        port: uploadsUrl.port,
        pathname: '/uploads/**',
      },
      { protocol: 'https', hostname: '*.amazonaws.com', pathname: '/**' },
    ],
  },
};

module.exports = nextConfig;
