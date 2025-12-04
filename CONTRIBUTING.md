# Contributing to React Mosaic

Thank you for your interest in contributing to React Mosaic! This document provides guidelines and instructions for contributing.

## Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification to enable automatic changelog generation and semantic versioning.

### Commit Message Format

Each commit message consists of a **header**, an optional **body**, and an optional **footer**:

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
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

#### Scope

The scope is optional and can be anything specifying the place of the commit change, e.g., `mosaic`, `window`, `drag-drop`, etc.

#### Subject

The subject contains a succinct description of the change:

- Start with an uppercase character
- Don't end with a period
- Use the imperative, present tense: "Change" not "Changed" nor "Changes"
- Maximum 100 characters

#### Body (Optional)

The body should include the motivation for the change and contrast this with previous behavior.

#### Footer (Optional)

The footer should contain any information about **Breaking Changes** and is also the place to reference GitHub issues that this commit closes.

### Examples

```
feat: Add support for custom toolbar buttons

Allows users to define custom buttons in the toolbar through a new prop.

Closes #123
```

```
fix(drag-drop): Prevent memory leak on unmount

The drag-drop listeners were not being cleaned up properly when components unmounted.
```

```
docs: Update installation instructions

Add npm installation steps and update peer dependency requirements.
```

### Enforcement

- **Git Hooks**: When you commit locally, a Git hook will automatically validate your commit message format
- **Pull Requests**: All PR titles and commit messages are validated in CI
- **Merges**: PRs with invalid commit messages will not be merged

## Setting Up Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Lonli-Lokli/react-mosaic.git
   cd react-mosaic
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Git hooks** (happens automatically during npm install):
   ```bash
   npm run prepare
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Start development server**:
   ```bash
   npm start
   ```

## Pull Request Process

1. **Fork the repository** and create your branch from `master`
2. **Make your changes** following the coding standards
3. **Write or update tests** as needed
4. **Ensure all tests pass**: `npm test`
5. **Ensure linting passes**: `npm run lint`
6. **Write a clear PR title** following Conventional Commits format
7. **Submit your pull request**

### PR Title Format

Your PR title must follow the same Conventional Commits format as commit messages:

```
feat: Add new feature
fix: Resolve bug in component
docs: Update README
```

This is enforced by CI and PRs with invalid titles will not be merged.

## Release Process

Releases are managed using [Nx Release](https://nx.dev/features/manage-releases):

1. Changelogs are **automatically generated** from commit messages
2. Version bumps are determined by commit types:
   - `feat`: Minor version bump
   - `fix`: Patch version bump
   - `BREAKING CHANGE`: Major version bump
3. Release command: `npm run release`

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.
