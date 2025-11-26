# Development Principles

A strict, opinionated, minimal-overhead style guide built from 200+ hours of solo development.

## General Principles

- Only create an abstraction if it’s **actually needed**
- Prefer clear function/variable names over inline comments
- Avoid helper functions when a simple inline expression would suffice
- Use `knip` to remove unused code when making large changes
- The GitHub CLI (`gh`) is installed — use it
- Do not use emojis in code, commits, or documentation
- Never implement a workaround when you can solve the root cause — workarounds are future-you’s problems
- Remove debugging — delete every `console.log` or temporary fix before committing
- Minimal configs — start with zero configuration, add only what’s necessary
- One config, everywhere — centralize settings, never duplicate
- No build changes without approval — altering Vite/webpack/etc. is a contract with the codebase
- Root cause over quick fixes — bugs aren’t isolated; trace why they exist
- Document the **why**, not the how — code should be self-explanatory
- Simplicity first — the best solution is the one that doesn’t need explaining
- **Orange is #FF6D4D** — all styling references use this exact color. No approximations, no Tailwind defaults.
- use pnpm package for server start and build

## React

- Avoid massive JSX blocks — compose small, focused components
- Colocate code that changes together
- Avoid `useEffect` unless absolutely required

## Tailwind

- Mostly use built-in values
- Occasionally allow dynamic/classname values
- Rarely use global styles
- Always use Tailwind v4 + global CSS file format + shadcn/ui

## TypeScript

- Do not add unnecessary `try/catch` blocks
- Never cast to `any`

---
*Keep it boring. Keep it working.*
