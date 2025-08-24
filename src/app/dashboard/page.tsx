'use client';

import { useGetPortfolioQuery, useGetMarketDataQuery, useGetOrdersQuery } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { data: portfolio } = useGetPortfolioQuery();
  const { data: marketData } = useGetMarketDataQuery();
  const { data: orders } = useGetOrdersQuery();

  // Calculate dashboard metrics
  const totalPortfolioValue = portfolio?.reduce((sum, item) => sum + item.currentValue, 0) || 0;
  const totalPnl = portfolio?.reduce((sum, item) => sum + item.unrealizedPnl, 0) || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(order => order.status === 'pending').length || 0;

  // Get top gainers and losers
  const topGainers = marketData
    ?.filter(item => item.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 3) || [];

  const topLosers = marketData
    ?.filter(item => item.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 3) || [];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your trading activity and market performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
              <p className="text-xs text-muted-foreground">
                {portfolio?.length || 0} positions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
              {totalPnl >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalPnl)}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalPnl >= 0 ? '+' : ''}{formatPercent((totalPnl / (totalPortfolioValue - totalPnl)) * 100)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketData?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                stocks tracked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Market Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Gainers
              </CardTitle>
              <CardDescription>Best performing stocks today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topGainers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(stock.price)}</p>
                      <p className="text-sm text-green-600">
                        +{formatPercent(stock.changePercent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Top Losers
              </CardTitle>
              <CardDescription>Worst performing stocks today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topLosers.map((stock) => (
                  <div key={stock.symbol} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(stock.price)}</p>
                      <p className="text-sm text-red-600">
                        {formatPercent(stock.changePercent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest trading activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {orders?.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="font-medium">{order.symbol}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.type.toUpperCase()} • {formatNumber(order.quantity)} shares
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.price)}</p>
                    <p className={`text-sm ${
                      order.status === 'executed' ? 'text-green-600' : 
                      order.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
