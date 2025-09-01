'use client';

import { EmailCaptureForm } from '@repo/design-system/components/ui/email-capture-form';

export const JolteonCTA = () => {
  const handleEmailSubmit = (email: string) => {
    console.log('Email submitted:', email);
    // Here you would typically send the email to your backend
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-32" style={{backgroundColor: '#FFC300'}}>
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-[800px] text-center">
          <h2 className="text-black mb-5 font-bold font-headline text-5xl uppercase leading-[0.9] tracking-[-2px] md:text-7xl lg:text-[80px]">
            Join the Waitlist
          </h2>
          <p className="text-black mx-auto mb-12 max-w-[600px] font-body font-normal text-xl leading-relaxed opacity-80 md:text-2xl">
            Sign up to get early access to Jolteon AI and start creating landing pages in seconds.
          </p>
          <EmailCaptureForm onSubmit={handleEmailSubmit} buttonText="Join waitlist" />
        </div>
      </div>
    </section>
  );
};
