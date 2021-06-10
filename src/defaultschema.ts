import { BaseModel } from "./models/base.model";
import { CollectionModel, CollectionSchema, CollectionUISchema } from "./models/collection";
import { PageSchema, PageUISchema } from "./models/page";
import { SiteSchema, SiteUISchema } from "./models/site";
import { DataType, CollectionType } from "./types";


export const getConcreteCollections = () => {
    const concreteCollections = new Map<String, BaseModel<any>>()
    concreteCollections.set(DataType.page, createConcreteCollection(DataType.page, pageCollection));
    concreteCollections.set(DataType.site, createConcreteCollection(DataType.site, siteCollection));
    concreteCollections.set(DataType.collection, createConcreteCollection(DataType.collection, collectionCollection));
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
    rules: {},
    validations: {},
    uischema: PageUISchema(),
    schema: PageSchema(),
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
    rules: {},
    validations: {},
    uischema: SiteUISchema(),
    schema: SiteSchema(),
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
    rules: {},
    validations: {},
    uischema: CollectionUISchema(),
    schema: CollectionSchema(),
};