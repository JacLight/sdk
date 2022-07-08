import { DataType, CollectionType } from './types';
import * as models from './models';
import { deepCopy, toTitleCase } from './utils';
import { RoleType } from './types';

const createConcreteCollection = (
  dataType: DataType,
  data: any
): models.BaseModel<any> => {
  return {
    pk: dataType,
    sk: dataType,
    name: dataType,
    data: data,
    datatype: dataType,
    version: 0,
  };
};

const collectionCollection: models.CollectionModel = {
  name: 'collection',
  title: 'Collection',
  description: 'Collection',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.CollectionRules(),
  validations: {},
  schema: models.CollectionSchema() as any,
  uischema: models.CollectionUI() as any,
};

const collectionCollectionForm = deepCopy(collectionCollection);
collectionCollectionForm.name = 'collectionform';
collectionCollectionForm.title = 'collectionform';
collectionCollectionForm.description = 'collectionform';

const collectionCollectionView = deepCopy(collectionCollection);
collectionCollectionForm.name = 'collectionview';
collectionCollectionForm.title = 'collectionview';
collectionCollectionForm.description = 'collectionview';

const applicationCollection: models.CollectionModel = {
  name: 'application',
  title: 'Application',
  description: 'Application',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.ApplicationRules(),
  validations: {},
  schema: models.ApplicationSchema() as any,
  uischema: models.ApplicationUI() as any,
};

const pageCollection: models.CollectionModel = {
  name: 'page',
  title: 'Page',
  description: 'Page',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.PageRules(),
  validations: {},
  schema: models.PageSchema() as any,
  uischema: models.PageUI() as any,
};

const siteCollection: models.CollectionModel = {
  name: 'site',
  title: 'Site',
  description: 'Site',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.PageRules(),
  validations: {},
  schema: models.SiteSchema() as any,
  uischema: models.SiteUI() as any,
};

const configCollection: models.CollectionModel = {
  name: 'config',
  title: 'Config',
  description: 'Config',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.PageRules(),
  validations: {},
  schema: models.ConfigSchema() as any,
  uischema: models.ConfigUI() as any,
};


const categoryCollection: models.CollectionModel = {
  name: 'category',
  title: 'Category',
  description: 'Category',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.CategoryRules(),
  validations: {},
  schema: models.CategorySchema() as any,
  uischema: models.CategoryUI() as any,
};

const navigationCollection: models.CollectionModel = {
  name: 'navigation',
  title: 'Navigation',
  description: 'Navigation',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.NavigationRules(),
  validations: {},
  schema: models.NavigationSchema() as any,
  uischema: models.NavigationUI() as any,
};

const tagCollection: models.CollectionModel = {
  name: 'tag',
  title: 'Tag',
  description: 'Tag',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: models.TagRules(),
  validations: {},
  schema: models.TagSchema() as any,
  uischema: models.TagUI() as any,
};

const messageTemplateCollection: models.CollectionModel = {
  name: 'messageemplate',
  title: 'MessageTemplate',
  description: 'MessageTemplate',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.MessageTemplateSchema() as any,
  uischema: {} as any,
};

const userCollection: models.CollectionModel = {
  name: 'user',
  title: 'User',
  description: 'User',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.UserSchema() as any,
  uischema: models.UserUI() as any,
};

const userGroupCollection: models.CollectionModel = {
  name: 'usergroup',
  title: 'User Group',
  description: 'User Group',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.UserGroupSchema() as any,
  uischema: {} as any,
};

const settingCollection: models.CollectionModel = {
  name: 'setting',
  title: 'Setting',
  description: 'Setting',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.SettingSchema() as any,
  uischema: {} as any,
};

const userRoleCollection: models.CollectionModel = {
  name: 'userrole',
  title: 'User Role',
  description: 'User Role',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.UserRoleSchema() as any,
  uischema: {} as any,
};

const commentCollection: models.CollectionModel = {
  name: 'comment',
  title: 'Comment',
  description: 'Comment',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.CommentSchema() as any,
  uischema: {} as any,
};

const passwordPolicyCollection: models.CollectionModel = {
  name: 'passwordpolicy',
  title: 'PasswordPolicy',
  description: 'PasswordPolicy',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.PasswordPolicySchema() as any,
  uischema: {} as any,
};

const mintflowCollection: models.CollectionModel = {
  name: 'mintflow',
  title: 'MintFlow',
  description: 'MintFlow',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.MintflowSchema() as any,
  uischema: {} as any,
};

const postCollection: models.CollectionModel = {
  name: 'post',
  title: 'Post',
  description: 'Post Fillter',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.PostSchema() as any,
  uischema: {} as any,
};

const scriptCollection: models.CollectionModel = {
  name: 'post',
  title: 'Post',
  description: 'Post Fillter',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.ScriptSchema() as any,
  uischema: {} as any,
};


const worflowDefinitionCollection: models.WorkflowDefinitionModel = {
  name: 'workflowdefinition',
  title: 'Workflow Definition',
  description: 'Workflow Definition',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.ScriptSchema() as any,
  uischema: {} as any,
};



const ticketCollection: models.TicketModel = {
  name: 'ticket',
  title: 'Ticket',
  description: 'Tickets',
  type: CollectionType.Concrete,
  enablePost: true,
  enableWorkflow: true,
  enableVersioning: true,
  enableIndexing: true,
  permission: {},
  rules: [],
  validations: {},
  schema: models.ScriptSchema() as any,
  uischema: {} as any,
};


export const concreteCollections = new Map<String, models.BaseModel<any>>();
concreteCollections.set(
  DataType.page,
  createConcreteCollection(DataType.page, pageCollection)
);
concreteCollections.set(
  DataType.script,
  createConcreteCollection(DataType.site, scriptCollection)
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
  DataType.collectionform,
  createConcreteCollection(DataType.collectionform, collectionCollectionForm)
);
concreteCollections.set(
  DataType.collectionview,
  createConcreteCollection(DataType.collectionview, collectionCollectionView)
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
concreteCollections.set(
  DataType.post,
  createConcreteCollection(DataType.post, postCollection)
);
concreteCollections.set(
  DataType.config,
  createConcreteCollection(DataType.config, configCollection)
);

concreteCollections.set(
  DataType.application,
  createConcreteCollection(DataType.application, applicationCollection)
);

concreteCollections.set(
  DataType.ticket,
  createConcreteCollection(DataType.ticket, ticketCollection)
);

concreteCollections.set(
  DataType.workflowdefinition,
  createConcreteCollection(DataType.workflowdefinition, worflowDefinitionCollection)
);



const createUser = (
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  groups: string
) => {
  return { firstname, lastname, email, password, groups };
};
export const users: models.UserModel[] = [];
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
export const groups: models.UserGroupModel[] = [];
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

export const baseSettings: models.SettingModel = {
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

export const rootPage: models.PageModel = {
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
