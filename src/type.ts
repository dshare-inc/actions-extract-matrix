import * as core from '@actions/core'
import {PullRequestPayload, pullRequest, tag} from './extract'
import {context} from '@actions/github'

export const Actions: {
  [K: string]: () => void
} = {
  Extract: () => {
    try {
      core.setOutput(
        'pull_request_number',
        pullRequest(context.payload as PullRequestPayload).number
      )
      core.setOutput(
        'pull_request_module',
        pullRequest(context.payload as PullRequestPayload).module
      )
      core.setOutput('tag_version', tag(context.payload).version)
      core.setOutput('tag_module', tag(context.payload).module)
      core.setOutput('tag_suffix', tag(context.payload).suffix)

      core.debug(
        JSON.stringify(pullRequest(context.payload as PullRequestPayload))
      )
      core.debug(JSON.stringify(tag(context.payload)))
    } catch (e) {
      if (e instanceof Error) core.setFailed(e.message)

      core.setFailed(`🚨 Unknown Error`)
      core.debug(JSON.stringify(e))
    }
  }
}
