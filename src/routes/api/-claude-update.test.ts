import { describe, expect, it } from 'vitest'
import { createRemoteStatus, remoteUrlMatchesExpectedRepo } from './claude-update'

describe('claude update repo gating', () => {
  it('matches Claude workspace repo aliases', () => {
    expect(remoteUrlMatchesExpectedRepo('https://github.com/example/hermeschi.git', ['hermeschi'])).toBe(true)
    expect(remoteUrlMatchesExpectedRepo('git@github.com:outsourc-e/hermeschi.git', ['outsourc-e/hermeschi'])).toBe(true)
  })

  it('blocks update availability for wrong remote repos even when heads differ', () => {
    const status = createRemoteStatus({
      name: 'origin',
      label: 'HermesChi',
      expectedRepo: 'hermeschi',
      aliases: ['hermeschi'],
      url: 'https://github.com/example/not-workspace.git',
      currentHead: 'local',
      remoteHead: 'remote',
    })

    expect(status.repoMatches).toBe(false)
    expect(status.updateAvailable).toBe(false)
    expect(status.error).toContain('expected hermeschi')
  })

  it('allows update availability only for the expected repo with a newer remote head', () => {
    const status = createRemoteStatus({
      name: 'upstream',
      label: 'Hermes Agent',
      expectedRepo: 'hermes-agent',
      aliases: ['hermes-agent'],
      url: 'https://github.com/NousResearch/hermes-agent.git',
      currentHead: 'local',
      remoteHead: 'remote',
    })

    expect(status.repoMatches).toBe(true)
    expect(status.updateAvailable).toBe(true)
    expect(status.error).toBeNull()
  })
})
