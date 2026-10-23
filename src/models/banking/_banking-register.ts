import { concreteCollections, registerCollection } from '../../default-schema';
import { DataType, RoleType } from '../../types';

/** Banking records use custom ownership-checked APIs; generic customers never receive collection CRUD rights. */
export const registerBankingCollection = (title: string, datatype: DataType, schema: any) => {
  registerCollection(title, datatype, schema);
  const registered = concreteCollections.get(datatype)!;
  concreteCollections.set(datatype, { ...registered, data: { ...registered.data, permission: {
    read: [RoleType.User], create: [RoleType.User], update: [RoleType.User], delete: [RoleType.User],
  } } });
};
