import { CategoryRules, CategorySchema, CategoryUI } from "./models/category";
import { NavigationRules, NavigationSchema, NavigationUI } from "./models/navigation";
import { TagRules, TagSchema, TagUI } from "./models/tag";
import { BaseModel } from "./models/base.model";
import { CollectionModel, CollectionRules, CollectionSchema, CollectionUI } from "./models/collection";
import { PageRules, PageSchema, PageUI } from "./models/page";
import { SiteSchema, SiteUI } from "./models/site";
import { DataType, CollectionType } from "./types";


export const getConcreteCollection = (datatype: DataType | string) => {
    return getConcreteCollections().get(datatype)
};

export const getConcreteCollections = () => {
    const concreteCollections = new Map<String, BaseModel<any>>()
    concreteCollections.set(DataType.page, createConcreteCollection(DataType.page, pageCollection));
    concreteCollections.set(DataType.site, createConcreteCollection(DataType.site, siteCollection));
    concreteCollections.set(DataType.collection, createConcreteCollection(DataType.collection, collectionCollection));
    concreteCollections.set(DataType.category, createConcreteCollection(DataType.category, categoryCollection));
    concreteCollections.set(DataType.navigation, createConcreteCollection(DataType.navigation, navigationCollection));
    concreteCollections.set(DataType.tag, createConcreteCollection(DataType.tag, tagCollection));
    return concreteCollections
};

const createConcreteCollection = (dataType: DataType, data: any): BaseModel<any> => {
    return {
        pk: dataType,
        sk: dataType,
        name: dataType,
        data: data,
        datatype: dataType,
    }
}

const pageCollection: CollectionModel = {
    name: 'page',
    title: 'Page',
    description: 'Page',
    type: CollectionType.Concrete,
    enableAssetFramework: true,
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
    enableAssetFramework: true,
    enableWorkflow: true,
    enableVersioning: true,
    enableIndexing: true,
    permission: {},
    rules: PageRules(),
    validations: {},
    schema: SiteSchema(),
    uischema: SiteUI(),
};

const collectionCollection: CollectionModel = {
    name: 'collection',
    title: 'Collection',
    description: 'Collection',
    type: CollectionType.Concrete,
    enableAssetFramework: true,
    enableWorkflow: true,
    enableVersioning: true,
    enableIndexing: true,
    permission: {},
    rules: CollectionRules(),
    validations: {},
    schema: CollectionSchema(),
    uischema: CollectionUI()
};

const categoryCollection: CollectionModel = {
    name: 'category',
    title: 'Category',
    description: 'Category',
    type: CollectionType.Concrete,
    enableAssetFramework: true,
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
    enableAssetFramework: true,
    enableWorkflow: true,
    enableVersioning: true,
    enableIndexing: true,
    permission: {},
    rules: NavigationRules(),
    validations: {},
    schema: NavigationSchema(),
    uischema: NavigationUI()
};

const tagCollection: CollectionModel = {
    name: 'tag',
    title: 'Tag',
    description: 'Tag',
    type: CollectionType.Concrete,
    enableAssetFramework: true,
    enableWorkflow: true,
    enableVersioning: true,
    enableIndexing: true,
    permission: {},
    rules: TagRules(),
    validations: {},
    schema: TagSchema(),
    uischema: TagUI()
};