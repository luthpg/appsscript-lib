import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { getLibraryNames } from './utils';

const distDir = resolve(process.cwd(), 'dist');

export const main = () => {
  try {
    const targets = getLibraryNames();
    if (targets.length === 0) {
      console.log('No libraries found in `lib` directory. Nothing to publish.');
      return;
    }

    console.log(`Found libraries to publish: ${targets.join(', ')}`);

    for (const target of targets) {
      console.log(`\n----------------------------------------`);
      console.log(`Publishing ${target}...`);
      console.log(`----------------------------------------`);

      // distディレクトリからclasp pushを実行
      console.log('Pushing files to Google Apps Script...');
      execSync('clasp push -f', {
        cwd: resolve(distDir, target),
        stdio: 'inherit', // claspの出力をリアルタイムで表示
      });

      console.log(`\nSuccessfully published ${target}.`);
    }

    console.log(`\n----------------------------------------`);
    console.log('All libraries have been published successfully!');
    console.log(`----------------------------------------`);
  } catch (error) {
    console.error('\nAn error occurred during the publish process:');
    console.error(error);
    process.exit(1);
  }
};
