import fs from 'node:fs/promises';
import { compile } from 'json-schema-to-typescript';

const url = 'https://www.schemastore.org/package.json';
const outputDir = 'types';
const outputPath = `${outputDir}/packageJson.d.ts`;

export async function generateTypeScriptTypes() {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const schema = (await response.json()) as object;
    const ts = await compile(schema, 'packageJson.d.ts');

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, ts, 'utf-8');

    console.log(`Successfully generated TypeScript types at ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate TypeScript types:', error);
    process.exit(1);
  }
}
