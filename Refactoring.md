# Refactoring

You've been asked to refactor the function `deterministicPartitionKey` in [`dpk.js`](dpk.js) to make it easier to read and understand without changing its functionality. For this task, you should:

1. Write unit tests to cover the existing functionality and ensure that your refactor doesn't break it. We typically use `jest`, but if you have another library you prefer, feel free to use it.
2. Refactor the function to be as "clean" and "readable" as possible. There are many valid ways to define those words - use your own personal definitions, but be prepared to defend them. Note that we do like to use the latest JS language features when applicable.
3. Write up a brief (~1 paragraph) explanation of why you made the choices you did and why specifically your version is more "readable" than the original.

You will be graded on the exhaustiveness and quality of your unit tests, the depth of your refactor, and the level of insight into your thought process provided by the written explanation.

## Your Explanation Here

My first thought while tackling this excercise was that while the different conditions that needed to be met for each result weren´t particularly complex, the way the function was written obfuscated this and made it so that you needed to follow each execution pathway to understand what you would get at the end. I started moving TRIVIAL_PARTITION_KEY response up top, as it is a base case for the funcion and having it as the result of a chain of conditionals makes it harder than what it should to understand when it should be returned. I created two functions, hashPartitionKey and partitionKeyToString, to encapsulate simple algorithms that were being repeated in the function or that obfuscated the flow of it. By using them, I managed to encapsulate the many conditionals of the original function into two ternary conditionals that are easier to read. As the last touch, I moved the hashPartitionKey function outside of deterministicPartitionKey as I felt that it was reusable enough that maybe another function in the file could use it.