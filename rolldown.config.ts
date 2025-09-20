import { type ConfigExport, defineConfig } from 'rolldown';
import { removeExportPlugin } from 'rolldown-plugin-remove-export';
import { getLibraryProperties } from './scripts/config';

const outputFileName = 'main';
const plugin = removeExportPlugin(`${outputFileName}.js`);
const folders = getLibraryProperties();

const configs: ConfigExport = folders.map(
  ({ name, version, author, homepage }) => {
    return {
      input: `lib/${name}/${outputFileName}.ts`,
      output: {
        file: `dist/${name}/${outputFileName}.js`,
        format: 'esm',
        banner: `// transform from npm package \`${name}\`@${version} by ${author}\n// see: ${homepage}\n`,
      },
      plugins: [plugin],
    };
  },
);

export default defineConfig(configs);
