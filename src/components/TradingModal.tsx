'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';
import { useCreateOrderMutation } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface TradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  currentPrice: number;
  side: 'buy' | 'sell';
}

export function TradingModal({ isOpen, onClose, symbol, currentPrice, side }: TradingModalProps) {
  const [price, setPrice] = useState(currentPrice.toString());
  const [quantity, setQuantity] = useState('1');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>(side);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const { toast } = useToast();

  // Update state when props change
  useEffect(() => {
    if (isOpen) {
      console.log('TradingModal opened with:', { side, symbol, currentPrice });
      setOrderSide(side);
      setPrice(currentPrice.toString());
      setQuantity('1');
    }
  }, [isOpen, side, currentPrice, symbol]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createOrder({
        symbol,
        type: orderSide,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        status: 'pending',
        placedAt: new Date().toISOString(),
        filledAt: null,
      }).unwrap();

      toast({
        title: 'Order Placed Successfully',
        description: `${orderSide.toUpperCase()} order for ${quantity} ${symbol} at ${formatCurrency(parseFloat(price))}`,
      });

      onClose();
      // Reset form
      setPrice(currentPrice.toString());
      setQuantity('1');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to place order. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  const totalValue = parseFloat(price) * parseInt(quantity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
        <Card>
          <CardHeader className={`${orderSide === 'buy' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
            <CardTitle className="flex items-center justify-between">
              <span>{orderSide.toUpperCase()} {symbol}</span>
              <Badge 
                variant={orderSide === 'buy' ? 'default' : 'secondary'}
                className={orderSide === 'buy' ? 'bg-green-600' : 'bg-red-600'}
              >
                {orderSide.toUpperCase()}
              </Badge>
            </CardTitle>
            <CardDescription>
              Place your {orderSide} order for {symbol} at current market price
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Symbol */}
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  value={symbol}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              {/* Side Selector */}
              <div className="space-y-2">
                <Label htmlFor="side">Order Type</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={orderSide === 'buy' ? 'default' : 'outline'}
                    className={`${
                      orderSide === 'buy' 
                        ? 'bg-green-600 hover:bg-green-700 border-green-600' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => setOrderSide('buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    type="button"
                    variant={orderSide === 'sell' ? 'default' : 'outline'}
                    className={`${
                      orderSide === 'sell' 
                        ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                        : 'border-gray-300'
                    }`}
                    onClick={() => setOrderSide('sell')}
                  >
                    Sell
                  </Button>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>

              {/* Total */}
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex justify-between text-sm">
                  <span>Total Value:</span>
                  <span className="font-semibold">{formatCurrency(totalValue)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 ${
                    orderSide === 'buy' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isLoading ? 'Placing Order...' : `${orderSide.toUpperCase()}`}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
