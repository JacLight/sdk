import { FromSchema } from "json-schema-to-ts";

export const PermissionSchema = () => {
  return {
    type: 'object',
    properties: {
      ownertype: {
        type: 'string' //role, user, group 
      },
      ownerid: {
        type: 'string'
      },
      permissions: {
        type: 'array',
        layout: 'vertical',
        items: {
          type: 'object',
          properties: {
            resourcetype: {
              type: 'string' //Component, Content
            },
            resourceid: {
              type: 'string'
            },
            allow: {
              type: 'object',
              title: 'Allow',
              displayStyle: 'card',
              layout: 'horizontal',
              properties: {
                read: {
                  type: 'boolean'
                },
                create: {
                  type: 'boolean'
                },
                delete: {
                  type: 'boolean'
                },
                update: {
                  type: 'boolean'
                },
                view: {
                  type: 'boolean'
                },
                configure: {
                  type: 'boolean'
                },
                add: {
                  type: 'boolean'
                },
                remove: {
                  type: 'boolean'
                },
              }
            },
            deny: {
              type: 'object',
              title: 'Deny',
              displayStyle: 'card',
              layout: 'horizontal',
              properties: {
                read: {
                  type: 'boolean'
                },
                create: {
                  type: 'boolean'
                },
                delete: {
                  type: 'boolean'
                },
                update: {
                  type: 'boolean'
                },
                view: {
                  type: 'boolean'
                },
                configure: {
                  type: 'boolean'
                },
                add: {
                  type: 'boolean'
                },
                remove: {
                  type: 'boolean'
                },
              }
            },
          }
        }
      }
    }
  } as const;
}

const pes = PermissionSchema();
export type PermissionModel = FromSchema<typeof pes>;



// Action on Collection - Read, Create, Delete, Update
// Action on Compoent - View, Configure, Add, Remove, Update
// Where - ControlPanel, Website, Mobile
// Actor  - Role, Group, User
// Subject - Collection, Component, API

// Default Groups

// Default Roles
// Guest, User, Owner, Publisher, Reviewer, PowerUser, Administrator
