import {CEO, deserializeUser, Employee} from "./User";
import {Position, RequestStatus} from "./enums";

class RewardRequst {
    id: number = 0;
    user: Employee = new Employee();
    description: string = "";
    datetime_requested: Date = new Date();
    state: RequestStatus = RequestStatus.PENDING;

    static deserialize(input: any): RewardRequst {
        let rewardRequest: RewardRequst = Object.assign(new RewardRequst(), input);
        let employee = deserializeUser(input['user']);
        if(employee instanceof Employee)
            rewardRequest.user = employee;
        else throw new Error("Requester user is not an employee");
        return rewardRequest;
    }

    static deserializeArray(input: any): RewardRequst[] {
        return input.map(RewardRequst.deserialize);
    }
}

export class SalaryIncreaseRequest extends RewardRequst {
    fixed_amount: number = 0;
    percentage: number = 0;
    salary_increase: number = 0;

    static deserialize(input: any): SalaryIncreaseRequest {
        let salaryIncreaseRequest: any = RewardRequst.deserialize(input);
        salaryIncreaseRequest['fixex_amount'] = input['fixex_amount'];
        salaryIncreaseRequest['percentage'] = input['percentage'];
        salaryIncreaseRequest['salary_increase'] = input['salary_increase'];
        console.log(salaryIncreaseRequest)
        return salaryIncreaseRequest;
    }

    static deserializeArray(input: any): SalaryIncreaseRequest[] {
        return input.map(SalaryIncreaseRequest.deserialize);
    }
}

export class FreeDaysRequest extends RewardRequst {
    date_free_days_start: Date = new Date();
    date_free_days_end: Date = new Date();

    static deserialize(input: any): FreeDaysRequest {
        let freeDaysRequest: any = RewardRequst.deserialize(input);
        freeDaysRequest['date_free_days_start'] = input['date_free_days_start'];
        freeDaysRequest['date_free_days_end'] = input['date_free_days_end'];
        return freeDaysRequest;
    }

    static deserializeArray(input: any): FreeDaysRequest[] {
        return input.map(FreeDaysRequest.deserialize);
    }
}

export class CareerDevelopmentRequest extends RewardRequst {
    position_requested:Position = Position.INTERN;

    static deserialize(input: any): CareerDevelopmentRequest {
        let careerDevelopmentRequest: any = RewardRequst.deserialize(input);
        careerDevelopmentRequest['position_requested'] = input['position_requested'];
        return careerDevelopmentRequest;
    }

    static deserializeArray(input: any): CareerDevelopmentRequest[] {
        return input.map(CareerDevelopmentRequest.deserialize);
    }
}