'use server';

import { env } from '@/env';
// import { resend } from '@repo/email';
// import { ContactTemplate } from '@repo/email/templates/contact';
import { parseError } from '@repo/observability/error';
// import { createRateLimiter, slidingWindow } from '@repo/rate-limit';
// import { headers } from 'next/headers';

export const contact = async (
  name: string,
  email: string,
  message: string
): Promise<{
  error?: string;
}> => {
  try {
    // Rate limiting disabled - uncomment when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are available
    // if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    //   const rateLimiter = createRateLimiter({
    //     limiter: slidingWindow(1, '1d'),
    //   });
    //   const head = await headers();
    //   const ip = head.get('x-forwarded-for');

    //   const { success } = await rateLimiter.limit(`contact_form_${ip}`);

    //   if (!success) {
    //     throw new Error(
    //       'You have reached your request limit. Please try again later.'
    //     );
    //   }
    // }

    // Email sending disabled - uncomment when RESEND_FROM and RESEND_TOKEN are available
    // await resend.emails.send({
    //   from: env.RESEND_FROM,
    //   to: env.RESEND_FROM,
    //   subject: 'Contact form submission',
    //   replyTo: email,
    //   react: <ContactTemplate name={name} email={email} message={message} />,
    // });
    
    // For now, just log the contact form submission
    console.log('Contact form submission:', { email, name, message });

    return {};
  } catch (error) {
    const errorMessage = parseError(error);

    return { error: errorMessage };
  }
};
