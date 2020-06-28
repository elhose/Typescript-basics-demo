class ProjectInput {
	templateElement: HTMLTemplateElement;
	hostElement: HTMLDivElement;
	formElement: HTMLFormElement;

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
		this.attach();
	}

	private attach() {
		this.hostElement.insertAdjacentElement("afterbegin", this.formElement);
	}
}

const projectInput: ProjectInput = new ProjectInput();