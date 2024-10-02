#!/usr/bin/env node
import util from 'util';
import path from 'path';
import fs from 'fs';
import FsExt from 'fs-extra';
import inquirer from 'inquirer';
import { execSync, exec as cpExec } from 'child_process';

// Utility functions
const exec = util.promisify(cpExec);
const makePath = (...p) => path.join(...p);

async function runCmd(command) {
  try {
    const { stdout, stderr } = await exec(command);
    console.log(stdout);
    console.log(stderr);
  } catch {
    (error) => {
      console.log(error);
    };
  }
}

async function hasYarn() {
  try {
    await execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function promptForMissingOptions() {
  const questions = [];
  questions.push({
    type: 'input',
    name: 'projectName',
    message: 'Please choose a name for the project, this will also be the folder name:',
    validate: function (input) {
      if (input) return true;
      else return 'Project name is required.';
    },
  });
  questions.push({
    type: 'input',
    name: 'awsRegion',
    message: 'Please choose an AWS region:',
    validate: function (input) {
      if (input) return true;
      else return 'AWS region is required.';
    },
  });
  questions.push({
    type: 'input',
    name: 'awsS3BucketName',
    message: 'Please choose a name for the S3 bucket where AWS SAM files will be uploaded:',
    default: 'ts-starter-1',
  });
  questions.push({
    type: 'input',
    name: 'awsCloudFormationStackName',
    message: 'Please choose a name for the AWS CloudFormation stack:',
    default: 'TSStarter1Stack',
  });

  return await inquirer.prompt(questions);
}

async function setup() {
  try {
    const options = await promptForMissingOptions();
    // Define constants
    const ownPath = process.cwd();
    const folderName = options.projectName;
    const appPath = path.join(ownPath, folderName);
    const repo = 'https://github.com/kazizehsan/ts-starter-1.git';

    // Check if directory already exists
    try {
      fs.mkdirSync(appPath);
    } catch (err) {
      if (err.code === 'EEXIST') {
        console.log('Directory already exists. Please choose another name for the project.');
      } else {
        console.log(err);
      }
      process.exit(1);
    }

    // Change directory
    process.chdir(appPath);

    // Clone repo
    console.log(`Downloading files from repo ${repo}`);
    await runCmd(`git clone --depth 1 ${repo} .`);
    console.log('Cloned successfully.');
    console.log('');

    const pkg = FsExt.readJsonSync(makePath(appPath, 'package.json'));
    pkg.name = folderName;
    delete pkg.bin;
    delete pkg.repository;
    delete pkg.author;
    pkg.config['region'] = options.awsRegion;
    pkg.config['s3BucketName'] = options.awsS3BucketName;
    pkg.config['cloudFormationStackName'] = options.awsCloudFormationStackName;
    FsExt.writeJsonSync(makePath(appPath, 'package.json'), pkg, { spaces: 2 });

    FsExt.removeSync(makePath(appPath, 'bin'));

    // Install dependencies
    const useYarn = await hasYarn();
    console.log('Installing dependencies...');
    if (useYarn) {
      await runCmd('yarn install');
    } else {
      await runCmd('npm install');
    }
    console.log('Dependencies installed successfully.');
    console.log();

    // Copy envornment variables
    fs.copyFileSync(path.join(appPath, '.env.example'), path.join(appPath, '.env'));
    console.log('Environment files copied. You may want to change some values in .env file.');

    // Delete .git folder
    await runCmd('npx rimraf ./.git');

    // Remove extra files
    if (!useYarn) {
      fs.unlinkSync(path.join(appPath, 'yarn.lock'));
    }

    console.log('Installation is now complete!');
    console.log();

    console.log(
      'If you have changed the project name from ts-starter-1, then remove references to it from the following files:'
    );
    console.log('    - .env');
    console.log('    - sam-template.yaml');
    console.log();

    console.log('We suggest that you start by running MongoDB locally and then typing:');
    console.log(`    cd ${folderName}`);
    console.log(useYarn ? '    yarn dev' : '    npm run dev');
    console.log();
    console.log('Enjoy your production-ready Node.js app, which already supports a large number of ready-made features!');
    console.log('Check README.md for more info.');
  } catch (error) {
    console.log(error);
  }
}

setup();
