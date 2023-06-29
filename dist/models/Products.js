"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    imageName: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    productProfile: {
        type: String,
        required: true,
    },
    burnTime: {
        type: Number,
        required: true,
    },
    indication: {
        type: String,
        required: true,
    },
});
exports.Products = (0, mongoose_1.model)("Products", productSchema);
//# sourceMappingURL=Products.js.map