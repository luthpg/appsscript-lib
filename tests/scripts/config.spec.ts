import fs from 'node:fs';
import { describe, expect, test, vi } from 'vitest';
import { getLibraryProperties } from '../../scripts/config';
import * as utils from '../../scripts/utils';

// fs.readFileSyncとgetLibraryNamesをモック化
vi.mock('node:fs');
vi.mock('../../scripts/utils');

describe('scripts/config', () => {
  test('getLibraryProperties should return correct properties for a library', () => {
    // getLibraryNamesが特定のライブラリ名を返すようにモック
    vi.mocked(utils.getLibraryNames).mockReturnValue(['test-lib']);

    // fs.readFileSyncがpackage.jsonの内容を返すようにモック
    vi.mocked(fs.readFileSync).mockReturnValueOnce(
      JSON.stringify({
        name: 'test-lib',
        version: '1.0.0',
        author: { name: 'Test Author' },
        repository: { url: 'git+https://github.com/test-owner/test-repo.git' },
        homepage: 'https://example.com/test-lib',
      }),
    );

    const properties = getLibraryProperties();

    expect(properties).toEqual([
      {
        name: 'test-lib',
        version: '1.0.0',
        author: 'Test Author',
        homepage: 'https://example.com/test-lib',
      },
    ]);
    expect(fs.readFileSync).toHaveBeenCalledWith(
      'node_modules/test-lib/package.json',
      'utf-8',
    );
  });

  test('getLibraryProperties should handle maintainers if author is not present', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue(['another-lib']);
    vi.mocked(fs.readFileSync).mockReturnValueOnce(
      JSON.stringify({
        name: 'another-lib',
        version: '2.0.0',
        maintainers: [{ name: 'Maintainer One' }],
        repository: {
          url: 'git+https://github.com/another-owner/another-repo.git',
        },
      }),
    );

    const properties = getLibraryProperties();

    expect(properties).toEqual([
      {
        name: 'another-lib',
        version: '2.0.0',
        author: 'Maintainer One',
        homepage: 'https://github.com/another-owner/another-repo',
      },
    ]);
  });

  test('getLibraryProperties should use repoOwner as author if no author/maintainer', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue(['repo-lib']);
    vi.mocked(fs.readFileSync).mockReturnValueOnce(
      JSON.stringify({
        name: 'repo-lib',
        version: '3.0.0',
        repository: { url: 'git+https://github.com/repo-owner/repo-lib.git' },
      }),
    );

    const properties = getLibraryProperties();

    expect(properties).toEqual([
      {
        name: 'repo-lib',
        version: '3.0.0',
        author: 'repo-owner',
        homepage: 'https://github.com/repo-owner/repo-lib',
      },
    ]);
  });

  test('getLibraryProperties should default to Unknown author if no info is available', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue(['no-info-lib']);
    vi.mocked(fs.readFileSync).mockReturnValueOnce(
      JSON.stringify({
        name: 'no-info-lib',
        version: '4.0.0',
      }),
    );

    const properties = getLibraryProperties();

    expect(properties).toEqual([
      {
        name: 'no-info-lib',
        version: '4.0.0',
        author: 'Unknown',
        homepage: '',
      },
    ]);
  });

  test('getLibraryProperties should handle multiple libraries', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue(['lib-a', 'lib-b']);

    vi.mocked(fs.readFileSync)
      .mockReturnValueOnce(
        JSON.stringify({
          name: 'lib-a',
          version: '1.0.0',
          author: { name: 'Author A' },
        }),
      )
      .mockReturnValueOnce(
        JSON.stringify({
          name: 'lib-b',
          version: '2.0.0',
          maintainers: [{ name: 'Maintainer B' }],
        }),
      );

    const properties = getLibraryProperties();

    expect(properties).toEqual([
      { name: 'lib-a', version: '1.0.0', author: 'Author A', homepage: '' },
      { name: 'lib-b', version: '2.0.0', author: 'Maintainer B', homepage: '' },
    ]);
  });
});
