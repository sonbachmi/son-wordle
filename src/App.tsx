import {ChangeEvent, FormEvent, useState} from 'react'

import './App.css'
import {guessRandom} from '../api.ts'
import {Guess} from './models/api.ts'
import {GameResult} from './models/game.ts'
import {guessWord} from './ai.ts'

function newSeed() {
    return 100
}

function App() {
    const [seed, setSeed] = useState(newSeed())
    const [word, setWord] = useState('')
    const [guesses, setGuesses] = useState<Guess[]>([])
    const [result, setResult] = useState<GameResult>(null)

    function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
        setWord(e.target.value)
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        try {
            const result = await guessRandom(word, seed)
            if (result?.length !== 5) throw new Error('Unexpected API result')
            console.log(result)
            const guess: Guess = {slots: result}
            const aiGuess = guessWord([...guesses, guess])
            console.log(aiGuess)
            setGuesses(g => ([...g, guess]))

            if (guesses.length > 4) {
                setResult('lose')
            }
        } catch (err) {
            console.log(err)
        }
    }

    function resetGame() {
        setResult(null)
        setSeed(newSeed())
        setGuesses([])
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
                        <input type="text" required minLength={5} maxLength={5} value={word}
                               onChange={handleInputChange}/>
                        <button type="submit">Submit Guess</button>
                    </form>
                )}
                {result && <div className="result">
                    <div className="message">
                        {result === 'win' ? 'Congratulations! Yon won' : 'You lost. Good luck next time'}
                    </div>
                    <button onClick={() => resetGame()}>New Game</button>
                </div>}
            </div>
        </>
    )
}

export default App
