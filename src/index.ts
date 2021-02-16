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
    });
    return result.data;
  }

  public async search(
    indexes: string[] | string,
    query: string,
    pageSize: number = 10,
    pageNumber: number = 0): Promise<Entry[]> {
    return this.request({
      method: 'POST',
      route: '/entry/query',
      params: {
        indexes,
        pageSize,
        pageNumber,
      },
      data: {
        query,
      },
    });
  }

  public async index(index: string, entries: Entry[]) {
    await this.request({
      method: 'PUT',
      route: '/entry',
      params: {
        index,
      },
      data: {
        entries,
      },
    });
  }

  public async delete(index: string) {
    await this.request({
      method: 'DELETE',
      route: '/entry',
      params: {
        index,
      },
    });
  }

  public async entry(index: string, id: string): Promise<Entry> {
    return this.request({
      method: 'GET',
      route: `/entry`,
      params: {
        index,
        entryID: id,
      },
    });
  }

  public async entries(index: string, pageSize: number = 100, pageID?: string): Promise<{ entries: Entry[], pageID: string }> {
    return this.request({
      method: 'GET',
      route: '/entry',
      params: {
        index,
        pageSize,
        pageID,
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
