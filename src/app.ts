//Project State Managment

class ProjectState {
    private listeners: any[] = [];
    private projects: any[] = [];
    private static instance: ProjectState;

    private constructor() {
    }

    static getInstance() {
        if (ProjectState.instance) {
            return ProjectState.instance
        } else {
            ProjectState.instance = new ProjectState();
            return ProjectState.instance;
        }
    }

    addListener(listenerFunction: Function) {
        this.listeners.push(listenerFunction);
    }

    addProject(title: string, description: string, numberOfPeople: number) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            people: numberOfPeople
        }
        this.projects.push(newProject);

        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}

const projectState = ProjectState.getInstance();

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

// ProjectList Class
class ProjectList {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    sectionElement: HTMLElement;

    constructor(private typeOfProject: 'active' | 'finished') {
        this.templateElement = document.getElementById(
            "project-list"
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById("app")! as HTMLDivElement;

        const importedNode = document.importNode(
          this.templateElement.content,
          true
        );

        this.sectionElement = importedNode.firstElementChild as HTMLElement;
        this.sectionElement.id = `${this.typeOfProject}-projects`;
        this.attach();
        this.renderContent();
    }

    private renderContent() {
        const listId = `${this.typeOfProject}-projects-list`;
        this.sectionElement.querySelector('ul')!.id = listId;
        this.sectionElement.querySelector('h2')!.textContent = this.typeOfProject.toUpperCase() + " PROJECTS";
    }

    private attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.sectionElement);
    }
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
            this.clearFormsAfterSubmitting();
        }
    }

    private clearFormsAfterSubmitting() {
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
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");