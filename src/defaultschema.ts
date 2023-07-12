import { DataType, CollectionType, JsonSchemaCustom } from './types';
import { RoleType } from './types';
import {
  BaseModel,
  CollectionRule,
  CollectionUI,
  PageModel,
  UserGroupModel,
  UserModel,
} from './models';

const createConcreteCollection = (name: string, data: any): BaseModel<any> => {
  return {
    pk: name,
    sk: name,
    name: name,
    data: data,
    datatype: DataType.collection,
    version: 0,
  };
};

export const concreteCollections = new Map<String, BaseModel<any>>();
export const registerCollection = (
  title: string,
  datatype: DataType,
  schema: JsonSchemaCustom | any,
  uischema: CollectionUI[],
  rules: CollectionRule[],
  hidden = false,
  enableSubSchema = false
) => {
  const thisCollection = {
    name: datatype,
    title,
    description: title,
    type: CollectionType.Concrete,
    enablePost: true,
    enableWorkflow: true,
    enableVersioning: true,
    enableIndexing: true,
    enableSubSchema,
    permission: {},
    rules: rules,
    validations: {},
    schema: schema,
    uischema: uischema,
    hidden,
  };

  concreteCollections.set(
    datatype,
    createConcreteCollection(datatype, thisCollection)
  );
};

const defaultData = new Map<String, {}>();
export const defaultDataRegister = {
  get: (datatype: DataType) => {
    const data = defaultData.get(datatype);
    if (data) {
      if (typeof data === 'function') {
        return data();
      } else {
        return JSON.parse(JSON.stringify(data));
      }
    }
    return null;
  },
};

export const registerDefaultData = (datatype: DataType, data: any) => {
  defaultData.set(datatype, data);
};

const createUser = (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  groups: string
) => {
  return { firstname, lastname, email, password, groups };
};
export const users: UserModel[] = [];
users.push(createUser('imzee', 'jac', 'imzee@local.com', 'aaaaaa', 'Admin'));
users.push(createUser('admin', 'user', 'admin@local.com', 'aaaaaa', 'Admin'));
users.push(
  createUser('visitor', 'user', 'visitor@local.com', 'guest', 'Agent')
);
users.push(createUser('Help', 'user', 'helpuser@local.com', 'guest', 'Guest'));

const createGroup = (name: string, description: string, roles: string) => {
  return { name, description, roles };
};
export const groups: UserGroupModel[] = [];
groups.push(
  createGroup('Guest', 'Unauthenticated users', [RoleType.Guest].join(','))
);
groups.push(
  createGroup(
    'Agent',
    'Help Desk User Group',
    [RoleType.Reviewer, RoleType.Publisher].join(',')
  )
);
groups.push(
  createGroup(
    'Customer',
    'Site users, authenticated users',
    [RoleType.User].join(',')
  )
);
groups.push(
  createGroup('Admin', 'Omin Administrator', [RoleType.RootAdmin].join(','))
);

export const rootPage: PageModel = {
  name: 'rootpage',
  slug: 'rootpage',
  title: 'Root Page',
  childEditing: 'append',
  site: '',
  breakpoints: [
    { high: 768, low: 480, columns: 1, name: 'sm' },
    { high: 1024, low: 768, columns: 4, name: 'md' },
    { high: 1280, low: 1024, columns: 8, name: 'lg' },
    { high: 1536, low: 1280, columns: 12, name: 'xl' },
    { high: 10000, low: 1536, columns: 12, name: '2xl' },
  ],
};
