import { execSync } from 'node:child_process';
import * as path from 'node:path'; // pathモジュールをインポート
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  type MockInstance,
  test,
  vi,
} from 'vitest';
import { main } from '../../scripts/publish';
import * as utils from '../../scripts/utils';

// 依存関係をモック化
vi.mock('../../scripts/utils');
vi.mock('node:child_process');

describe('scripts/publish', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let processExitSpy: MockInstance<
    (code?: number | string | null | undefined) => never
  >; // Explicitly type processExitSpy
  let originalCwd: () => string;

  beforeEach(() => {
    // 各テストの前にすべてのモックをリセット
    vi.clearAllMocks();
    // consoleメソッドとprocess.exitをスパイ
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation((_code?: number | string | null | undefined) => {
        // Add code parameter
        throw new Error('process.exit was called');
      });

    // 元のprocess.cwdを保存し、モック化
    originalCwd = process.cwd;
    vi.spyOn(process, 'cwd').mockReturnValue(
      'C:\\Users\\lutha\\Documents\\Code\\appsscript-lib',
    );
  });

  afterEach(() => {
    // 各テストの後に元のconsoleとprocess.exitを復元
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    // 元のprocess.cwdを復元
    process.cwd = originalCwd;
  });

  test('should log message and return if no libraries are found', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue([]);

    main();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'No libraries found in `lib` directory. Nothing to publish.',
    );
    expect(execSync).not.toHaveBeenCalled();
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test('should publish a single library successfully', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue(['test-lib']);
    vi.mocked(execSync).mockReturnValue(Buffer.from('clasp push success'));

    main();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Found libraries to publish: test-lib',
    );
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(execSync).toHaveBeenCalledWith('clasp push -f', {
      cwd: path.resolve(process.cwd(), 'dist', 'test-lib'), // path.resolveを使用して期待されるパスを構築
      stdio: 'inherit',
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '\nSuccessfully published test-lib.',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'All libraries have been published successfully!',
      ),
    );
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test('should publish multiple libraries successfully', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue(['lib-a', 'lib-b']);
    vi.mocked(execSync).mockReturnValue(Buffer.from('clasp push success'));

    main();

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Found libraries to publish: lib-a, lib-b',
    );
    expect(execSync).toHaveBeenCalledTimes(2);
    expect(execSync).toHaveBeenCalledWith('clasp push -f', {
      cwd: path.resolve(process.cwd(), 'dist', 'lib-a'), // path.resolveを使用して期待されるパスを構築
      stdio: 'inherit',
    });
    expect(execSync).toHaveBeenCalledWith('clasp push -f', {
      cwd: path.resolve(process.cwd(), 'dist', 'lib-b'), // path.resolveを使用して期待されるパスを構築
      stdio: 'inherit',
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '\nSuccessfully published lib-a.',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '\nSuccessfully published lib-b.',
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'All libraries have been published successfully!',
      ),
    );
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test('should handle error during clasp push and exit', () => {
    vi.mocked(utils.getLibraryNames).mockReturnValue(['failing-lib']);
    const mockError = new Error('clasp push failed');
    vi.mocked(execSync).mockImplementation(() => {
      throw mockError;
    });

    // process.exitのモックによりテストがエラーをスローすることを期待
    expect(() => main()).toThrow('process.exit was called');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Found libraries to publish: failing-lib',
    );
    expect(execSync).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '\nAn error occurred during the publish process:',
    );
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
