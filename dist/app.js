"use strict";
//Drag & Drop Interfaces
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
//Project Type
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
class Project {
    constructor(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
}
//Project State Managment
class ProjectState {
    constructor() {
        this.listeners = [];
        this.projects = [];
    }
    static getInstance() {
        if (ProjectState.instance) {
            return ProjectState.instance;
        }
        else {
            ProjectState.instance = new ProjectState();
            return ProjectState.instance;
        }
    }
    addListener(listenerFunction) {
        this.listeners.push(listenerFunction);
    }
    addProject(title, description, numberOfPeople) {
        const newProject = new Project(Math.random().toString(), title, description, numberOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}
const projectState = ProjectState.getInstance();
function validate(inputToValidate) {
    let isValid = true;
    if (inputToValidate.required) {
        isValid = isValid && inputToValidate.value.toString().trim().length !== 0;
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
function Autobind(_target, _methodName, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjustedDescriptor;
}
// Base Component Class
class Component {
    constructor(templateId, hostElementId, positionToInsertElement, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        if (newElementId) {
            this.element.id = newElementId;
        }
        this.attach(positionToInsertElement);
    }
    attach(positionToInsertElement) {
        this.hostElement.insertAdjacentElement(positionToInsertElement, this.element);
    }
}
//ProjectItem class
class ProjectItem extends Component {
    constructor(hostId, project) {
        super("single-project", hostId, "beforeend", project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }
    get persons() {
        if (this.project.people === 1) {
            return `1 person`;
        }
        else {
            return `${this.project.people} persons`;
        }
    }
    dragEndHandler(event) {
        console.log("DRAG END");
    }
    dragStartHandler(event) {
        console.log("DRAG START");
    }
    configure() {
        this.element.addEventListener("dragstart", this.dragStartHandler);
        this.element.addEventListener("dragend", this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector("h2").textContent = this.project.title;
        this.element.querySelector("h3").textContent = this.persons + " assigned";
        this.element.querySelector("p").textContent = this.project.description;
    }
}
__decorate([
    Autobind
], ProjectItem.prototype, "dragEndHandler", null);
__decorate([
    Autobind
], ProjectItem.prototype, "dragStartHandler", null);
// ProjectList Class
class ProjectList extends Component {
    constructor(typeOfProject) {
        super("project-list", "app", "beforeend", `${typeOfProject}-projects`);
        this.typeOfProject = typeOfProject;
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }
    dragLeaveHandler(event) {
        const listElement = this.element.querySelector('ul');
        listElement.classList.remove('droppable');
    }
    dragOverHandler(event) {
        const listElement = this.element.querySelector('ul');
        listElement.classList.add('droppable');
    }
    dropHandler(event) {
    }
    renderContent() {
        const listId = `${this.typeOfProject}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.typeOfProject.toUpperCase() + " PROJECTS";
    }
    configure() {
        this.element.addEventListener("dragover", this.dragOverHandler);
        this.element.addEventListener("drop", this.dropHandler.bind(this));
        this.element.addEventListener("dragleave", this.dragLeaveHandler);
        projectState.addListener((projects) => {
            const validProjects = projects.filter((project) => {
                if (this.typeOfProject === "active") {
                    return project.status === ProjectStatus.Active;
                }
                else if (this.typeOfProject === "finished") {
                    return project.status === ProjectStatus.Finished;
                }
            });
            this.assignedProjects = validProjects;
            this.renderProjects();
        });
    }
    renderProjects() {
        const listElement = document.getElementById(`${this.typeOfProject}-projects-list`);
        //clear rendered items in list
        listElement.innerHTML = "";
        for (const projectItem of this.assignedProjects) {
            let projectItem1 = new ProjectItem(this.element.querySelector("ul").id, projectItem);
        }
    }
}
__decorate([
    Autobind
], ProjectList.prototype, "dragLeaveHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragOverHandler", null);
class ProjectInput extends Component {
    constructor() {
        super("project-input", "app", "afterbegin", "user-input");
        this.titleInputElement = this.element.querySelector("#title");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.peopleInputElement = this.element.querySelector("#people");
        this.configure();
    }
    configure() {
        this.element.addEventListener("submit", this.submitHandler);
    }
    renderContent() {
    }
    submitHandler(event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (userInput) {
            const [title, description, people] = userInput;
            projectState.addProject(title, description, people);
            this.clearFormsAfterSubmitting();
        }
    }
    clearFormsAfterSubmitting() {
        this.titleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.peopleInputElement.value = "";
    }
    gatherUserInput() {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;
        const titleValidatable = {
            value: enteredTitle,
            required: true
        };
        const descriptionValidatable = {
            value: enteredDescription,
            required: true,
            minLength: 5
        };
        const peopleValidatable = {
            value: +enteredPeople,
            required: true,
            min: 0,
            max: 5
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert(`Invalid input, please try again!`);
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
