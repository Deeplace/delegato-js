# Contents

- [Contents](#contents)
- [Introduction](#introduction)
- [Usage](#usage)
  - [Configuration](#configuration)
    - [Parameters](#parameters)
    - [Example](#example)
  - [Error handling](#error-handling)
    - [Errors](#errors)
    - [Example](#example-1)
  - [Event handling](#event-handling)
    - [Example](#example-2)
  - [Registration](#registration)
    - [Example](#example-3)
  - [Authentication](#authentication)
    - [Example](#example-4)
  - [Signing a transaction](#signing-a-transaction)
    - [Example](#example-5)
  - [Calling API methods](#calling-api-methods)
    - [Namespaces](#namespaces)
    - [Example](#example-6)

# Introduction

```bash
npm i @liquid-democracy/delegato-js
```

Or if you're using Yarn:

```bash
yarn add @liquid-democracy/delegato-js
```

# Usage

## Configuration

Blockchain API client can be configured by `address` and `chainId` properties of [Api](src/api/Api.ts) class instance.

### Parameters

| Name      | Type                                                                                              | Description                                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `address` | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Websocket address and port of Delegato blockchain node. The address should contain protocol (`ws` or `wss`).                                                         |
| `chainId` | [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Identifier of Delegato blockchain. This identifier makes difference between two different networks of Delegato blockchain. For example production and test networks. |

### Example

The following example illustrates how to connect to test blockhain network using JavaScript [promises](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```ts
import { Api } from "@liquid-democracy/delegato-js";

let api = new Api();
api.address = "wss://delegato.stage.deeplace.md/blockchain";
api.chainId =
  "74b66242d0ac8c5c447d04ae10460002fb5ee9c5013dd0d46a7296e259ae95a8";

api
  .connect()
  .then(() => {
    // We have been connected. Now we can interact with blockchain API.
  })
  .catch((error) => {
    // An error occurred on establishing connection with blockchain node.
    // Here we can handle error and take some action.
    // For example try to connect again.
  });
```

Or you can use [await](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/await) operator.

```ts
import { Api } from "@liquid-democracy/delegato-js";

let api = new Api();
api.address = "wss://delegato.stage.deeplace.md/blockchain";
api.chainId =
  "74b66242d0ac8c5c447d04ae10460002fb5ee9c5013dd0d46a7296e259ae95a8";

(async () => {
  try {
    await api.connect();
    // We have been connected. Now we can interact with blockchain API.
  } catch (error) {
    // An error occurred on establishing connection with blockchain node.
    // Here we can handle error and take some action.
    // For example try to connect again.
  }
})();
```

## Error handling

### Errors

| Error           | Description                                                        | Data                                            |
| --------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| ConnectionError | Web socket connection error.                                       | _No additional data._                           |
| MethodError     | Occurres after method call processing on server side.              | The data returned by server in `data` property. |
| ProtocolError   | Occurres if not described by JSON-RPC 2.0 protocol action appears. | _No additional data._                           |
| InternalError   | Unexpected error. Internal logic error of JsonRpcWebSocket class.  | _No additional data._                           |
| ValidationError | Error on parse JS literal to blockchain data.                      | _No additional data._                           |
| LogicError      | Occures on component state error.                                  | _No additional data._                           |

### Example

An example of error catching:

```ts
import {
  Api,
  ConnectionError,
  MethodError,
  ProtocolError,
  InternalError,
} from "@liquid-democracy/delegato-js";

let api = new Api();

(async () => {
  try {
    await api.connect();
    console.log(await api.database.getBlock(1));
  } catch (error) {
    switch (error.constructor) {
      case ConnectionError:
        console.error(error.message);
        break;

      case MethodError:
        console.log(error);
        break;

      case ProtocolError:
      case InternalError:
        console.log(`Unexpected error: ${error.message}`);
        break;
    }
  }
})();
```

## Event handling

The library supports event system according [observer](https://refactoring.guru/design-patterns/observer/typescript/example) pattern. Here an example of handling disconnection event:

### Example

```ts
import { Api } from "@liquid-democracy/delegato-js";

let api = new Api();
api.onDisconnect.attach(() => {
  console.log("Connection closed.");
});

api.connect().then(() => api.disconnect());
```

## Registration

To use all functionality of Delegato blockchain, you need have an account registred in blockchain system.

Firstly, you need to generate keys using a pair of email and password. The same pair of email and password will generate the same pair of keys.

```ts
const email = "email@example.com";
const password = "1234567890123";
const owner = PrivateKey.create(email, password, PrivateKeyType.owner);
const active = PrivateKey.create(email, password, PrivateKeyType.active);
```

You do not need to generate keys every time you need them, better to store keys in memory and do not even save email/password pair, because generating of keys is resource-intensive task, but storing email/password pair in memory or persistent storage is dangerous.

To perform any other transaction you should perform [AccountCreate](src/chain/operations/AccountCreate.ts) one. [AccountCreate](src/chain/operations/AccountCreate.ts) transaction stores active and owner public keys and should be signed by both corresponding active and owner private one. **DO NOT** send your private keys in [AccountCreate](src/chain/operations/AccountCreate.ts) transaction, it leads for security issues of your account. By default API client uses [MemoryStorage](src/api/storage/MemoryStorage.ts) to save you keys, but you can use [LocalStorage](src/api/storage/LocalStorage.ts) (which saves keys in browser [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)) or create your own one implementing [Storage](src/api/storage/Storage.ts) interface.

After [AccountCreate](src/chain/operations/AccountCreate.ts) operation is applied, your active and owner public keys will be stored in blockchain database. These keys will be used to identify your transactions signed by your private keys.

### Example

The following example illustrates how to register new account in blockchain system using keys generated before.

```ts
import {
  LocalStorage,
  PrivateKey,
  PrivateKeyType,
  Api,
  operations,
} from "@liquid-democracy/delegato-js";

(async () => {
  // Be careful, this example cannot be compiled in NodeJS. Browser only.
  const api = new Api(new LocalStorage());
  const email = "email@example.com";
  const password = "1234567890123";
  const owner = PrivateKey.create(email, password, PrivateKeyType.owner);
  const active = PrivateKey.create(email, password, PrivateKeyType.active);
  const secret = "Dark Helmet";

  try {
    await api.connect();

    console.log(
      await (
        await api.transaction([
          new operations.AccountCreate({
            firstName: "John",
            lastName: "Doe",
            birth: 2004,
            idnp: 1234567890123,
            email: "email@example.com",
            locality: "1.20.1",
            secretQuestion: "Who is your father’s brother’s nephew’s cousin’s former roommate?",
            secretAnswer: sha256(
              secret
                .trim()
                .toLocaleLowerCase()
                .replace(/[^a-zа-я0-9]/, "")
            ),
            owner: owner.publicKey,
            active: active.publicKey,
          }),
        ])
      )
      .sign([owner, active])
      .broadcast()
    );

    api.disconnect();
  }
  catch (error) {
    console.log(error);
  }
})();
```

## Authentication

Some API methods need authorization, so you should be authenticated to perform them.
Now we can authenticate to your account (if you don't know how to create one, look [Registration](#registration) section) using email and password pair. You can use `authenticate` method of [Api](src/api/Api.ts) class to log in your account created before.

### Example

Here is an example. You don't need to generate keys manualy. In this example the client automaticaly generates keys and stores them in [MemoryStorage](src/api/storage/MemoryStorage.ts).

```ts
import {
  MemoryStorage,
  Api,
} from "@liquid-democracy/delegato-js";

(async () => {
  const api = new Api(new MemoryStorage());
  const email = "email@example.com";
  const password = "1234567890123";

  try {
    await api.connect();

    api.authenticate(email, password);
    console.log(api.isAuthenticated);

    api.disconnect();
  }
  catch (error) {
    console.log(error);
  }
})();
```

## Signing a transaction

After account [registration](#registration) you can perform any other transaction using `Api.transaction` method. The `transaction` method returns [Transaction](src/chain/Transaction.ts) object. Any transaction should be signed by corresponding private key(s) according operations which transaction contains. Use `sign` method of [Transaction](src/chain/Transaction.ts) class to sign the transaction and use operation documentation to determine which keys (active and/or owner) it requires. One transaction can contain multiple operations, but you should not sign one transaction with same key multiple times.

Signed transaction can be broadcasted to blockchain using `broadcast` method of [Transaction](src/chain/Transaction.ts) class. Also you can use `Api.network.broadcastTransactionSynchronous` method to do this.

### Example

The following example shows how to vote in poll.

```ts
import {
  Api,
  PrivateKey,
  PrivateKeyType,
  operations,
} from "@liquid-democracy/delegato-js";

(async () => {
  const api = new Api();
  const email = "email@example.com";
  const password = "1234567890123";
  const active = PrivateKey.create(email, password, PrivateKeyType.active);

  try {
    await api.connect();

    console.log(
      await (
        await api.transaction([
          new operations.PollVote({
            account: "1.2.7",
            variant: "1.23.1",
          }),
        ])
      )
      .sign([active])
      .broadcast()
    );

    api.disconnect();
  }
  catch (error) {
    console.log(error);
  }
})();
```

Or if you have been authenticated before, use key from storage.

```ts
import {
  Api,
  PrivateKey,
  PrivateKeyType,
  operations,
} from "@liquid-democracy/delegato-js";

(async () => {
  const api = new Api();
  const email = "email@example.com";
  const password = "1234567890123";

  try {
    await api.connect();

    await api.authenticate(email, password);

    console.log(
      await (
        await api.transaction([
          new operations.PollVote({
            account: "1.2.7",
            variant: "1.23.1",
          }),
        ])
      )
      .sign([api.storage.activePrivateKey])
      .broadcast()
    );

    api.disconnect();
  }
  catch (error) {
    console.log(error);
  }
})();
```

## Calling API methods

While we need transactions to modify data in blockchain database, API methods are needed to get one. There are three types of API methods.

+ Public API methods which don't need any authorization and can be performed by any user, even unauthenticated. That's why public methods don't contain any personal data.
+ The second type is API methods which return data depending on user authentication. If user is authenticated API methods of this type can contain personal information. But these methods still can be used whithout authentication.
+ The last one contains API methods which can be performed by authorized users only. Data returned by methods of this group contains personal information and differs for each authenticated user.

### Namespaces

All API methods are separated to logical groups named "namespaces". There are 4 namespaces in delegato-js library.

| Name       | Name in blockchain  | Description                                                                                                                |
| ---------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `login`    | `login`             | Contains basic API methods to manage session.                                                                              |
| `database` | `database`          | Contains information about chain, blocks and transactions.                                                                 |
| `network`  | `network_broadcast` | This namespace contains information about blockchain network. Also blocks and transactions can be broadcasted by this API. |
| `poll`     | `poll`              | This namespace serves all requests related to public polls and vote delegation in public polls.                            |

Any API method can be called using the following path: `api.<namespace>.<method>`. For example `getVoteDelegationAvailability` from `poll` name space can be called using the following path: `api.poll.getVoteDelegationAvailability`.

### Example

This example shows how to call `getVoteDelegationAvailability` method. `getVoteDelegationAvailability` method need user to be authorized.

```ts
import {
  Api,
} from '@liquid-democracy/delegato-js';

(async () => {
  const api = new Api();
  const email = "email@example.com";
  const password = "1234567890123";

  try {
    await api.connect();

    await api.authenticate(email, password);
    console.log(api.poll.getVoteDelegationAvailability(startDate, endDate, ['1.12.0']));

    api.disconnect();
  }
  catch (error) {
    console.log(error);
  }
})();
```