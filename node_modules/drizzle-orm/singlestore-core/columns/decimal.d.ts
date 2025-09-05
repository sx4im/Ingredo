import type { ColumnBuilderBaseConfig } from "../../column-builder.js";
import type { ColumnBaseConfig } from "../../column.js";
import { entityKind } from "../../entity.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
export type SingleStoreDecimalBuilderInitial<TName extends string> = SingleStoreDecimalBuilder<{
    name: TName;
    dataType: 'string';
    columnType: 'SingleStoreDecimal';
    data: string;
    driverParam: string;
    enumValues: undefined;
    generated: undefined;
}>;
export declare class SingleStoreDecimalBuilder<T extends ColumnBuilderBaseConfig<'string', 'SingleStoreDecimal'>> extends SingleStoreColumnBuilderWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    constructor(name: T['name'], config: SingleStoreDecimalConfig | undefined);
}
export declare class SingleStoreDecimal<T extends ColumnBaseConfig<'string', 'SingleStoreDecimal'>> extends SingleStoreColumnWithAutoIncrement<T, SingleStoreDecimalConfig> {
    static readonly [entityKind]: string;
    readonly precision: number | undefined;
    readonly scale: number | undefined;
    readonly unsigned: boolean | undefined;
    getSQLType(): string;
}
export interface SingleStoreDecimalConfig {
    precision?: number;
    scale?: number;
    unsigned?: boolean;
}
export declare function decimal(): SingleStoreDecimalBuilderInitial<''>;
export declare function decimal(config: SingleStoreDecimalConfig): SingleStoreDecimalBuilderInitial<''>;
export declare function decimal<TName extends string>(name: TName, config?: SingleStoreDecimalConfig): SingleStoreDecimalBuilderInitial<TName>;
