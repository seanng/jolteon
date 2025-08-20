import { config } from '@repo/next-config';

// let nextConfig: NextConfig = withToolbar(withLogging(config));
// const nextConfig: NextConfig = withToolbar(config);

// if (env.VERCEL) {
//   nextConfig = withSentry(nextConfig);
// }

// if (env.ANALYZE === 'true') {
//   nextConfig = withAnalyzer(nextConfig);
// }

// export default nextConfig;
export default config;
