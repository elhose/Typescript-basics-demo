//Drag & Drop Interfaces

interface Draggable {
    dragStartHandler(event: DragEvent): void;

    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;

    dropHandler(event: DragEvent): void;

    dragLeaveHandler(event: DragEvent): void;
}

//Project Type
enum ProjectStatus {
    Active, Finished
}

class Project {
    id: string;
    title: string;
    description: string;
    people: number;
    status: ProjectStatus

    constructor(id: string, title: string, description: string, people: number, status: ProjectStatus) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}

type Listener = (items: Project[]) => void;

//Project State Managment
class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
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

    addListener(listenerFunction: Listener) {
        this.listeners.push(listenerFunction);
    }

    addProject(title: string, description: string, numberOfPeople: number) {
        const newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active);
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

// Base Component Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    protected templateElement: HTMLTemplateElement;
    protected hostElement: T;
    protected element: U;

    protected constructor(templateId: string, hostElementId: string, positionToInsertElement: InsertPosition, newElementId?: string) {
        this.templateElement = document.getElementById(
            templateId
        )! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(
            this.templateElement.content,
            true
        );

        this.element = importedNode.firstElementChild as U;
        if (newElementId) {
            this.element.id = newElementId;
        }

        this.attach(positionToInsertElement);
    }

    protected attach(positionToInsertElement: InsertPosition) {
        this.hostElement.insertAdjacentElement(positionToInsertElement, this.element);
    }

    protected abstract configure(): void;

    protected abstract renderContent(): void;
}

//ProjectItem class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
        if (this.project.people === 1) {
            return `1 person`
        } else {
            return `${this.project.people} persons`
        }
    }

    constructor(hostId: string, project: Project) {
        super("single-project", hostId, "beforeend", project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragEndHandler(event: DragEvent): void {
        console.log("DRAG END")
    }

    @Autobind
    dragStartHandler(event: DragEvent): void {
        console.log("DRAG START")
    }

    protected configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler)
        this.element.addEventListener("dragend", this.dragEndHandler)
    }

    protected renderContent() {
        this.element.querySelector("h2")!.textContent = this.project.title;
        this.element.querySelector("h3")!.textContent = this.persons + " assigned";
        this.element.querySelector("p")!.textContent = this.project.description;
    }
}

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
    assignedProjects: Project[];

    constructor(private typeOfProject: 'active' | 'finished') {
        super("project-list", "app", "beforeend", `${typeOfProject}-projects`)
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    protected renderContent() {
        const listId = `${this.typeOfProject}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.typeOfProject.toUpperCase() + " PROJECTS";
    }

    protected configure(): void {
        projectState.addListener((projects: Project[]) => {
            const validProjects = projects.filter((project) => {
                if (this.typeOfProject === "active") {
                    return project.status === ProjectStatus.Active;
                } else if (this.typeOfProject === "finished") {
                    return project.status === ProjectStatus.Finished;
                }
            })
            this.assignedProjects = validProjects;
            this.renderProjects();
        })
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.typeOfProject}-projects-list`) as HTMLUListElement;
        //clear rendered items in list
        listElement.innerHTML = "";
        for (const projectItem of this.assignedProjects) {
            let projectItem1 = new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
        }
    }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        super("project-input", "app", "afterbegin", "user-input")

        this.titleInputElement = this.element.querySelector(
            "#title"
        ) as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector(
            "#description"
        ) as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector(
            "#people"
        ) as HTMLInputElement;

        this.configure();
    }

    protected configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }

    protected renderContent(): void {
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (userInput) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
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
            min: 0,
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
}

const projectInput: ProjectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");