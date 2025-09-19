import fs from 'node:fs';
import { type ConfigExport, defineConfig } from 'rolldown';
import { removeExportPlugin } from 'rolldown-plugin-remove-export';

const outputFileName = 'main';
const plugin = removeExportPlugin(`${outputFileName}.js`);
const folders = fs.readdirSync('lib', { encoding: 'utf-8', recursive: false });

const configs: ConfigExport = folders.map((lib) => {
  const packageJson = fs.readFileSync(
    `node_modules/${lib}/package.json`,
    'utf-8',
  );
  const { version, maintainers, author, repository, homepage } =
    JSON.parse(packageJson);
  const [, repoOwner, repoName] =
    repository?.url?.match(/github\.com\/(.+?)\/(.+?)\.git/) ?? [];
  const authorName =
    author?.name ?? maintainers?.[0]?.name ?? repoOwner ?? 'Unknown';

  return {
    input: `lib/${lib}/${outputFileName}.ts`,
    output: {
      file: `dist/${lib}/${outputFileName}.js`,
      format: 'esm',
      banner: `// transform from npm package \`${lib}\`@${version} by ${authorName}\n// see: ${homepage ?? (repoOwner ? `https://github.com/${repoOwner}/${repoName}` : '')}\n`,
    },
    plugins: [plugin],
  };
});

export default defineConfig(configs);
