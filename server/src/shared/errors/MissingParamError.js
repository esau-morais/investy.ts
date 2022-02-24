"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingParamError = void 0;
class MissingParamError extends Error {
    constructor(paramField) {
        super(`The param ${paramField} is missing.`);
    }
}
exports.MissingParamError = MissingParamError;
