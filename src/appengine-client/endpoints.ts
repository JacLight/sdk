export const appEndpoints = {
  batch_log_data: {
    name: 'batch_log_data',
    method: 'post',
    path: 'batch/log/data',
  },
  get: {
    name: 'get',
    method: 'get',
    path: 'repository/get',
  },
  get_collection: {
    name: 'get_collection',
    method: 'get',
    path: 'repository/collection',
  },
  isunique: {
    name: 'isunique',
    method: 'get',
    path: 'repository/isunique',
  },
  query: {
    name: 'query',
    method: 'get',
    path: 'repository/query',
  },
  search: {
    name: 'search',
    method: 'post',
    path: 'repository/search',
  },
  find: {
    name: 'find',
    method: 'post',
    path: 'repository/find',
  },
  create: {
    name: 'create',
    method: 'put',
    path: 'repository/create',
  },
  update: {
    name: 'update',
    method: 'post',
    path: 'repository/update',
  },
  activities: {
    name: 'activities',
    method: 'get',
    path: 'repository/activities',
  },
  logout: {
    name: 'logout',
    method: 'get',
    path: 'profile/logout',
  },
  login: {
    name: 'login',
    method: 'post',
    path: 'profile/customer/signin',
  },
  login_magiclink: {
    name: 'login_magiclink',
    method: 'get',
    path: 'profile/magiclink',
  },
  login_facebook: {
    name: 'login_facebook',
    method: 'get',
    path: 'profile/facebook',
  },
  login_google: {
    name: 'login_google',
    method: 'get',
    path: 'profile/google',
  },
  login_code: {
    name: 'login_code',
    method: 'get',
    path: 'profile/code',
  },
  refresh_token: {
    name: 'refresh_token',
    method: 'post',
    path: 'profile/customer/refresh',
  },
  register: {
    name: 'register',
    method: 'post',
    path: 'profile/customer/signup',
  },
  forget_password: {
    name: 'forgot_password',
    method: 'get',
    path: 'profile/customer/password/forgot',
  },
  reset_password: {
    name: 'reset_password',
    method: 'post',
    path: 'profile/customer/password/reset',
  },
  profile_update: {
    name: 'profile_update',
    method: 'post',
    path: 'profile/customer/update',
  },
  appkey: {
    name: 'appkey',
    method: 'post',
    path: 'profile/app/key',
  },
  delete: {
    name: 'delete',
    method: 'del',
    path: 'repository/delete',
  },
  profile: {
    name: 'profile',
    method: 'post',
    path: 'profile',
  },
  file_delete: {
    name: 'file_delete',
    method: 'post',
    path: 'repository/customer/file/delete',
  },
  file_upload: {
    name: 'file_upload',
    method: 'post',
    path: 'repository/customer/file/upload',
  },
  file_flatlist: {
    name: 'file_flatlist',
    method: 'post',
    path: 'repository/customer/file/flatlist',
  },
  products: {
    name: 'products',
    method: 'get',
    path: 'storefront/products',
  },
  product: {
    name: 'product',
    method: 'get',
    path: 'storefront/product',
  },
  product_category: {
    name: 'products_category',
    method: 'get',
    path: 'storefront/product/category',
  },
  product_search: {
    name: 'product_search',
    method: 'post',
    path: 'storefront/search',
  },
  product_find: {
    name: 'product_find',
    method: 'post',
    path: 'storefront/find',
  },
  product_brands: {
    name: 'product_brands',
    method: 'get',
    path: 'storefront/brands',
  },
  product_collections: {
    name: 'product_collections',
    method: 'get',
    path: 'storefront/collections',
  },
  product_categories: {
    name: 'product_categories',
    method: 'get',
    path: 'storefront/categories',
  },
  order_id: {
    name: 'order_id',
    method: 'get',
    path: 'storefront/order/get',
  },
  order_email: {
    name: 'order_email',
    method: 'get',
    path: 'storefront/order/email',
  },
  orders: {
    name: 'orders',
    method: 'get',
    path: 'storefront/orders/get',
  },
  order_update: {
    name: 'order_update',
    method: 'post',
    path: 'storefront/order/update',
  },
  upstream_call: {
    name: 'upstream_call',
    method: 'post',
    path: 'upstream/call',
  },
  upstream_get_config: {
    name: 'upstream_get_config',
    method: 'get',
    path: 'upstream/get/config',
  },
  crm_ticket_get: {
    name: 'crm_ticket_get',
    method: 'get',
    path: 'crm/tickets/get',
  },
  crm_ticket_delete: {
    name: 'crm_ticket_delete',
    method: 'delete',
    path: 'crm/tickets/delete',
  },
  crm_ticket_create: {
    name: 'crm_ticket_create',
    method: 'post',
    path: 'crm/tickets/create',
  },
  crm_ticket_update: {
    name: 'crm_ticket_update',
    method: 'post',
    path: 'crm/tickets/update',
  },
  crm_message_get: {
    name: 'crm_message_get',
    method: 'get',
    path: 'crm/message/get',
  },
  crm_message_delete: {
    name: 'crm_message_delete',
    method: 'delete',
    path: 'crm/message/delete',
  },
  crm_message_create: {
    name: 'crm_message_create',
    method: 'post',
    path: 'crm/message/create',
  },
  crm_message_update: {
    name: 'crm_message_update',
    method: 'post',
    path: 'crm/message/update',
  },
  crm_reservations_get: {
    name: 'crm_reservations_get',
    method: 'get',
    path: 'crm/reservations/get',
  },
  crm_reservations_delete: {
    name: 'crm_reservations_delete',
    method: 'delete',
    path: 'crm/reservations/delete',
  },
  crm_reservations_create: {
    name: 'crm_reservations_create',
    method: 'post',
    path: 'crm/reservations/create',
  },
  crm_reservations_update: {
    name: 'crm_reservations_update',
    method: 'post',
    path: 'crm/reservations/update',
  },
  crm_reservations_definitions: {
    name: 'crm_reservations_definitions',
    method: 'get',
    path: 'crm/reservations/definitions',
  },
  crm_reservations_slots: {
    name: 'crm_reservations_slots',
    method: 'post',
    path: 'crm/reservations/slots',
  },
  crm_service_request_queue_join: {
    name: 'crm_service_request_queue_join',
    method: 'post',
    path: 'crm/service-request-queue/join',
  },
  crm_service_request_update: {
    name: 'crm_service_request_update',
    method: 'post',
    path: 'crm/service-request/update',
  },
  crm_service_request_get: {
    name: 'crm_service_request_get',
    method: 'get',
    path: 'crm/service-request/get',
  },
  crm_subscribe: {
    name: 'crm_subscribe',
    method: 'post',
    path: 'crm/subscribe',
  },
  crm_unsubscribe: {
    name: 'crm_unsubscribe',
    method: 'post',
    path: 'crm/unsubscribe',
  },
  crm_form_save: {
    name: 'crm_form_save',
    method: 'post',
    path: 'crm/form/save',
  },
  crm_form_delete: {
    name: 'crm_form_delete',
    method: 'post',
    path: 'crm/form/delete',
  },
  crm_form_get: {
    name: 'crm_form_get',
    method: 'get',
    path: 'crm/form/get',
  },
  crm_events_get: {
    name: 'crm_events_get',
    method: 'get',
    path: 'crm/events/get',
  },
  crm_events_delete: {
    name: 'crm_events_delete',
    method: 'delete',
    path: 'crm/events/delete',
  },
  crm_events_create: {
    name: 'crm_events_create',
    method: 'post',
    path: 'crm/events/create',
  },
  crm_events_update: {
    name: 'crm_events_update',
    method: 'post',
    path: 'crm/events/update',
  },
};

export type APIEndpointName = keyof typeof appEndpoints;
export const getAppEnginePath = (appConfig: any) => {
  return `${appConfig.appengine.host}`;
};
