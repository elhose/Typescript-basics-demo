import {Component} from "./base-component.js";
import {DragTarget} from "../models/drag-drop.js";
import {Project, ProjectStatus} from "../models/project.js";
import {Autobind} from "../decorators/autobind.js";
import {projectState} from "../state/project-state.js";
import {ProjectItem} from "./project-item.js";

export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private typeOfProject: 'active' | 'finished') {
        super("project-list", "app", "beforeend", `${typeOfProject}-projects`)
        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @Autobind
    dragLeaveHandler(event: DragEvent): void {
        const listElement = this.element.querySelector('ul')!;
        listElement.classList.remove('droppable');
    }

    @Autobind
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            const listElement = this.element.querySelector('ul')!;
            listElement.classList.add('droppable');
        }
    }

    dropHandler(event: DragEvent): void {
        const projectItemId = event.dataTransfer!.getData("text/plain");
        projectState.switchProjectStatus(projectItemId, this.typeOfProject === "active" ? ProjectStatus.Active : ProjectStatus.Finished);
    }

    protected renderContent() {
        const listId = `${this.typeOfProject}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.typeOfProject.toUpperCase() + " PROJECTS";
    }

    protected configure(): void {
        this.element.addEventListener("dragover", this.dragOverHandler)
        this.element.addEventListener("drop", this.dropHandler.bind(this))
        this.element.addEventListener("dragleave", this.dragLeaveHandler)

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
            new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
        }
    }
}
