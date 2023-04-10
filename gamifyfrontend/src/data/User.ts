import {Position, UserType} from "./enums";
import {BadgeReward} from "./BadgeReward";
import React from "react";

abstract class User {
    id: number = 0;
    username: string = "";
    password: string = "";
    email: string = "";
    first_name: string = "";
    last_name: string = "";
    image: string = ""; // image url
    type: UserType = UserType.Employee;
}

export class CEO extends User {
}

export class Employee extends User {
    id: number = 0;
    position: Position = Position.INTERN;
    salary: number = 0;
    date_employed: Date = new Date();
    date_of_birth: Date = new Date();
    tokens: number = 0;
    discount_next_purchase: number = 0;
    badges: BadgeReward[] = [];
}

export const deserializeUser = (input: any): CEO | Employee => {
    if(input['employee'] !== undefined && input['employee'] !== null) {
        let employee: Employee = Object.assign(new Employee(), input);
        employee = Object.assign(employee, input['employee']);
        employee.type = UserType.Employee;

        if('badges' in input && input['badges'] !== null && input['badges'] !== undefined)
        {
            employee.badges = input['badges'].map((badge: BadgeReward) => BadgeReward.deserialize(badge));
        }

        return employee;
    }
    let ceo: CEO = Object.assign(new CEO(), input);
    ceo.type = UserType.CEO;
    return ceo;
}

export class RegisterRequest {
    id: number = 0;
    username: string = "";
    email: string = "";
    first_name: string = "";
    last_name: string = "";
    date_of_birth: Date = new Date();
    image: string = "";

    static deserialize(input: any): RegisterRequest {
        return Object.assign(new RegisterRequest(), input);
    }

    static deserializeArray(input: any): RegisterRequest[] {
        return input.map(RegisterRequest.deserialize);
    }
}

export interface AuthData {
    user: Employee | CEO | null;
    roles: UserType[] | null;
}

export interface AuthResponse {
    auth: AuthData;
    setAuth: React.Dispatch<React.SetStateAction<AuthData>>
}