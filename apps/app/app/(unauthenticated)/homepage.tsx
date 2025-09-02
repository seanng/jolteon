import { Button } from '@repo/design-system/components/ui/button';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import VariationExpandableCard from '@repo/design-system/components/ui/variation-expandable-card';
import { Check, Send } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';

// Types
type ApplicationPhase = 'initial' | 'chat' | 'split-view';
type MessageType = 'user' | 'assistant' | 'system';
type VariationState = 'idle' | 'generating' | 'ready' | 'error';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface Specification {
  key: string;
  question: string;
  value: string;
  required: boolean;
  collected: boolean;
}

interface Variation {
  id: string;
  type: 'html' | 'image';
  content: string;
  metadata: {
    style: string;
    features: string[];
  };
}

interface ApplicationState {
  phase: ApplicationPhase;
  messages: Message[];
  specifications: Map<string, Specification>;
  currentQuestion: string | null;
  variations: Variation[];
  variationState: VariationState;
  selectedVariation: string | null;
  iterationCount: number;
}

// Mock Data
const aiResponses = {
  greeting:
    "Great! I'd love to help you create your website. Let me gather some information to build exactly what you need.",
  allQuestions: `Please answer the following questions to help me create your website:

1. What's the name of your brand or company?
2. Who is your target audience?
3. What sections would you like? (e.g., Hero, Features, Testimonials, Pricing, Contact)
4. What colors would you prefer?
5. What tone should the content have? (Professional, Casual, Playful, Technical)`,
  questions: {
    brand: "What's the name of your brand or company?",
    audience: 'Who is your target audience?',
    sections:
      'What sections would you like? (e.g., Hero, Features, Testimonials, Pricing, Contact)',
    colors: 'Do you have any color preferences?',
    tone: 'What tone should the content have? (Professional, Casual, Playful, Technical)',
  },
  generating:
    'Perfect! I have all the information I need. Let me generate some variations for you...',
  selection:
    'Excellent choice! Would you like to refine this design further, or are you happy with it?',
  refinement:
    'What aspects would you like to adjust? (layout, colors, content, sections)',
};

const mockVariations: Variation[] = [
  {
    id: 'var-1',
    type: 'html',
    content: `
      <html>
        <body style="margin: 0; font-family: system-ui;">
          <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 4rem 2rem; text-align: center;">
            <h1 style="color: white; font-size: 3.5rem; margin-bottom: 1rem;">Your Brand</h1>
            <p style="color: rgba(255,255,255,0.9); font-size: 1.25rem; margin-bottom: 2rem;">Empowering your success with innovative solutions</p>
            <button style="background: white; color: #667eea; border: none; padding: 1rem 2rem; font-size: 1.125rem; border-radius: 0.5rem; cursor: pointer;">Get Started</button>
          </div>
        </body>
      </html>
    `,
    metadata: {
      style: 'modern-gradient',
      features: ['hero', 'cta'],
    },
  },
  {
    id: 'var-2',
    type: 'html',
    content: `
      <html>
        <body style="margin: 0; font-family: system-ui;">
          <div style="min-height: 100vh; background: #000; color: white; padding: 4rem 2rem;">
            <nav style="display: flex; justify-content: space-between; margin-bottom: 4rem;">
              <div style="font-size: 1.5rem; font-weight: bold;">BRAND</div>
              <div style="display: flex; gap: 2rem;">
                <a style="color: white; text-decoration: none;">Features</a>
                <a style="color: white; text-decoration: none;">Pricing</a>
                <a style="color: white; text-decoration: none;">Contact</a>
              </div>
            </nav>
            <h1 style="font-size: 4rem; margin-bottom: 1rem;">Welcome to the Future</h1>
            <p style="font-size: 1.25rem; opacity: 0.8;">Transform your business with cutting-edge technology</p>
          </div>
        </body>
      </html>
    `,
    metadata: {
      style: 'dark-minimal',
      features: ['hero', 'navigation'],
    },
  },
  {
    id: 'var-3',
    type: 'html',
    content: `
      <html>
        <body style="margin: 0; font-family: Georgia, serif;">
          <div style="min-height: 100vh; background: #FFF8DC; padding: 4rem 2rem;">
            <header style="text-align: center; margin-bottom: 4rem;">
              <h1 style="color: #8B4513; font-size: 3rem; margin-bottom: 0.5rem;">Elegant Solutions</h1>
              <p style="color: #A0522D; font-size: 1.125rem; font-style: italic;">Crafted with precision and care</p>
            </header>
            <div style="max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
              <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="color: #8B4513;">Feature One</h3>
                <p style="color: #666;">Description of your amazing feature that provides value.</p>
              </div>
              <div style="background: white; padding: 2rem; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <h3 style="color: #8B4513;">Feature Two</h3>
                <p style="color: #666;">Another great feature that sets you apart from others.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    metadata: {
      style: 'classic-elegant',
      features: ['hero', 'features'],
    },
  },
  {
    id: 'var-4',
    type: 'html',
    content: `
      <html>
        <body style="margin: 0; font-family: system-ui;">
          <div style="min-height: 100vh; background: linear-gradient(135deg, #FFD60A 0%, #FFC300 100%); padding: 0;">
            <div style="background: rgba(0,0,0,0.1); padding: 4rem 2rem;">
              <h1 style="color: #000; font-size: 5rem; font-weight: 900; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: -0.05em;">Lightning Fast</h1>
              <p style="color: #333; font-size: 1.5rem; margin-bottom: 2rem;">Speed meets sophistication</p>
              <div style="display: flex; gap: 1rem;">
                <button style="background: #000; color: #FFD60A; border: none; padding: 1rem 2rem; font-size: 1.125rem; font-weight: bold; cursor: pointer;">Start Now</button>
                <button style="background: transparent; color: #000; border: 3px solid #000; padding: 1rem 2rem; font-size: 1.125rem; font-weight: bold; cursor: pointer;">Learn More</button>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    metadata: {
      style: 'electric-bold',
      features: ['hero', 'cta-buttons'],
    },
  },
];

// Initial state
const initialSpecifications = new Map<string, Specification>([
  [
    'brand',
    {
      key: 'brand',
      question: aiResponses.questions.brand,
      value: '',
      required: true,
      collected: false,
    },
  ],
  [
    'audience',
    {
      key: 'audience',
      question: aiResponses.questions.audience,
      value: '',
      required: true,
      collected: false,
    },
  ],
  [
    'sections',
    {
      key: 'sections',
      question: aiResponses.questions.sections,
      value: '',
      required: true,
      collected: false,
    },
  ],
  [
    'colors',
    {
      key: 'colors',
      question: aiResponses.questions.colors,
      value: '',
      required: true,
      collected: false,
    },
  ],
  [
    'tone',
    {
      key: 'tone',
      question: aiResponses.questions.tone,
      value: '',
      required: true,
      collected: false,
    },
  ],
]);

const initialState: ApplicationState = {
  phase: 'initial',
  messages: [],
  specifications: initialSpecifications,
  currentQuestion: null,
  variations: [],
  variationState: 'idle',
  selectedVariation: null,
  iterationCount: 0,
};

// Reducer actions
type Action =
  | { type: 'SET_PHASE'; phase: ApplicationPhase }
  | { type: 'ADD_MESSAGE'; message: Message }
  | { type: 'SET_SPECIFICATION'; key: string; value: string }
  | { type: 'SET_CURRENT_QUESTION'; question: string | null }
  | { type: 'SET_VARIATIONS'; variations: Variation[] }
  | { type: 'SET_VARIATION_STATE'; state: VariationState }
  | { type: 'SELECT_VARIATION'; id: string | null }
  | { type: 'INCREMENT_ITERATION' }
  | { type: 'REORDER_AND_SELECT'; id: string };

// Reducer
function appReducer(state: ApplicationState, action: Action): ApplicationState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };
    case 'SET_SPECIFICATION': {
      const newSpecs = new Map(state.specifications);
      const spec = newSpecs.get(action.key);
      if (spec) {
        spec.value = action.value;
        spec.collected = true;
        newSpecs.set(action.key, spec);
      }
      return { ...state, specifications: newSpecs };
    }
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.question };
    case 'SET_VARIATIONS':
      return { ...state, variations: action.variations };
    case 'SET_VARIATION_STATE':
      return { ...state, variationState: action.state };
    case 'SELECT_VARIATION':
      return { ...state, selectedVariation: action.id };
    case 'INCREMENT_ITERATION':
      return { ...state, iterationCount: state.iterationCount + 1 };
    case 'REORDER_AND_SELECT': {
      const selectedIndex = state.variations.findIndex(
        (v) => v.id === action.id
      );
      if (selectedIndex === -1) return state;

      if (selectedIndex > 0) {
        // Swap selected card with first card
        const newVariations = [...state.variations];
        const selected = newVariations[selectedIndex];
        const first = newVariations[0];
        newVariations[0] = selected;
        newVariations[selectedIndex] = first;
        return {
          ...state,
          variations: newVariations,
          selectedVariation: action.id,
        };
      }
      return { ...state, selectedVariation: action.id };
    }
    default:
      return state;
  }
}

export function Homepage() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Add message helper
  const addMessage = useCallback((type: MessageType, content: string) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      type,
      content,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', message });
  }, []);

  // Simulate AI response with typing delay
  const simulateAIResponse = useCallback(
    async (response: string) => {
      setIsTyping(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
      addMessage('assistant', response);
      setIsTyping(false);
    },
    [addMessage]
  );

  // Handle initial submission
  const handleInitialSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;

    // Add user message
    addMessage('user', inputValue);
    setInputValue('');

    // Transition to chat phase
    dispatch({ type: 'SET_PHASE', phase: 'chat' });

    // AI greeting
    await simulateAIResponse(aiResponses.greeting);

    // Ask all questions at once
    await simulateAIResponse(aiResponses.allQuestions);
    dispatch({
      type: 'SET_CURRENT_QUESTION',
      question: aiResponses.allQuestions,
    });
  }, [inputValue, addMessage, simulateAIResponse]);

  // Handle chat responses
  const handleChatSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;

    const message = inputValue;
    addMessage('user', message);
    setInputValue('');

    // Check if we're collecting initial specifications
    if (state.currentQuestion === aiResponses.allQuestions) {
      // Mark all specifications as collected with the full response
      // In a real implementation, you'd parse the response more intelligently
      for (const [key] of state.specifications.entries()) {
        dispatch({
          type: 'SET_SPECIFICATION',
          key: key,
          value: message,
        });
      }

      // All specifications collected, generate variations
      await simulateAIResponse(aiResponses.generating);
      dispatch({ type: 'SET_PHASE', phase: 'split-view' });
      dispatch({ type: 'SET_VARIATION_STATE', state: 'generating' });

      // Simulate generation delay
      setTimeout(() => {
        dispatch({ type: 'SET_VARIATIONS', variations: mockVariations });
        dispatch({ type: 'SET_VARIATION_STATE', state: 'ready' });
        addMessage(
          'assistant',
          "I've generated 4 variations for you. Please comment on the designs and I will generate new variations based on your feedback."
        );
      }, 3000);
    }
  }, [
    inputValue,
    state.currentQuestion,
    state.specifications,
    addMessage,
    simulateAIResponse,
  ]);

  // Handle variation selection from expandable card
  const handleVariationSelect = useCallback(
    (variationId: string) => {
      const selected = state.variations.find((v) => v.id === variationId);
      if (selected) {
        // Reorder variations to put selected at index 0 and mark as selected
        dispatch({ type: 'REORDER_AND_SELECT', id: variationId });
        // addMessage(
        //   'user',
        //   `I like the ${selected.metadata.style} design`
        // );
        // simulateAIResponse(aiResponses.selection);
        dispatch({ type: 'INCREMENT_ITERATION' });
      }
    },
    [state.variations]
  );

  // Handle refinement
  const handleRefinementSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;

    addMessage('user', inputValue);
    setInputValue('');

    // Check if we have a published/selected card (first position)
    const hasPublishedCard = state.selectedVariation !== null;

    await simulateAIResponse(
      hasPublishedCard
        ? 'Keeping your selected design and generating new alternatives...'
        : 'Let me generate new variations based on your feedback...'
    );

    dispatch({ type: 'SET_VARIATION_STATE', state: 'generating' });

    // If we have a published card, immediately show placeholder cards for the ones being regenerated
    if (hasPublishedCard) {
      const publishedCard = state.variations[0];
      const placeholderVariations = [
        publishedCard,
        {
          id: 'loading-1',
          type: 'html' as const,
          content: '',
          metadata: { style: 'loading', features: [] },
        },
        {
          id: 'loading-2',
          type: 'html' as const,
          content: '',
          metadata: { style: 'loading', features: [] },
        },
        {
          id: 'loading-3',
          type: 'html' as const,
          content: '',
          metadata: { style: 'loading', features: [] },
        },
      ];
      dispatch({ type: 'SET_VARIATIONS', variations: placeholderVariations });
    }

    setTimeout(() => {
      // Generate new variations with unique IDs to avoid conflicts
      const timestamp = Date.now();
      const newGeneratedVariations = mockVariations
        .slice(0, 3)
        .map((v, index) => ({
          ...v,
          id: `var-refined-${timestamp}-${index + 1}`,
        }));

      // Keep the first variation (published) and add new ones
      const publishedVariation = hasPublishedCard ? state.variations[0] : null;
      const newVariations = publishedVariation
        ? [publishedVariation, ...newGeneratedVariations]
        : [...newGeneratedVariations, mockVariations[3]];

      dispatch({ type: 'SET_VARIATIONS', variations: newVariations });
      dispatch({ type: 'SET_VARIATION_STATE', state: 'ready' });
      addMessage(
        'assistant',
        'Here are the refined variations. Please select your favorite!'
      );
    }, 2500);
  }, [
    inputValue,
    addMessage,
    simulateAIResponse,
    state.variations,
    state.selectedVariation,
  ]);

  // Handle form submission based on phase
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (state.phase === 'initial') {
        handleInitialSubmit();
      } else if (state.phase === 'chat') {
        handleChatSubmit();
      } else if (state.phase === 'split-view') {
        handleRefinementSubmit();
      }
    },
    [state.phase, handleInitialSubmit, handleChatSubmit, handleRefinementSubmit]
  );

  // Handle keyboard events for multi-line input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (without Shift)
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
      // Shift+Enter adds a new line (default behavior)
    },
    []
  );

  // Render message
  const renderMessage = (message: Message) => (
    <div key={message.id} className="flex justify-start">
      {message.type === 'user' ? (
        <div className="max-w-[80%] rounded-lg bg-muted px-5 py-3">
          <p className="whitespace-pre-wrap font-body font-medium text-base">
            {message.content}
          </p>
        </div>
      ) : (
        <div className="max-w-[80%]">
          <p className="whitespace-pre-wrap font-body font-medium text-base">
            {message.content}
          </p>
        </div>
      )}
    </div>
  );

  // Phase 1: Initial chat bar
  if (state.phase === 'initial') {
    return (
      <div className="flex justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4 pt-40">
        <div className="w-full max-w-3xl space-y-12">
          <div className="text-center">
            <h1 className="mb-2 font-bold font-headline text-6xl text-white tracking-[-2px]">
              Describe the website you want to create.
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="hover:-translate-y-[3px] flex items-stretch gap-0 border-[3px] border-primary bg-background transition-all duration-300 hover:transform hover:border-primary hover:shadow-2xl">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="!border-0 !rounded-none !shadow-none min-h-[56px] flex-1 resize-none bg-transparent px-8 py-5 font-body outline-none placeholder:tracking-[1px] placeholder:opacity-50 focus-visible:border-0 focus-visible:ring-0 md:text-lg"
                autoFocus
              />
              <Button
                type="submit"
                // variant="electric"
                size="xl"
                className="hover:-translate-0 h-auto rounded-none py-5"
                disabled={!inputValue.trim()}
              >
                Create
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Phase 2: Full-screen chat
  if (state.phase === 'chat') {
    return (
      <div className="flex h-[calc(100vh-64px)] flex-col bg-background p-8">
        <ScrollArea className="flex-1">
          <div className="mx-auto max-w-3xl space-y-4">
            {state.messages.map(renderMessage)}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="mx-auto w-full max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative border-[3px] border-secondary bg-background shadow-lg transition-all duration-200 focus-within:border-primary focus-within:shadow-2xl hover:shadow-xl">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here... (Shift+Enter for new line)"
                className="max-h-[200px] min-h-[56px] w-full resize-none border-0 bg-transparent p-4 pr-16 font-body placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                autoFocus
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-2 h-10 w-10 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Phase 3: Split-view with variations
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Chat Panel */}
      <div className="flex w-2/5 flex-col overflow-hidden border-r">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {state.messages.map(renderMessage)}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative border-[3px] border-secondary bg-background shadow-lg transition-all duration-200 focus-within:border-primary focus-within:shadow-2xl hover:shadow-xl">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here... (Shift+Enter for new line)"
                className="max-h-[200px] min-h-[56px] w-full resize-none border-0 bg-transparent p-4 pr-16 font-body placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-2 h-10 w-10 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
                disabled={!inputValue.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {state.variationState === 'generating' &&
          state.variations.length === 0 ? (
            // Initial generation - show all skeletons
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="aspect-video rounded-lg" />
              ))}
            </div>
          ) : state.variations.length > 0 ? (
            // Check if we have loading placeholders
            state.variationState === 'generating' &&
            state.variations.some((v) => v.id.startsWith('loading-')) ? (
              // Show mixed content: real card + skeletons
              <div className="grid gap-4 md:grid-cols-2">
                {state.variations.map((v) =>
                  v.id.startsWith('loading-') ? (
                    <Skeleton key={v.id} className="aspect-video rounded-lg" />
                  ) : (
                    <div
                      key={v.id}
                      className="relative cursor-pointer overflow-hidden rounded-xl border-2 border-yellow-500 ring-2 ring-yellow-500/50"
                    >
                      <div className="aspect-video bg-neutral-50 dark:bg-neutral-800">
                        {v.type === 'html' ? (
                          <div className="relative h-full w-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
                              <iframe
                                srcDoc={v.content}
                                className="pointer-events-none h-full w-full origin-top-left scale-[0.3]"
                                style={{ width: '333%', height: '333%' }}
                                title={v.metadata.style}
                              />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={v.content}
                            alt={v.metadata.style}
                            className="h-full w-full object-cover"
                          />
                        )}
                        <div className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 font-semibold text-sm text-white">
                          1
                        </div>
                        <div className="absolute top-4 right-4 rounded-full bg-yellow-500 p-2 text-black">
                          <Check className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              // Normal state - show all cards with VariationExpandableCard
              <VariationExpandableCard
                cards={state.variations.map((v) => ({
                  id: v.id,
                  title: v.metadata.style
                    .split('-')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                  description: `Features: ${v.metadata.features.join(', ')}`,
                  type: v.type,
                  content: v.content,
                  metadata: v.metadata,
                }))}
                onSelect={handleVariationSelect}
                selectedId={state.selectedVariation}
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>Variations will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
