import type { Column } from 'drizzle-orm';
import { z } from 'zod';
import type { CreateSchemaFactoryOptions } from "./schema.types.cjs";
import type { Json } from "./utils.cjs";
export declare const literalSchema: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>;
export declare const jsonSchema: z.ZodType<Json>;
export declare const bufferSchema: z.ZodType<Buffer>;
export declare function columnToSchema(column: Column, factory: CreateSchemaFactoryOptions | undefined): z.ZodTypeAny;
