'use client';

import { EmailCaptureForm } from '@repo/design-system/components/ui/email-capture-form';
import type { Dictionary } from '@repo/internationalization';
import { Play } from 'lucide-react';
import { addToWaitlist } from '@/app/actions/waitlist';

type JolteonHeroProps = {
  dictionary: Dictionary;
};

export const JolteonHero = ({ dictionary }: JolteonHeroProps) => {
  return (
    <section className="hero-section relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background px-4 py-20 md:py-32">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />

      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-[1400px] text-center">
          <h1 className="mb-5 font-bold font-headline text-6xl uppercase leading-[0.9] tracking-[-2px] md:text-8xl lg:text-[96px]">
            <span className="relative block">Create at the</span>
            <span className="hero-title-highlight -skew-x-[5deg] relative my-2.5 block transform text-primary md:my-5">
              SPEED OF THOUGHT
            </span>
            <span className="relative block">With Jolteon</span>
          </h1>

          <p className="mx-auto mb-12 max-w-[600px] font-body font-normal text-xl leading-relaxed opacity-80 md:text-2xl">
            Deliver perfect branded websites for your clients. Powered by AI.
          </p>

          <div className="relative z-10">
            <EmailCaptureForm
              onSubmit={addToWaitlist}
              buttonText="Join waitlist"
            />
          </div>

          <div className="demo-area-wrapper mt-16 py-24">
            <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-lg border-2 border-primary/20 bg-background/50 shadow-2xl">
              <div className="flex h-full w-full items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
                  <Play className="h-12 w-12 text-primary" fill="currentColor" />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
