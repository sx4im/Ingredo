# Installation
> `npm install --save @types/connect-pg-simple`

# Summary
This package contains type definitions for connect-pg-simple (https://github.com/voxpelli/node-connect-pg-simple#readme).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/connect-pg-simple.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/connect-pg-simple/index.d.ts)
````ts
import { RequestHandler } from "express";
import { SessionData, SessionOptions, Store } from "express-session";
import { Pool, PoolConfig } from "pg";

declare function connectPgSimple(session: (options?: SessionOptions) => RequestHandler): typeof connectPgSimple.PGStore;

declare namespace connectPgSimple {
    class PGStore extends Store {
        constructor(options?: PGStoreOptions);
        close(): void;
        pruneSessions(callback?: (err: Error) => void): void;

        get(sid: string, callback: (err: any, session?: SessionData | null) => void): void;
        set(sid: string, session: SessionData, callback?: (err?: any) => void): void;
        destroy(sid: string, callback?: (err?: any) => void): void;

        touch(sid: string, session: SessionData, callback?: () => void): void;
    }
    interface PGStoreOptions {
        pool?: Pool | undefined;
        pgPromise?: object | undefined; // not typed to avoid dependency to "pg-promise" module (which includes its own types)
        conString?: string | undefined;
        conObject?: PoolConfig | undefined;
        ttl?: number | undefined;
        disableTouch?: boolean | undefined;
        createTableIfMissing?: boolean | undefined;
        schemaName?: string | undefined;
        tableName?: string | undefined;
        pruneSessionInterval?: false | number | undefined;
        errorLog?: ((...args: any[]) => void) | undefined;
    }
}

export = connectPgSimple;

````

### Additional Details
 * Last updated: Mon, 06 Nov 2023 22:41:05 GMT
 * Dependencies: [@types/express](https://npmjs.com/package/@types/express), [@types/express-session](https://npmjs.com/package/@types/express-session), [@types/pg](https://npmjs.com/package/@types/pg)

# Credits
These definitions were written by [Pasi Eronen](https://github.com/pasieronen), and [Samar Mohan](https://github.com/samarmohan).
