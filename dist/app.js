"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById("project-input");
        this.hostElement = document.getElementById("app");
        //render form from template
        const importedForms = document.importNode(this.templateElement.content, true);
        this.formElement = importedForms.firstElementChild;
        this.attach();
    }
    attach() {
        this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
    }
}
const projectInput = new ProjectInput();
