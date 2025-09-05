type DevMessage = (check: boolean, message: string) => void;
declare let warning: DevMessage;
declare let invariant: DevMessage;

declare const noop: <T>(any: T) => T;

export { type DevMessage, invariant, noop, warning };
