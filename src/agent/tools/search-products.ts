import * as fs from 'fs';
import * as path from 'path';
import csv from 'csv-parser';
import { Product } from '../types/product.interface';

interface ProductCsvRecord {
  displayTitle?: string;
  embeddingText?: string;
  price?: string;
  url?: string;
  imageUrl?: string;
  productType?: string;
}

const MAX_RESULTS = 2;

/**
 * Searches for products in the catalog that match the given query
 *
 * This function performs a case-insensitive text search across product
 * titles and descriptions in the CSV database. Results are limited to
 * the top matching items.
 *
 * @param searchQuery - User's search terms (e.g., "laptop", "wireless earbuds")
 * @returns Promise resolving to array of matching products
 */
export async function searchProducts(searchQuery: string): Promise<Product[]> {
  const matchingProducts: Product[] = [];
  const normalizedQuery = searchQuery.toLowerCase().trim();

  const catalogPath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'data',
    'products_list.csv',
  );

  return new Promise((resolve, reject) => {
    fs.createReadStream(catalogPath)
      .pipe(csv())
      .on('data', (record: ProductCsvRecord) => {
        const productTitle = record.displayTitle?.toLowerCase() || '';
        const productDescription = record.embeddingText?.toLowerCase() || '';

        const isMatch =
          productTitle.includes(normalizedQuery) ||
          productDescription.includes(normalizedQuery);

        if (isMatch) {
          matchingProducts.push({
            title: record.displayTitle || 'Untitled Product',
            description: record.embeddingText || 'No description available',
            price: record.price || 'Price not available',
            url: record.url || '',
            imageUrl: record.imageUrl || '',
            category: record.productType || 'Uncategorized',
          });
        }
      })
      .on('end', () => {
        resolve(matchingProducts.slice(0, MAX_RESULTS));
      })
      .on('error', (error) => {
        console.error('Error reading product catalog:', error);
        reject(error);
      });
  });
}
