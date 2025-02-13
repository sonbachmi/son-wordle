import {ChangeEvent, FormEvent, useEffect, useState} from 'react'

import './App.css'
import {guessRandom} from './api.ts'
import {Guess} from './models/api.ts'
import {GameResult} from './models/game.ts'
import {guessWord, isCorrectGuess} from './ai.ts'

function newSeed() {
    return Math.floor(Math.random() * 10000)
}

function padWord(word: string) {
    return Array.from({length: 5},
        (s, i) => word.charAt(i)?.toUpperCase() || ' ')
}

function GuessWord({guess, index}: { guess: Guess, index: number }) {
    const {word, slots} = guess
    return (
        <div className={'guess' + (index === -1 ? ' preview' : '')} key={index}>
            {padWord(word).map((s, i) => {
                const slot = slots[i]
                return (
                    <div
                        className={'slot ' + (slot?.result || '')}
                        key={i}>
                        {s.toUpperCase()}
                    </div>
                )
            })}
        </div>
    )
}

function App() {
    const [seed, setSeed] = useState(newSeed())
    const [word, setWord] = useState('')
    const [guesses, setGuesses] = useState<Guess[]>([])
    const [autoGuess, setAutoGuess] = useState(false)
    const [result, setResult] = useState<GameResult>(null)

    const lastGuess = guesses.length ? guesses[guesses.length - 1] : null
    const newGuess: Guess = {
        word,
        slots: word.split('').map((l, i) => {
            return {
                slot: i,
                guess: l,
                result: lastGuess?.slots[i].guess === l && lastGuess?.slots[i].result === 'correct' ? 'correct' :
                    guesses.some(g => g.slots.some(s =>
                        s.guess === l && s.result === 'absent')) ? 'absent' :
                        guesses.some(g => g.slots[i].guess === l && g.slots[i].result === 'present') ? 'present' :
                            null
            }
        })
    }

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        const word = e.target.value
        if (!/^[a-z]*$/i.test(word)) return
        setWord(word)
    }

    function handleCheckboxChange(e: ChangeEvent<HTMLInputElement>) {
        setAutoGuess(e.target.checked)
        if (e.target.checked) {
            setWord(guessWord(guesses) || '')
        } else {
            setWord('')
        }
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        try {
            const result = await guessRandom(word, seed)
            if (result?.length !== 5)
                return Promise.reject('Unexpected API result')
            // console.log(result)
            const guess: Guess = {
                word,
                slots: result
            }
            const newGuesses = [...guesses, guess]
            setGuesses(newGuesses)
            setWord('')

            if (isCorrectGuess(guess)) {
                setResult('win')
            } else if (newGuesses.length > 5) {
                setResult('lose')
            } else {
                setWord(autoGuess ? guessWord(newGuesses) || '' : '')
            }
        } catch (err) {
            console.log(err)
        }
    }

    function resetGame() {
        setResult(null)
        setSeed(newSeed())
        setGuesses([])
        if (autoGuess) {
            setWord(guessWord([]) || '')
        }
        // setAutoGuess(false)
    }

    return (
        <>
            <h1>Guess Random Word</h1>
            <div className="guesses">
                {guesses.map((guess, i) =>
                    <GuessWord guess={guess} index={i} key={i}/>
                )}
                {!result &&
                    <GuessWord guess={newGuess} index={-1} key={-1}/>
                }

            </div>
            <div className="form">
                {!result && (
                    <form onSubmit={handleSubmit}>
                        <input type="checkbox" id="autoguess" checked={autoGuess}
                               onChange={handleCheckboxChange}/>
                        <label htmlFor="autoguess">Auto guess</label>
                        <input type="text" required autoFocus minLength={5} maxLength={5} value={word}
                               placeholder="Enter 5-letter word"
                               onChange={handleInputChange}/>
                        <button type="submit">Submit Guess</button>
                    </form>
                )}
                {result && <div className="result">
                    <div className="message">
                        {result === 'win' ? 'Congratulations! You won.' : 'You lost. Good luck next time!'}
                    </div>
                    <button onClick={() => resetGame()}>New Game</button>
                </div>}
            </div>
        </>
    )
}

export default App
