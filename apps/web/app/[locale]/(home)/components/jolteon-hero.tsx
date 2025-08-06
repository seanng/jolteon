'use client';

import { EmailCaptureForm } from '@repo/design-system/components/ui/email-capture-form';
import { EnergyParticles } from '@repo/design-system/components/ui/energy-particles';
import { HeroBadge } from '@repo/design-system/components/ui/hero-badge';
import { LightningBolt } from '@repo/design-system/components/ui/lightning-bolt';
import type { Dictionary } from '@repo/internationalization';

type JolteonHeroProps = {
  dictionary: Dictionary;
};

export const JolteonHero = ({ dictionary }: JolteonHeroProps) => {
  const handleEmailSubmit = (email: string) => {
    console.log('Email submitted:', email);
  };

  return (
    <section className="hero-section relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background px-4 py-20 md:px-15 md:py-32">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />

      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-[1400px] text-center">
          <HeroBadge>September Sale</HeroBadge>

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

          <EmailCaptureForm onSubmit={handleEmailSubmit} className="mb-20" />

          <div className="relative mt-16 h-[300px]">
            <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[200px] w-[400px] transform md:h-[300px] md:w-[600px]">
              <LightningBolt />
              <EnergyParticles />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
