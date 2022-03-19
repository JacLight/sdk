import { CategoryRules, CategorySchema, CategoryUI } from './models/category';
import {
  NavigationRules,
  NavigationSchema,
  NavigationUI,
} from './models/navigation';
import { TagRules, TagSchema, TagUI } from './models/tag';
import { BaseModel, WorkflowDefinationSubSchema } from './models/base.model';
import {
  CollectionModel,
  CollectionRules,
  CollectionSchema,
  CollectionUI,
} from './models/collection';
import { PageRules, PageSchema, PageUI } from './models/page';
import { SiteSchema, SiteUI } from './models/site';
import { DataType, CollectionType } from './types';
import {
  UserGroupModel,
  UserModel,
  PageModel,
  SettingModel,
  CommentSchema,
  MintflowSchema,
  MessageTemplateSchema,
  PasswordPolicySchema,
  CollectionViewSchema,
  SettingSchema,
  UserGroupSchema,
  UserRoleSchema,
  UserSchema,
} from './models';
import { toTitleCase } from './utils';
import { RoleType } from './types';

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
  };
};

const collectionCollection: CollectionModel = {
  name: 'collection',
  title: 'Collection',
  description: 'Collection',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: CollectionRules(),
  validations: {},
  schema: CollectionSchema(),
  uischema: CollectionUI(),
};

const collectionViewCollection: CollectionModel = {
  name: 'collectionview',
  title: 'Collection View',
  description: 'Collection View',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: CollectionViewSchema(),
  uischema: {} as any,
};

const pageCollection: CollectionModel = {
  name: 'page',
  title: 'Page',
  description: 'Page',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: PageRules(),
  validations: {},
  schema: PageSchema(),
  uischema: PageUI(),
};

const siteCollection: CollectionModel = {
  name: 'site',
  title: 'Site',
  description: 'Site',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: PageRules(),
  validations: {},
  schema: SiteSchema(),
  uischema: SiteUI(),
};

const categoryCollection: CollectionModel = {
  name: 'category',
  title: 'Category',
  description: 'Category',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: CategoryRules(),
  validations: {},
  schema: CategorySchema(),
  uischema: CategoryUI(),
};

const navigationCollection: CollectionModel = {
  name: 'navigation',
  title: 'Navigation',
  description: 'Navigation',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: NavigationRules(),
  validations: {},
  schema: NavigationSchema() as any,
  uischema: NavigationUI(),
};

const tagCollection: CollectionModel = {
  name: 'tag',
  title: 'Tag',
  description: 'Tag',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: TagRules(),
  validations: {},
  schema: TagSchema(),
  uischema: TagUI(),
};

const messageTemplateCollection: CollectionModel = {
  name: 'messageemplate',
  title: 'MessageTemplate',
  description: 'MessageTemplate',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: MessageTemplateSchema(),
  uischema: {} as any,
};

const userCollection: CollectionModel = {
  name: 'user',
  title: 'User',
  description: 'User',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: UserSchema(),
  uischema: {} as any,
};

const userGroupCollection: CollectionModel = {
  name: 'usergroup',
  title: 'User Group',
  description: 'User Group',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: UserGroupSchema(),
  uischema: {} as any,
};

const settingCollection: CollectionModel = {
  name: 'setting',
  title: 'Setting',
  description: 'Setting',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: SettingSchema() as any,
  uischema: {} as any,
};

const userRoleCollection: CollectionModel = {
  name: 'userrole',
  title: 'User Role',
  description: 'User Role',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: UserRoleSchema(),
  uischema: {} as any,
};

const workflowCollection: CollectionModel = {
  name: 'workflow',
  title: 'Workflow',
  description: 'Workflow',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: WorkflowDefinationSubSchema(),
  uischema: {} as any,
};

const commentCollection: CollectionModel = {
  name: 'comment',
  title: 'Comment',
  description: 'Comment',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: CommentSchema(),
  uischema: {} as any,
};

const passwordPolicyCollection: CollectionModel = {
  name: 'passwordpolicy',
  title: 'PasswordPolicy',
  description: 'PasswordPolicy',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: PasswordPolicySchema(),
  uischema: {} as any,
};

const mintflowCollection: CollectionModel = {
  name: 'mintflow',
  title: 'MintFlow',
  description: 'MintFlow',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: {} as any,
  validations: {},
  schema: MintflowSchema(),
  uischema: {} as any,
};

export const concreteCollections = new Map<String, BaseModel<any>>();
concreteCollections.set(
  DataType.page,
  createConcreteCollection(DataType.page, pageCollection)
);
concreteCollections.set(
  DataType.site,
  createConcreteCollection(DataType.site, siteCollection)
);
concreteCollections.set(
  DataType.collection,
  createConcreteCollection(DataType.collection, collectionCollection)
);
concreteCollections.set(
  DataType.collectionview,
  createConcreteCollection(DataType.collectionview, collectionViewCollection)
);
concreteCollections.set(
  DataType.category,
  createConcreteCollection(DataType.category, categoryCollection)
);
concreteCollections.set(
  DataType.navigation,
  createConcreteCollection(DataType.navigation, navigationCollection)
);
concreteCollections.set(
  DataType.messagetemplate,
  createConcreteCollection(DataType.messagetemplate, messageTemplateCollection)
);
concreteCollections.set(
  DataType.comment,
  createConcreteCollection(DataType.comment, commentCollection)
);
concreteCollections.set(
  DataType.workflow,
  createConcreteCollection(DataType.workflow, workflowCollection)
);
concreteCollections.set(
  DataType.user,
  createConcreteCollection(DataType.user, userCollection)
);
concreteCollections.set(
  DataType.userrole,
  createConcreteCollection(DataType.userrole, userRoleCollection)
);
concreteCollections.set(
  DataType.setting,
  createConcreteCollection(DataType.setting, settingCollection)
);
concreteCollections.set(
  DataType.usergroup,
  createConcreteCollection(DataType.usergroup, userGroupCollection)
);
concreteCollections.set(
  DataType.passwordpolicy,
  createConcreteCollection(DataType.passwordpolicy, passwordPolicyCollection)
);
concreteCollections.set(
  DataType.tag,
  createConcreteCollection(DataType.tag, tagCollection)
);
concreteCollections.set(
  DataType.mintflow,
  createConcreteCollection(DataType.mintflow, mintflowCollection)
);

const createUser = (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  groups: string[]
) => {
  return { firstname, lastname, email, password, groups };
};
export const users: UserModel[] = [];
users.push(createUser('imzee', 'jac', 'imzee@local.com', 'aaaaaa', ['Admin']));
users.push(createUser('admin', 'user', 'admin@local.com', 'aaaaaa', ['Admin']));
users.push(
  createUser('visitor', 'user', 'visitor@local.com', 'guest', ['Agent'])
);
users.push(
  createUser('Help', 'user', 'helpuser@local.com', 'guest', ['Guest'])
);

const createGroup = (name: string, description: string, roles: string[]) => {
  return { name, description, roles };
};
export const groups: UserGroupModel[] = [];
groups.push(createGroup('Guest', 'Unauthenticated users', [RoleType.Guest]));
groups.push(
  createGroup('Agent', 'Help Desk User Group', [RoleType.Reviewer, RoleType.Publisher])
);
groups.push(
  createGroup('Customer', 'Site users, authenticated users', [RoleType.User])
);
groups.push(createGroup('Admin', 'Omin Administrator', [RoleType.RootAdmin]));


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
    title: toTitleCase(resourceid.replaceAll('_', ' ')),
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
  breakpoints: [
    { high: 480, low: 0, columns: 1 },
    { high: 768, low: 480, columns: 2 },
    { high: 996, low: 768, columns: 4 },
    { high: 1200, low: 996, columns: 8 },
    { high: 10000, low: 1200, columns: 12 },
  ],
};
