import { entityKind } from "../../entity.js";
import { getColumnNameAndConfig } from "../../utils.js";
import { SingleStoreColumn, SingleStoreColumnBuilder } from "./common.js";
class SingleStoreBinaryBuilder extends SingleStoreColumnBuilder {
  static [entityKind] = "SingleStoreBinaryBuilder";
  constructor(name, length) {
    super(name, "string", "SingleStoreBinary");
    this.config.length = length;
  }
  /** @internal */
  build(table) {
    return new SingleStoreBinary(
      table,
      this.config
    );
  }
}
class SingleStoreBinary extends SingleStoreColumn {
  static [entityKind] = "SingleStoreBinary";
  length = this.config.length;
  getSQLType() {
    return this.length === void 0 ? `binary` : `binary(${this.length})`;
  }
}
function binary(a, b = {}) {
  const { name, config } = getColumnNameAndConfig(a, b);
  return new SingleStoreBinaryBuilder(name, config.length);
}
export {
  SingleStoreBinary,
  SingleStoreBinaryBuilder,
  binary
};
//# sourceMappingURL=binary.js.map