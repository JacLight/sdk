import { CategoryRules, CategorySchema, CategoryUI } from "./models/category";
import { NavigationRules, NavigationSchema, NavigationUI } from "./models/navigation";
import { TagRules, TagSchema, TagUI } from "./models/tag";
import { BaseModel, WorkflowDefinationSchema } from "./models/base.model";
import { CollectionModel, CollectionRules, CollectionSchema, CollectionUI } from "./models/collection";
import { PageRules, PageSchema, PageUI } from "./models/page";
import { SiteSchema, SiteUI } from "./models/site";
import { DataType, CollectionType } from "./types";
import { UserGroupModel, UserModel, UserRoleModel, SettingModel, PermissionModel, CommentSchema, MintflowSchema, MessageTemplateSchema, PasswordPolicySchema, CollectionViewSchema, PermissionSchema, PostSchema, SettingSchema, UserGroupSchema, UserRoleSchema, UserSchema } from "./models";
import { toTitleCase } from "./utils";

const createConcreteCollection = (dataType: DataType, data: any): BaseModel<any> => {
    return {
        pk: dataType,
        sk: dataType,
        name: dataType,
        data: data,
        datatype: dataType,
    }
}

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
    uischema: CollectionUI()
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
    uischema: PageUI()
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
    uischema: CategoryUI()
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
    uischema: NavigationUI()
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
    uischema: TagUI()
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
    uischema: {} as any
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
    uischema: {} as any
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
    uischema: {} as any
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
    uischema: {} as any
};


const permissionCollection: CollectionModel = {
    name: 'permission',
    title: 'Permission',
    description: 'Permission',
    type: CollectionType.Concrete,
    enablePost: true,
    enableWorkflow: true,
    enableVersioning: true,
    enableIndexing: true,
    permission: {},
    rules: {} as any,
    validations: {},
    schema: PermissionSchema(),
    uischema: {} as any
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
    uischema: {} as any
};

const postCollection: CollectionModel = {
    name: 'post',
    title: 'Post',
    description: 'Post',
    type: CollectionType.Concrete,
    enablePost: true,
    enableWorkflow: true,
    enableVersioning: true,
    enableIndexing: true,
    permission: {},
    rules: {} as any,
    validations: {},
    schema: PostSchema(),
    uischema: {} as any
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
    schema: WorkflowDefinationSchema(),
    uischema: {} as any
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
    uischema: {} as any
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
    uischema: {} as any
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
    uischema: {} as any
};

export const concreteCollections = new Map<String, BaseModel<any>>()
concreteCollections.set(DataType.page, createConcreteCollection(DataType.page, pageCollection));
concreteCollections.set(DataType.site, createConcreteCollection(DataType.site, siteCollection));
concreteCollections.set(DataType.collection, createConcreteCollection(DataType.collection, collectionCollection));
concreteCollections.set(DataType.collectionview, createConcreteCollection(DataType.collectionview, collectionViewCollection));
concreteCollections.set(DataType.category, createConcreteCollection(DataType.category, categoryCollection));
concreteCollections.set(DataType.navigation, createConcreteCollection(DataType.navigation, navigationCollection));
concreteCollections.set(DataType.messagetemplate, createConcreteCollection(DataType.messagetemplate, messageTemplateCollection));
concreteCollections.set(DataType.post, createConcreteCollection(DataType.post, postCollection));
concreteCollections.set(DataType.comment, createConcreteCollection(DataType.comment, commentCollection));
concreteCollections.set(DataType.workflow, createConcreteCollection(DataType.workflow, workflowCollection));
concreteCollections.set(DataType.user, createConcreteCollection(DataType.user, userCollection));
concreteCollections.set(DataType.userrole, createConcreteCollection(DataType.userrole, userRoleCollection));
concreteCollections.set(DataType.setting, createConcreteCollection(DataType.setting, settingCollection));
concreteCollections.set(DataType.permission, createConcreteCollection(DataType.permission, permissionCollection));
concreteCollections.set(DataType.usergroup, createConcreteCollection(DataType.usergroup, userGroupCollection));
concreteCollections.set(DataType.passwordpolicy, createConcreteCollection(DataType.passwordpolicy, passwordPolicyCollection));
concreteCollections.set(DataType.tag, createConcreteCollection(DataType.tag, tagCollection));
concreteCollections.set(DataType.mintflow, createConcreteCollection(DataType.mintflow, mintflowCollection));


// Guest, User, Owner, Publisher, Reviewer, PowerUser, Administrator
const createRole = (name: string, description: string, permissions: string[], users: string[], groups: string[]) => {
    return { name, description, permissions, users, groups }
}
export const roles: UserRoleModel[] = [];
roles.push(createRole('Administrator', 'Administrators are super users who can do anything.', [], [], []))
roles.push(createRole('PowerUser', 'PowerUser users who can view data across the company, cannot change permissions', [], [], []))
roles.push(createRole('Owner', 'This is an implied role with respect to the objects users create. This role is automatically assigned.', [], [], []))
roles.push(createRole('Publisher', 'This is an autogenerated role from the workflow definition.', [], [], []))
roles.push(createRole('Reviewer', 'Administrators are super users who can do anything.', [], [], []))
roles.push(createRole('User', 'Authenticated users should be assigned this role. This role is automatically assigned.', [], [], []))
roles.push(createRole('Guest', 'Unauthenticated users always have this role. This role is automatically assigned.', [], [], []))



const createUser = (firstname: string, lastname: string, email: string, password: string, groups: string[]) => {
    return { firstname, lastname, email, password, groups }
}
export const users: UserModel[] = [];
users.push(createUser('imzee', 'jac', 'imzee@local.com', 'aaaaaa', ['Admin']))
users.push(createUser('admin', 'user', 'admin@local.com', 'aaaaaa', ['Admin']))
users.push(createUser('visitor', 'user', 'visitor@local.com', 'guest', ['Agent']))
users.push(createUser('Help', 'user', 'helpuser@local.com', 'guest', ['Guest']))


const createGroup = (name: string, description: string, roles: string[]) => {
    return { name, description, roles }
}
export const groups: UserGroupModel[] = [];
groups.push(createGroup('Guest', 'Unauthenticated users', ['Guest']))
groups.push(createGroup('Agent', 'Help Desk User Group', ['Reviewer', 'Publisher']))
groups.push(createGroup('Customer', 'Site users, authenticated users', ['User']))
groups.push(createGroup('Admin', 'Site Administrator', ['Administrator']))

const createPermission = (resourcetype: "component" | "collection" | "route", resourceid: string, view: boolean, add: boolean, configure: boolean, remove: boolean): PermissionModel => {
    return { resourcetype, resourceid, allow: { view, configure, add, remove }, deny: {} }
}
const adminPermissions: PermissionModel = { ownertype: "role", ownerid: "Administrator", permissions: [] };
adminPermissions.permissions.push(createPermission('component', 'site', true, true, true, true))
adminPermissions.permissions.push(createPermission('component', 'collection', true, true, true, true))

const powerPermissions: PermissionModel = { ownertype: "role", ownerid: "PowerUser", permissions: [] };
powerPermissions.permissions.push(createPermission('component', 'site', true, true, true, true))
powerPermissions.permissions.push(createPermission('component', 'collection', true, true, true, true))

const reviewerPermissions: PermissionModel = { ownertype: "role", ownerid: "Reviewer", permissions: [] };
reviewerPermissions.permissions.push(createPermission('component', 'site', true, true, false, false))
reviewerPermissions.permissions.push(createPermission('component', 'collection', true, true, false, false))

const publisherPermissions: PermissionModel = { ownertype: "role", ownerid: "Publisher", permissions: [] };
publisherPermissions.permissions.push(createPermission('component', 'site', true, true, true, false))
publisherPermissions.permissions.push(createPermission('component', 'collection', true, true, true, false))

const userPermissions: PermissionModel = { ownertype: "role", ownerid: "User", permissions: [] };
userPermissions.permissions.push(createPermission('component', 'site', true, false, false, false))
userPermissions.permissions.push(createPermission('component', 'collection', true, false, false, false))

const guestPermissions: PermissionModel = { ownertype: "role", ownerid: "Guest", permissions: [] };
guestPermissions.permissions.push(createPermission('component', 'site', true, false, false, false))
guestPermissions.permissions.push(createPermission('component', 'collection', true, false, false, false))

export const permissions = {
    Administrator: adminPermissions,
    PowerUser: powerPermissions,
    Reviewer: reviewerPermissions,
    Publisher: publisherPermissions,
    User: userPermissions,
    Guest: guestPermissions,
}


export const baseSettings: SettingModel = { name: 'BaseSettings', ownertype: "System", ownerid: "" };
const addSetting = (resourcetype: "component" | "collection" | "route", resourceid: string, property: string, value: boolean | number | string) => {
    const settingKey = `setting_${resourcetype}_${resourceid}`;
    const thisSetting: any = baseSettings[settingKey] || { 'title': toTitleCase(resourceid.replaceAll('_', ' ')) }

    const valueString: string = value as string;
    thisSetting[`property_${property}`] = valueString;
    baseSettings[settingKey] = thisSetting;
}
addSetting('component', 'dataform', 'width', 600)
addSetting('component', 'dataform', 'height', 800)
addSetting('component', 'table', 'pagesize', 100)
addSetting('component', 'table', 'autoscroll', true)
addSetting('component', 'table', 'show', true)
addSetting('component', 'table', 'pagerstyle', 'auto')
addSetting('component', 'email_server', 'type', '')
addSetting('component', 'email_server', 'url', '')
addSetting('component', 'email_server', 'password', '')
addSetting('component', 'email_server', 'username', '')
addSetting('component', 'email_server', 'username', '')
addSetting('component', 'email_template', 'order', '')
addSetting('component', 'email_template', 'ticket', '')
addSetting('component', 'email_template', 'signup', '')
addSetting('component', 'email_template', 'passwordreset', '')
addSetting('component', 'sms_template', 'order', '')
addSetting('component', 'sms_template', 'signup', '')
addSetting('component', 'sms_template', 'ticket', '')
addSetting('component', 'sms_template', 'passwordreset', '')
addSetting('component', 'site', 'name', 'Websitemint')
addSetting('component', 'site', 'domain', 'localhost')

console.log(baseSettings)