import {PullRequestEvent} from '@octokit/webhooks-types'
import {WebhookPayload} from '@actions/github/lib/interfaces'

export interface Tag {
  version: string
  module: string
  suffix: string
}

export interface PullRequest {
  number: string
  module: string
}

export type PullRequestPayload = WebhookPayload & PullRequestEvent

function tagVersion(payload: WebhookPayload): string {
  if (
    payload.ref === undefined ||
    payload.ref === null ||
    payload.ref.match(/refs\/tags\//) === null
  ) {
    return ''
  }
  return payload.ref.replace(
    /refs\/tags\/(?:([A-z0-9-_]+)-|)([0-9]+\.[0-9]+\.[0-9]+)$/,
    '$2'
  )
}

function tagModule(payload: WebhookPayload): string {
  if (
    payload.ref === undefined ||
    payload.ref === null ||
    payload.ref.match(/refs\/tags\//) === null
  ) {
    return ''
  }

  return payload.ref.replace(
    /refs\/tags\/([A-z0-9-_]+)-[0-9]+\.[0-9]+\.[0-9]+$/,
    '$1'
  )
}

function tagSuffix(payload: WebhookPayload): string {
  if (
    payload.ref === undefined ||
    payload.ref === null ||
    payload.ref.match(/refs\/tags\//) === null
  ) {
    return ''
  }

  return payload.ref.replace(
    /refs\/tags\/(?:([A-z0-9-_]+)-|)([0-9]+\.[0-9]+\.[0-9]+)(-|)(|[A-z]+)$/,
    '$4'
  )
}

export function tag(payload: WebhookPayload): Tag {
  return {
    version: tagVersion(payload),
    module: tagModule(payload),
    suffix: tagSuffix(payload)
  }
}

function pullRequestNumber(payload: PullRequestPayload): string {
  if (
    payload.issue === undefined ||
    payload.issue === null ||
    payload.issue.number === undefined ||
    payload.issue.number === null
  ) {
    return ''
  }

  return String(payload.issue.number)
}

function pullRequestModule(payload: PullRequestPayload): string {
  if (
    payload.pull_request === null ||
    payload.pull_request === undefined ||
    payload.pull_request.labels.length === 0
  ) {
    return ''
  }

  const result = payload.pull_request.labels.filter(label =>
    label.name.match(/^deploy(|-.*?) 🚀$/)
  )

  if (result.length > 1) {
    throw new Error(`🚨 배포 라벨은 단 하나만 설정할 수 있습니다.`)
  }

  if (result.length === 0) {
    return ''
  }

  return result[0].name
}

export function pullRequest(payload: PullRequestPayload): PullRequest {
  return {
    number: pullRequestNumber(payload),
    module: pullRequestModule(payload)
  }
}
