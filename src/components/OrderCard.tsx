import { Clock, User, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/Card";
import { Button } from "./ui/Button";
import { OrderStatusBadge } from "./ui/Badge";
import { Order, OrderStatus } from "../types";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatCurrency } from "../utils/formatters";

interface OrderCardProps {
  order: Order;
  isAdmin?: boolean;
  hideDetails?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function OrderCard({
  order,
  isAdmin = false,
  hideDetails = false,
  isExpanded = false,
  onToggle,
}: OrderCardProps) {
  const { orderDispatch } = useOrders();
  const { user, isAdmin: userIsAdmin, isStaff } = useAuth();

  const canManageOrder = isAdmin && (userIsAdmin || isStaff);
  const isOwnOrder = user?.id === order.userId;

  const handleUpdateStatus = (status: OrderStatus) => {
    if (!canManageOrder) return;
    orderDispatch({
      type: "UPDATE_ORDER_STATUS",
      payload: { id: order.id, status },
    });
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center min-w-[24px]">
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  Order #{order.id.slice(0, 8)}
                </span>
                {canManageOrder && (
                  <h3 className="text-lg font-semibold text-gray-900">
                    {order.customerName}
                  </h3>
                )}
              </div>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Clock size={16} className="mr-2" />
            <span>Ordered {formatDate(order.createdAt)}</span>
          </div>
        </CardHeader>
      </div>

      {isExpanded && (
        <>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1">
                {(canManageOrder || isOwnOrder) && !hideDetails && (
                  <>
                    <div className="flex items-center text-sm text-gray-500">
                      <User size={16} className="mr-2" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone size={16} className="mr-2" />
                      <span>{order.customerPhone}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li
                      key={`${order.id}-item-${item.id}-${index}`}
                      className="flex justify-between"
                    >
                      <div className="flex">
                        <span className="font-medium">{item.quantity}x</span>
                        <span className="ml-2">{item.name}</span>
                      </div>
                      {(canManageOrder || isOwnOrder) && (
                        <span className="text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                {order.items.some((item) => item.specialInstructions) && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <h5 className="text-sm font-medium text-gray-900">
                      Special Instructions:
                    </h5>
                    <ul className="mt-1 space-y-1">
                      {order.items
                        .filter((item) => item.specialInstructions)
                        .map((item, index) => (
                          <li
                            key={`${order.id}-instruction-${item.id}-${index}`}
                            className="text-sm text-gray-600"
                          >
                            <span className="font-medium">{item.name}:</span>{" "}
                            {item.specialInstructions}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {(canManageOrder || isOwnOrder) && (
                  <div className="flex justify-between font-semibold text-gray-900 mt-4">
                    <span>Total</span>
                    <span>{formatCurrency(order.totalAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>

          {canManageOrder &&
            order.status !== "delivered" &&
            order.status !== "cancelled" && (
              <CardFooter className="flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus("preparing")}
                    className="flex-1"
                  >
                    Start Preparing
                  </Button>
                )}

                {order.status === "preparing" && (
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus("ready")}
                    className="flex-1"
                  >
                    Mark as Ready
                  </Button>
                )}

                {order.status === "ready" && (
                  <Button
                    variant="success"
                    onClick={() => handleUpdateStatus("delivered")}
                    className="flex-1"
                  >
                    Mark as Delivered
                  </Button>
                )}

                {(order.status === "pending" ||
                  order.status === "preparing" ||
                  order.status === "ready") && (
                  <Button
                    variant="danger"
                    onClick={() => handleUpdateStatus("cancelled")}
                    className="flex-1"
                  >
                    Cancel Order
                  </Button>
                )}
              </CardFooter>
            )}
        </>
      )}
    </Card>
  );
}
