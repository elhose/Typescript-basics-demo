/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
}