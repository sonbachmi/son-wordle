import validWords from './valid-wordle-words.json'
import {Guess} from './models/api.ts'

/**
 * Check a guess if its valid based on results of past guesses
 * @param word
 * @param guesses List of guess results as returned by API
 *
 */

export function isValidWord(word: string, guesses: Guess[]) {
    let valid = true
    for (const guess of guesses) {
        if (guess.word === word) {
            valid = false
            break
        }
        if (guess.slots.some(slot => {
            if (slot.result === 'absent')
                return word.includes(slot.guess)
            else if (slot.result === 'present')
                return !word.includes(slot.guess) || word.charAt(slot.slot) === slot.guess
            else if (slot.result === 'correct')
                return word.charAt(slot.slot) !== slot.guess
            return false
        })) {
            valid = false
        }
    }
    return valid
}

/**
 * Guess based on results of past guesses
 * @param guesses List of guess results as returned by API
 * Using bruteforce to scan a list of valid words for now
 */

export function guessWord(guesses: Guess[]) {
    if (!guesses?.length) {
        return 'tales'
    }
    for (const word of validWords) {
        if (isValidWord(word, guesses)) return word
    }
    return null
}

export function isCorrectGuess(guess: Guess) {
    return guess.slots.every(slot => slot.result === 'correct')
}