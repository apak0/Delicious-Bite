import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { OrderCard } from '../components/OrderCard';
import { useOrders } from '../context/OrderContext';

export function OrderTrackingPage() {
  const { orders } = useOrders();
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [foundOrder, setFoundOrder] = useState<typeof orders[0] | null>(null);
  
  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    const order = orders.find(
      order => order.id.toLowerCase().includes(orderId.toLowerCase())
    );
    
    if (order) {
      setFoundOrder(order);
      setError('');
    } else {
      setFoundOrder(null);
      setError('No order found with that ID. Please check and try again.');
    }
  };
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-gray-600 mt-2">
          Enter your order ID to see the current status of your order
        </p>
      </div>
      
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleTrackOrder} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Enter your order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              error={error}
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              <Search className="mr-2 h-5 w-5" />
              Track Order
            </Button>
          </div>
        </form>
        
        {foundOrder ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Found!</h2>
            <OrderCard order={foundOrder} />
            
            {['preparing', 'ready'].includes(foundOrder.status) && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Estimated Time</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700">
                    Your order should be {foundOrder.status === 'ready' ? 'ready for pickup' : 'ready'} by approximately:{' '}
                    <span className="font-semibold">
                      {foundOrder.estimatedDeliveryTime 
                        ? new Date(foundOrder.estimatedDeliveryTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'To be determined'}
                    </span>
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Progress</h3>
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div 
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-600 ${
                      foundOrder.status === 'pending' ? 'w-1/4' :
                      foundOrder.status === 'preparing' ? 'w-2/4' :
                      foundOrder.status === 'ready' ? 'w-3/4' :
                      foundOrder.status === 'delivered' ? 'w-full' :
                      'w-0'
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <div className={`text-xs ${foundOrder.status === 'pending' || foundOrder.status === 'preparing' || foundOrder.status === 'ready' || foundOrder.status === 'delivered' ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                    Received
                  </div>
                  <div className={`text-xs ${foundOrder.status === 'preparing' || foundOrder.status === 'ready' || foundOrder.status === 'delivered' ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                    Preparing
                  </div>
                  <div className={`text-xs ${foundOrder.status === 'ready' || foundOrder.status === 'delivered' ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                    Ready
                  </div>
                  <div className={`text-xs ${foundOrder.status === 'delivered' ? 'font-bold text-red-600' : 'text-gray-500'}`}>
                    Delivered
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600">
              We couldn't find an order with that ID. Please check and try again.
            </p>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-900 mb-4">How to Track Your Order</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li className="text-gray-700">
                Enter your order ID in the field above. You can find your order ID in the confirmation email you received.
              </li>
              <li className="text-gray-700">
                Click on "Track Order" to see the status of your order.
              </li>
              <li className="text-gray-700">
                You'll be able to see if your order is being prepared, ready for pickup, or has been delivered.
              </li>
            </ol>
            <p className="mt-4 text-gray-500 text-sm">
              If you're having trouble finding your order, please contact our customer support at (123) 456-7890.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}