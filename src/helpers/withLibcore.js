// @flow

// TODO: `core` should be typed
type Job<A> = Object => Promise<A>

export default function withLibcore<A>(job: Job<A>): Promise<A> {
  const core = require('./init-libcore').default
  core.getPoolInstance()
  return job(core)
}
