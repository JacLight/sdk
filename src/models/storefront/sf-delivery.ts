import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFDeliverySchema = () => {
    return {
        type: 'object',
        properties: {
            order: {
                type: 'string',
            },
            product: {
                type: 'string',
            },
            user: {
                type: 'string',
            },
            shipping: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            deliveryInfo: {
                type: 'string',
            },
            proof: {
                type: 'string',
                fieldType: 'File'
            },
            remark: {
                type: 'string',
            },
        },
    } as const;
};

const ms = SFDeliverySchema();
export type SFDeliveryModel = FromSchema<typeof ms>;

export const SFDeliveryUI = (): CollectionUI[] => { return null };
export const SFDeliveryRules = (): CollectionRule[] => { return null };
registerCollection('Store Delivery', DataType.sf_delivery, SFDeliverySchema(), SFDeliveryUI(), SFDeliveryRules(), true)
