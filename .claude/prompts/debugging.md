# Debugging Prompt Template

Use this template when debugging issues in React Mosaic.

## Debugging Process

### 1. Gather Information

**Symptoms**:
- What is the unexpected behavior?
- What was the expected behavior?
- Is this reproducible?
- In what environment (browser, React version, etc.)?

**Context**:
- What tree structure is involved?
- What operations were performed?
- What's the component hierarchy?
- Are there any error messages?

### 2. Reproduce the Issue

Create a minimal reproduction:
```typescript
// Minimal tree structure
const testTree = { ... };

// Steps to reproduce
1. ...
2. ...
3. ...

// Expected result
// Actual result
```

### 3. Hypothesis Formation

Possible causes:
1. [Hypothesis 1]
2. [Hypothesis 2]
3. [Hypothesis 3]

### 4. Investigation Steps

#### For Tree-Related Issues
```typescript
// Log the tree
console.log('Tree:', JSON.stringify(tree, null, 2));

// Log the path
console.log('Path:', path.join(' → '));

// Validate tree structure
function validateTree(node) {
  if (isSplitNode(node)) {
    // Check children exist
    // Check split percentages
    // Recurse
  } else if (isTabsNode(node)) {
    // Check tabs array
    // Check activeTabIndex
  }
}
```

#### For Component Issues
```typescript
// Add console logs
useEffect(() => {
  console.log('Props changed:', props);
}, [props]);

// Check context values
const context = useContext(MosaicContext);
console.log('Context:', context);

// Track renders
console.log('Rendering:', componentName);
```

#### For Drag & Drop Issues
```typescript
// Log drag events
onDragStart={() => console.log('Drag start')}
onDragEnd={(type) => console.log('Drag end:', type)}

// Check drop target registration
// Verify backend setup
// Log drop position calculations
```

### 5. Root Cause Analysis

**Root Cause**: [Description]

**Why it happens**: [Explanation]

**Related code**: [File paths and line numbers]

### 6. Solution Design

**Approach**: [Description of fix]

**Files to modify**:
- `file1.ts`: [What to change]
- `file2.tsx`: [What to change]

**Trade-offs**:
- Pro: [Benefits]
- Con: [Drawbacks]

### 7. Implementation

```typescript
// Before
// [Old code]

// After
// [New code]

// Why this fixes it
// [Explanation]
```

### 8. Testing

**Test the fix**:
1. [ ] Original issue resolved
2. [ ] No regressions introduced
3. [ ] Edge cases handled
4. [ ] Unit tests pass
5. [ ] Visual testing confirms

**Add regression test**:
```typescript
it('should handle [specific case]', () => {
  // Test that prevents this bug from returning
});
```

## Common Issue Patterns

### Pattern 1: Tree Mutation
**Symptom**: Tree changes not reflecting in UI
**Cause**: Mutating tree instead of creating new instance
**Fix**: Use `updateTree` or spread operator

### Pattern 2: Invalid Path
**Symptom**: Node not found, errors accessing properties
**Cause**: Path doesn't match tree structure
**Fix**: Validate paths, log tree structure

### Pattern 3: Type Errors
**Symptom**: TypeScript errors, runtime type issues
**Cause**: Missing type guards
**Fix**: Use `isSplitNode()`, `isTabsNode()`

### Pattern 4: Render Loop
**Symptom**: Infinite re-renders, performance issues
**Cause**: Unstable callbacks, missing dependencies
**Fix**: Use `useCallback`, fix dependency arrays

### Pattern 5: Drag & Drop Not Working
**Symptom**: Can't drag panels
**Cause**: DnD context not setup, backend issues
**Fix**: Check `Mosaic` setup, verify backend

## Debugging Tools

### Browser DevTools
- React DevTools: Component hierarchy, props, state
- Console: Logging, errors
- Performance: Profiling renders
- Network: Loading issues

### Code Debugging
```typescript
// Add type checking
if (!isSplitNode(node) && !isTabsNode(node)) {
  console.warn('Invalid node type:', node);
}

// Validate tree
function isValidTree(node) {
  // Check structure recursively
}

// Log tree operations
const result = updateTree(tree, updates);
console.log('Before:', tree);
console.log('After:', result);
```

### Test Debugging
```bash
# Run single test
npm test -- --testNamePattern="specific test"

# Add .only to focus
it.only('should do something', () => { ... });

# Increase timeout for debugging
it('should do something', () => { ... }, 10000);
```

## Prevention

After fixing:
1. [ ] Add test to prevent regression
2. [ ] Document edge case if needed
3. [ ] Consider if this affects other areas
4. [ ] Update documentation if needed
5. [ ] Share learnings with team
