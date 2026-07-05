import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: '../backend/schema.graphqls',
   documents: [
     'src/**/*.{ts,tsx,graphql}',
     '!src/generated/**/*',
     '!src/gql/**/*',
     '!src/components/ui/**/*',
   ],
   generates: {
      './src/generated/': {
        preset: 'client',
        presetConfig: {
          fragmentMasking: false,
        },
      }
   },
   ignoreNoDocuments: true,
   hooks: {
     afterAllFileWrite: ['node scripts/fix-generated-imports.mjs'],
   },
}
export default config