type GuessResult = 'absent' | 'present' | 'correct'

export interface GuessSlot {
    slot: number
    guess: string
    result: GuessResult
}

export interface Guess {
    slots: GuessSlot[]
}