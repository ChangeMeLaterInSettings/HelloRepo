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
*  init: () => Promise<number | null>,
*  install: (packages: string[], installAsDevDependency?: boolean) => Promise<number | null>,
* }} PackageManager
*/

/**
 * @param {string} name
 * @param {string} init
 * @param {string} install
 * @returns {PackageManager}
 */
function PackageManager(name, init, install) {
    return {
        name,
        init: () => exec(`${name} ${init}`),
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
        {name: 'pnpm', init: async () => exec('pnpm init'), install: async (packages) => exec(`pnpm add ${packages.join(' ')}`)},
        {name: 'yarn', init: async () => exec('yarn init -y'), install: 'add'},
        {name: 'npm', init: async () => exec('npm init -y'), install: 'i'},
    ];

    for (const choice of choices) {
        if ((await exec(`which ${choice.name}`)) === 0) {
            console.info(`🛠️ Using ${choice.name} as the package manager...`)
            return choice;
        }
    }
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
    const framework = process.argv[2];

    if (!await exists('package.json')) {
        console.info('🙅🏽‍♂️ No package.json detected. Creating one...');

        await packageManager.init();
        devPackages.push('typescript');

        console.log('✅ Created package.json.\n');
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
            packages.push('solid-js');
        }

        await fs.copyFile(source, '.eslintrc.cjs');

        console.log('✅ Copied .eslintrc.cjs.\n');
    }

    if (!await exists('.eslintignore')) {
        console.info('🙅🏽‍♂️ No .eslintignore detected. Copying one...');

        await fs.copyFile('./configs/eslint/.eslintignore', '.eslintignore');

        console.log('✅ Copied .eslintignore.\n');
    }

    await packageManager.install(devPackages);
    await packageManager.install(packages, false);
}

main().then();
