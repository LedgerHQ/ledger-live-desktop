#!/usr/bin/env node

/* eslint-disable no-console */

const util = require('util')
const exec = util.promisify(require('child_process').exec)
const octokit = require('@octokit/rest')()

const repo = {
  owner: 'LedgerHQ',
  repo: 'ledger-live-desktop',
}

async function getTag() {
  const { stdout } = await exec('git tag --points-at HEAD')
  const tag = stdout.replace('\n', '')

  if (!tag) {
    throw new Error(`Unable to get current tag. Is your HEAD on a tagged commit?`)
  }

  return tag
}

async function checkDraft(tag) {
  const { status, data } = await octokit.repos.getReleases(repo)

  if (status !== 200) {
    throw new Error(`Got HTTP status ${status} when trying to fetch releases list.`)
  }

  for (const release of data) {
    if (release.tag_name === tag) {
      if (release.draft) {
        return true
      }

      throw new Error(`A release tagged ${tag} exists but is not a draft.`)
    }
  }

  return false
}

async function createDraft(tag) {
  const params = {
    ...repo,
    tag_name: tag,
    name: tag,
    draft: true,
    prerelease: true,
  }

  const { status } = await octokit.repos.createRelease(params)

  if (status !== 201) {
    throw new Error(`Got HTTP status ${status} when trying to create the release draft.`)
  }
}

async function main() {
  try {
    const token = process.env.GH_TOKEN
    const tag = await getTag()

    octokit.authenticate({
      type: 'token',
      token,
    })

    const existingDraft = await checkDraft(tag)

    if (!existingDraft) {
      console.log(`No draft exists for ${tag}, creating...`)
      createDraft(tag)
    } else {
      console.log(`A draft already exists for ${tag}, nothing to do.`)
    }
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

main()
