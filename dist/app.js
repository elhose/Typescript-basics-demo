"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
            console.log([title, description, people]);
            this.clearFormsAfterSubmiting();
        }
    }
    clearFormsAfterSubmiting() {
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
