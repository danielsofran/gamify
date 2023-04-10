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

export enum QuestStatus {
    NOT_STARTED = 0,
    IN_PROGRESS = 1,
    FINISHED = 2,
}

export enum RequestStatus {
    PENDING = 'P',
    ACCEPTED = 'A',
    REJECTED = 'R',
}

export enum RequestType {
    SALARY_INCREASE = 0,
    FREE_DAYS = 1,
    CAREER_DEVELOPMENT = 2,
}

export const QuestDifficultyMap = new Map<QuestDifficulty, string>([
    [QuestDifficulty.EASY, 'Easy'],
    [QuestDifficulty.MEDIUM, 'Medium'],
    [QuestDifficulty.HARD, 'Hard'],
]);

export const PositionMap = new Map<Position, string>([
    [Position.INTERN, 'Intern'],
    [Position.JUNIOR, 'Junior'],
    [Position.MIDDLE, 'Middle'],
    [Position.SENIOR, 'Senior'],
    [Position.MANAGER, 'Manager'],
    [Position.LEAD, 'Lead'],
]);

export const UserTypeMap = new Map<UserType, string>([
    [UserType.Employee, 'Employee'],
    [UserType.CEO, 'CEO'],
]);

export const RequestStatusMap = new Map<RequestStatus, string>([
    [RequestStatus.PENDING, 'Pending'],
    [RequestStatus.ACCEPTED, 'Accepted'],
    [RequestStatus.REJECTED, 'Rejected'],
]);

export const RequestTypeMap = new Map<RequestType, string>([
    [RequestType.SALARY_INCREASE, 'Salary increase'],
    [RequestType.FREE_DAYS, 'Free days'],
    [RequestType.CAREER_DEVELOPMENT, 'Career development'],
]);