# General Principles for React development

## Motivation

Certain decisions in these ADRs are based on the goal to make our code better. But what does "better" mean? Let's define it by creating some principles for good code quality when developing React in this project.

## Principles

I. We aim to reduce complexity in order to speed up development, reduce risk of bugs, and make it easy to change code.

Reason: This is self-explanatory, however not always followed in practice. We are developing this project now, and complexity needs to be tackled from the start, before it grows too much. The alternative is to ending with a project that is extremely hard to understand and work on and resistent to change, like the current edx-platform. Resistance to change is what slows developer teams down.

II. To achieve the above point, we generally orient ourselves at Clean Code principles.

Reason: Clean Code is industry standard and proven method to tackle complexity.

III. We follow the React docs and prefer patterns and principles that are established in the community in order to have a good architecture that is easy to understand.

Reason: The community has spent years learning and improving upon what works well and what doesn't, and this has led to the patterns described there. The docs are in general not opinionated and violating their principles has caused applications to have many bugs. When we use established principles, we make it easy for people to understand the code, especially if they are newcomers to the project or community members.

IV. We follow the KISS principle - "Keep it simple, stupid", in order to make it easy for any developer to understand the code.

Reason: We work agile and with an open source community. A common rule of thumb is that a developer with just 3 months of experience should be able to understand code. We should enable developers to work on this codebase without spending a lot of time trying to understand what is going on.

V. We do not increase code complexity in order to make it easier to write tests, unless absolutely necessary and for good reasons. (Reducing complexity to improve testability is fine.)

Reason: Our code should not depend on our tests, our tests should depend on our code. Changing code because of our testing library is a red flag. In some places online you will read that you rewriting code for good testability is a good thing. But if you dig deep, you will find that it actually means that low testability can be a sign of a concrete problem in the code - either a bug or just in general a bad architecture, high complexity, and huge components. It is good to change code to solve a problem with the code, but it is bad to change code to solve a problem with the testing library or way we write tests.

The idea that we need to employ methods that increase code complexity for testability is based on a bad premise: that we somehow need them, and there is no other way to get the tests to work. However, there is any number of codebases demonstrating that this is wrong. They have - compared to the current status quo when writing this - lower complexity, better tests, and do not rely on these methods.
