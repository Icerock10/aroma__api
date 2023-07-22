export enum ResponseMessage {
  TOKEN_NOT_VALID = 'Token is not valid or expired',
  TOKEN_NOT_FOUND = 'Token was not found',
  USER_NOT_FOUND = 'User was not found',
  PRODUCT_NOT_FOUND = 'Product was not found',
  LOGGED_OUT = 'You were logged out',
  SOMETHING_WENT_WRONG = 'Something went wrong',
  AWS_BUCKET_ISSUES = 'Something went wrong in AWS service',
  EMAIL_TAKEN = 'This email has already been taken',
  ACCOUNT_CREATED = 'Account created successfully!',
  FIELDS_REQUIRED = 'All fields are required',
  EMAIL_OR_PASSWORD_INCORRECT = 'Your email or password is not correct',
  FILE_OR_ID_NOT_FOUND = 'File or user ID were not found',
  FILE_OR_PRODUCT_NOT_UPLOADED = 'File or Product information is missing',
  IMAGE_ALREADY_EXISTS = 'This image already exists',
  PRODUCT_CATEGORY_INVALID = 'Product category is invalid',
  PAGES_ARE_OVER = 'There is no next page'
}