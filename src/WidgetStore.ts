export type WidgetType = {
  component: any;
  name: string;
  icon: any;
};

class WidgetStore {
  public widgetList: WidgetType[] = [];
  public addWidget = (name: string) => { console.log(name) };
  public FindByName = (name: string) => {
    return this.widgetList.indexOf(this.widgetList.find((item) => item.name === name));
  };

  public register = (addFn: (name: string) => any) => {
    this.addWidget = addFn;
  };
  public unregister = () => {
    this.addWidget = undefined;
  };
}

const store = new WidgetStore();
export const widgetStore = store;
