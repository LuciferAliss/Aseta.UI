export interface ValidError extends Error {}

export class ValidError extends Error implements ValidError {
    constructor(message: string, code?: string) {
        super(message);
        this.name = 'ValidError'; 
        Object.setPrototypeOf(this, ValidError.prototype);
    }
}