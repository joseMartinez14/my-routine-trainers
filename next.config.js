// next.config.mjs

const allowedOrigin = process.env.NODE_ENV === 'dev'
  ? 'http://localhost:5173'
  : 'https://my-routine-client.netlify.app';

const allowedDestination = process.env.NODE_ENV === 'dev'
  ? 'http://localhost:3000/api/client/:path*'
  : 'my-routine-trainers.vercel.app';

module.exports = {
  async headers() {
    return [
      {
        source: '/api/client/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: allowedOrigin,
          },
          {
            key: 'Vary',
            value: 'Origin', // important so CDN/browsers know the origin matters
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/client/:path*',
        destination: allowedDestination,
      },
    ];
  },
};