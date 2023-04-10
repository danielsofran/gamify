import {Employee, CEO} from "./User";
import {QuestDifficulty} from "./enums";

export class Quest {
    id: number = 0;
    author: Employee | CEO = new Employee();
    title: string = "";
    description: string = "";
    difficulty: QuestDifficulty = QuestDifficulty.EASY;
    datetime_start: Date = new Date();
    datetime_end: Date = new Date();
    max_winners: number = 0;
    tokens: number = 0;

    no_of_winners: number = 0;
    solved?: boolean = false;

    static deserialize(input: any): Quest {
        let quest: Quest = Object.assign(new Quest(), input);
        quest.author = Object.assign(quest.author, input['author']);
        if('solved' in input && input['solved'] !== null && input['solved'] !== undefined)
        {
            quest.solved = input['solved'];
        }
        return quest;
    }

    static deserializeArray(input: any): Quest[] {
        // console.warn("Input: ", input)
        return input.map(Quest.deserialize);
    }
}

export class EmployeePoints {
    employee: Employee = new Employee();
    points: number = 0;

    static deserialize(input: any): EmployeePoints {
        let questSolve: EmployeePoints = Object.assign(new EmployeePoints(), input);
        questSolve.employee = Object.assign(questSolve.employee, input['employee']);
        return questSolve;
    }

    static deserializeArray(input: any): EmployeePoints[] {
        return input.map(EmployeePoints.deserialize);
    }
}