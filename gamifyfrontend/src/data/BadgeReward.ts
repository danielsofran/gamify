export class Badge {
    id: number = 0;
    name: string = "";
    description: string = "";
    image: string = "";

    deserialize(input: any): Badge {
        return Object.assign(this, input);
    }
}