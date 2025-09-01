import { keys as core } from '@repo/next-config/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [
    core(),
    // Uncomment these as you add the required API keys:
    // cms(),        // Requires: BASEHUB_TOKEN
    // email(),      // Requires: RESEND_FROM, RESEND_TOKEN
    // observability(), // Optional keys
    // flags(),      // Optional: FLAGS_SECRET
    // security(),   // Optional: ARCJET_KEY
    // rateLimit(),  // Optional: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
  ],
  server: {},
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    PORT: process.env.PORT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
  },
});
