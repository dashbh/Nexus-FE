'use client';

import { useGetPortfolioQuery } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { TableSkeleton, SummaryCardSkeleton } from '@/components/skeletons';

export default function PortfolioPage() {
  const { data: portfolio, isLoading, error } = useGetPortfolioQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        
        <div className="grid gap-6">
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SummaryCardSkeleton />
            <SummaryCardSkeleton />
          </div>

          {/* Holdings Table Skeleton */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Holdings</CardTitle>
              <CardDescription>Your current stock positions and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <TableSkeleton rows={4} columns={6} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error loading portfolio data</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalValue = portfolio?.reduce((sum, item) => sum + item.currentValue, 0) || 0;
  const totalPnl = portfolio?.reduce((sum, item) => sum + item.unrealizedPnl, 0) || 0;

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      
      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Unrealized P&L</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalPnl)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>Your current stock positions and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Avg Buy Price</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Unrealized P&L</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolio?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.symbol}</TableCell>
                      <TableCell>{formatNumber(item.quantity)}</TableCell>
                      <TableCell>{formatCurrency(item.avgBuyPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.currentPrice)}</TableCell>
                      <TableCell>{formatCurrency(item.currentValue)}</TableCell>
                      <TableCell className={item.unrealizedPnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(item.unrealizedPnl)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
