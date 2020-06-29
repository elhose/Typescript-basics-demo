"use strict";
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
// ProjectList Class
class ProjectList {
    constructor(typeOfProject) {
        this.typeOfProject = typeOfProject;
        this.templateElement = document.getElementById("project-list");
        this.hostElement = document.getElementById("app");
        this.assignedProjects = [];
        const importedNode = document.importNode(this.templateElement.content, true);
        this.sectionElement = importedNode.firstElementChild;
        this.sectionElement.id = `${this.typeOfProject}-projects`;
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
        this.attach();
        this.renderContent();
    }
    renderProjects() {
        const listElement = document.getElementById(`${this.typeOfProject}-projects-list`);
        //clear rendered items in list
        listElement.innerHTML = "";
        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li");
            listItem.textContent = projectItem.title;
            listElement.appendChild(listItem);
        }
    }
    renderContent() {
        const listId = `${this.typeOfProject}-projects-list`;
        this.sectionElement.querySelector('ul').id = listId;
        this.sectionElement.querySelector('h2').textContent = this.typeOfProject.toUpperCase() + " PROJECTS";
    }
    attach() {
        this.hostElement.insertAdjacentElement("beforeend", this.sectionElement);
    }
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        //render form from template
        const importedForms = document.importNode(this.templateElement.content, true);
        this.formElement = importedForms.firstElementChild;
        //connected css #user-input to form
        this.formElement.id = "user-input";
        this.titleInputElement = this.formElement.querySelector("#title");
        this.descriptionInputElement = this.formElement.querySelector("#description");
        this.peopleInputElement = this.formElement.querySelector("#people");
        this.configure();
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
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
            min: 1,
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
    configure() {
        this.formElement.addEventListener("submit", this.submitHandler);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
