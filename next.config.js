// next.config.mjs

module.exports = {
  async headers() {
    return [
      {
        source: '/api/client/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'http://localhost:5173', // Set to a specific origin (e.g., localhost:5173)
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Allow these HTTP methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization', // Allow these headers
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true', // Allow cookies to be sent with requests
          },
        ],
      },
    ]
  },

  async rewrites() {
    return [
      {
        source: '/api/client/:path*',
        destination: 'http://localhost:3000/api/client/:path*', // Forward request to your backend
      },
    ];
  },
}
