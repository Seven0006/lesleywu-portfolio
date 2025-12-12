export const VIEW_CATALOG = 'catalog';
export const VIEW_CART = 'cart';
export const VIEW_ORDERS = 'orders';
export const VIEW_ADMIN_INVENTORY = 'admin-inventory';
export const VIEW_ADMIN_ORDERS = 'admin-orders';

export const ERROR_MESSAGES = {
  'network-error': 'Network error, please try again.',
  'auth-missing': 'Please log in to continue.',
  'auth-insufficient': 'You do not have permission to perform this action.',
  'required-username': 'Username is required and must use letters, numbers, or underscores.',
  'required-password': 'Password is required.',
  'user-exists': 'This username is already registered.',
  'user-missing': 'This username is not registered yet. Please register first.',
  'invalid-credentials': 'Username or password is incorrect.',
  'invalid-card': 'Card data is invalid. Please check all required fields.',
  'card-not-found': 'This card is no longer available.',
  'invalid-cart-payload': 'Cart request was invalid.',
  'invalid-quantity': 'Quantity must be zero or a positive integer.',
  'out-of-stock': 'Not enough stock available for this card.',
  'empty-cart': 'Your cart is empty.',
  'invalid-order-update': 'Order update is invalid.',
  'login-required': 'Please sign-in to use this feature.',
};


export function mapErrorToMessage(code) {
  if (!code) {
    return '';
  }
  return ERROR_MESSAGES[code] || 'Something went wrong, please try again.';
}