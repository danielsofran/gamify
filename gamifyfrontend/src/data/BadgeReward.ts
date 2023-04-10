export class BadgeReward {
    id: number = 0;
    name: string = "";
    description: string = "";
    image: string = "";

    static deserialize(input: any): BadgeReward {
        return Object.assign(this, input);
    }
}