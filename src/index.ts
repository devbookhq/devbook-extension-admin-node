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
    try {
      const result = await axios({
        url: `https://api.usedevbook.com/${this.apiVersion}/extension/${this.extensionID}${route ? route : ''}`,
        method,
        data,
        params,
        headers: {
          'Authorization': `ApiKey ${this.secretAPIKey}`,
        },
      });
      return result.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.error.message);
      } else {
        throw error;
      }
    }
  }

  public async search(
    indexOrIndexes: string[] | string,
    query: string,
    pageSize: number = 10,
    pageNumber: number = 0): Promise<Required<Entry>[]> {

    let indexes: string[];

    if (typeof indexOrIndexes === 'string') {
      indexes = [indexOrIndexes];
    } else {
      indexes = indexOrIndexes
    }

    return this.request({
      method: 'POST',
      route: '/entry/query',
      params: {
        pageSize,
        pageNumber,
      },
      data: {
        indexes,
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

  public async entry(index: string, id: string): Promise<Required<Entry>> {
    const data = await this.request({
      method: 'GET',
      route: `/entry`,
      params: {
        index,
        entryID: id,
      },
    });
    return data.entry;
  }

  public async entries(index: string, pageSize: number = 100, pageID?: string): Promise<{ entries: Required<Entry>[], pageID: string | undefined }> {
    const data = await this.request({
      method: 'GET',
      route: '/entry',
      params: {
        index,
        pageSize,
        pageID,
      }
    });
    return data;
  }

  public async info(): Promise<ExtensionInfo> {
    return this.request({
      method: 'GET',
    });
  }
}

export default Devbook;
