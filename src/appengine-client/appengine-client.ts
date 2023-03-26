import { DataType } from "../types";
import { appEndpoints } from "./endpoints";
// import { decode } from "jsonwebtoken";
// import { BaseModel } from "@models/base.model";
// import { UserModel } from "@models/user";


class CustomHttpError extends Error {
  public response = { data: {}, status: 0 }
  constructor(status: number, message: string, data: any) {
    super(message)
    this.response.data = data, this.response.status = status;
  }
}
export class AppEngineClient {
  private renewTries = 0;
  private token: string = null;

  constructor(private appConfig: any, private axios: any) { }

  async getToken() {
    const path = `${this.appConfig.appengine.host}/${appEndpoints.appkey.path}`;
    const data = {
      appId: this.appConfig.appengine.appId,
      secret: this.appConfig.appengine.secret,
      key: this.appConfig.appengine.key,
    };
    this.renewTries = this.renewTries + 1;
    const rt = await this.axios.post(path, data, this.getBaseHeader());
    if (rt?.data?.token) {
      return rt.data.token
    } else {
      console.error("invalid  App Key | App Secret || App Id")
      return null
    }
  }

  getUserFromToken(auth_token: string) {
    if (!auth_token) {
      console.error("user auth_token is undefined")
      return null;
    }

    try {
      const token = auth_token.split(" ")[1];
      const user = { sk: '', token };// decode(token) as BaseModel<UserModel>;
      return user
    } catch (err) {
      console.error(err)
    }
    return null;
  };


  getBaseHeader(): { headers: any } {
    return {
      headers: {
        'Content-Type': 'application/json',
        orgid: this.appConfig.orgId,
      },
    }
  };

  async getHeaderWithToken() {
    if (!this.token) {
      this.token = await this.getToken();
      this.renewTries = 0;
    }
    const init = this.getBaseHeader();
    init.headers['Authorization'] = `Bearer ${this.token}`;
    return init;
  };

  private userAuthPaths = ['user/customer']
  async processRequest(method: string, clientPath: string, clientData?: any, clientHeader?: any, clientQuery?: any): Promise<any> {
    let path;

    //check authorization
    let clientAuthRequired = false
    this.userAuthPaths.forEach(path => {
      if (clientPath.includes(path)) {
        clientAuthRequired = true
      }
    })
    if (clientAuthRequired) {
      const user = this.getUserFromToken(clientHeader?.authorization)
      if (!user) {
        return new CustomHttpError(401, 'Unauthorized', 'User information required');
      }

      if (clientPath.includes('repository/create') && clientData) {
        if (!clientData.author || clientData.author !== user.sk) {
          return new CustomHttpError(422, 'Data author not set', 'Invalid owner information, set author prop');
        }
      }

      if (clientPath.includes('repository/update') && clientData) {
        if (clientData.author && clientData.author !== user.sk) {
          return new CustomHttpError(401, 'Unauthorized', 'Owner information required');
        }
      }
    }

    if (clientPath.startsWith('/api')) {
      path = this.appConfig.appengine.host + "/" + clientPath.substring(clientPath.indexOf('/api/') + 5)
    } else {
      path = this.appConfig.appengine.host + "/" + clientPath
    }
    const header: any = await this.getHeaderWithToken();
    header['x-client-authorization'] = clientHeader?.authorization
    const data = clientData;
    if (data) {
      data.clientQuery = clientQuery
    }
    method = method.toLowerCase();
    console.log('request -> callStorefront', method, clientPath, path);
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
      return this.processResponse(rt);
    } catch (error) {
      console.error(error.message);
      if (this.renewTries < 2 && error?.response?.status === 401 && error?.response?.statusText === 'Unauthorized') {
        console.log('Appengine Token Expired,.... renewing token');
        this.token = null;
        return await this.processRequest(method, path, data);
      } else {
        throw error;
      }
    }
  };

  async getSite() {
    const sitePath = `${appEndpoints.query.path}/site/name/${this.appConfig.siteName}`
    const rt: any = await this.processRequest('get', sitePath, null, null);
    if (rt && Array.isArray(rt.data) && rt.data.length > 0) {
      const [site] = rt.data;
      if (site.data.mainNavigation) {
        const navPath = `${appEndpoints.get.path}/${DataType.navigation}/${site.data.mainNavigation}`
        const mainNav = await this.processRequest('get', navPath, null, null);
        site.data.mainNavigation = mainNav?.data?.data || [];
      }

      if (site.data.footerNavigation) {
        const navPath = `${appEndpoints.get.path}/${DataType.navigation}/${site.data.footerNavigation}`
        const footNav = await this.processRequest('get', navPath, null, null);
        site.data.mainNavigation = footNav?.data?.data || [];
      }

      const pagePath = `${appEndpoints.query.path}/${DataType.page}/site/${site.sk}`
      const pages = await this.processRequest('get', pagePath, null, null);
      site.data.pages = pages.data;
      if (site.data.languages) {
        site.data.languages = JSON.parse(site.data.languages);
      }
      if (site.data.currencies) {
        site.data.currencies = JSON.parse(site.data.currencies);
      }
      return site;
    }
    return null;
  };


  async upload(path: string, location: string, file: any): Promise<any> {
    console.debug('request -> updateData', path);
    const formData = new FormData();
    formData.append('location', location);
    formData.append('files', file);

    // let rt = await axios.post(path, formData, getHeaderToken());
    try {
      let rt = await fetch(path, {
        method: 'POST',
        headers: new Headers({
          ...((await this.getHeaderWithToken()) as Record<string, any>),
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
    if (response && (response.status === 200 || response.status === 201 || response.status === 202 || response.statusText)) {
      return response.data;
    }
    return response
  };
}