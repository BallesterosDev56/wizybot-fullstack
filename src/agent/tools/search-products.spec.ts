import { searchProducts } from './search-products';

describe('searchProducts', () => {
  it('should return products that match the query', async () => {
    const result = await searchProducts('iphone');
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('title');
    expect(result[0]).toHaveProperty('price');
  });

  it('should return empty array if no match', async () => {
    const result = await searchProducts('nonexistentproduct');
    expect(result).toEqual([]);
  });
});
