import axios from 'axios';

interface CurrencyConversionResult {
  result: number;
  rate: number;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

interface ExchangeRatesApiResponse {
  base: string;
  rates: Record<string, number>;
}

const EXCHANGE_RATES_API_URL = 'https://openexchangerates.org/api/latest.json';

/**
 * Converts an amount from one currency to another using live exchange rates
 *
 * This function fetches current exchange rates from Open Exchange Rates API
 * and performs the conversion calculation. All currency codes should follow
 * the ISO 4217 standard (3-letter codes).
 *
 * @param amountToConvert - Numeric value to convert (must be positive)
 * @param sourceCurrency - Source currency code (e.g., 'USD', 'EUR', 'GBP')
 * @param destinationCurrency - Target currency code (e.g., 'CAD', 'JPY', 'AUD')
 * @returns Conversion result with amount, rate, and currency details
 * @throws Error if validation fails or API request encounters issues
 */
export async function convertCurrencies(
  amountToConvert: number,
  sourceCurrency: string,
  destinationCurrency: string,
): Promise<CurrencyConversionResult> {
  validateInputs(amountToConvert, sourceCurrency, destinationCurrency);

  const apiKey = process.env.OPEN_EXCHANGE_APP_ID;
  if (!apiKey) {
    throw new Error(
      'Missing OPEN_EXCHANGE_APP_ID in environment variables. ' +
        'Obtain a free API key at https://openexchangerates.org/signup/free',
    );
  }

  const requestUrl = `${EXCHANGE_RATES_API_URL}?app_id=${apiKey}`;

  try {
    const apiResponse = await axios.get<ExchangeRatesApiResponse>(requestUrl);
    const exchangeRates = apiResponse.data.rates;

    const sourceCode = sourceCurrency.toUpperCase();
    const targetCode = destinationCurrency.toUpperCase();

    const sourceRate = exchangeRates[sourceCode];
    const targetRate = exchangeRates[targetCode];

    if (!sourceRate || !targetRate) {
      const invalidCode = !sourceRate ? sourceCode : targetCode;
      throw new Error(
        `Currency code "${invalidCode}" is not supported. ` +
          'Use valid ISO 4217 codes (USD, EUR, GBP, JPY, etc.)',
      );
    }

    const conversionRate = targetRate / sourceRate;
    const convertedAmount = amountToConvert * conversionRate;

    return {
      amount: amountToConvert,
      fromCurrency: sourceCode,
      toCurrency: targetCode,
      result: parseFloat(convertedAmount.toFixed(2)),
      rate: parseFloat(conversionRate.toFixed(6)),
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
}

/**
 * Validates input parameters for currency conversion
 */
function validateInputs(amount: number, from: string, to: string): void {
  if (amount <= 0) {
    throw new Error('Amount must be greater than zero');
  }

  if (!from || !to) {
    throw new Error('Both source and target currency codes are required');
  }
}

/**
 * Handles and formats errors from the exchange rates API
 */
function handleApiError(error: unknown): void {
  if (!axios.isAxiosError(error)) {
    return;
  }

  if (error.response?.status === 401) {
    throw new Error(
      'Authentication failed: Invalid API key for Open Exchange Rates',
    );
  }

  if (error.response?.status === 429) {
    throw new Error(
      'Rate limit exceeded. Wait before retrying or upgrade your API plan',
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const errorDetails = error.response?.data?.message || error.message;
  throw new Error(
    `Exchange rates API error: ${String(errorDetails || 'Unknown issue')}`,
  );
}
