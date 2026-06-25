"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductImage {
  images: string[];
}

interface Product {
  name: string;
  products_images: ProductImage;
}

interface OrderDetail {
  id: number;
  price: number;
  quantity: number;
  product_id: number;
  product: Product;
}

interface Order {
  id: number;
  order_day: string;
  payment_method: string;
  subtotal: number;
  status: OrderStatus;
  order_detail: OrderDetail[];
}

enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
}

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  if (!orders) return null;

  const toggleOrder = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "text-yellow-500";
      case OrderStatus.PROCESSING:
        return "text-blue-500";
      case OrderStatus.SHIPPED:
        return "text-orange-500";
      case OrderStatus.DELIVERED:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Order History</h3>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-600">You have no order history.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div
                className="flex justify-between items-center p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                onClick={() => toggleOrder(order.id)}
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Đơn hàng #{order.id}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.order_day).toLocaleDateString("en-EN")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">
                    {order.subtotal.toLocaleString("en-EN", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                  <p className={`text-sm ${getStatusClass(order.status)}`}>
                    {order.status}
                  </p>
                </div>
                {expandedOrder === order.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
              {expandedOrder === order.id && (
                <div className="p-4 bg-white">
                  <p className="mb-2 text-gray-700">
                    Phương thức thanh toán: {order.payment_method}
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-600">#</th>
                        <th className="text-left py-2 text-gray-600">Ảnh</th>
                        <th className="text-left py-2 text-gray-600">Tên</th>
                        <th className="text-left py-2 text-gray-600">
                          Số lượng
                        </th>
                        <th className="text-right py-2 text-gray-600">
                          Đơn giá
                        </th>
                        <th className="text-right py-2 text-gray-600">Tổng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.order_detail.map((item, index) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-2 text-gray-800">{index + 1}</td>
                          <td className="py-2 text-gray-800">
                            <img
                              src={
                                item.product.products_images?.images[0] ||
                                "/placeholder.png"
                              }
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                          </td>
                          <td className="py-2 text-gray-800">
                            {item.product.name}
                          </td>
                          <td className="py-2 text-gray-800">
                            {item.quantity}
                          </td>
                          <td className="text-right py-2 text-gray-800">
                            {item.price.toLocaleString("en-EN", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </td>
                          <td className="text-right py-2 text-gray-800">
                            {(item.price * item.quantity).toLocaleString(
                              "en-EN",
                              {
                                style: "currency",
                                currency: "USD",
                              }
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
