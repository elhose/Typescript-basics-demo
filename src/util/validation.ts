namespace App {
    //validation logic
    export interface Validatable {
        value?: string | number;
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
    }

    export function validate(inputToValidate: Validatable) {
        let isValid = true;

        if (inputToValidate.required) {
            isValid = isValid && inputToValidate.value!.toString().trim().length !== 0;
        }

        if (inputToValidate.minLength != null && typeof inputToValidate.value === "string") {
            isValid = isValid && inputToValidate.value.length > inputToValidate.minLength;
        }

        if (inputToValidate.maxLength != null && typeof inputToValidate.value === "string") {
            isValid = isValid && inputToValidate.value.length < inputToValidate.maxLength;
        }

        if (inputToValidate.min != null && typeof inputToValidate.value === "number") {
            isValid = isValid && inputToValidate.value > inputToValidate.min;
        }

        if (inputToValidate.max != null && typeof inputToValidate.value === "number") {
            isValid = isValid && inputToValidate.value < inputToValidate.max;
        }

        return isValid;
    }
}