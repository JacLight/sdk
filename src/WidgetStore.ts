export type WidgetType = {
  component: any;
  name: string;
  icon: any;
  props?: any;
  hide?: boolean;
};

class WidgetStore {
  public widgetList: WidgetType[] = [];
  public addWidget = (widget: WidgetType) => {
    const index = this.widgetList.findIndex(oldWidget => oldWidget.name === widget.name)
    if (index >= 0) {
      this.widgetList[index] = widget;
    } else {
      this.widgetList.push(widget)
    }
  };
  public FindByName = (name: string) => {
    return this.widgetList.indexOf(this.widgetList.find((item) => item.name === name));
  };
}

const store = new WidgetStore();
export const widgetStore = store;
