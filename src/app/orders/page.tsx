'use client';

import { useState, useMemo } from 'react';
import { useGetOrdersQuery } from '@/lib/api';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { TableSkeleton } from '@/components/skeletons';
import { Edit, X, Eye } from 'lucide-react';
import { TradingModal } from '@/components/TradingModal';

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [tradingModal, setTradingModal] = useState<{
    isOpen: boolean;
    symbol: string;
    price: number;
    side: 'buy' | 'sell';
    mode: 'new' | 'edit';
    orderData?: {
      id: string;
      quantity: number;
      price: number;
      type: 'buy' | 'sell';
    };
  }>({
    isOpen: false,
    symbol: '',
    price: 0,
    side: 'buy',
    mode: 'new',
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      executed: 'bg-green-50 text-green-700 border-green-200',
      cancelled: 'bg-red-50 text-red-700 border-red-200',
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants] || 'bg-gray-50 text-gray-700'} border font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      buy: 'bg-blue-50 text-blue-700 border-blue-200',
      sell: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    
    return (
      <Badge className={`${variants[type as keyof typeof variants] || 'bg-gray-50 text-gray-700'} border font-medium`}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const sortedOrders = useMemo(() => {
    if (!orders) return [];
    
    return [...orders].sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.placedAt).getTime();
          bValue = new Date(b.placedAt).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'amount':
          aValue = a.quantity * a.price;
          bValue = b.quantity * b.price;
          break;
        default:
          aValue = new Date(a.placedAt).getTime();
          bValue = new Date(b.placedAt).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [orders, sortBy, sortOrder]);

  const canCancelOrder = (order: { status: string }) => {
    return order.status === 'pending';
  };

  const canEditOrder = (order: { status: string }) => {
    return order.status === 'pending';
  };

  const openEditModal = (order: {
    symbol: string;
    price: number;
    type: 'buy' | 'sell';
    id: string;
    quantity: number;
  }) => {
    setTradingModal({
      isOpen: true,
      symbol: order.symbol,
      price: order.price,
      side: order.type,
      mode: 'edit',
      orderData: order,
    });
  };

  const closeTradingModal = () => {
    setTradingModal({
      isOpen: false,
      symbol: '',
      price: 0,
      side: 'buy',
      mode: 'new',
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Your trading orders and their current status</p>
          </div>

                  <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>Your trading orders and their current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <TableSkeleton rows={3} columns={9} />
            </div>
          </CardContent>
                </Card>
      </div>

      {/* Trading Modal for Editing Orders */}
      <TradingModal
        isOpen={tradingModal.isOpen}
        onClose={closeTradingModal}
        symbol={tradingModal.symbol}
        currentPrice={tradingModal.price}
        side={tradingModal.side}
        mode={tradingModal.mode}
        orderData={tradingModal.orderData}
      />
    </AppShell>
  );
}

  if (error) {
    return (
      <AppShell>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">Error loading orders</div>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Your trading orders and their current status</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Your trading orders and their current status</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Placed At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">{order.id}</TableCell>
                      <TableCell className="font-medium">{order.symbol}</TableCell>
                      <TableCell>{getTypeBadge(order.type)}</TableCell>
                      <TableCell>{formatNumber(order.quantity)}</TableCell>
                      <TableCell className="font-mono">{formatCurrency(order.price)}</TableCell>
                      <TableCell className="font-mono font-medium">
                        {formatCurrency(order.quantity * order.price)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(order.placedAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!canEditOrder(order)}
                            title="Edit Order"
                            className="h-8 px-2"
                            onClick={() => openEditModal(order)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            <span className="text-xs">Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!canCancelOrder(order)}
                            title="Cancel Order"
                            className="h-8 px-2"
                          >
                            <X className="h-3 w-3 mr-1" />
                            <span className="text-xs">Cancel</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="View Details"
                            className="h-8 px-2"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {sortedOrders.map((order) => (
                <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-base">{order.symbol}</h3>
                      <p className="text-xs text-gray-500 font-mono">{order.id}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {getTypeBadge(order.type)}
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Quantity</p>
                      <p className="font-semibold text-sm">{formatNumber(order.quantity)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Price</p>
                      <p className="font-semibold text-sm">{formatCurrency(order.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Amount</p>
                      <p className="font-semibold text-sm">{formatCurrency(order.quantity * order.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Placed</p>
                      <p className="font-semibold text-sm">{formatDate(order.placedAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canEditOrder(order)}
                        className="text-xs h-8 px-3"
                        onClick={() => openEditModal(order)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!canCancelOrder(order)}
                        className="text-xs h-8 px-3"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8 px-3"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
