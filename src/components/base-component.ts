namespace App {
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        protected templateElement: HTMLTemplateElement;
        protected hostElement: T;
        protected element: U;

        protected constructor(templateId: string, hostElementId: string, positionToInsertElement: InsertPosition, newElementId?: string) {
            this.templateElement = document.getElementById(
                templateId
            )! as HTMLTemplateElement;
            this.hostElement = document.getElementById(hostElementId)! as T;

            const importedNode = document.importNode(
                this.templateElement.content,
                true
            );

            this.element = importedNode.firstElementChild as U;
            if (newElementId) {
                this.element.id = newElementId;
            }

            this.attach(positionToInsertElement);
        }

        protected attach(positionToInsertElement: InsertPosition) {
            this.hostElement.insertAdjacentElement(positionToInsertElement, this.element);
        }

        protected abstract configure(): void;

        protected abstract renderContent(): void;
    }
}