import {GuessSlot} from './models/api.ts'

const apiUrl = 'https://wordle.votee.dev:8000'

export function guessRandom(guess: string, seed: number): Promise<GuessSlot[]> {
    const data = {
        guess,
        size: guess.length.toString(),
        seed: seed.toString()
    }
    const params = new URLSearchParams(data)
    return fetch(apiUrl + '/random?' + params.toString())
        .then(res => {
            if (!res.ok) {
                if (res.status === 422) {
                    return res.json().then(data => {
                        console.log(data)
                        return Promise.reject(new Error(data.detail))
                    })
                }
            }
            return res.json()
        }).catch(err => Promise.reject(err))
}