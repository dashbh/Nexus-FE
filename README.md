# Nexus Trading Platform

A modern trading platform built with Next.js 14, TypeScript, TailwindCSS, shadcn/ui, Redux Toolkit, and RTK Query.

## Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, and TailwindCSS
- **Beautiful UI**: shadcn/ui components for a consistent and modern design
- **State Management**: Redux Toolkit with RTK Query for efficient data fetching
- **Mock API**: json-server for development and testing
- **Responsive Design**: Mobile-friendly interface with responsive Tailwind classes
- **Real-time Data**: Simulated real-time market data and portfolio updates
- **Notifications**: Real-time notification system with drawer and badge indicators
- **Enhanced Orders**: Advanced order management with sorting, filtering, and action buttons

## Pages

1. **Login** (`/login`) - Basic authentication form
2. **Portfolio** (`/portfolio`) - View holdings, current values, and P&L
3. **Market** (`/market`) - Real-time stock prices and market data
4. **Orders** (`/orders`) - Enhanced order history with sorting, filtering, and action buttons

## API Endpoints

The mock API (json-server) provides the following endpoints:

- `GET /users` - User data
- `GET /portfolio` - Portfolio holdings
- `GET /orders` - Order history
- `GET /executions` - Trade executions
- `GET /marketdata` - Market data
- `GET /notifications` - User notifications
- `PATCH /notifications/:id` - Update notification read status

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nexus-fe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server with mock API:
```bash
npm run dev:mock
```

This will start both:
- Next.js development server on `http://localhost:3000`
- json-server mock API on `http://localhost:3001`

### Available Scripts

- `npm run dev` - Start Next.js development server only
- `npm run dev:mock` - Start both Next.js and json-server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── portfolio/         # Portfolio page
│   ├── market/            # Market data page
│   ├── orders/            # Orders page
│   ├── api/               # API routes
│   │   └── notifications/ # Notifications API
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── Notifications/     # Notification components
│   │   ├── NotificationBell.tsx
│   │   ├── NotificationDrawer.tsx
│   │   └── index.ts
│   └── layout/
│       └── AppShell.tsx   # Main layout with notifications
├── hooks/
│   └── useNotifications.ts # Custom notification hook
└── lib/
    ├── api.ts             # RTK Query API configuration
    ├── store.ts           # Redux store configuration
    └── providers.tsx      # Redux provider wrapper
```

## Data Schema

The application uses a comprehensive data schema that includes:

- **Users**: Authentication and account information
- **PortfolioItems**: Stock holdings with current values and P&L
- **Orders**: Trading orders with status tracking
- **Executions**: Completed trades
- **MarketData**: Real-time stock prices and market information
- **Notifications**: User alerts and system messages

## Technologies Used

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: Redux Toolkit, RTK Query
- **Mock API**: json-server
- **Animations**: Framer Motion
- **Development**: ESLint, Turbopack

## Development

### Adding New Components

To add new shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

### API Development

The RTK Query API is configured in `src/lib/api.ts`. To add new endpoints:

1. Define the endpoint in the `nexusApi` builder
2. Export the generated hook
3. Use the hook in your components

#### Available RTK Query Hooks

- `useGetPortfolioQuery()` - Fetch portfolio data
- `useGetMarketDataQuery()` - Fetch market data
- `useGetOrdersQuery()` - Fetch order history
- `useGetNotificationsQuery()` - Fetch user notifications
- `useCreateOrderMutation()` - Create new orders
- `useUpdateNotificationReadMutation()` - Update notification read status

### Mock Data

Mock data is stored in `mock-data.json` and follows the schema defined in `docs/schema.md`. To modify the mock data:

1. Edit `mock-data.json`
2. Restart the json-server (or it will auto-reload)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
