import { appEndpoints } from './endpoints';
// import { decode } from "jsonwebtoken";
// import { BaseModel } from "@models/base.model";
// import { UserModel } from "@models/user";

type AppInfo = {
  appId: string;
  appKey: string;
  appSecret: string;
  orgId: string;
  siteName: string;
};

export class AppEngineClient {
  private renewTries = 0;
  private token: string = null;

  constructor(private appConfig: any, private axios: any) { }

  async getToken(appInfo: AppInfo) {
    const path = `${this.appConfig.appengine.host}/${appEndpoints.appkey.path}`;

    let data;
    if (appInfo?.appId && appInfo?.appKey && appInfo?.appSecret) {
      data = {
        appId: appInfo.appId,
        secret: appInfo.appSecret,
        key: appInfo.appKey,
        siteName: appInfo.siteName,
      };
    } else {
      data = {
        appId: this.appConfig.appengine.appId,
        secret: this.appConfig.appengine.secret,
        key: this.appConfig.appengine.key,
      };
    }
    this.renewTries = this.renewTries + 1;
    const rt = await this.axios.post(path, data, this.getBaseHeader(appInfo));
    if (rt?.data?.token) {
      return rt.data.token;
    } else {
      console.error('invalid  App Key | App Secret || App Id');
      return null;
    }
  }

  getUserFromToken(auth_token: string) {
    if (!auth_token) {
      console.error('user auth_token is undefined');
      return null;
    }

    try {
      const token = auth_token.split(' ')[1];
      const user = { sk: '', token }; // decode(token) as BaseModel<UserModel>;
      return user;
    } catch (err) {
      console.error(err);
    }
    return null;
  }

  getBaseHeader(appInfo: AppInfo): { headers: any } {
    return {
      headers: {
        'Content-Type': 'application/json',
        orgid: appInfo?.orgId || this.appConfig.orgId,
      },
    };
  }

  async getHeaderWithToken(appInfo: AppInfo) {
    if (!this.token) {
      this.token = await this.getToken(appInfo);
    }
    const init = this.getBaseHeader(appInfo);
    init.headers['Authorization'] = `Bearer ${this.token}`;
    return init;
  }

  async processRequest(
    method: string,
    clientPath: string,
    clientData?: any,
    clientAuthorization?: string,
    clientQuery?: any,
    clientInfo?: any,
    appInfo?: AppInfo
  ): Promise<any> {
    let path;
    if (clientPath.startsWith('/api')) {
      path = this.appConfig.appengine.host + '/' + clientPath.substring(clientPath.indexOf('/api/') + 5);
    } else {
      path = this.appConfig.appengine.host + '/' + clientPath;
    }
    const header: any = await this.getHeaderWithToken(appInfo);
    if (clientAuthorization) {
      header.headers['x-client-authorization'] = clientAuthorization
    }

    if (clientInfo) {
      header.headers['x-client-info'] = clientInfo
    }
    const data = clientData;
    if (data) {
      data.clientQuery = clientQuery;
    }
    method = method.toLowerCase();
    console.log('request starting  -> ', method, clientPath, path);
    let rt;
    try {
      if (method === 'post') {
        rt = await this.axios.post(path, data, header);
      } else if (method === 'put') {
        rt = await this.axios.put(path, data, header);
      } else if (method === 'get') {
        rt = await this.axios.get(path, header);
      } else if (method === 'delete') {
        rt = await this.axios.delete(path, header);
      }
      this.renewTries = 0;
      console.log('request success -> ', method, clientPath);
      return this.processResponse(rt);
    } catch (error) {
      console.error('request error -> ', clientPath, error.message);
      if (
        this.renewTries < 2 &&
        error?.response?.status === 401 &&
        error?.response?.statusText === 'Unauthorized'
      ) {
        console.log('Appengine Token Expired,.... renewing token');
        this.token = null;
        await this.getHeaderWithToken(appInfo);
        console.log('auth ok')
        return await this.processRequest(method, clientPath, clientData, clientAuthorization, clientQuery);
      } else {
        throw error;
      }
    }
  }

  async getSite(appInfo?: AppInfo) {
    //en=true enables enrichment
    const sitePath = `${appEndpoints.query.path}/site/name/${this.appConfig.siteName}?en=true`;
    const rt: any = await this.processRequest('get', sitePath, null, null, null, null, appInfo);
    if (rt && Array.isArray(rt.data) && rt.data.length > 0) {
      const [site] = rt.data;
      return site;
    }
    return null;
  }

  async getPages(siteName = this.appConfig.siteName, appInfo?: AppInfo) {
    const query = { 'data.site': siteName }
    let rt = await this.processRequest('post', `${appEndpoints.find.path}/page`, { query, options: { enrich: true } }, null, null, null, appInfo);
    return rt?.data
  }

  async getPage(site: string, pageIds: { slug?: string, name?: string, id?: string }, appInfo?: AppInfo) {
    let rt;
    if (pageIds?.id) {
      const pagePath = `${appEndpoints.get.path}/page/${pageIds?.id}?en=true`;
      rt = await this.processRequest('get', pagePath, null, null, null, null, appInfo);
    } else if (pageIds?.name) {
      const query = { 'data.site': site, 'data.name': pageIds?.name }
      rt = await this.processRequest('post', `${appEndpoints.find.path}/page`, { query, options: { enrich: true } }, null, null, null, appInfo);
    } else if (pageIds?.slug) {
      const query = { 'data.site': site, 'data.slug': pageIds?.slug }
      rt = await this.processRequest('post', `${appEndpoints.find.path}/page`, { query, options: { enrich: true } }, null, null, null, appInfo);
    } else {
      console.debug('request -> getPage, not found site: ' + site + ' page: ', pageIds);
      return null
    }
    return rt?.data
  }


  async getPreviewPage(orgId: string, site: string, page: string, token: string) {
    return await this.processRequest('get', `tools/preview/${orgId}/${site}/${page}?token=${token}`,);
  }


  async logData(data: any) {
    const sitePath = `${appEndpoints.batch_log_data}`;
    const rt: any = await this.processRequest('post', sitePath, data, null, null);
    if (rt && Array.isArray(rt.data) && rt.data.length > 0) {
      const [site] = rt.data;
      return site;
    }
    return null;
  }


  async upload(path: string, location: string, file: any, appInfo?: AppInfo): Promise<any> {
    console.debug('request -> updateData', path);
    const formData = new FormData();
    formData.append('location', location);
    formData.append('files', file);

    // let rt = await axios.post(path, formData, getHeaderToken());
    try {
      let rt = await fetch(path, {
        method: 'POST',
        headers: new Headers({
          ...((await this.getHeaderWithToken(appInfo)) as Record<string, any>),
        }),
        body: formData,
      });

      if (rt.ok) {
        return rt.json();
      } else {
        throw new Error(rt.statusText);
      }
    } catch (error) {
      if (
        this.renewTries < 2 &&
        error.statusCode === '401' &&
        error.message === 'jwt expired'
      ) {
        console.log('Appengine Token Expired,.... renewing token');
        this.token = null;
        return await this.upload(path, location, file);
      } else {
        console.error(error.message);
        return error;
      }
    }
  }

  processResponse(response: any) {
    if (
      response &&
      (response.status === 200 ||
        response.status === 201 ||
        response.status === 202 ||
        response.statusText)
    ) {
      return response.data;
    }
    return response;
  }
}
