import { Language } from '../chain';
import Api from './Api';
import { poll, database } from './types';

enum ApiNamespace {
  database = 'database',
  network = 'network_broadcast',
  poll = 'poll',
  login = 1,
};

import { LocalStorage, MemoryStorage, Storage } from './storage';

export { ApiNamespace, LocalStorage, MemoryStorage, Storage, poll, database };
export default Api;
