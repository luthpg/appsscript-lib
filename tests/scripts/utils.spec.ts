import * as _fs from 'node:fs';
import { beforeEach, describe, expect, test, vi } from 'vitest';

// 'node:fs'モジュール全体をモック
vi.mock('node:fs', () => ({
  readdirSync: vi.fn(), // vi.fn()を返すだけ
}));

// fsをモックされたモジュールとして明示的に宣言
const fs = vi.mocked(_fs);

describe('scripts/utils', () => {
  let getLibraryNames: typeof import('../../scripts/utils').getLibraryNames;

  beforeEach(async () => {
    vi.clearAllMocks();
    const utilsModule = await import('../../scripts/utils.js');
    getLibraryNames = utilsModule.getLibraryNames;
  });

  test('getLibraryNames should return directory names', () => {
    // Direntのようなオブジェクトの配列を返すようにreaddirSyncをモック
    fs.readdirSync.mockReturnValue([
      { name: 'luxon', isDirectory: () => true },
      { name: 'diff', isDirectory: () => true },
      { name: '.DS_Store', isDirectory: () => false },
    ] as unknown as _fs.Dirent<Buffer<ArrayBufferLike>>[]); // _fs.Dirent[]にキャスト

    const libNames = getLibraryNames();

    expect(libNames).toEqual(['luxon', 'diff']);
    expect(fs.readdirSync).toHaveBeenCalledWith(
      expect.stringContaining('lib'),
      { withFileTypes: true },
    );
  });

  test('getLibraryNames should return an empty array when no directories exist', () => {
    fs.readdirSync.mockReturnValue([
      { name: '.DS_Store', isDirectory: () => false },
    ] as unknown as _fs.Dirent<Buffer<ArrayBufferLike>>[]);

    const libNames = getLibraryNames();

    expect(libNames).toEqual([]);
  });

  test('getLibraryNames should re-throw errors from readdirSync', () => {
    const mockError = new Error('Permission denied');
    fs.readdirSync.mockImplementation(() => {
      throw mockError;
    });

    expect(() => getLibraryNames()).toThrow(mockError);
  });
});
