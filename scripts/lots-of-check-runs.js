const config = require('../config')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run() {
  const profile = await config()

  const post = profile.bent('POST', 'application/vnd.github.antiope-preview+json', 201)

  const body = x => {
    return {
      name: `Payload ${x} from github-lab`,
      head_sha: profile.headSha, // Get a sha you want to create checks runs on and put it here
      status: 'queued',
      started_at: new Date(),
      output: {
        title: `Probot check #${x}!`,
        summary: `Payload from github-lab is queued`
      },
      actions: [
        {
          label: `Try #${x} again`,
          description: 'Run this check again!',
          identifier: 'Try again!'
        },
        {
          label: 'Do something else',
          description: 'This will do something else',
          identifier: 'Do something else!'
        }
      ]
    }
  }

  for (const x of Array(20).keys()) {
    await post(`/repos/${profile.resource}/${profile.repo}/check-runs`, body(x + 1))
    console.log(`Sent payload #${x + 1}`)
    await sleep(2000)
  }
  return
}

run().catch(err => console.error(err.message))
