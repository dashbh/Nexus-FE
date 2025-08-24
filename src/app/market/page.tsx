'use client';

import { useState, useMemo } from 'react';
import { useGetMarketDataQuery } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils';
import { TableSkeleton } from '@/components/skeletons';
import { TradingModal } from '@/components/TradingModal';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';

export default function MarketPage() {
  const { data: marketData, isLoading, error } = useGetMarketDataQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'changePercent' | 'volume'>('symbol');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [tradingModal, setTradingModal] = useState<{
    isOpen: boolean;
    symbol: string;
    price: number;
    side: 'buy' | 'sell';
  }>({
    isOpen: false,
    symbol: '',
    price: 0,
    side: 'buy',
  });

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    if (!marketData) return [];

    let filtered = marketData.filter(
      (item) =>
        item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort data
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'symbol':
          aValue = a.symbol;
          bValue = b.symbol;
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'changePercent':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        default:
          aValue = a.symbol;
          bValue = b.symbol;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [marketData, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const openTradingModal = (symbol: string, price: number, side: 'buy' | 'sell') => {
    console.log('Opening trading modal:', { symbol, price, side });
    setTradingModal({
      isOpen: true,
      symbol,
      price,
      side,
    });
  };

  const closeTradingModal = () => {
    setTradingModal({
      isOpen: false,
      symbol: '',
      price: 0,
      side: 'buy',
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Real-time stock prices and market data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <TableSkeleton rows={6} columns={7} />
            </div>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error loading market data</div>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Market</h1>
            <p className="text-muted-foreground">Real-time stock prices and market data</p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by symbol or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="symbol">Symbol</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="changePercent">Change %</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Table */}
        <Card>
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>
              {filteredAndSortedData.length} stocks found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('symbol')}
                    >
                      Symbol
                    </TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('price')}
                    >
                      Price
                    </TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('changePercent')}
                    >
                      Change %
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('volume')}
                    >
                      Volume
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedData.map((item) => (
                    <TableRow key={item.symbol} className="hover:bg-gray-50">
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
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => openTradingModal(item.symbol, item.price, 'buy')}
                          >
                            Buy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => openTradingModal(item.symbol, item.price, 'sell')}
                          >
                            Sell
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={tradingModal.isOpen}
        onClose={closeTradingModal}
        symbol={tradingModal.symbol}
        currentPrice={tradingModal.price}
        side={tradingModal.side}
      />
    </AppShell>
  );
}
