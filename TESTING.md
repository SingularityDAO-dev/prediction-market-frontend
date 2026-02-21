# Testing Prediction Market Frontend

## Unit Tests

Unit tests are located in `src/lib/test-utils.ts` and include:

- ✅ Market validation
- ✅ Probability calculations  
- ✅ Address formatting
- ✅ USDC formatting
- ✅ API connection testing

## Run Tests

### Browser Tests
Visit `/test` page to run all tests in the browser:
```
http://localhost:3000/test
```

### Console Tests
Tests auto-run in browser console on page load:
```
Running unit tests...
✅ Passed: 5
❌ Failed: 0
```

## Manual Testing Checklist

### Markets Page
- [ ] Markets load from API
- [ ] Category filters work
- [ ] Market cards display correctly
- [ ] Clicking market navigates to detail page

### Wallet Connection
- [ ] "Connect Wallet" button visible when disconnected
- [ ] MetaMask opens on click
- [ ] Address displays when connected
- [ ] Disconnect button works
- [ ] Auto-reconnects on refresh

### API Integration
- [ ] `/markets` returns data
- [ ] `/markets/:id` returns single market
- [ ] `/markets/:id/orderbook` returns bids/asks
- [ ] `/markets/:id/trades` returns trades
- [ ] `/markets/:id/prices/history` returns chart data

## API Endpoints

Base URL: `https://prediction-market-backend-production-4e85.up.railway.app`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/markets` | GET | List all markets |
| `/markets/:id` | GET | Get single market |
| `/markets/:id/orderbook` | GET | Get orderbook |
| `/markets/:id/trades` | GET | Get trades |
| `/markets/:id/prices/history` | GET | Get price history |
| `/users/:address/balances` | GET | Get user balances |
| `/users/:address/orders` | GET | Get user orders |

## Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=https://prediction-market-backend-production-4e85.up.railway.app
```
