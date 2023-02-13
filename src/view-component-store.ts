export type ViewComponentType = {
  component: any;
  schema?: any;
  name: string;
  icon?: any;
  props?: any;
  hide?: boolean;
};

class ViewComponentStore {
  public components: ViewComponentType[] = [];

  public addTemplate = (_component: ViewComponentType) => {
    const index = this.components.findIndex(
      tComponent => tComponent.name === _component.name
    );

    if (index >= 0) {
      this.components[index] = _component;
    } else {
      this.components.push(_component);
    }
  };

  public FindByName = (name: string) => {
    return this.components.indexOf(
      this.components.find(item => item.name === name)
    );
  };
}

const store = new ViewComponentStore();
export const viewComponentStore = store;
