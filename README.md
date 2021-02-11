# Devbook Extension Node.js library

The Devbook Extension Node.js library provides convenient access to the Devbook Extension API from applications written in server-side JavaScript.

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
// - Page number (optional, default is 1).
// - Page size (optional, default is 10).
const pageNumber = 1;
const pageSize = 10;
const results = await devbook.search(['index1', 'index2'], query, pageNumber, pageSize);

// Delete indexed data.
// Arguments:
// - Data index from where you want to delete the data.
// - IDs of entries in the index.
await devbook.delete('indexName', ['entryID-1', 'entryID-2']);

// Read a single entry from an index.
// Arguments:
// - Name of the index.
// - ID of an entry you want to read.
const entry = await devbook.entry('indexName', 'entryID');

// Read multiple entries from an index.
// Arguments:
// - Name of the index.
// - Page number.
// - Page size.
const pageNumber = 1;
const pageSize = 10;
const entries = await devbook.entries('indexName', pageNumber, pageSize);

// Get information about the extension
const info = await devbook.info();
```

## Documentation
TODO: Add a link to documentation.
