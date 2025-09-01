import { keys as core } from '@repo/next-config/keys';
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const google = () =>
  createEnv({
    extends: [],
    client: {},
    server: {
      GOOGLE_SHEET_ID: z.string().min(1),
      GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL: z.string().min(1),
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: z.string().min(1),
    },
    runtimeEnv: {
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
      GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL:
        process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY:
        process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    },
  });

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
    google(),
  ],
  server: {},
  client: {},
  runtimeEnv: {
    // NODE_ENV: process.env.NODE_ENV,
    // NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    // NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
  },
});
