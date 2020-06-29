//validation logic
interface Validatable {
    value?: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(inputToValidate: Validatable) {
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

//autobind decorator
function Autobind(
    _target: any,
    _methodName: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,

        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjustedDescriptor;
}

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    formElement: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById(
            "project-input"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        //render form from template
        const importedForms = document.importNode(
            this.templateElement.content,
            true
        );
        this.formElement = importedForms.firstElementChild as HTMLFormElement;
        //connected css #user-input to form
        this.formElement.id = "user-input";

        this.titleInputElement = this.formElement.querySelector(
            "#title"
        ) as HTMLInputElement;
        this.descriptionInputElement = this.formElement.querySelector(
            "#description"
        ) as HTMLInputElement;
        this.peopleInputElement = this.formElement.querySelector(
            "#people"
        ) as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (userInput) {
            const [title, description, people] = userInput;
            console.log([title, description, people]);
            this.clearFormsAfterSubmiting();
        }
    }

    private clearFormsAfterSubmiting() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 5
        }

        if (
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ) {
            alert(`Invalid input, please try again!`);
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private configure() {
        this.formElement.addEventListener("submit", this.submitHandler);
    }
}

const projectInput: ProjectInput = new ProjectInput();
