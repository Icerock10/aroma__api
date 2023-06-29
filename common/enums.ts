enum UsersPath {
  ROOT = '/users',
  CREATE = '/create',
  LOGIN = '/login',
  TOKEN_REFRESH = '/refresh',
  DASHBOARD = '/dashboard',
  UPLOAD_AVATAR = '/upload',
  UPDATE_ONE = '/update'
}

enum ProductsPath {
  ROOT = '/products',
  UPLOAD = '/upload',
  GET_MANY = '/category',
  GET_ONE = '/product',
  GET_MANY_BY_IDS = '/getMany'
}

export { UsersPath, ProductsPath };