const jestConfig = {
  transformIgnorePatterns: ['node_modules', 'dist'],
  transform: {
    '^.+\\.(j|t)sx?$': [
      '@swc-node/jest',
      {
        swc: {
          jsc: {
            parser: {
              syntax: 'typescript',
            },
          },
          module: {
            type: 'es6',
          },
        },
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],
}

export default jestConfig
