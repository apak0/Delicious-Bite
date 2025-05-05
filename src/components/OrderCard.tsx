import React from 'react';
import { Clock, User, Phone } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { OrderStatusBadge } from './ui/Badge';
import { Order, OrderStatus } from '../types';
import { useOrders } from '../context/OrderContext';
import { formatDate, formatCurrency } from '../utils/formatters';

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
}

export function OrderCard({ order, isAdmin = false }: OrderCardProps) {
  const { orderDispatch } = useOrders();
  
  const handleUpdateStatus = (status: OrderStatus) => {
    orderDispatch({ 
      type: 'UPDATE_ORDER_STATUS', 
      payload: { id: order.id, status } 
    });
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {order.customerName}
            </h3>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={16} className="mr-2" />
              <span>Ordered {formatDate(order.createdAt)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <User size={16} className="mr-2" />
              <span>{order.customerName}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Phone size={16} className="mr-2" />
              <span>{order.customerPhone}</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
            <ul className="space-y-2">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <div className="flex">
                    <span className="font-medium">{item.quantity}x</span>
                    <span className="ml-2">{item.name}</span>
                  </div>
                  <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            
            {order.items.some(item => item.specialInstructions) && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <h5 className="text-sm font-medium text-gray-900">Special Instructions:</h5>
                <ul className="mt-1 space-y-1">
                  {order.items
                    .filter(item => item.specialInstructions)
                    .map((item) => (
                      <li key={`${item.id}-instructions`} className="text-sm text-gray-600">
                        <span className="font-medium">{item.name}:</span> {item.specialInstructions}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            
            <div className="flex justify-between font-semibold text-gray-900 mt-4">
              <span>Total</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {isAdmin && order.status !== 'delivered' && order.status !== 'cancelled' && (
        <CardFooter className="flex flex-wrap gap-2">
          {order.status === 'pending' && (
            <Button 
              variant="secondary" 
              onClick={() => handleUpdateStatus('preparing')}
              className="flex-1"
            >
              Start Preparing
            </Button>
          )}
          
          {order.status === 'preparing' && (
            <Button 
              variant="secondary" 
              onClick={() => handleUpdateStatus('ready')}
              className="flex-1"
            >
              Mark as Ready
            </Button>
          )}
          
          {order.status === 'ready' && (
            <Button 
              variant="success" 
              onClick={() => handleUpdateStatus('delivered')}
              className="flex-1"
            >
              Mark as Delivered
            </Button>
          )}
          
          {order.status !== 'cancelled' && (
            <Button 
              variant="danger" 
              onClick={() => handleUpdateStatus('cancelled')}
              className="flex-1"
            >
              Cancel Order
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}