# appsscript-lib

This project provides npm packages as a library for Google Apps Script (GAS).

## For Users

### How to Use the Library

1. Open the Google Apps Script editor.
2. Click the `+` icon next to "Libraries."
3. Paste the Script ID of the library you want to use into the "Script ID" field and click "Find."
4. Select the desired version and click "Add."

### Available Libraries

| Library Name | Script ID | Description | Official Website |
| :--- | :--- | :--- | :--- |
| `diff` | `1cGsS5kFEuRxs4q4huY9zeEJKqwGuOpy3XIm9ZByWltW8ruS7czrMz1Rx` | A library to compare text differences | [diff](https://github.com/kpdecker/jsdiff) |
| `luxon` | `1nTyDY64s57_wk2r8zOSz6fauz_Kt4l4BY74eajkHwR3RLPQ3P2p6PtN5` | A library for working with dates and times | [luxon](https://moment.github.io/luxon) |

### Usage Example (`diff` library)

```js
function myFunction() {
  const text1 = 'Hello\nWorld';
  const text2 = 'Hello\nJavaScript';

  // The library's identifier defaults to the library name.
  const changes = diff.diffLines(text1, text2);

  changes.forEach(part => {
    const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    console.log(part.value, color);
  });
}
```

### Usage Example (`luxon` library)

```js
function myFunction() {
  // Get the current date and time with a specific timezone.
  // The library's identifier defaults to 'luxon'.
  const dt = luxon.DateTime.now().setZone('Asia/Tokyo');

  // Format the date and time.
  const formatted = dt.toFormat('yyyy-MM-dd HH:mm:ss');
  console.log(`Current Date and Time (Tokyo): ${formatted}`);

  // Calculate the date and time one week from now.
  const nextWeek = dt.plus({ weeks: 1 });
  console.log(`Date one week from now: ${nextWeek.toFormat('yyyy-MM-dd')}`);
}
```

## For Maintainers

### Project Overview

This project uses [rolldown](https://rolldown.rs/) to bundle npm packages into a single JavaScript file and [clasp](https://github.com/google/clasp) to deploy them as Google Apps Script libraries.

### Setting Up the Environment

```bash
# Install dependencies
pnpm install
```

### Building

This command builds each library and outputs them to the `dist` directory.

```bash
pnpm build
```

### Deploying

Running `scripts/publish.ts` will push each library in the lib directory to Google Apps Script and create a new version.

```bash
pnpm publish
```

### Steps to Add a New Library

1. Create a new directory for the library within the `lib` directory (e.g., `lib/new-lib`).
2. Create `appsscript.json` and `.clasp.json` inside the new directory.
   - In `.clasp.json`, enter the new Script ID obtained from the GUI or via `clasp create`.
3. Create `main.ts` and define the functions or objects to be exposed as a library.

### Managing `.clasp.json`

Typically, `.clasp.json` contains sensitive information and is excluded from Git. However, this project intentionally includes it in Git because it only contains the Script IDs for **public libraries**. This makes it easy for maintainers to manage and share the Script IDs with users.

## License

This project is licensed under the terms of the [LICENSE](./LICENSE) file.
