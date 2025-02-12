import {describe, it} from 'node:test'
import assert from 'node:assert/strict'

import {guessRandom} from './api.ts'

describe('API', () => {
    it('should connect to api and get result for random word guess', async () => {
        const seed = 1
        const result = await guessRandom('slate', seed)
        assert(result.length === 5)
    })
})

