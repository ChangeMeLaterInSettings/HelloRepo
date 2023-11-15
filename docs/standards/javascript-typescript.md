# JavaScript and TypeScript ☕️

## Table Contents

- [Table Contents](#table-contents)
- [Spacing and Punctuation](#spacing-and-punctuation)
- [Naming](#naming)
- [Imports](#imports)
    - [Aliasing](#aliasing)
    - [Ordering](#ordering)
- [JSX](#jsx)
    - [File Naming](#file-naming)
    - [Folder Structure](#folder-structure)
    - [Components and Related Files](#components-and-related-files)
- [React](#react)
    - [Hooks](#hooks)


## Spacing and Punctuation

- **Indentation**: 4 spaces 
- Single quotes everywhere, except in JSX
- Double quotes in JSX
- Use of semicolons
- Use trailing commas


## Naming

- Variables: `camelCase`
- Global Constants: `UPPERCASE_SNAKE_CASE`
- Functions: `camelCase`
- Classes: `PascalCase`
- Enums & Values: `PascalCaseForEnum.UPPERCASE_SNAKE_CASE_FOR_VALUE`
- API Response Properties: `snake_case`
- Vanilla File Names: `kebab-case`


## Imports

### Aliasing
When possible, aliasing should be used to make import paths nicer. These will be defined in `tsconfig.json` and will need to be included in other configuration files (like `vite.config.(js|ts)`) for tools that will interact with code using aliases (such as test frameworks and module bundlers).

```json5
// tsconfig.json
{
    "paths": {
        "!/*": ["./__tests__/*"],
        "@/*": ["./src/*"],
        "@mocks/*": ["./__mocks__/*"]
    }
}
```


### Ordering

Import statements should be grouped in the order below.

Each group should be separated with a newline, and its members listed in alphanumerical order:

1. Side-effect imports
2. Node.js built-ins (prefixed with `node:`)
3. 3rd party packages
4. **Path Alias (`~`)**: Imports from the project root (starts with `~`)
5. **Path Alias (`!`)**: Imports from the testing directory that (starts with `!`)
6. **Path Alias (`!`)**: Imports from the `src` directory that (starts with `@`)
7. Absolute imports, relative imports, and other imports not matched in the groups listed above.

```ts
// 1. Side-effect imports.
import './index.css';

// 2. Node.js built-ins.
import {resolve} from 'node:path';

// 3. 3rd party packages.
import {MetaProvider} from '@solidjs/meta';
import axios from 'axios';
import throttle from 'lodash.throttle';
import {type Component, createSignal} from 'solid-js';

// 4. Imports from the project root.
import MockTheme from '~/mocks/MockTheme';
// 5. Imports from the testing directory.

import {testUtility} from '!/utilities/test-utility';

// 6. Imports from the `src` directory.
import {mySvg} from '@/assets/img/mySvg.svg';
import Button from '@/components/Button';
import Home from '@/pages/Home';
import About from '@/pages/Home/About';
import Hero from '@/pages/Home/Hero';
import Sidebar from '@/partials/Sidebar';

// 7a. Absolute imports and other imports not matched in another group
// 7b. Relative imports. Anything that starts with a dot.
import SomeAbsoluteImport from '/path/to/import/__also__/this/goes/before/relative/imports';
import {someVariable} from '../../someModule'
import styles from './styles.module.css';
```


## JSX

### File Naming 

- Components: `PascalCase`
- Hooks: `camelCase` and must start with `use`. (Ex. `useBreakpoints`)


### Folder Structure 

#### Components and Related Files

In general, React and SolidJS components that can composed in only a ***single*** file should stay in a single file.

If the component needs another file, such as a stylesheet or is composed of other components, all files that make up this component should live in the same folder. This folder will be named after the main component. Additionally: 

- The main component will be defined in a file named after the main component (e.g. `@/components/MainComponent/MainComponent.tsx`)
- An `index.ts` file will be defined in the same folder as the main component (e.g. `@/components/MainComponent/index.ts`)
    - This file will group together index imports.

An example of this is as follows:

```ts
// `index.ts`
import PageScroller from '@/components/PageScroller';

export PageScroller;

//

// How `PageScroller` is imported
import PageScroller from '@/components/PageScroller';
```

```
~/
|__ node_modules/
|__ src/
    |__ components/
        |__ PageScroller/
            |__ styles.module.scss
            |__ index.ts
            |__ PageScroller.tsx
|__ .eslintrc.cjs
|__ package.json
|__ tsconfig.json
```


## React

### Hooks
Hooks should only be called at the top level of a React function before any early returns. This ensures that hooks are called in the same order each time a component renders.

In addition, only call Hooks from React function components or custom Hooks.

For more, see the React docs for [rules of hooks](https://reactjs.org/docs/hook-rules.html).
