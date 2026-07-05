import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const generatedDir = join(import.meta.dirname, "../src/generated")

for (const file of ["gql.ts", "graphql.ts"]) {
  const path = join(generatedDir, file)
  const source = readFileSync(path, "utf8")
  const fixed = source.replace(
    /^import \{ TypedDocumentNode as DocumentNode \} from '@graphql-typed-document-node\/core';$/m,
    "import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';",
  )
  if (fixed !== source) {
    writeFileSync(path, fixed)
  }
}
