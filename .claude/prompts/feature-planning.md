# Feature Planning Prompt Template

Use this template when planning new features for React Mosaic.

## Feature Planning Steps

### 1. Requirements Analysis
- What is the feature?
- What problem does it solve?
- Who is the target user?
- What are the acceptance criteria?

### 2. API Design
- What new types are needed?
- What new components are needed?
- What new utilities are needed?
- How will users consume this feature?
- Is it a breaking change?

### 3. Implementation Plan

#### Files to Create
- [ ] Component file(s)
- [ ] Type definitions
- [ ] Utility functions
- [ ] Test files
- [ ] Style files

#### Files to Modify
- [ ] `index.ts` (exports)
- [ ] `types.ts` (if new types)
- [ ] Existing components (if integrating)
- [ ] Documentation

#### Testing Strategy
- Unit tests for utilities
- Component tests for React components
- Integration tests if needed
- Visual testing in demo app

### 4. Dependencies
- Any new npm packages needed?
- Any peer dependency changes?
- Build system changes?

### 5. Documentation Plan
- README updates
- API documentation
- Code examples
- Migration guide (if breaking)

### 6. Backwards Compatibility
- Is this a breaking change?
- Can we provide a migration path?
- Do we need deprecation warnings?

### 7. Performance Considerations
- Will this impact render performance?
- Are there expensive operations?
- Should we add memoization?

### 8. Accessibility Considerations
- Keyboard navigation support?
- Screen reader support?
- ARIA labels needed?
- Focus management?

## Implementation Order

1. **Phase 1: Types & Utilities**
   - Define new types
   - Implement utility functions
   - Write unit tests

2. **Phase 2: Components**
   - Implement core component
   - Add styles
   - Write component tests

3. **Phase 3: Integration**
   - Export from index.ts
   - Integrate with existing components
   - Update context if needed

4. **Phase 4: Documentation**
   - Update README
   - Add code examples
   - Update QUICKREF

5. **Phase 5: Testing**
   - Visual testing in demo app
   - Cross-browser testing
   - Accessibility testing

## Example Plan Template

```markdown
## Feature: [Name]

### Overview
[1-2 sentence description]

### Requirements
1. [Requirement 1]
2. [Requirement 2]

### API Design

```typescript
// New types
interface NewFeatureProps<T> {
  // ...
}

// New components
<NewFeature<T>
  prop1={...}
  prop2={...}
/>
```

### Implementation Steps
1. [ ] Create types in `types.ts`
2. [ ] Create component in `NewFeature.tsx`
3. [ ] Add tests in `NewFeature.spec.tsx`
4. [ ] Add styles in `styles/new-feature.less`
5. [ ] Export from `index.ts`
6. [ ] Update README
7. [ ] Add demo example

### Testing
- Unit tests: [Describe]
- Integration tests: [Describe]
- Manual testing: [Describe]

### Timeline
- Phase 1: [Duration]
- Phase 2: [Duration]
- Total: [Duration]
```
