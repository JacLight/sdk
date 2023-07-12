export interface CollectionRule {
  name: string;
  condition?: {
    type?: string; //and or
    param?: {
      field1?: string; //property you want to read or compare
      field2?: string; //property you want to read or compare
      compareField?: boolean; // field or value
      value?: string | number | boolean; // incase you're comparing to a fixed value  set it here
      operation?: string;
    }[];
  };
  action?: {
    operation: string;
    targetField?: string | string[]; //property you want to apply actions to
    sourceField?: string; //property where the value you want to apply will come from
    valueFromField?: boolean;
    value?: string | number | boolean; // incase you're set to fixed value put it here
  }[];
}
