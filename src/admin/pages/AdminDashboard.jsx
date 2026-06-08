import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    blockedUsers: 0,
    totalProducts: 0,
    inactiveProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  /* ===============================
     Fetch Dashboard Data
  =============================== */
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        api.get("/users"),
        api.get("/products"),
        api.get("/orders"),
      ]);

      const users = usersRes.data.users || usersRes.data;
const products = productsRes.data.products || productsRes.data;
const orders = ordersRes.data.orders || ordersRes.data;

      setStats({
        totalUsers: users.length,
        blockedUsers: users.filter((u) => u.isBlocked).length,
        totalProducts: products.length,
        inactiveProducts: products.filter((p) => !p.isActive).length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      });

    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  /* ===============================
     Charts Data
  =============================== */

  const usersChart = [
    { name: "Active Users", value: stats.totalUsers - stats.blockedUsers },
    { name: "Blocked Users", value: stats.blockedUsers },
  ];

  const productsChart = [
    {
      name: "Active Products",
      value: stats.totalProducts - stats.inactiveProducts,
    },
    { name: "Inactive Products", value: stats.inactiveProducts },
  ];

  const trendChart = [
    { name: "Orders", value: stats.totalOrders },
    { name: "Revenue (₹k)", value: Math.round(stats.totalRevenue / 1000) },
  ];

  const USER_COLORS = ["#22c55e", "#ef4444"];
  const PRODUCT_COLORS = ["#3b82f6", "#f59e0b"];

  return (
    <div className="space-y-10">

      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} />
        <StatCard title="Blocked Users" value={stats.blockedUsers} />
        <StatCard title="Total Products" value={stats.totalProducts} />
        <StatCard title="Inactive Products" value={stats.inactiveProducts} />
        <StatCard title="Total Orders" value={stats.totalOrders} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Users Chart */}
        <ChartCard title="Users Overview">
          <PieChart width={260} height={260}>
            <Pie
              data={usersChart}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
            >
              {usersChart.map((_, i) => (
                <Cell key={i} fill={USER_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        {/* Products Chart */}
        <ChartCard title="Products Overview">
          <PieChart width={260} height={260}>
            <Pie
              data={productsChart}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
            >
              {productsChart.map((_, i) => (
                <Cell key={i} fill={PRODUCT_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        {/* Orders Trend */}
        <ChartCard title="Orders & Revenue Trend">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

    </div>
  );
}


/* ===============================
   UI COMPONENTS
================================ */

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-3xl font-bold mt-1">{value}</h2>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex flex-col items-center">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}