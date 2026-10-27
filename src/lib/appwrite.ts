import 'react-native-url-polyfill/auto';
import { Account, Client, TablesDB } from 'react-native-appwrite';
import { config } from './config';

// The ONLY Appwrite client in the app.
export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platformId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
