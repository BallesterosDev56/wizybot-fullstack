import { convertCurrencies } from './convert-currencies';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('convertCurrencies', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, OPEN_EXCHANGE_APP_ID: 'test_key' };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should convert currencies correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        base: 'USD',
        rates: {
          USD: 1.0,
          EUR: 0.9,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as never,
      },
    } as never);

    const result = await convertCurrencies(100, 'USD', 'EUR');

    expect(result).toEqual({
      amount: 100,
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      result: 90.0,
      rate: 0.9,
    });
  });

  it('should throw error for unsupported currencies', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        base: 'USD',
        rates: {
          USD: 1.0,
          EUR: 0.9,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: {} as never,
      },
    } as never);

    await expect(convertCurrencies(100, 'USD', 'XYZ')).rejects.toThrow(
      /Currency code "XYZ" is not supported/,
    );
  });

  it('should throw error for negative amounts', async () => {
    await expect(convertCurrencies(-100, 'USD', 'EUR')).rejects.toThrow(
      'Amount must be greater than zero',
    );
  });

  it('should throw error when API key is missing', async () => {
    process.env.OPEN_EXCHANGE_APP_ID = '';

    await expect(convertCurrencies(100, 'USD', 'EUR')).rejects.toThrow(
      /Missing OPEN_EXCHANGE_APP_ID in environment variables/,
    );
  });

  it('should handle API errors gracefully', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 401,
        data: { message: 'Invalid API key' },
      },
    });
    jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);


    await expect(convertCurrencies(100, 'USD', 'EUR')).rejects.toThrow(
      /Authentication failed: Invalid API key/,
    );
  });
});
