# WizyBot - Intelligent Shopping Assistant

> An AI-powered shopping assistant that helps users find products and convert currencies using natural language

## 🚀 Live Demo

- **Frontend UI**: [https://wizybot-ui.vercel.app](https://wizybot-ui.vercel.app)
- **Backend API**: [https://wizybot-fullstack.onrender.com](https://wizybot-fullstack.onrender.com)
- **API Docs**: [https://wizybot-fullstack.onrender.com/docs](https://wizybot-fullstack.onrender.com/docs)

## Overview

WizyBot is a modern backend application built with NestJS and TypeScript that leverages OpenAI's GPT models to provide intelligent product recommendations and real-time currency conversion. The system uses function calling to seamlessly integrate external tools and deliver accurate, helpful responses to user queries.

## Key Features

- **AI-Powered Conversations**: Natural language understanding powered by OpenAI GPT-3.5 Turbo
- **Smart Product Search**: Finds relevant products from a catalog based on user intent
- **Real-Time Currency Conversion**: Converts amounts between multiple currencies using live exchange rates
- **RESTful API**: Clean, well-documented API endpoints
- **Interactive Documentation**: Built-in Swagger UI for easy API exploration
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Well-Tested**: Comprehensive unit and integration tests
- **Production-Ready**: Configured for deployment with proper error handling

## Technology Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **AI Integration**: OpenAI API (GPT-3.5 Turbo)
- **API Documentation**: Swagger/OpenAPI 3.0
- **Testing**: Jest
- **Code Quality**: ESLint + Prettier
- **HTTP Client**: Axios
- **Data Processing**: CSV Parser

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- Open Exchange Rates API key ([free tier available](https://openexchangerates.org/signup/free))

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Edit `.env` with your API keys:

```env
OPENAI_API_KEY=sk-your-openai-key-here
OPEN_EXCHANGE_APP_ID=your-exchange-rates-key-here
PORT=3000
```

### Running the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

The API will be available at `http://localhost:3000`

## API Documentation

### Interactive Documentation

Visit `http://localhost:3000/docs` for the Swagger UI interface where you can test all endpoints interactively.

### Main Endpoint

**POST** `/agent`

Send a natural language query and receive an intelligent response.

**Request Body:**
```json
{
  "query": "Show me laptops under $1000"
}
```

**Response:**
```json
{
  "response": "I found several laptops under $1000:\n\n1. Dell Inspiron 15...\n2. HP Pavilion..."
}
```

**Example Queries:**
- "I need a birthday gift for my dad who loves technology"
- "Show me wireless headphones"
- "Convert 100 USD to EUR"
- "How much is 50 GBP in CAD?"

### Quick Test with cURL

```bash
curl -X POST http://localhost:3000/agent \
  -H "Content-Type: application/json" \
  -d '{"query": "Find me a smartphone with good camera"}'
```

## Architecture

### Project Structure

```
wizybot-fullstack/
├── src/
│   ├── agent/                    # Core agent logic
│   │   ├── tools/               # Tool implementations
│   │   │   ├── search-products.ts
│   │   │   └── convert-currencies.ts
│   │   ├── dto/                 # Data transfer objects
│   │   ├── types/               # TypeScript interfaces
│   │   ├── agent.controller.ts  # HTTP endpoints
│   │   └── agent.service.ts     # Business logic
│   ├── openai/                   # OpenAI integration
│   │   ├── openai.service.ts    # GPT API wrapper
│   │   └── types/               # OpenAI-specific types
│   ├── app.module.ts            # Root module
│   └── main.ts                  # Application entry point
├── data/
│   └── products_list.csv        # Product catalog
├── test/                         # E2E tests
└── package.json
```

### How It Works

1. **User Query**: Client sends natural language request to `/agent`
2. **AI Processing**: OpenAI analyzes the query and determines if tools are needed
3. **Tool Execution**: If required, the system executes `searchProducts` or `convertCurrencies`
4. **Response Generation**: AI formulates a natural response using tool results
5. **Return**: Formatted response sent back to client

## Development

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run end-to-end tests
npm run test:e2e
```

### Code Quality

```bash
# Lint and auto-fix
npm run lint

# Format code
npm run format
```

### Adding New Products

Edit `data/products_list.csv` with the following columns:
- `displayTitle`: Product name
- `embeddingText`: Detailed description for search matching
- `price`: Price with currency (e.g., "299.99 USD")
- `url`: Product page URL
- `imageUrl`: Product image URL
- `productType`: Category/type

## Deployment

### Build for Production

```bash
npm run build
```

The compiled output will be in the `dist/` directory.

### Environment Variables

Ensure all required environment variables are set in your production environment:

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPEN_EXCHANGE_APP_ID`: Your Open Exchange Rates API key
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Set to `production`

### Deployment Options

- **Traditional VPS**: Use PM2 or systemd to run the application
- **Docker**: Create a Dockerfile and deploy to any container platform
- **Cloud Platforms**: Deploy to AWS, Google Cloud, Azure, or Heroku
- **Serverless**: Adapt for AWS Lambda or similar platforms

## Troubleshooting

### Common Issues

**"Invalid OpenAI API key"**
- Verify your `OPENAI_API_KEY` in `.env` is correct
- Ensure you have credits in your OpenAI account

**"OPEN_EXCHANGE_APP_ID not configured"**
- Add your Open Exchange Rates API key to `.env`
- Sign up for a free account at openexchangerates.org

**Port already in use**
- Change the `PORT` value in `.env`
- Or stop the process using port 3000

## Technical Implementation Details

This project implements the Wizybot Technical Assessment for the Fullstack Developer Position using:

### Core Requirements Met

- ✅ NestJS with TypeScript
- ✅ OpenAI Chat Completion API with Function Calling (not Agent API)
- ✅ `searchProducts()` tool with semantic similarity search algorithm
- ✅ `convertCurrencies()` tool with Open Exchange Rates API integration
- ✅ DTOs for request/response validation
- ✅ Controllers for routing and services for business logic
- ✅ Swagger documentation
- ✅ Comprehensive code comments in English
- ✅ All variables, functions, and classes named in English

### Testing

The implementation has been tested with the following queries:
- "I am looking for a phone"
- "I am looking for a present for my dad"
- "How much does a watch cost?"
- "What is the price of the watch in Euros"
- "How many Canadian Dollars are 350 Euros"

## Author

**Daniel Ballesteros**
Technical Assessment - Wizybot Fullstack Developer Position
