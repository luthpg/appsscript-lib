import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const libDir = resolve(process.cwd(), 'lib');

/**
 * libディレクトリからライブラリ名（フォルダ名）のリストを取得します。
 */
export const getLibraryNames = () => {
  const entries = readdirSync(libDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
};
