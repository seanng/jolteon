"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@repo/design-system/hooks/use-outside-click";
import { Check, X } from "lucide-react";

interface VariationCard {
  id: string;
  title: string;
  description?: string;
  type: 'html' | 'image';
  content: string; // HTML srcDoc or image URL
  metadata?: {
    style: string;
    features: string[];
  };
}

interface VariationExpandableCardProps {
  cards: VariationCard[];
  onSelect: (cardId: string) => void;
  selectedId?: string | null;
}

export default function VariationExpandableCard({ 
  cards, 
  onSelect,
  selectedId 
}: VariationExpandableCardProps) {
  const [active, setActive] = useState<VariationCard | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => handleClose());

  const handleClose = () => {
    if (active?.type === 'html') {
      // For HTML cards, use a fade-out transition before closing
      setIsClosing(true);
      setTimeout(() => {
        setActive(null);
        setIsClosing(false);
      }, 150);
    } else {
      // For image cards, close immediately to allow smooth layout animation
      setActive(null);
    }
  };

  const handleSelect = (card: VariationCard) => {
    // Close the expanded view first, then trigger selection after animation
    handleClose();
    // Delay selection to allow close animation to complete
    setTimeout(() => {
      onSelect(card.id);
    }, 300);
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 h-full w-full z-[9999]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[10000] p-4">
            <motion.button
              key={`button-close-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="absolute top-4 right-4 flex items-center justify-center bg-white dark:bg-neutral-800 rounded-full h-10 w-10 z-[10001]"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </motion.button>
            
            <motion.div
              layoutId={active.type === 'image' ? `card-${active.id}-${id}` : undefined}
              ref={ref}
              className="w-full max-w-7xl h-full md:h-[85vh] flex flex-col bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden"
              initial={active.type === 'html' ? { opacity: 0, scale: 0.95 } : undefined}
              animate={{ opacity: isClosing ? 0 : 1, scale: 1 }}
              exit={active.type === 'html' ? { opacity: 0, scale: 0.95 } : undefined}
              transition={{
                type: active.type === 'html' ? "tween" : "spring",
                duration: active.type === 'html' ? 0.15 : undefined,
                stiffness: active.type === 'image' ? 350 : undefined,
                damping: active.type === 'image' ? 35 : undefined
              }}
            >
              {/* Use a placeholder div instead of layoutId for the preview to avoid iframe issues */}
              <div className="flex-1 relative">
                {active.type === 'html' ? (
                  <motion.div
                    className="w-full h-full"
                    animate={{ opacity: isClosing ? 0 : 1 }}
                    transition={{ duration: 0.1 }}
                  >
                    <iframe
                      srcDoc={active.content}
                      className="w-full h-full"
                      title={active.title}
                    />
                  </motion.div>
                ) : (
                  <motion.img
                    layoutId={`image-${active.id}-${id}`}
                    src={active.content}
                    alt={active.title}
                    className="w-full h-full object-cover"
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 35
                    }}
                  />
                )}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-6 border-t bg-white dark:bg-neutral-900"
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      {active.title}
                    </h3>
                    {active.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        {active.description}
                      </p>
                    )}
                    {active.metadata && (
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                          {active.metadata.style}
                        </span>
                        {active.metadata.features.map(feature => (
                          <span key={feature} className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleSelect(active)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Check className="h-5 w-5" />
                    Publish
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={card.type === 'image' ? `card-${card.id}-${id}` : undefined}
            key={card.id}
            onClick={() => setActive(card)}
            className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
              selectedId === card.id 
                ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
                : 'border-border hover:border-primary/50'
            }`}
            initial={card.type === 'html' ? { opacity: 1 } : undefined}
            whileHover={card.type === 'html' ? { scale: 1.02 } : undefined}
            transition={{
              type: card.type === 'html' ? "tween" : "spring",
              duration: card.type === 'html' ? 0.15 : undefined,
              stiffness: card.type === 'image' ? 350 : undefined,
              damping: card.type === 'image' ? 35 : undefined
            }}
          >
            <div className="aspect-video bg-neutral-50 dark:bg-neutral-800">
              {card.type === 'html' ? (
                <div className="relative w-full h-full overflow-hidden">
                  {/* Use a background gradient as placeholder for HTML content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
                    <iframe
                      srcDoc={card.content}
                      className="w-full h-full pointer-events-none scale-[0.3] origin-top-left"
                      style={{ width: '333%', height: '333%' }}
                      title={card.title}
                      loading="lazy"
                    />
                  </div>
                </div>
              ) : (
                <motion.img
                  layoutId={`image-${card.id}-${id}`}
                  src={card.content}
                  alt={card.title}
                  className="w-full h-full object-cover"
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 35
                  }}
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="font-semibold">{card.title}</p>
                  {card.description && (
                    <p className="text-sm opacity-90">{card.description}</p>
                  )}
                </div>
              </div>
              
              {/* Number badge */}
              <div className="absolute top-4 left-4 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              
              {selectedId === card.id && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black rounded-full p-2">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
