/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  output: 'export',
  
  // ▼▼▼ ADD THESE NEW OPTIONS ▼▼▼
  basePath: '/2/next', // 1. Set this to your server subdirectory path (e.g. '/my-app')
  assetPrefix: '/2/next/', // 2. Must match basePath with trailing slash
  trailingSlash: true, // 3. Ensures consistent URLs
  
  // CORS headers for static assets
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { 
          key: 'Access-Control-Allow-Origin', 
          value: '*' 
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: 'Origin, X-Requested-With, Content-Type, Accept'
        }
      ],
    },
  ],
  // ▲▲▲ END OF NEW OPTIONS ▲▲▲

  webpack: (config, { isServer }) => {
    // ▼ Your existing font loader ▼
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          publicPath: '/2/next/static/fonts/', // ← Updated path
          outputPath: 'static/fonts/',
        },
      },
    });

    // ▼ Your existing Three.js aliases ▼
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': path.resolve('./node_modules/three'),
      'three/examples/jsm': path.resolve('./node_modules/three/examples/jsm'),
      '@react-three/fiber': path.resolve('./node_modules/@react-three/fiber'),
      '@react-three/drei': path.resolve('./node_modules/@react-three/drei')
    };

    // ▼ Your existing SSR disable for Three.js ▼
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push(({ context, request }, callback) => {
        if (/^three/.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      });
    }

    return config;
  },
  experimental: {
    esmExternals: 'loose',
    appDir: true
  }
};

export default nextConfig;