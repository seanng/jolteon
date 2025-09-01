const features = [
  {
    title: 'Infinite Design, Instantly',
    description: 'Instantly generate and explore a multitude of design options. Find the perfect landing page for your business and compare variations with your client to match their brand perfectly.',
  },
  {
    title: 'Instant Inspiration, Zero Effort',
    description: 'Go from a simple prompt to multiple, ready-to-use landing page variations in a flash. Streamline your design process, get your page live faster, and eliminate manual design work.',
  },
  {
    title: 'From Design to Deployment in Seconds',
    description: 'Jolteon doesn’t just create beautiful designs—it generates clean, functional, and ready-to-deploy code. Launch your landing pages in a fraction of the time.',
  },
];

export const ValueProposition = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="container relative z-10 mx-auto">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-20 text-center">
            <h2 className="mb-5 font-bold font-headline text-5xl uppercase leading-[0.9] tracking-[-2px] md:text-7xl lg:text-[80px]">
              Launch in Seconds, Not Weeks
            </h2>
          </div>

          <div className="flex flex-col gap-32">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`grid items-center gap-12 md:grid-cols-5 md:gap-24`}
              >
                <div className={`md:col-span-2 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <h3 className="mb-4 font-bold font-headline text-4xl tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xl opacity-80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <div className={`md:col-span-3 rounded-lg border-2 border-primary/20 bg-background/50 p-4 shadow-2xl ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="aspect-video rounded-md bg-muted/50 flex items-center justify-center">
                    <p className="text-muted-foreground">Screenshot Placeholder</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
