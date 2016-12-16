const AbstractClientStore = require('express-brute/lib/AbstractClientStore');
const redis = require('redis');


class RedisStore extends AbstractClientStore {

    constructor(options) {

        super();

        if (options instanceof RedisStore) {

            this.client = options.client;
            this.redisOptions = options.redisOptions;
            this.settings = arguments[1];

        } else {

            if (options) {

                options.settings = options.settings || RedisStore.defaultOptions.settings;
                options.redisOptions = options.redisOptions || RedisStore.defaultOptions.redisOptions;

            } else {

                options = RedisStore.defaultOptions

            }


            this.settings = options.settings;
            this.redisOptions = options.redisOptions;
            this.client = redis.createClient(this.redisOptions);

        }

    }

    set(key, value, lifetime, callback) {

        lifetime = parseInt(lifetime, 10) || 0;

        let multi = this.client.multi();
        let redisKey = this.settings.prefix + key;

        multi.set(redisKey, JSON.stringify(value));

        if (lifetime > 0) multi.expire(redisKey, lifetime);

        multi.exec(err => {

            if (typeof callback == 'function') {

                err ? callback(err) : callback(null);

            }

        });

    }

    get(key, callback) {

        let redisKey = this.settings.prefix + key;

        this.client.get(redisKey, (err, data) => {

            if (data) {

                data = JSON.parse(data);
                data.lastRequest = new Date(data.lastRequest);
                data.firstRequest = new Date(data.firstRequest);

            }

            if (typeof callback == 'function') {

                err ? callback(err) : callback(null, data);

            }

        });

    }

    reset(key, callback) {

        let redisKey = this.settings.prefix + key;

        this.client.del(redisKey, (err, data) => {

            if (typeof callback == 'function') {

                err ? callback(err) : callback(null, data);

            }
        });

    }

}

RedisStore.defaultOptions = {
    settings: { prefix: '' },
    redisOptions: {
        host: '127.0.0.1',
        port: '6379'
    }
};


module.exports = RedisStore;