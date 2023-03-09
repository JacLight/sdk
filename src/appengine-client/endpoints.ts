export const appEndpoints = {
  get: {
    name: 'get',
    method: 'get',
    path: 'repository/get',
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
  logout: {
    name: 'logout',
    method: 'get',
    path: 'user/logout',
  },
  login: {
    name: 'login',
    method: 'post',
    path: 'user/signin',
  },
  register: {
    name: 'register',
    method: 'post',
    path: 'user/signup',
  },
  appkey: {
    name: 'appkey',
    method: 'post',
    path: 'user/app/key',
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
  batchprocess: {
    name: 'batchprocess',
    method: 'post',
    path: 'batchprocess',
  },
  file_get: {
    name: 'file_get',
    method: 'post',
    path: 'repository/file',
  },
  file_buffer: {
    name: 'file_buffer',
    method: 'post',
    path: 'repository/file/buffer',
  },
  file_signedurl: {
    name: 'file_signedurl',
    method: 'post',
    path: 'repository/file/signurl',
  },
  file_stat: {
    name: 'file_stat',
    method: 'post',
    path: 'repository/file/stat',
  },
  file_stream: {
    name: 'file_stream',
    method: 'post',
    path: 'repository/file/stream',
  },
  file_url: {
    name: 'file_url',
    method: 'post',
    path: 'repository/file/url',
  },
  file_upload: {
    name: 'file_upload',
    method: 'post',
    path: 'repository/file/upload',
  },
  file_flatlist: {
    name: 'file_flatlist',
    method: 'post',
    path: 'repository/file/flatlist',
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
  categories: {
    name: 'categories',
    method: 'get',
    path: 'storefront/category',
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
};

export type APIEndpointName = keyof typeof appEndpoints;
export const getAppEnginePath = (appConfig: any) => {
  return `${appConfig.appengine.host}`;
};
