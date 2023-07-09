type User = {
    emailAddress: string
    password: string
}

type JournalEntry = {
    entry: string
}

type TokenPayload = {
    id: string;
    emailAddress: string;
}
export {
    User,
    JournalEntry,
    TokenPayload
}