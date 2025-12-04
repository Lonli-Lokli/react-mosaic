# Tree Analysis Prompt Template

Use this template when analyzing tree structures or tree operations.

## Analyzing a Tree Structure

When given a tree structure, analyze it by:

1. **Structure Overview**
   - Root node type (split, tabs, or leaf)
   - Total depth of the tree
   - Number of leaf nodes
   - Number of split nodes
   - Number of tab nodes

2. **Visual Representation**
   - Draw ASCII tree diagram
   - Show split directions and percentages
   - Show tab groups and active tabs

3. **Validation**
   - Check for invalid node types
   - Verify split percentages (should sum to ~100)
   - Check for orphaned nodes
   - Validate path references

4. **Optimization Suggestions**
   - Identify redundant nesting
   - Suggest balanced alternatives
   - Point out deep nesting issues

## Example Analysis

```typescript
// Given tree
const tree = {
  type: 'split',
  direction: 'row',
  children: ['left', { type: 'split', direction: 'column', children: ['top', 'bottom'] }]
};

// Analysis output:
Structure:
├── Split (row)
│   ├── Leaf: 'left'
│   └── Split (column)
│       ├── Leaf: 'top'
│       └── Leaf: 'bottom'

Metrics:
- Depth: 2
- Leaves: 3
- Split nodes: 2
- Layout: 2 columns, right column split into 2 rows
```
