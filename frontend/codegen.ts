import type { CodegenConfig } from '@graphql-codegen/cli'
 
const config: CodegenConfig = {
   schema: '../backend/schema.graphqls',
   documents: ['src/**/*.{ts,tsx,graphql}','!src/gql/**/*',],
   generates: {
      './src/gql/': {
        preset: 'client',
      }
   },
   ignoreNoDocuments: true,
}
export default config