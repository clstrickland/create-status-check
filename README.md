# Create Status Check

<p align="center">
  <a href="https://github.com/billyjbryant/create-status-check"><img alt="create-status-check status"
  src="https://github.com/billyjbryant/create-status-check/workflows/test/badge.svg"></a>
  <a href="https://github.com/billyjbryant/create-status-check"><img alt="create-status-check status" src="https://github.com/billyjbryant/create-status-check/workflows/build/badge.svg"></a>
</p>

Adds a status check update to a commit. GitHub will always show the latest state of a context.

> **Note**
>
> This action was forked from [Sibz/github-status-action](https://github.com/Sibz/github-status-action) which has not been updated in 2+ years. Rather than create another PR, I forked it to a new action, updated all dependencies and restored build tests.

## Usage

### Inputs

| Input         | Description                                                                                                                               | Default                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `authToken`   | Use secrets.GITHUB_TOKEN or your own token if you need to trigger other workflows that use "on: status"                                   | Required                        |
| `state`       | The status of the check should only be `success`, `error`, `failure` or `pending`                                                         | Required                        |
| `context`     | The context, this is displayed as the name of the check                                                                                   |                                 |
| `description` | Short text explaining the status of the check                                                                                             |                                 |
| `owner`       | Repository owner, defaults to context github.repository_owner if omitted                                                                  | context github.repository_owner |
| `repository`  | Repository, default to context github.repository if omitted                                                                               | context github.repository       |
| `sha`         | SHA of commit to update status on, defaults to context github.sha. _If using `on: pull_request` use `github.event.pull_request.head.sha`_ | context github.sha              |
| `target_url`  | Url to use for the details link. If omitted no link is shown                                                                              |                                 |

### Outputs

None.

## Example

```yml
name: 'test'
on: # run on any PRs and main branch changes
pull_request:
push:
  branches:
    - main

jobs:
test: # make sure the action works on a clean machine without building
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - name: Run the action # You would run your tests before this using the output to set state/desc
      uses: mapbox/create-status-check@v1
      with:
        authToken: ${{secrets.GITHUB_TOKEN}}
        context: 'Test run'
        description: 'Passed'
        state: 'success'
        sha: ${{github.event.pull_request.head.sha || github.sha}}
```
