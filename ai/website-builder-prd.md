# AI Website Builder - Product Requirements Document

## Executive Summary

### Project Overview
Create a working, clickable prototype of an AI-powered website builder that helps users generate customized websites through an intuitive conversational interface. The system will guide users from initial concept to realized website through iterative refinement of AI-generated variations.

### Goals
- Build a production-ready prototype that demonstrates core functionality
- Create an intuitive UX that progressively guides users through website creation
- Mock AI responses while maintaining architecture for future integration
- Enable users to iterate until they achieve their desired website design

### Target Implementation
`/apps/app/app/page.tsx` - Single page application within the Jolteon monorepo

## User Journey

### Phase 1: Initial Engagement
**Objective**: Capture user's initial intent with minimal friction

**User Experience**:
1. User lands on a clean, centered interface
2. Sees inviting prompt: "What's on your mind today?"
3. Types their initial website concept
4. Submits via Enter key or Submit button
5. Seamless transition to Phase 2

**Visual Design**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                                                 │
│                                                 │
│             What's on your mind today?          │
│                                                 │
│   ┌─────────────────────────────────────────┐   │
│   │                            [Submit]    │   │
│   └─────────────────────────────────────────┘   │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Phase 2: Specification Gathering
**Objective**: Collect necessary information through conversational AI

**User Experience**:
1. Chat interface expands to full screen with smooth animation
2. AI assistant asks clarifying questions one at a time
3. User provides responses naturally through chat
4. System tracks specifications internally
5. Transitions to Phase 3 once all requirements gathered

**Required Specifications Checklist**:
- [ ] Brand/Company name
- [ ] Target audience
- [ ] Primary purpose (marketing, e-commerce, portfolio, etc.)
- [ ] Desired sections (hero, features, testimonials, pricing, etc.)
- [ ] Color preferences
- [ ] Content tone (professional, casual, playful, technical)
- [ ] Any specific features or functionality

**Visual Design**:
```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────────────────────────────┐      │
│  │ User: Create a simple 1 page landing page                                   │      │
│  └─────────────────────────────────────────────────────────────────────────────┘      │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐      │
│  │ AI: Sure! What sections should the landing page comprise of?                │      │
│  └─────────────────────────────────────────────────────────────────────────────┘      │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐      │
│  │ Type your message here...                                      [Submit]     │      │
│  └─────────────────────────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Phase 3: Iterative Design Refinement
**Objective**: Generate and refine website variations based on user preferences

**User Experience**:
1. Screen splits into two panels (chat left, preview right)
2. AI generates multiple variations based on specifications
3. User reviews variations in grid layout
4. User selects preferred variation
5. AI asks for refinement preferences
6. Process repeats until user satisfaction achieved

**Workflow Loop**:
1. User enters refinement prompt → 
2. AI asks clarifying questions (if needed) → 
3. Preview shows "generating" state → 
4. Variations displayed in grid → 
5. User selects preference → 
6. Loop continues or finalize

**Visual Design**:
```
┌─────────────────────────┬─────────────────────────────────────────────────────────────────────┐
│ Chat History            │ ┌─────────────────────────┐ ┌─────────────────────────┐           │
│                         │ │                         │ │                         │           │
│ AI: Please choose       │ │       Variation 1       │ │       Variation 2       │           │
│ one of the designs.     │ │      (iframe/image)     │ │      (iframe/image)     │           │
│                         │ └─────────────────────────┘ └─────────────────────────┘           │
│                         │                                                                     │
│                         │ ┌─────────────────────────┐ ┌─────────────────────────┐           │
│                         │ │       Variation 3       │ │       Variation 4       │           │
│                         │ │      (iframe/image)     │ │      (iframe/image)     │           │
│ ┌─────────────────────┐ │ └─────────────────────────┘ └─────────────────────────┘           │
│ │Type message... [▶]  │ │                                                                     │
│ └─────────────────────┘ │                            [Confirm Selection]                      │
└─────────────────────────┴─────────────────────────────────────────────────────────────────────┘
```

## Functional Requirements

### Core Features

#### 1. Chat Interface
- **Input Field**: 
  - Auto-expanding textarea
  - Enter to submit (Shift+Enter for new line)
  - Character limit: 500 characters
  - Clear button when text present
  
- **Message Display**:
  - Distinguish user vs AI messages visually
  - Timestamps for each message
  - Smooth scroll to latest message
  - Message history preservation across phases

#### 2. AI Assistant Behavior
- **Conversation Management**:
  - One question at a time approach
  - Context-aware follow-ups
  - Graceful handling of ambiguous responses
  - Specification validation before generation

- **Response Patterns**:
  - Greeting and acknowledgment
  - Clarification requests
  - Progress indicators
  - Confirmation messages

#### 3. Variation Generation
- **Display Options**:
  - Grid layout (responsive: 1-3 columns)
  - Consistent aspect ratio (16:9)
  - Smooth loading animations
  - Hover effects for interactivity

- **Content Types**:
  - HTML preview in iframes
  - Static image mockups
  - Mixed content support

#### 4. Selection Mechanism
- **Interaction**:
  - Click to select variation
  - Visual feedback on selection
  - Confirmation button activation
  - Deselection capability

### State Management

#### Application States
```typescript
type ApplicationPhase = 'initial' | 'chat' | 'split-view';

type MessageType = 'user' | 'assistant' | 'system';

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

interface Specification {
  key: string;
  value: string;
  required: boolean;
  collected: boolean;
}

interface Variation {
  id: string;
  type: 'html' | 'image';
  content: string; // HTML string or image URL
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
  variationState: 'idle' | 'generating' | 'ready' | 'error';
  selectedVariation: string | null;
  iterationCount: number;
}
```

### Animations & Transitions

#### Phase Transitions
1. **Initial → Chat**:
   - Duration: 600ms
   - Effect: Expand from center to full screen
   - Easing: ease-in-out

2. **Chat → Split-view**:
   - Duration: 800ms
   - Effect: Contract chat to left, reveal preview panel
   - Easing: ease-out

#### Loading States
- Skeleton loaders for variations
- Pulsing animation during generation
- Staggered fade-in for variation appearance

## Technical Specifications

### Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: @repo/design-system (existing)
- **State**: React hooks (useState, useEffect, useReducer)

### Component Architecture

```typescript
// Main component structure
export default function AIWebsiteBuilder() {
  // State management
  const [appState, dispatch] = useReducer(appReducer, initialState);
  
  // Phase-specific renderers
  const renderInitialPhase = () => { /* ... */ };
  const renderChatPhase = () => { /* ... */ };
  const renderSplitView = () => { /* ... */ };
  
  // Main render logic
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {appState.phase === 'initial' && renderInitialPhase()}
      {appState.phase === 'chat' && renderChatPhase()}
      {appState.phase === 'split-view' && renderSplitView()}
    </div>
  );
}
```

### Mock Data Structure

#### Sample AI Responses
```typescript
const aiResponses = {
  greeting: "Great! I'd love to help you create a landing page. Let me gather some information to build exactly what you need.",
  
  questions: [
    "What's the name of your brand or company?",
    "Who is your target audience?",
    "What sections would you like? (e.g., Hero, Features, Testimonials, Pricing, Contact)",
    "Do you have any color preferences?",
    "What tone should the content have? (Professional, Casual, Playful, Technical)",
  ],
  
  generating: "Perfect! I have all the information I need. Let me generate some variations for you...",
  
  selection: "Excellent choice! Would you like to refine this design further, or are you happy with it?",
  
  refinement: "What aspects would you like to adjust? (layout, colors, content, sections)",
};
```

#### Sample Variations
```typescript
const mockVariations = [
  {
    id: 'var-1',
    type: 'html',
    content: `
      <div style="font-family: system-ui; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <h1 style="color: white; font-size: 3rem;">Your Brand Here</h1>
        <p style="color: rgba(255,255,255,0.9);">Empowering your success</p>
      </div>
    `,
    metadata: {
      style: 'modern-gradient',
      features: ['hero', 'cta'],
    },
  },
  // Additional variations...
];
```

## UI/UX Requirements

### Design System Integration
- Use existing Jolteon design tokens
- Apply electric yellow (#FFD60A) as primary accent
- Maintain consistent spacing using Tailwind utilities
- Follow established button and input patterns

### Responsive Design
- **Mobile (< 768px)**:
  - Single column layout
  - Full-width chat interface
  - Stack variations vertically
  
- **Tablet (768px - 1024px)**:
  - 2-column variation grid
  - Adjusted chat width in split view
  
- **Desktop (> 1024px)**:
  - 3-column variation grid
  - Optimal 40/60 split for chat/preview

### Accessibility
- Keyboard navigation support
- ARIA labels for interactive elements
- Focus management during phase transitions
- Screen reader announcements for state changes

## Mock Implementation Details

### Simulated Delays
```typescript
const delays = {
  aiResponse: 800,      // Typing indicator before response
  generation: 3000,     // Variation generation time
  transition: 600,      // Phase transition duration
};
```

### Conversation Flow Logic
```typescript
function getNextQuestion(specifications: Map<string, Specification>): string | null {
  const unanswered = Array.from(specifications.values())
    .filter(spec => spec.required && !spec.collected);
  
  if (unanswered.length === 0) return null;
  
  return unanswered[0].key;
}
```

## Success Metrics

### Prototype Validation
- [ ] All three phases functional and connected
- [ ] Smooth transitions between phases
- [ ] Chat history preserved throughout session
- [ ] At least 4 variations displayed in grid
- [ ] Selection and confirmation mechanism working
- [ ] Responsive design across breakpoints
- [ ] Mock delays creating realistic feel

### User Experience Goals
- [ ] Time from landing to first variation: < 2 minutes
- [ ] Clear visual hierarchy in all phases
- [ ] Intuitive navigation without instructions
- [ ] Professional appearance matching Jolteon brand

## Future Considerations

### Production Implementation
1. **AI Integration**:
   - Connect to actual LLM API
   - Implement prompt engineering
   - Add context management
   
2. **Variation Generation**:
   - Integration with design generation service
   - Real HTML/CSS generation
   - Component library integration
   
3. **Persistence**:
   - Save conversation history
   - Store user preferences
   - Export functionality
   
4. **Enhanced Features**:
   - Undo/redo functionality
   - A/B testing variations
   - Collaborative editing
   - Version control
   
5. **Performance**:
   - Code splitting for phases
   - Lazy loading variations
   - WebSocket for real-time updates

## Implementation Timeline

### Milestone 1: Phase 1 Implementation
- Initial chat bar UI
- Jolteon styling integration
- Form submission handling
- Transition trigger setup

### Milestone 2: Phase 2 Implementation  
- Full-screen chat expansion
- Message history display
- AI response simulation
- Specification tracking

### Milestone 3: Phase 3 Implementation
- Split-view layout
- Variation grid display
- Selection mechanism
- Loading states

### Milestone 4: Polish & Testing
- Animation refinement
- Responsive adjustments
- Edge case handling
- Cross-browser testing

## Appendix

### File Location
```
/apps/app/app/page.tsx
```

### Dependencies
- React 18+
- Next.js 15
- @repo/design-system components
- Tailwind CSS v4
- TypeScript 5+

### Environment Variables
None required for prototype (all mocked)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Status: Ready for Implementation*