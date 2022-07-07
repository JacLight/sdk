export type ViewTemplateType = {
  component: any;
  schema?: any;
  name: string;
  icon?: any;
  props?: any;
  hide?: boolean;
};

class ViewTemplateStore {
  public templateList: ViewTemplateType[] = [];

  public addTemplate = (template: ViewTemplateType) => {
    const index = this.templateList.findIndex(
      oldTemplate => oldTemplate.name === template.name
    );

    if (index >= 0) {
      this.templateList[index] = template;
    } else {
      this.templateList.push(template);
    }
  };

  public FindByName = (name: string) => {
    return this.templateList.indexOf(
      this.templateList.find(item => item.name === name)
    );
  };
}

const store = new ViewTemplateStore();
export const viewTemplateStore = store;
