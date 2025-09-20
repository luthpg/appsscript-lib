import fs from 'node:fs';
import { getLibraryNames } from './utils';

export interface LibraryProperties {
  name: string;
  version: string;
  author: string;
  homepage: string;
}

export const getLibraryProperties = (): LibraryProperties[] => {
  const folders = getLibraryNames();
  return folders.map((lib) => {
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
      name: lib,
      version,
      author: authorName,
      homepage:
        homepage ??
        (repoOwner ? `https://github.com/${repoOwner}/${repoName}` : ''),
    };
  });
};
