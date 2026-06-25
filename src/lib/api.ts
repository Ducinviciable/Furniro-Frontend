import {
  format,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
} from "date-fns";

export async function fetchStatsData() {
  const result = await fetch(process.env.NEXT_PUBLIC_API_URL + "order/stats");
  return result;
}

export async function fetchProductsData() {
  const result = await fetch(process.env.NEXT_PUBLIC_API_URL + "products");
  return result;
}

export async function fetchDashboardData(startDate: Date, endDate: Date) {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  const years = eachYearOfInterval({ start: startDate, end: endDate });

  let revenueData;
  if (days.length <= 31) {
    revenueData = days.map((day) => ({
      date: format(day, "yyyy-MM-dd"),
      revenue: Math.floor(Math.random() * 10000),
    }));
  } else if (months.length <= 12) {
    revenueData = months.map((month) => ({
      date: format(month, "yyyy-MM"),
      revenue: Math.floor(Math.random() * 100000),
    }));
  } else {
    revenueData = years.map((year) => ({
      date: format(year, "yyyy"),
      revenue: Math.floor(Math.random() * 1000000),
    }));
  }

  const response = await fetchStatsData();
  const stats = await response.json();

  const response2 = await fetchProductsData();
  const products = await response2.json();

  const topSellingProducts = (products?.data as any[])
    ?.map((product) => ({
      id: product.id,
      name: product.name,
      sales: Math.floor(Math.random() * 1000),
      image: product.image,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return {
    totalCustomers: stats?.data?.totalCustomers || 0,
    totalOrders: stats?.data?.totalOrders || 0,
    totalProducts: stats?.data?.totalProducts || 0,
    totalCategories: stats?.data?.totalCategories || 0,

    revenueData,
    topSellingProducts,
  };
}
