import { useState, useMemo, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown, Filter, RefreshCw } from "lucide-react";
import { OrderCard } from "../components/OrderCard";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Input";
import { useOrders } from "../hooks/useOrders";
import { useAuth } from "../context/AuthContext";
import { OrderStatus } from "../types";

export function OrderListPage() {
  const { orders, fetchOrders, loading } = useOrders();
  const { isAdmin } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [expandedOrderIds, setExpandedOrderIds] = useState<Set<string>>(
    new Set()
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to manually refresh orders
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => setIsRefreshing(false), 500); // Add slight delay for better UX
  };
  // Fetch orders when component mounts
  useEffect(() => {
    fetchOrders();
  }, []); // boş bağımlılık dizisi, sadece component mount olduğunda çalışır

  // Initialize expanded state with the latest order
  useEffect(() => {
    if (orders.length > 0 && expandedOrderIds.size === 0) {
      const latestOrder = [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      setExpandedOrderIds(new Set([latestOrder.id]));
    }
  }, [orders]);

  const toggleOrderExpansion = useCallback((orderId: string) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (prev.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  }, []);

  // Filtered and sorted orders
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();

      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [orders, statusFilter, sortBy]);

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "preparing", label: "Preparing" },
    { value: "ready", label: "Ready" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Count orders by status
  const orderCounts = useMemo(() => {
    return orders.reduce((counts, order) => {
      const status = order.status as OrderStatus;
      counts[status] = (counts[status] || 0) + 1;
      return counts;
    }, {} as Record<OrderStatus, number>);
  }, [orders]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? "Orders Management" : "Orders"}
          </h1>
        </div>

        <div className="mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>
      {/* Order statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-yellow-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-gray-900">
            {orderCounts.pending || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-orange-500 text-sm">Preparing</p>
          <p className="text-2xl font-bold text-gray-900">
            {orderCounts.preparing || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-red-600 text-sm">Ready</p>
          <p className="text-2xl font-bold text-gray-900">
            {orderCounts.ready || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 text-center">
          <p className="text-green-500 text-sm">Delivered</p>
          <p className="text-2xl font-bold text-gray-900">
            {orderCounts.delivered || 0}
          </p>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center">
            <Filter className="mr-2 h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 mr-2">
              Filter by:
            </span>
          </div>

          <div className="flex-1">
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto"
            />
          </div>

          <div>
            <Button
              variant="outline"
              onClick={() =>
                setSortBy(sortBy === "newest" ? "oldest" : "newest")
              }
              className="w-full sm:w-auto"
            >
              {sortBy === "newest" ? (
                <>
                  <ArrowDown className="mr-2 h-5 w-5" />
                  Newest First
                </>
              ) : (
                <>
                  <ArrowUp className="mr-2 h-5 w-5" />
                  Oldest First
                </>
              )}
            </Button>
          </div>
        </div>
      </div>{" "}
      {/* Orders list */}
      {isRefreshing ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
            <h2 className="text-lg font-medium text-gray-900">
              Loading Orders
            </h2>
            <p className="text-gray-500">
              Please wait while we fetch the latest orders...
            </p>
          </div>
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isAdmin={true}
              isExpanded={expandedOrderIds.has(order.id)}
              onToggle={() => toggleOrderExpansion(order.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-lg font-medium text-gray-900 mb-1">
            No orders found
          </h2>
          <p className="text-gray-500">
            {statusFilter !== "all"
              ? `There are no orders with status "${statusFilter}"`
              : "There are no orders yet"}
          </p>
        </div>
      )}
    </main>
  );
}
