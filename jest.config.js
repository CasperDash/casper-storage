module.exports = {
  "roots": [
    "<rootDir>"
  ],
  "testMatch": [
    "**/*.test.ts"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  // Aliases from tsconfig.json
  "moduleNameMapper": {
    "^@/(.*)": "<rootDir>/src/$1"
  },
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!test/**/*"
  ]
}