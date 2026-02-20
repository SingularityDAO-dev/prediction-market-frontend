export interface Market {
  id: string;
  conditionId: string;
  questionId: string;
  title: string;
  description: string;
  category: string;
  image: string;
  yesTokenId: string;
  noTokenId: string;
  collateral: string;
  oracle: string;
  status: "ACTIVE" | "PAUSED" | "RESOLVED";
  yesPrice: number;
  noPrice: number;
  volume: number;
  liquidity: number;
  resolution: number | null;
  createdAt: string;
  resolvedAt: string | null;
  expirationDate: string | null;
  resolutionTx: string | null;
  resolvedOutcome: number | null;
}

export const mockMarkets: Market[] = [
  {
    id: "1",
    conditionId: "0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab",
    questionId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd12",
    title: "Will Bitcoin reach $100k by end of 2025?",
    description: "This market resolves to YES if Bitcoin's price reaches or exceeds $100,000 USD on any major exchange before January 1, 2026.",
    category: "Crypto",
    image: "/images/btc.jpg",
    yesTokenId: "1001",
    noTokenId: "1002",
    collateral: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    oracle: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    status: "ACTIVE",
    yesPrice: 0.65,
    noPrice: 0.35,
    volume: 2450000,
    liquidity: 890000,
    resolution: null,
    createdAt: "2026-02-19T21:38:47.000Z",
    resolvedAt: null,
    expirationDate: "2025-12-31T23:59:59.000Z",
    resolutionTx: null,
    resolvedOutcome: null,
  },
  {
    id: "2",
    conditionId: "0xefgh5678901234ijkl5678901234mnop5678901234qrst5678901234uvwx",
    questionId: "0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcd",
    title: "Will ETH ETF be approved in Q2 2025?",
    description: "This market resolves to YES if the SEC approves an Ethereum spot ETF before July 1, 2025.",
    category: "Crypto",
    image: "/images/eth.jpg",
    yesTokenId: "1003",
    noTokenId: "1004",
    collateral: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    oracle: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    status: "ACTIVE",
    yesPrice: 0.42,
    noPrice: 0.58,
    volume: 1890000,
    liquidity: 650000,
    resolution: null,
    createdAt: "2026-02-18T15:22:10.000Z",
    resolvedAt: null,
    expirationDate: "2025-06-30T23:59:59.000Z",
    resolutionTx: null,
    resolvedOutcome: null,
  },
  {
    id: "3",
    conditionId: "0xmnop9012345678qrst9012345678uvwx9012345678yzab9012345678cdef",
    questionId: "0x9012345678abcdef9012345678abcdef9012345678abcdef9012345678abcd",
    title: "Will Trump win the 2024 US Election?",
    description: "This market resolves to YES if Donald Trump wins the 2024 US Presidential Election.",
    category: "Politics",
    image: "/images/trump.jpg",
    yesTokenId: "1005",
    noTokenId: "1006",
    collateral: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    oracle: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    status: "RESOLVED",
    yesPrice: 1,
    noPrice: 0,
    volume: 5670000,
    liquidity: 2100000,
    resolution: 1,
    createdAt: "2026-02-15T10:00:00.000Z",
    resolvedAt: "2026-02-19T08:00:00.000Z",
    expirationDate: "2024-11-05T23:59:59.000Z",
    resolutionTx: "0xabc...",
    resolvedOutcome: 1,
  },
  {
    id: "4",
    conditionId: "0xuvwx1234567890yzab1234567890cdef1234567890ghij1234567890klmn",
    questionId: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd",
    title: "Will SpaceX land on Mars by 2030?",
    description: "This market resolves to YES if SpaceX successfully lands a crewed mission on Mars before January 1, 2030.",
    category: "Science",
    image: "/images/spacex.jpg",
    yesTokenId: "1007",
    noTokenId: "1008",
    collateral: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    oracle: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    status: "ACTIVE",
    yesPrice: 0.28,
    noPrice: 0.72,
    volume: 980000,
    liquidity: 340000,
    resolution: null,
    createdAt: "2026-02-14T09:15:30.000Z",
    resolvedAt: null,
    expirationDate: "2029-12-31T23:59:59.000Z",
    resolutionTx: null,
    resolvedOutcome: null,
  },
  {
    id: "5",
    conditionId: "0xghij5678901234klmn5678901234opqr5678901234stuv5678901234wxyz",
    questionId: "0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcd",
    title: "Will AI surpass human intelligence by 2027?",
    description: "This market resolves to YES if artificial general intelligence (AGI) is demonstrated before January 1, 2027.",
    category: "Technology",
    image: "/images/ai.jpg",
    yesTokenId: "1009",
    noTokenId: "1010",
    collateral: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    oracle: "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6",
    status: "ACTIVE",
    yesPrice: 0.38,
    noPrice: 0.62,
    volume: 1230000,
    liquidity: 420000,
    resolution: null,
    createdAt: "2026-02-13T14:30:00.000Z",
    resolvedAt: null,
    expirationDate: "2026-12-31T23:59:59.000Z",
    resolutionTx: null,
    resolvedOutcome: null,
  },
];

export const chartData = {
  "1H": [
    { time: "00:00", price: 0.62 },
    { time: "00:10", price: 0.63 },
    { time: "00:20", price: 0.64 },
    { time: "00:30", price: 0.63 },
    { time: "00:40", price: 0.65 },
    { time: "00:50", price: 0.64 },
    { time: "01:00", price: 0.65 },
  ],
  "1D": [
    { time: "00:00", price: 0.58 },
    { time: "04:00", price: 0.60 },
    { time: "08:00", price: 0.62 },
    { time: "12:00", price: 0.64 },
    { time: "16:00", price: 0.63 },
    { time: "20:00", price: 0.65 },
    { time: "24:00", price: 0.65 },
  ],
  "1W": [
    { time: "Mon", price: 0.55 },
    { time: "Tue", price: 0.58 },
    { time: "Wed", price: 0.60 },
    { time: "Thu", price: 0.62 },
    { time: "Fri", price: 0.63 },
    { time: "Sat", price: 0.64 },
    { time: "Sun", price: 0.65 },
  ],
};

export const orderBookData = {
  bids: [
    { price: 0.64, size: 12500 },
    { price: 0.63, size: 8900 },
    { price: 0.62, size: 15200 },
    { price: 0.61, size: 6800 },
    { price: 0.60, size: 23100 },
  ],
  asks: [
    { price: 0.66, size: 8200 },
    { price: 0.67, size: 11500 },
    { price: 0.68, size: 9400 },
    { price: 0.69, size: 5600 },
    { price: 0.70, size: 18900 },
  ],
};

export const portfolioData = [
  { id: 1, market: "BTC $100k 2025", position: "YES", amount: 5000, pnl: 850, pnlPercent: 17 },
  { id: 2, market: "ETH ETF Q2 2025", position: "NO", amount: 3000, pnl: -420, pnlPercent: -14 },
  { id: 3, market: "Trump 2024", position: "YES", amount: 8000, pnl: 3200, pnlPercent: 40 },
  { id: 4, market: "SpaceX Mars 2030", position: "YES", amount: 2000, pnl: -180, pnlPercent: -9 },
];

export const leaderboardData = [
  { rank: 1, name: "CryptoKing", avatar: "/avatars/1.jpg", profit: 456000, winRate: 78 },
  { rank: 2, name: "PredictionPro", avatar: "/avatars/2.jpg", profit: 389000, winRate: 72 },
  { rank: 3, name: "MarketMaster", avatar: "/avatars/3.jpg", profit: 312000, winRate: 69 },
  { rank: 4, name: "TradeTitan", avatar: "/avatars/4.jpg", profit: 245000, winRate: 65 },
  { rank: 5, name: "OracleEye", avatar: "/avatars/5.jpg", profit: 198000, winRate: 61 },
];

export const tickerData = [
  { symbol: "BTC", price: 67432, change: 2.34 },
  { symbol: "ETH", price: 3521, change: 1.87 },
  { symbol: "SOL", price: 148, change: -0.92 },
  { symbol: "AVAX", price: 42, change: 3.21 },
  { symbol: "LINK", price: 18, change: 0.45 },
  { symbol: "UNI", price: 12, change: -1.23 },
  { symbol: "AAVE", price: 98, change: 4.56 },
  { symbol: "MKR", price: 2450, change: 1.12 },
];
