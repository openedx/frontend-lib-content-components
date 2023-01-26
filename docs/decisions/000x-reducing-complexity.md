# Reducing Complexity

## Decisions

### General

I. We follow the React docs and prefer patterns and examples found there.

Reason: The community has spent years learning and improving upon what works well and what doesn't, and this has led to the patterns described there. The docs are in general not opinionated and violating their principles has caused applications to have many bugs.

II. We follow the KISS principle - "Keep it simple, stupid".

### Hooks

I. Hooks always start with `use` (for example `useCounter`). This applies to custom hooks. A custom hook is any function that calls other hooks, especially state and lifecycle hooks like `useEffect` or `useState`. Functions that do not call other hooks never start with `use`.

Reason: see [React Docs](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks#hook-names-always-start-with-use)

II. 