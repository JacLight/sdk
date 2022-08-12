import { DataType, CollectionType, JsonSchemaCustom } from './types';
import { toTitleCase } from './utils';
import { RoleType } from './types';
import { BaseModel, CollectionRule, CollectionUI, PageModel, SettingModel, UserGroupModel, UserModel } from './models';

const createConcreteCollection = (
  dataType: DataType,
  data: any
): BaseModel<any> => {
  return {
    pk: dataType,
    sk: dataType,
    name: dataType,
    data: data,
    datatype: dataType,
    version: 0,
  };
};

export const concreteCollections = new Map<String, BaseModel<any>>();
export const registerCollection = (title: string, datatype: DataType, schema: JsonSchemaCustom | any, uischema: CollectionUI[], rules: CollectionRule[], hidden = false, enableSubSchema = false) => {
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
    hidden
  };

  concreteCollections.set(datatype, createConcreteCollection(datatype, thisCollection));
}

const defaultData = new Map<String, {}>();
export const defaultDataRegister = {
  get: (datatype: DataType) => {
    const data = defaultData.get(datatype);
    if (data) {
      return JSON.parse(JSON.stringify(data))
    }
    return null;
  }
}

export const registerDefaultData = (datatype: DataType, data: any) => {
  defaultData.set(datatype, data);
}

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
users.push(
  createUser('Help', 'user', 'helpuser@local.com', 'guest', 'Guest')
);

const createGroup = (name: string, description: string, roles: string) => {
  return { name, description, roles };
};
export const groups: UserGroupModel[] = [];
groups.push(createGroup('Guest', 'Unauthenticated users', [RoleType.Guest].join(',')));
groups.push(
  createGroup('Agent', 'Help Desk User Group', [
    RoleType.Reviewer,
    RoleType.Publisher,
  ].join(','))
);
groups.push(
  createGroup('Customer', 'Site users, authenticated users', [RoleType.User].join(','))
);
groups.push(createGroup('Admin', 'Omin Administrator', [RoleType.RootAdmin].join(',')));

export const baseSettings: SettingModel = {
  name: 'BaseSettings',
  ownertype: 'System',
  ownerid: '',
};
const addSetting = (
  resourcetype: 'component' | 'collection' | 'route',
  resourceid: string,
  property: string,
  value: boolean | number | string
) => {
  const settingKey = `setting_${resourcetype}_${resourceid}`;
  const thisSetting: any = baseSettings[settingKey] || {
    title: toTitleCase(resourceid?.replace(/_/g, ' ')),
  };

  const valueString: string = value as string;
  thisSetting[`property_${property}`] = valueString;
  baseSettings[settingKey] = thisSetting;
};

addSetting('component', 'dataform', 'width', 600);
addSetting('component', 'dataform', 'height', 800);
addSetting('component', 'table', 'pagesize', 100);
addSetting('component', 'table', 'autoscroll', true);
addSetting('component', 'table', 'show', true);
addSetting('component', 'table', 'pagerstyle', 'auto');
addSetting('component', 'email_server', 'type', '');
addSetting('component', 'email_server', 'url', '');
addSetting('component', 'email_server', 'password', '');
addSetting('component', 'email_server', 'username', '');
addSetting('component', 'email_server', 'username', '');
addSetting('component', 'email_template', 'order', '');
addSetting('component', 'email_template', 'ticket', '');
addSetting('component', 'email_template', 'signup', '');
addSetting('component', 'email_template', 'passwordreset', '');
addSetting('component', 'sms_template', 'order', '');
addSetting('component', 'sms_template', 'signup', '');
addSetting('component', 'sms_template', 'ticket', '');
addSetting('component', 'sms_template', 'passwordreset', '');
addSetting('component', 'site', 'name', 'Websitemint');
addSetting('component', 'site', 'domain', 'localhost');

export const rootPage: PageModel = {
  name: 'rootpage',
  slug: 'rootpage',
  title: 'Root Page',
  childEditing: 'append',
  site: '',
  breakpoints: [
    { high: 480, low: 0, columns: 1 },
    { high: 768, low: 480, columns: 2 },
    { high: 996, low: 768, columns: 4 },
    { high: 1200, low: 996, columns: 8 },
    { high: 10000, low: 1200, columns: 12 },
  ],
};
