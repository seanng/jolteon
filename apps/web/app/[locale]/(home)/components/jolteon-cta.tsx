'use client';

import { addToWaitlist } from '@/app/actions/waitlist';
import { EmailCaptureForm } from '@repo/design-system/components/ui/email-capture-form';
import { Countdown } from './countdown';

export const JolteonCTA = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-primary">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-[800px] text-center">
          <Countdown />
          <h2 className="text-black mb-5 font-bold font-headline text-5xl uppercase leading-[0.9] tracking-[-2px] md:text-7xl lg:text-[80px]">
            30 days free
          </h2>
          <p className="text-black mx-auto mb-12 max-w-[600px] font-body font-normal text-xl leading-relaxed opacity-80 md:text-2xl">
            Sign up to get a promo code for a 30-day free trial of Jolteon AI. Start creating landing pages in seconds.
          </p>
          <EmailCaptureForm onSubmit={addToWaitlist} buttonText="Get Promo Code" />
        </div>
      </div>
    </section>
  );
};
