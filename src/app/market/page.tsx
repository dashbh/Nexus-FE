'use client';

import { useGetMarketDataQuery } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { TableSkeleton } from '@/components/skeletons/TableSkeleton';

export default function MarketPage() {
  const { data: marketData, isLoading, error } = useGetMarketDataQuery();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Real-time stock prices and market data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <TableSkeleton rows={6} columns={6} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Navbar />
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error loading market data</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Navbar />
      
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>Real-time stock prices and market data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Change %</TableHead>
                  <TableHead>Volume</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData?.map((item) => (
                  <TableRow key={item.symbol}>
                    <TableCell className="font-medium">{item.symbol}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="font-mono">{formatCurrency(item.price)}</TableCell>
                    <TableCell className={`font-mono ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {item.change >= 0 ? '+' : ''}{formatCurrency(item.change)}
                    </TableCell>
                    <TableCell className={`font-mono ${item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(item.changePercent)}
                    </TableCell>
                    <TableCell className="font-mono">{formatNumber(item.volume)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
