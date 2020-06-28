"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        //render form from template
        const importedForms = document.importNode(this.templateElement.content, true);
        this.formElement = importedForms.firstElementChild;
        //connected css #user-input to form
        this.formElement.id = "user-input";
        this.titleInputElement = this.formElement.querySelector('#title');
        this.descriptionInputElement = this.formElement.querySelector('#description');
        this.peopleInputElement = this.formElement.querySelector('#people');
        this.configure();
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }
    submitHandler(event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }
    configure() {
        this.formElement.addEventListener("submit", this.submitHandler.bind(this));
    }
}
const projectInput = new ProjectInput();
