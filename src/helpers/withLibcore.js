// @flow

// TODO: `core` should be typed
type Job<A> = Object => Promise<A>

let counter = 0
export default async function withLibcore<A>(job: Job<A>): Promise<A> {
  const core = require('./init-libcore').default
  core.getPoolInstance()
  try {
    if (counter++ === 0 && !process.env.CLI) {
      process.send({
        type: 'setLibcoreBusy',
        busy: true,
      })
    }
    const res = await job(core)
    return res
  } finally {
    if (--counter === 0 && !process.env.CLI) {
      process.send({
        type: 'setLibcoreBusy',
        busy: false,
      })
    }
  }
}
