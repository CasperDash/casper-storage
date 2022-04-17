# Checkers

This checker module contains 2 file:
- `checker.js`: Provide the whole logic to perform the check
- `checker-run.js`: Provide an example of calling the runner

The runner will provide a summary whether library's core modules work properly or failure to run with a specific error

## Usage

1. Copy and place `checker.js` whenever in your project
2. Copy the example from `checker-run.js` and invoke anywhere in your project (e.g main entry file)

```javascript
import { LibraryChecker } from "./checker";

new LibraryChecker().run().then(x => {
  console.log(x.getSummary());
});
```