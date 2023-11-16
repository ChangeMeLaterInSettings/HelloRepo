import {exec as nodeExec} from 'node:child_process';
import fs from 'node:fs/promises';

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
    }
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
            console.info(`🛠️ Using ${choice.name} as the package manager...\n`)
            return choice;
        }
    }

    throw new Error('🤯 No package manager was found. Do you have Node.js installed?');
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
 * @returns {Promise<void>}
 */
async function main() {
    const packageManager = await resolvePackageManager();
    /** @type {string[]} */
    const devPackages = [];
    /** @type {string[]} */
    const packages = [];
    
    /** @type {string | undefined} */
    const framework = process.argv[2]?.toLowerCase();

    if (!await exists('package.json')) {
        console.error('🙉 No package.json detected. Please initialize your project before proceeding.\n');
        console.info('🎭 For frontend projects, try initializing the project using: `npx create-vite`');

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

        let source = './configs/eslint/.eslintrc.cjs';

        if (framework === 'solid') {
            source = './configs/eslint/.eslintrc.solid.cjs';
            devPackages.push(
                'eslint-plugin-jsx-a11y',
                'eslint-plugin-solid',
            );
        }

        if (framework === 'react') {
            source = './configs/eslint/.eslintrc.react.cjs';
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

        await fs.copyFile('./configs/eslint/.eslintignore', '.eslintignore');

        console.log('✅ Copied .eslintignore.\n');
    }

    if (devPackages.length > 0) {
        console.info('📦 Installing development packages...');
        await packageManager.install(devPackages);
    
        console.info('✅ Installed:');
        for (const pkg of devPackages) {
            console.info('\t-', pkg);
        }
    }

    if (packages.length > 0) {
        console.info('📦 Installing development packages...');
        await packageManager.install(packages, false);

        console.info('✅ Installed:\n');
    
        for (const pkg of [...packages, ...devPackages]) {
            console.info('\t-', pkg);
        }
    }

    console.info('\n🎉 Done!');
}

main().then();
