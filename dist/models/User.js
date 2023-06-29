"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: false,
    },
    jobPosition: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    avatarUrl: {
        type: String,
        required: false,
    },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=User.js.map