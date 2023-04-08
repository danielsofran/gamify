export enum UserType {
    Guest = -1,
    Employee = 0,
    CEO = 1,
}

export enum Position {
    INTERN = 0,
    JUNIOR = 1,
    MIDDLE = 2,
    SENIOR = 3,
    MANAGER = 4,
    LEAD = 5,
}

export enum QuestDifficulty {
    EASY = 'E',
    MEDIUM = 'M',
    HARD = 'H',
}

export enum Status {
    PENDING = 'P',
    ACCEPTED = 'A',
    REJECTED = 'R',
}

export const QuestDifficultyMap = new Map<QuestDifficulty, string>([
    [QuestDifficulty.EASY, 'Easy'],
    [QuestDifficulty.MEDIUM, 'Medium'],
    [QuestDifficulty.HARD, 'Hard'],
]);
