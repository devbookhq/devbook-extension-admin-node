import axios, { Method } from 'axios';

export enum APIVersion {
  v1 = 'v1',
}

interface Entry {
  id?: string;
  title: string;
  body: string;
}

interface ExtensionInfo {
  extensionID: string;
  indexes: string[];
}

interface DevbookOptions {
  apiVersion?: APIVersion;
  extensionID: string;
  secretAPIKey: string,
}

class Devbook {
  private secretAPIKey: string;
  private extensionID: string;
  private apiVersion = APIVersion.v1;

  public constructor(options: DevbookOptions) {
    this.secretAPIKey = options.secretAPIKey;
    this.extensionID = options.extensionID;

    if (options.apiVersion) {
      this.apiVersion = options.apiVersion;
    }
  }

  private async request(options: { method: Method, route?: string, data?: any, params?: any }) {
    const { method, route, data, params } = options;
    const result = await axios({
      url: `https://api.usedevbook.com/${this.apiVersion}/extension/${this.extensionID}${route ? route : ''}`,
      method,
      data,
      params,
      headers: {
        'Authorization': `ApiKey ${this.secretAPIKey}`,
      }
    })
    return result.data;
  }

  public async search(indexes: string[] | string, query: string, page: number = 1, pageSize: number = 10): Promise<Entry[]> {
    return this.request({
      method: 'POST',
      route: '/entry/query',
      data: {
        indexes,
        query,
      },
      params: {
        page,
        pageSize,
      },
    });
  }

  public async index(index: string, entries: Entry[]) {
    await this.request({
      method: 'PUT',
      route: '/entry',
      data: {
        entries,
        index,
      },
    });
  }

  public async delete(index: string, ids: string[]) {
    await this.request({
      method: 'DELETE',
      route: '/entry',
      data: {
        ids,
        index,
      },
    });
  }

  public async entry(index: string, id: string): Promise<Entry> {
    return this.request({
      method: 'GET',
      route: `/entry/${id}`,
      data: {
        index,
      },
    });
  }

  public async entries(index: string, page: number, pageSize: number): Promise<Entry[]> {
    return this.request({
      method: 'GET',
      route: '/entry',
      data: {
        index,
      },
      params: {
        page,
        pageSize,
      }
    });
  }

  public async info(): Promise<ExtensionInfo> {
    return this.request({
      method: 'GET',
    });
  }
}

export default Devbook;
