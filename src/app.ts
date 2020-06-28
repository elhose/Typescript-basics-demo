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

		this.titleInputElement = this.formElement.querySelector('#title') as HTMLInputElement;
		this.descriptionInputElement = this.formElement.querySelector('#description') as HTMLInputElement;
		this.peopleInputElement = this.formElement.querySelector('#people') as HTMLInputElement;

		this.configure();
		this.attach();
	}

	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
	}

	private submitHandler(event: Event){
		event.preventDefault();
		console.log(this.titleInputElement.value)
	}

	private configure(){
		this.formElement.addEventListener("submit", this.submitHandler.bind(this));
	}
}

const projectInput: ProjectInput = new ProjectInput();