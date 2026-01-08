# Backend Integration TODO

This document outlines pending backend integrations for the ceremony contribution flow.

## Overview

The UI/UX for the contribution flow is complete. The following tasks require backend API integration.

---

## 1. Project Creation

**File**: `apps/frontend/app/coordinator/page.tsx`

### Lines 54, 63-64

```typescript
// Line 54: Add user-facing error notification
catch (error) {
  console.error("Failed to create project:", error);
  // TODO: Show error notification to user
}

// Lines 63-64: Fetch ceremony counts from API
ceremoniesCount: 0, // TODO: Get from ceremonies API
activeCeremoniesCount: 0, // TODO: Get from ceremonies API
```

**Required**:

- Display error messages to user on project creation failure
- Fetch ceremony counts for each project from backend

---

## 2. Ceremony Creation

**Status**: Form needs backend connection

**Required**:

- Connect ceremony creation form to POST `/ceremonies` endpoint
- Handle form validation and error states

---

## 3. Navigation to Contribution Page

**File**: `apps/frontend/app/ceremonies/[slug]/page.tsx`

### Lines 105-110

```typescript
// Current: Button has no onClick handler
<Button variant="black" className="uppercase">
  Contribute on Browser
</Button>

// Required: Add navigation
<Button
  variant="black"
  className="uppercase"
  onClick={() => router.push(`/ceremonies/${slug}/contribute`)}
>
  Contribute on Browser
</Button>
```

**Required**:

- Add click handler to navigate to contribution page
- Import and use `useRouter` from `next/navigation`

---

## 4. Contribution Page - Data Fetching

**File**: `apps/frontend/app/ceremonies/[slug]/contribute/page.tsx`

### Lines 37-39

```typescript
// Current: Mock data
const [currentStep, setCurrentStep] = useState(3);
const [completedCircuits, setCompletedCircuits] = useState(12);
const totalCircuits = 32;

// Required: Fetch from API
const { data: ceremony } = useGetCeremonyById(slug);
const { data: contributionState } = useContributionState(slug);
```

**Required**:

- Fetch ceremony data (name, total circuits, etc.)
- Fetch current contribution state
- Display loading states

---

## 5. Real-time Progress Updates

**File**: `apps/frontend/app/ceremonies/[slug]/contribute/page.tsx`

**Required**:

- Implement WebSocket connection or polling for live updates
- Update `currentStep` based on contribution progress
- Update `completedCircuits` as circuits are processed

**Suggested approach**:

```typescript
useEffect(() => {
  const ws = new WebSocket(`ws://api/ceremonies/${slug}/contribute`);

  ws.onmessage = (event) => {
    const { step, circuitsCompleted } = JSON.parse(event.data);
    setCurrentStep(step);
    setCompletedCircuits(circuitsCompleted);
  };

  return () => ws.close();
}, [slug]);
```

---

## 6. Circuit Completion Tracking

**File**: `apps/frontend/app/ceremonies/[slug]/contribute/page.tsx`

**Required**:

- POST circuit completion events to backend
- Track which circuits have been completed
- Handle circuit verification status

---

## 7. Contribution Completion

**File**: `apps/frontend/app/ceremonies/[slug]/contribute/page.tsx`

**Required**:

- Detect when all circuits are completed (step 6)
- Show success message
- POST final contribution completion to backend
- Redirect or show next steps

---

## API Endpoints Needed

Based on the above requirements:

```
GET    /api/projects/:id/ceremonies       # Get ceremonies for a project
POST   /api/ceremonies                    # Create new ceremony
GET    /api/ceremonies/:slug              # Get ceremony details
GET    /api/ceremonies/:slug/contribution # Get contribution state
WS     /api/ceremonies/:slug/contribute   # Real-time updates
POST   /api/ceremonies/:slug/circuits/:id # Mark circuit complete
POST   /api/ceremonies/:slug/complete     # Complete contribution
```

---

## Notes

- All UI components are ready and functional with mock data
- Replace mock state with API calls
- Maintain existing component structure
- Add proper error handling and loading states
