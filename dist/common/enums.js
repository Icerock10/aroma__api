"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsPath = exports.UsersPath = void 0;
var UsersPath;
(function (UsersPath) {
    UsersPath["ROOT"] = "/users";
    UsersPath["CREATE"] = "/create";
    UsersPath["LOGIN"] = "/login";
    UsersPath["TOKEN_REFRESH"] = "/refresh";
    UsersPath["DASHBOARD"] = "/dashboard";
    UsersPath["UPLOAD_AVATAR"] = "/upload";
    UsersPath["UPDATE_ONE"] = "/update";
})(UsersPath || (UsersPath = {}));
exports.UsersPath = UsersPath;
var ProductsPath;
(function (ProductsPath) {
    ProductsPath["ROOT"] = "/products";
    ProductsPath["UPLOAD"] = "/upload";
    ProductsPath["GET_MANY"] = "/category";
    ProductsPath["GET_ONE"] = "/product";
    ProductsPath["GET_MANY_BY_IDS"] = "/getMany";
})(ProductsPath || (ProductsPath = {}));
exports.ProductsPath = ProductsPath;
//# sourceMappingURL=enums.js.map