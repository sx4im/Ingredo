import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumnBuilderWithAutoIncrement, SingleStoreColumnWithAutoIncrement } from "./common.js";
class SingleStoreDecimalBuilder extends SingleStoreColumnBuilderWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimalBuilder";
  constructor(name, config) {
    super(name, "string", "SingleStoreDecimal");
    this.config.precision = config?.precision;
    this.config.scale = config?.scale;
    this.config.unsigned = config?.unsigned;
  }
  /** @internal */
  build(table) {
    return new SingleStoreDecimal(
      table,
      this.config
    );
  }
}
class SingleStoreDecimal extends SingleStoreColumnWithAutoIncrement {
  static [entityKind] = "SingleStoreDecimal";
  precision = this.config.precision;
  scale = this.config.scale;
  unsigned = this.config.unsigned;
  getSQLType() {
    let type = "";
    if (this.precision !== void 0 && this.scale !== void 0) {
      type += `decimal(${this.precision},${this.scale})`;
    } else if (this.precision === void 0) {
      type += "decimal";
    } else {
      type += `decimal(${this.precision})`;
    }
    type = type === "decimal(10,0)" || type === "decimal(10)" ? "decimal" : type;
    return this.unsigned ? `${type} unsigned` : type;
  }
}
function decimal(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(
    a,
    b
  );
  return new SingleStoreDecimalBuilder(name, config);
}
export {
  SingleStoreDecimal,
  SingleStoreDecimalBuilder,
  decimal
};
//# sourceMappingURL=decimal.js.map