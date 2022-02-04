import * as core from '@actions/core'
import {Actions} from './type'

async function run(): Promise<void> {
  Actions[core.getInput('type', {required: true})]()
}

run()
