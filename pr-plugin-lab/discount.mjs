/** percentage is a whole percent from 0 to 100, e.g. 20 means twenty percent. */
export function discountedPrice(price, percentage) {
  return price * (1 - percentage);
}
