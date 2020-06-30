import {Project, ProjectStatus} from "../models/project.js";

type Listener = (items: Project[]) => void;

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

        this.updateListeners();
    }

    switchProjectStatus(projectId: string, newStatus: ProjectStatus) {
        let foundProject = this.projects.find(project => project.id === projectId);

        if (foundProject && foundProject.status !== newStatus) {
            foundProject.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for (const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();
