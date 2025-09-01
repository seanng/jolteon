'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { ScrollArea } from '@repo/design-system/components/ui/scroll-area';
import { Skeleton } from '@repo/design-system/components/ui/skeleton';
import VariationExpandableCard from '@repo/design-system/components/ui/variation-expandable-card';
import { Check, Send } from 'lucide-react';
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

export default function AIWebsiteBuilder() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Get next uncollected specification
  const getNextQuestion = useCallback(() => {
    const uncollected = Array.from(state.specifications.values()).find(
      (spec) => spec.required && !spec.collected
    );
    return uncollected?.question || null;
  }, [state.specifications]);

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

    // Ask first question
    const firstQuestion = getNextQuestion();
    if (firstQuestion) {
      await simulateAIResponse(firstQuestion);
      dispatch({ type: 'SET_CURRENT_QUESTION', question: firstQuestion });
    }
  }, [inputValue, addMessage, simulateAIResponse, getNextQuestion]);

  // Handle chat responses
  const handleChatSubmit = useCallback(async () => {
    if (!inputValue.trim()) return;

    const message = inputValue;
    addMessage('user', message);
    setInputValue('');

    // Find current specification being collected
    const currentSpec = Array.from(state.specifications.entries()).find(
      ([_, spec]) => spec.question === state.currentQuestion
    );

    if (currentSpec) {
      // Store the answer
      dispatch({
        type: 'SET_SPECIFICATION',
        key: currentSpec[0],
        value: message,
      });

      // Update specifications to mark as collected before getting next question
      const updatedSpecs = new Map(state.specifications);
      const spec = updatedSpecs.get(currentSpec[0]);
      if (spec) {
        spec.collected = true;
        updatedSpecs.set(currentSpec[0], spec);
      }

      // Get next uncollected question
      const nextUncollected = Array.from(updatedSpecs.values()).find(
        (spec) => spec.required && !spec.collected
      );
      const nextQuestion = nextUncollected?.question || null;

      if (nextQuestion) {
        // Ask next question
        await simulateAIResponse(nextQuestion);
        dispatch({ type: 'SET_CURRENT_QUESTION', question: nextQuestion });
      } else {
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
            "I've generated 4 variations for you. Please select the one you prefer!"
          );
        }, 3000);
      }
    }
  }, [
    inputValue,
    state.specifications,
    state.currentQuestion,
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

  // Render message
  const renderMessage = (message: Message) => (
    <div key={message.id} className="flex justify-start">
      {message.type === 'user' ? (
        <div className="max-w-[80%] rounded-lg bg-muted px-4 py-2">
          <p className="font-medium text-sm">{message.content}</p>
        </div>
      ) : (
        <div className="max-w-[80%]">
          <p className="font-medium text-sm">{message.content}</p>
        </div>
      )}
    </div>
  );

  // Phase 1: Initial chat bar
  if (state.phase === 'initial') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text font-bold text-4xl text-transparent">
              What's on your mind today?
            </h1>
            <p className="text-muted-foreground">
              Tell me about the website you want to create
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="I want to create a landing page for..."
                className="h-14 pr-24 text-lg"
                autoFocus
              />
              <Button
                type="submit"
                size="default"
                className="absolute top-2 right-2"
                disabled={!inputValue.trim()}
              >
                Submit
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
      <div className="flex h-[calc(100vh-57px)] flex-col bg-background">
        <ScrollArea className="flex-1 p-4">
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

        <div className="border-t">
          <form onSubmit={handleSubmit} className="relative mx-auto max-w-3xl">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message here..."
              className="h-14 rounded-none border-0 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button
              type="submit"
              size="icon"
              className="-translate-y-1/2 absolute top-1/2 right-4 h-8 w-8"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Phase 3: Split-view with variations
  return (
    <div className="flex h-[calc(100vh-57px)] overflow-hidden">
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

        <div className="border-t">
          <form onSubmit={handleSubmit} className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="h-14 rounded-none border-0 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              type="submit"
              size="icon"
              className="-translate-y-1/2 absolute top-1/2 right-4 h-8 w-8"
              disabled={!inputValue.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
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
