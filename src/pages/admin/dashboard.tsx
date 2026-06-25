"use client";

import { useState, useEffect } from "react";
import BarChart from "@/components/charts/BarChart";
import LineChart from "@/components/charts/LineChart";
import { fetchDashboardData } from "@/lib/api";
import StatCard from "./dashboard/StatCard";
import TopSellingProducts from "./dashboard/TopSellingProduct";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      const data = await fetchDashboardData(
        new Date(startDate),
        new Date(endDate)
      );
      setDashboardData(data);
    };
    loadDashboardData();
  }, [startDate, endDate]);

  if (!dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label
            htmlFor="startDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label
            htmlFor="endDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Customers"
          value={dashboardData.totalCustomers}
          icon="👥"
        />
        <StatCard
          title="Total Orders"
          value={dashboardData.totalOrders}
          icon="📦"
        />
        <StatCard
          title="Total Products"
          value={dashboardData.totalProducts}
          icon="🛍️"
        />
        <StatCard
          title="Total Categories"
          value={dashboardData.totalCategories}
          icon="📊"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Revenue Over Time
            </h2>
            <LineChart
              data={dashboardData.revenueData}
              xDataKey="date"
              lineDataKey="revenue"
              height={300}
            />
          </div>
        </div>
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Top Selling Products
            </h2>
            <BarChart
              data={dashboardData.topSellingProducts}
              xDataKey="name"
              barDataKey="sales"
              height={300}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Top Selling Products Details
        </h2>
        <TopSellingProducts products={dashboardData.topSellingProducts} />
      </div>
    </div>
  );
}
