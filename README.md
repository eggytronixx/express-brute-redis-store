# express-brute-redis-store
Redis adaptor for store adapter for the [express-brute](https://github.com/AdamPflug/express-brute)

##### Installation

via npm:
```bash
npm install --save express-brute-redis-store
```

##### Example

```javascript
const RedisStore = require('express-brute-redis-store');
const ExpressBrute = require('express-brute');

let redisStore = new RedisStore({
    settings: { prefix: 'api:'},
    redisOptions: {
        host: '127.0.0.1',
        port: '6379'
    }
});

let apiBruteforce = new ExpressBrute(redisStore, {
    freeRetries: 450, // number of request
    minWait: 16 * 60 * 1000, // 16 min
    maxWait:  16 * 60 * 1000, // 16 min
    lifetime: 15 * 60, // 15 min
    refreshTimeoutOnRequest: false
});
```

Create second RedisStore with existing RedisStore instance.

Good for reusing existing redis client. 
```javascript
let authRedisStore = new RedisStore(redisStore, {prefix: 'auth:'});
 
let authBruteForce = new ExpressBrute(authRedisStore, {
    freeRetries: 100, 
    minWait: 25 * 60 * 60 * 1000,
    lifetime: 24 * 60 * 60, 
    refreshTimeoutOnRequest: false
});
```