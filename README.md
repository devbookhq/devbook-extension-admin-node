# Devbook Extension Node.js library

The Devbook Extension Node.js library provides convenient way to upload data in the Devbook search engine from your Node server.

## Installation
```
npm install @devbookhq/extension-admin
or
yarn add @devbookhq/extension-admin
```

## Usage
```js
import Devbook, { APIVersion } from '@devbookhq/extension-admin';

// Initialize the API with your secret key and extension ID. You can find both in the Devbook dashboard.
const devbook = new Devbook({
  secretAPIKey: 'sk_dev_...',
  extensionID: 'your-extension-id',
  apiVersion: APIVersion.v1, // Optional.
});

// Index new extension search entries.
// Arguments:
// - Name of the index.
// - Data you want to index.
const entries = [
  {
    id: 'id1', // Optional.
    title: 'Title',
    body: 'Content',
  },
];
await devbook.index('indexName', entries);

// Search extension search data.
// Arguments:
// - Array of indexes you want to search in.
// - Query you want to search for.
// - Page size (optional, default is 10).
// - Page number (optional, default is 0).
const pageSize = 10;
const pageNumber = 0;
const results = await devbook.search(['index1', 'index2'], query, pageSize, pageNumber);

// Delete indexed data.
// Arguments:
// - Data index from where you want to delete the all the data.
await devbook.delete('indexName');

// Read a single entry from an index.
// Arguments:
// - Name of the index.
// - ID of an entry you want to read.
const entry = await devbook.entry('indexName', 'entryID');

// Read multiple entries from an index.
// Arguments:
// - Name of the index.
// - Page size (optional, default is 100).
// - Page ID used for pagination of results 
//   (optional, page ID for retrieving the next page of entries.
//   Is returned from the `devbook.entries` function in the `pageID` field of the return object.).
const pageSize = 100;
const pageID = 'pageID';
const entries = await devbook.entries('indexName', pageSize, pageID);

// Get information about the extension.
const info = await devbook.info();
```

## Documentation
TODO: Add a link to documentation.
