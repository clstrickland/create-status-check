import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import makeStatusRequest, { StatusRequest } from './makeStatusRequest';

async function run(): Promise<void> {
  const authToken: string = core.getInput('authToken');
  let octokit: Octokit | null = null;

  try {
    octokit = new Octokit({
      auth: authToken,
      userAgent: 'github-status-action',
      baseUrl: 'https://api.github.com',
      log: {
        debug: () => {},
        info: () => {},
        warn: console.warn,
        error: console.error
      },
      request: {
        agent: undefined,
        fetch: undefined,
        timeout: 0
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating octokit:\n${error.message}`);
      return;
    } else {
      core.setFailed(`Unknown Error creating octokit:\n${error}`);
      return;
    }
  }

  if (octokit == null) {
    core.setFailed('Error creating octokit: octokit was null');
    return;
  }

  let statusRequest: StatusRequest;
  try {
    statusRequest = makeStatusRequest();
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error creating status request object: ${error.message}`);
      return;
    } else {
      core.setFailed(`Unknown Error creating status request object:\n${error}`);
      return;
    }
  }

  try {
    await octokit.repos.createCommitStatus({
      ...statusRequest,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(
        `Error setting status: ${
          error.message
        }\nRequest object:\n${JSON.stringify(statusRequest, null, 2)}`
      );
    } else {
      core.setFailed(`Unknown Error setting status:\n${error}`);
    }
  }
}

run();
