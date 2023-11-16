import {exec as nodeExec} from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string} command
 * @returns {Promise<number | null>}
 */
function exec(command) {
    return new Promise((resolve) => {
        const child = nodeExec(command);

        child.on('exit', (code) => resolve(code));
    });  
}

/**
 * @typedef {{
*  name: string,
*  install: (packages: string[], installAsDevDependency?: boolean) => Promise<number | null>,
* }} PackageManager
*/

/**
 * @param {string} name
 * @param {string} install
 * @returns {PackageManager}
 */
function PackageManager(name, install) {
    return {
        name,
        install: (packages, installAsDevDependency = true) => installAsDevDependency
            ? exec(`${name} ${install} -D ${packages.join(' ')}`)
            : exec(`${name} ${install} ${packages.join(' ')}`),
    };
}

/**
 * @returns {Promise<PackageManager>}
 */
async function resolvePackageManager() {
    const choices = [
        PackageManager('pnpm', 'add'),
        PackageManager('yarn', 'add'),
        PackageManager('npm', 'i'),
    ];

    for (const choice of choices) {
        if ((await exec(`which ${choice.name}`)) === 0) {
            console.info(`🛠️ Using ${choice.name} as the package manager...`);
            return choice;
        }
    }

    throw new Error('😵 No package manager was found. Do you have Node.js installed?');
}

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function exists(path) {
    try {
        await fs.access(path, fs.constants.F_OK);
        return true;
    } catch (_error) {
        return false;
    }
}

/**
 * @param {string} configFolderName
 * @param {Array<{name: string; files: string[]}>} subconfigFolders
 * @returns {Promise<boolean>}
 */
async function isConfigFolderValid(configFolderName, subconfigFolders) {
    if (!(await exists(configFolderName)) || !(await fs.lstat(configFolderName)).isDirectory()) {
        console.error(
            '😵 No `config` folder was found.\n', 
            'Please make sure to run this script from the root of your project.',
        );
        console.error('Current Working Directory:', process.cwd());

        return false;
    }

    let didSubfoldersError = false;
    for (const folder of subconfigFolders) {
        let didSubfolderError = false;

        const folderPath = path.join(configFolderName, folder.name);
        if (!(await exists(folderPath)) || !(await fs.lstat(folderPath)).isDirectory()) {
            console.error(
                `❌ The \`${configFolderName}\` folder is missing a \`${folder.name}\` folder.`,
            );

            didSubfoldersError = true;
            didSubfolderError = true;
        }

        if (!didSubfolderError) {
            for (const file of folder.files) {
                const filePath = path.join(folderPath, file);
                if (!(await exists(filePath))) {
                    console.error(`❌ The \`${folder.name}\` config folder is missing \`${file}\`.`);
    
                    didSubfoldersError = true;
                }
            }
        }
    }

    if (didSubfoldersError) {
        console.error(`😵 Please update your project with the proper files.`);
    }    

    return !didSubfoldersError;
}

/**
 * @returns {Promise<void>}
 */
async function main() {
    const configFolder = 'configs';
    const eslintFolder = 'eslint';

    if (!(await isConfigFolderValid(
        configFolder, 
        [
            {
                name: 'eslint', 
                files: [
                    '.eslintrc.cjs',
                    '.eslintrc.react.cjs',
                    '.eslintrc.solid.cjs',
                    '.eslintignore',
                ],
            },
        ],
    ))) {
        process.exit(1);
    }

    const configEslintFolder = path.join(configFolder, eslintFolder);

    const packageManager = await resolvePackageManager();
    /** @type {string[]} */
    const devPackages = [];
    /** @type {string[]} */
    const packages = [];
    
    /** @type {string | undefined} */
    const framework = process.argv[2]?.toLowerCase();

    if (framework !== undefined) {
        console.info('... and', framework, 'as your framework...');
    }

    console.info('');

    if (!await exists('package.json')) {
        console.error(
            '🙉 No package.json detected. Please initialize your project before proceeding.\n',
        );
        console.info(
            '🎭 For frontend projects, try initializing the project using: `npx create-vite`',
        );

        process.exit(1);
    }

    devPackages.push(
        'eslint',
        'eslint-define-config',
        'eslint-plugin-import',
        'eslint-plugin-promise',
        'eslint-plugin-simple-import-sort',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
    );

    if (!await exists('.eslintrc.cjs')) {
        console.info('🙅🏽‍♂️ No .eslintrc.cjs detected. Copying one...');

        let source = path.resolve(configEslintFolder, '.eslintrc.cjs');

        if (framework === 'solid') {
            source = path.resolve(configEslintFolder, '.eslintrc.solid.cjs');
            devPackages.push(
                'eslint-plugin-jsx-a11y',
                'eslint-plugin-solid',
            );
        }

        if (framework === 'react') {
            source = path.resolve(configEslintFolder, '.eslintrc.react.cjs');
            devPackages.push(
                'eslint-plugin-jsx-a11y',
                'eslint-plugin-react',
                'eslint-plugin-react-hooks',
            );
        }

        await fs.copyFile(source, '.eslintrc.cjs');

        console.log('✅ Copied .eslintrc.cjs.\n');
    }

    if (!await exists('.eslintignore')) {
        console.info('🙅🏽‍♂️ No .eslintignore detected. Copying one...');

        await fs.copyFile(
            path.resolve(configEslintFolder, '.eslintignore'),
            '.eslintignore',
        );

        console.log('✅ Copied .eslintignore.\n');
    }

    if (devPackages.length > 0) {
        console.info('📦 Installing development packages...');
        await packageManager.install(devPackages);
    
        console.info('✅ Installed:');
        for (const pkg of devPackages) {
            console.info('  -', pkg);
        }
    }

    if (packages.length > 0) {
        console.info('📦 Installing development packages...');
        await packageManager.install(packages, false);

        console.info('✅ Installed:\n');
    
        for (const pkg of packages) {
            console.info('  -', pkg);
        }
    }

    console.info('\n🎉 Done!');
}

main().then();
