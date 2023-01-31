# Reducing Complexity

## Motivation

High complexity is in general a concerning problem: It can lead to untested legacy code, a high amount of bugs, bad maintainability, slow development, and so on. These decisions are concrete changes we want to make to reduce complexity in this project.

## Decisions

### Hooks

Decision: Hooks always start with `use` (for example `useCounter`). This applies to custom hooks. A custom hook is any function that calls other hooks, especially state and lifecycle hooks like `useEffect` or `useState`. If a function just calls something like `setState`, that does not make it a custom hook. Functions that do not call other hooks never start with `use`.

Reason: This is mandatory in the React docs. [React Docs](https://beta.reactjs.org/learn/reusing-logic-with-custom-hooks#hook-names-always-start-with-use) gives a great explanation why it is crucial to distinguish hooks from other functions. We want to follow the standards the React community sets so we have good code design.

### Single Responsibility Principle for hooks

Decision: Hooks are there to control the lifecycle and state of a component and run other side effects. Functions are there for other purposes (though they include things like calling setState from an onClick callback). As best as common sense allows, we want to follow the single responsibility principle and not mix both up.

### Contents of hooks.js

Decision: A hooks.js file must contain only custom hooks.

Reason: It is common practice to have a "hooks.js" file and you will only expect hooks in there. Here, too, we want to distinguish between hooks and normal functions. We also want to follow community conventions.

### Self-imports

Decision: We avoid self-imports and replace them wherever we find them.

Reason: They have unnecessary complexity and it is bad code design. That it improves testability is a bad argument: the functions will be testable one way or the other, it is not necessary; and there are other ways to improve testability that improve code design rather than make it worse. The conceptual idea behind it is not so clear: the way we program in JS is usually a one-directional flow where we declare a const for example, either import it or declare it in the same file, then use it down the line and export it. Conceptually the idea that you declare a constant, export it, then import it into the same file, then export again makes everything pretty convoluted, and we also have extra syntactical overhead for it. The code itself does not explain why the logic is so complicated and what it is there for - because it is only there for the tests. From a code perspective it is not logical to use such a logic. We do not need self-imports for writing tests, other projects generally do not use them.

Note: If you feel you really need something like this for your tests, consider this: instead of self-imports, exporting a class allows mocking of class methods, which also solves the problem and is already much better, since classes are a normal pattern and there is nothing bad about them. Still, this is not ideal because the code structure should not depend on the test. The best solution is to fix the problem you are having in the tests, not in the application code. There is a special (babel-plugin)[https://github.com/speedskater/babel-plugin-rewire/] for this which seems to solve the problem and which you should *only* add to the test environment.

### Component state

Decision: We use useState in the way it is demonstrated in the React docs, and we do not export a constant `state` from our hooks.js files.

Reason: We want to follow the normal industry way to develop React, and not completely change the way we use state. React has developed an elegant, well-working and testable state hook, and we do not need to abstract that with unnecessary complexity. This is also not needed for testability. Mocking useState is very difficult because you are not intended to. If you really need to do so, you can still absolutely do it, and this is a testing issue and should not affect the code in any way. However, it is not at all recommended to test state directly. Testing state directly, e.g. by mocking useState, will lead to false positives and false negatives in the tests, and as of React 18 useState behavior is not deterministic in development (&test?) environments. There is also the possibility of working with `useReducer`, (React local state hook, not redux reducer), which should be a bit easier to test.
