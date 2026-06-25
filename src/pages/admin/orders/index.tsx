import { useEffect, useState } from "react";
import AdminLayout from "../layout";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Modal,
} from "@mui/material";
import {
  useAdminGetOrdersQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "@/redux/api/orderApi";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import Image from "next/image";
import { IAdminOrder, OrderStatus } from "@/utils/types";

export default function OrdersPage() {
  const {
    data: ordersResponse,
    isLoading,
    error,
    refetch,
  } = useAdminGetOrdersQuery();
  const [allOrders, setAllOrders] = useState<IAdminOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IAdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<IAdminOrder | null>(null);
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleDeleteOrder = (id: number) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteOrder(id)
        .unwrap()
        .then(() => {
          toast.success("Order deleted successfully!");
          refetch();
        })
        .catch(() => {
          toast.error("Failed to delete order");
        });
    }
  };

  const statusOptions = [
    "DELIVERED",
    "PROCESSING",
    "SHIPPED",
    "PENDING",
    "CANCELLED",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "success";
      case "PROCESSING":
        return "warning";
      case "SHIPPED":
        return "info";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  useEffect(() => {
    if (ordersResponse) {
      setAllOrders(ordersResponse.data);
    }
  }, [ordersResponse]);

  useEffect(() => {
    let updatedOrders = [...allOrders];

    if (statusFilter) {
      updatedOrders = updatedOrders.filter(
        (order) => order.status === statusFilter
      );
    }

    updatedOrders.sort((a, b) => {
      if (sortBy === "id") {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
      if (sortBy === "order_day") {
        const dateA = new Date(a.order_day).getTime();
        const dateB = new Date(b.order_day).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      return 0;
    });

    const startIndex = (page - 1) * limit;
    const paginatedOrders = updatedOrders.slice(startIndex, startIndex + limit);

    setFilteredOrders(paginatedOrders);
  }, [allOrders, statusFilter, sortBy, sortOrder, page, limit]);

  const handleViewOrder = (order: IAdminOrder) => {
    setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <Typography>Error loading orders</Typography>;

  return (
    <AdminLayout>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {/* Bộ lọc và Sắp xếp */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-md px-2 py-1 bg-gray-50"
        >
          <option value="">All Status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className="flex items-center space-x-2">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-2 py-1 bg-gray-50"
          >
            <option value="id">ID</option>
            <option value="order_day">Order Date</option>
          </select>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="text-blue-500"
          >
            {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
          </button>
        </div>
      </div>

      {/* Bảng đơn hàng */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {new Date(order.order_day).toLocaleDateString()}
                </TableCell>
                <TableCell>{order.payment_method}</TableCell>
                <TableCell>${order.subtotal.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleViewOrder(order)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => handleViewOrder(order)}>
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="py-1 px-3 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Previous
        </button>
        <span className="py-1 px-3">{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={filteredOrders.length < limit}
          className="py-1 px-3 bg-gray-300 rounded-md hover:bg-gray-400"
        >
          Next
        </button>
      </div>
      <Modal open={!!selectedOrder} onClose={handleCloseModal}>
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          aria-labelledby="order-details-modal"
        >
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-auto p-6 max-h-[90vh]">
            {selectedOrder && (
              <>
                {/* Tiêu đề */}
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Order Details (ID: {selectedOrder.id})
                </h2>

                {/* Thông tin đơn hàng */}
                <div className="space-y-2 mb-4">
                  <p>
                    <span className="font-semibold text-gray-700">Date:</span>{" "}
                    {new Date(selectedOrder.order_day).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Payment Method:
                    </span>{" "}
                    {selectedOrder.payment_method}
                  </p>

                  {/* Thay đổi trạng thái */}
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-700">Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          status: e.target.value as OrderStatus,
                        })
                      }
                      className="border rounded-md px-2 py-1 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <hr className="my-4 border-gray-300" />

                {/* Thông tin khách hàng */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-gray-700">Name:</span>{" "}
                    {`${selectedOrder.address.first_name} ${selectedOrder.address.last_name}`}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Phone:</span>{" "}
                    {selectedOrder.customer.phone}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">Email:</span>{" "}
                    {selectedOrder.customer.account.email}
                  </p>
                </div>

                <hr className="my-4 border-gray-300" />

                {/* Thông tin địa chỉ */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Shipping Address
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-gray-700">Street:</span>{" "}
                    {selectedOrder.address.street}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">City:</span>{" "}
                    {selectedOrder.address.city}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Province:
                    </span>{" "}
                    {selectedOrder.address.province}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Country:
                    </span>{" "}
                    {selectedOrder.address.country}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-700">
                      Zipcode:
                    </span>{" "}
                    {selectedOrder.address.zipcode}
                  </p>
                </div>

                <hr className="my-4 border-gray-300" />

                {/* Danh sách sản phẩm */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Order Items
                </h3>
                <div className="space-y-4">
                  {selectedOrder.order_detail.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 border p-4 rounded-lg shadow-sm"
                    >
                      <Image
                        src={
                          item.product.products_images?.images[0] ?? "/placeholder.png"
                        }
                        alt={item.product.name}
                        width={64}
                        height={64}
                        unoptimized
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Price: ${item.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleCloseModal}
                className="py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!selectedOrder) return;
                  updateOrder({
                    id: selectedOrder.id,
                    status: selectedOrder.status,
                  })
                    .unwrap()
                    .then(() => {
                      toast.success("Order updated successfully!");
                      refetch();
                    })
                    .catch(() => {
                      toast.error("Failed to update order");
                    });
                  handleCloseModal();
                }}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
