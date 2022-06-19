import { generateContributors } from './changelog';

async function run() {
  await Promise.all([
    generateContributors(),
  ]);
}

run();
