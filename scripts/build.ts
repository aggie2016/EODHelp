import yargs from 'yargs';
import { copySync } from 'fs-extra';
import { existsSync, rmdirSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

interface IBuildOptions {
    buildType?: string | 'development' | 'production';
    outputDirectory: string;
    clearExisting?: boolean;
    minify?: string;
}

const build = (options: IBuildOptions) => {
    if (process.env.NODE_ENV === undefined) {
        if (options.buildType) {
            process.env.NODE_ENV = options.buildType;
        } else {
            console.error(
                'Unable to determine build type. Define build type by setting the NODE_ENV environment variable.'
            );
        }
    }

    options.outputDirectory = resolve(options.outputDirectory);

    console.log(`==== Starting build [${process.env.NODE_ENV}] ====`);

    if (!existsSync(options.outputDirectory)) {
        console.warn(
            `The output directory specified ${options.outputDirectory} does not exist and will be created.`
        );
    } else {
        console.log(`The contents of ${options.outputDirectory} will be replaced...`);
        rmdirSync(options.outputDirectory, {
            recursive: true,
        });
    }

    execSync('pnpx react-scripts build');

    copySync('./build', options.outputDirectory);

    console.log('Compiled application built and copied to: ' + options.outputDirectory);
};

build(
    yargs(process.argv).options({
        buildType: { choices: ['development', 'production'], demandOption: false },
        outputDirectory: { type: 'string', demandOption: true, alias: 'o' },
        clearExisting: { type: 'boolean', demandOption: false },
        minify: { type: 'string', demandOption: false },
    }).argv
);
