# Contributing to React Mosaic

Thank you for your interest in contributing to React Mosaic! This document provides guidelines and instructions for contributing to the project.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/<your-username>/react-mosaic.git
   cd react-mosaic
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

   This will automatically set up lefthook Git hooks for commit message validation.

3. **Start Development Server**
   ```bash
   npm start
   ```

## Commit Message Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) to automatically generate changelogs and determine version bumps. **All commit messages are validated and must follow this format.**

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, whitespace, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

#### Scope (Optional)

The scope should be the name of the component or area affected:

- `drag-drop`
- `split-view`
- `toolbar`
- `tabs`
- `deps`
- etc.

#### Subject

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Keep it concise (under 72 characters)

#### Examples

```bash
# Good commits
feat: add support for custom toolbar buttons
fix(drag-drop): prevent memory leak on unmount
docs: update installation instructions
perf(split-view): optimize resize performance
refactor: simplify tree traversal logic
test(tabs): add tests for tab switching
build(deps): upgrade react-dnd to v16

# Bad commits (will be rejected)
Added new feature  # Missing type
feat: Added new feature.  # Subject should be lowercase and no period
fix bug  # Missing colon after type
feature: new toolbar  # Wrong type (use 'feat')
```

## Enforcement

Commit messages are **enforced at multiple levels**:

1. **Local Git Hooks (lefthook)**: Your commits will be validated locally before they're created
2. **CI Validation**: Pull requests are validated in GitHub Actions

If your commit message doesn't follow the format, it will be **rejected** with a helpful error message explaining what needs to be fixed.

### Bypass Hooks (Not Recommended)

In rare cases where you need to bypass the hook:

```bash
git commit --no-verify -m "your message"
```

**Note**: CI validation will still run on PRs, so invalid commits will eventually need to be fixed.

## Development Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make Changes**
   - Write your code
   - Add/update tests
   - Update documentation if needed

3. **Run Tests**
   ```bash
   npm test
   ```

4. **Run Linter**
   ```bash
   npm run lint
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

   The lefthook hook will automatically validate your commit message.

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

   Then create a pull request on GitHub.

## Pull Request Guidelines

- **Title**: Must follow Conventional Commits format (same as commit messages)
- **Description**: Provide clear description of changes and motivation
- **Tests**: Include tests for new features or bug fixes
- **Documentation**: Update README or other docs if needed
- **Commits**: Can have multiple commits; they'll be squashed on merge

### PR Title Examples

```
feat: add keyboard shortcuts for window management
fix(tabs): resolve tab focus issue on Safari
docs: add migration guide from v6 to v7
```

## Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting (via ESLint)
- **TypeScript** for type checking

Code style is enforced automatically. Run these commands:

```bash
# Check linting
npm run lint

# Run type checking
npm run build:lib:check
```

## Testing

- Write tests for new features and bug fixes
- Ensure all tests pass before submitting PR
- Aim for good test coverage

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Release Process

Releases are automated using Nx Release:

1. Commits are analyzed to determine version bump (major/minor/patch)
2. Changelog is automatically generated from commit messages
3. GitHub release is created

This is why following Conventional Commits is **mandatory** - it enables this automation.

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/lonli-lokli/react-mosaic/issues)
- **Discussions**: [GitHub Discussions](https://github.com/lonli-lokli/react-mosaic/discussions)

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
