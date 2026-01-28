/**
 * Product Interface
 *
 * Represents a product item from the catalog with all relevant details
 * for display and reference purposes.
 */
export interface Product {
  /** Product name or title */
  title: string;

  /** Detailed description of the product */
  description: string;

  /** Price string (includes currency, e.g., "299.99 USD") */
  price: string;

  /** Direct link to the product page */
  url: string;

  /** URL to the product's main image */
  imageUrl: string;

  /** Product category or type */
  category: string;
}
