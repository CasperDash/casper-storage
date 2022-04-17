import { LibraryChecker } from "./checker";

new LibraryChecker().run().then(x => {
  console.log(x.getSummary());
});