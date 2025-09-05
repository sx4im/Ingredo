import type { CreateInsertSchema, CreateSchemaFactoryOptions, CreateSelectSchema, CreateUpdateSchema } from "./schema.types.cjs";
export declare const createSelectSchema: CreateSelectSchema;
export declare const createInsertSchema: CreateInsertSchema;
export declare const createUpdateSchema: CreateUpdateSchema;
export declare function createSchemaFactory(options?: CreateSchemaFactoryOptions): {
    createSelectSchema: CreateSelectSchema;
    createInsertSchema: CreateInsertSchema;
    createUpdateSchema: CreateUpdateSchema;
};
