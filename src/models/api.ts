type GuessResult = 'absent' | 'present' | 'correct'

export interface GuessSlot {
    slot: number
    guess: string
    result: GuessResult | null
}

export interface Guess {
    word: string
    slots: GuessSlot[]
}