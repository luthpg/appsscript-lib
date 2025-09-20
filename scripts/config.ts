import fs from 'node:fs';
import type { JSONSchemaForNPMPackageJsonFiles } from '../types/packageJson';
import { getLibraryNames } from './utils';

export interface LibraryProperties {
  name: string;
  version: string | undefined;
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
    const { version, maintainers, author, repository, homepage } = JSON.parse(
      packageJson,
    ) as JSONSchemaForNPMPackageJsonFiles;
    const repositoryUrl =
      typeof repository === 'string' ? repository : repository?.url;
    const [, repoOwner, repoName] =
      repositoryUrl?.match(/github\.com\/(.+?)\/(.+?)\.git/) ??
      repositoryUrl?.match(/github\.com\/(.+?)\/(.+)$/) ??
      [];
    const maintainerName =
      typeof maintainers?.[0] === 'string'
        ? maintainers?.[0]
        : maintainers?.[0]?.name;
    const authorName =
      typeof author === 'string'
        ? author
        : (author?.name ?? maintainerName ?? repoOwner ?? 'Unknown');

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
