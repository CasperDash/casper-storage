// browserify by default only pulls in files that are hard coded in requires
// In order of last to first in this file, the default wordlist will be chosen
// based on what is present. (Bundles may remove wordlists they don't need)

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { default as _default }  from './wordlists/english.json';

const wordlists: { [index: string]: string[] } = {};
wordlists.english = _default as string[];
wordlists.EN = _default as string[];

// Last one to overwrite wordlist gets to be default.
export { wordlists, _default };