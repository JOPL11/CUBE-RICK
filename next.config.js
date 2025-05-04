/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Disable Next.js font optimization
  optimizeFonts: false,
  
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ttf|eot|woff|woff2)$/,
      type: 'asset/resource',
      generator: {
        // Preserve original font filenames and paths
        filename: '[path][name][ext]'
      }
    });
    return config;
  },
}

export default nextConfig;
