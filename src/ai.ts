import validWords from './valid-wordle-words.txt?raw'
import {Guess} from './models/api.ts'

const words = validWords.split('\n')
console.log(words)

export function isValidWord(word: string, guesses: Guess[]) {
    let valid = true
    for (const guess of guesses) {
        const guessWord = guess.slots.map(s => s.guess).join('')
        if (guessWord === word) continue
        for (const slot of guess.slots) {
            switch (slot.result) {
                case 'absent':
                    if (word.includes(slot.guess)) {
                        valid = false
                        break
                    }
                    break
                case 'present':
                    if (!word.includes(slot.guess)) {
                        valid = false
                        break
                    }
                    break
                case 'correct':
                    if (word[slot.slot] !== slot.guess) {
                        valid = false
                        break
                    }
                    break
            }
        }
        if (valid) {
            return true
        }
    }
    return false
}

/**
 * Guess based on results of past guesses
 * @param guesses List of guess results as returned by API
 * Using bruteforce to scan a list of valid words for now
 */

export function guessWord(guesses: Guess[]) {
    for (const word of words) {
        if (isValidWord(word, guesses)) return true
    }
    return false
}

