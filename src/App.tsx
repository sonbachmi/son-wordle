import {ChangeEvent, FormEvent, useEffect, useState} from 'react'

import './App.css'
import {guessRandom} from './api.ts'
import {Guess} from './models/api.ts'
import {GameResult} from './models/game.ts'
import {guessWord, isCorrectGuess} from './ai.ts'

function newSeed() {
    return Math.floor(Math.random() * 10000)
}

function App() {
    const [seed, setSeed] = useState(newSeed())
    const [word, setWord] = useState('')
    const [guesses, setGuesses] = useState<Guess[]>([])
    const [autoGuess, setAutoGuess] = useState(false)
    const [result, setResult] = useState<GameResult>(null)

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setWord(e.target.value)
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
                throw new Error('Unexpected API result')
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
            } else if (guesses.length > 4) {
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
        setAutoGuess(false)
    }

    return (
        <>
            <h1>Guess Random Word</h1>
            <div className="guesses">
                {guesses.map((guess, i) => {
                    return (
                        <div className="guess" key={i}>
                            {guess.slots.map((s, i) => {
                                return (
                                    <div
                                        className={'slot ' + s.result}
                                        key={i}>
                                        {s.guess.toUpperCase()}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
            <div className="form">
                {!result && (
                    <form onSubmit={handleSubmit}>
                        <input type="checkbox" id="autoguess" checked={autoGuess}
                               onChange={handleCheckboxChange}/>
                        <label htmlFor="autoguess">Auto guess:</label>
                        <input type="text" required autoFocus minLength={5} maxLength={5} value={word}
                               onChange={handleInputChange}/>
                        <button type="submit">Submit Guess</button>
                    </form>
                )}
                {result && <div className="result">
                    <div className="message">
                        {result === 'win' ? 'Congratulations! You won' : 'You lost. Good luck next time'}
                    </div>
                    <button onClick={() => resetGame()}>New Game</button>
                </div>}
            </div>
        </>
    )
}

export default App
