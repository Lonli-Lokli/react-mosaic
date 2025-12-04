# Code Review Prompt Template

Use this template when reviewing React Mosaic code.

## Review Checklist

### 1. Type Safety
- [ ] All function parameters have explicit types
- [ ] Return types are specified
- [ ] No usage of `any` (use `unknown` if needed)
- [ ] Proper use of generics with `<T>`
- [ ] Type guards used for node type checking

### 2. Tree Operations
- [ ] Uses utility functions (not manual manipulation)
- [ ] Handles all node types (split, tabs, leaf)
- [ ] Creates new tree instances (immutability)
- [ ] Validates paths before use
- [ ] Handles edge cases (empty, single node, deep nesting)

### 3. React Patterns
- [ ] Functional components with hooks
- [ ] Proper dependency arrays in hooks
- [ ] Memoization where appropriate (`useMemo`, `useCallback`)
- [ ] Context used correctly
- [ ] No side effects in render

### 4. Performance
- [ ] No expensive operations in render
- [ ] Tree traversals minimized
- [ ] Callbacks are stable
- [ ] Components memoized if needed

### 5. Accessibility
- [ ] Semantic HTML used
- [ ] Keyboard navigation considered
- [ ] ARIA labels where needed
- [ ] Focus management appropriate

### 6. Testing
- [ ] Unit tests present for utilities
- [ ] Edge cases tested
- [ ] Type safety verified
- [ ] Visual testing mentioned if UI change

### 7. Documentation
- [ ] JSDoc comments for public APIs
- [ ] Complex logic explained
- [ ] Examples provided for new features

### 8. Code Style
- [ ] Follows existing patterns
- [ ] Naming conventions matched
- [ ] File organization correct
- [ ] Imports organized

## Review Format

**Summary**: [One sentence overview]

**Strengths**:
- [What's done well]

**Issues**:
1. **[Severity]**: [Description]
   - Location: [File:line]
   - Fix: [Suggestion]

**Suggestions**:
- [Optional improvements]

**Verdict**: ✅ Approve / ⚠️ Needs Changes / ❌ Reject
