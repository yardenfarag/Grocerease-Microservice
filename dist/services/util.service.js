"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
function formatDate(date) {
    const pad = (n) => (n < 10 ? '0' + n : n.toString());
    return (date.getFullYear() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()));
}
exports.formatDate = formatDate;
