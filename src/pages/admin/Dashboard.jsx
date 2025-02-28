import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStatsQuery } from "@/features/api/purchaseApi";
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2, TrendingUp, Users, DollarSign, BookOpen } from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";

const Dashboard = () => {
  const { data, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-center">
        <div className="p-6 max-w-sm mx-auto backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-xl border border-red-100 dark:border-red-900/20">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There was an error loading the dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const stats = data?.stats || {};
  const { 
    totalRevenue = 0, 
    totalSales = 0, 
    averageRevenue = 0, 
    uniqueCourses = 0,
    salesByDate = [],
    purchasedCourse = []
  } = stats;

  // Format data for charts
  const revenueData = salesByDate.map(item => ({
    name: item.date,
    revenue: item.revenue
  }));

  const courseData = purchasedCourse
    .filter(purchase => purchase.courseId)
    .map(purchase => ({
      name: purchase.courseId.courseTitle || 'Untitled Course',
      price: purchase.courseId.coursePrice || 0,
      sales: purchase.courseId.sales || 0
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your course performance and revenue metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-purple-100 dark:border-purple-900/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Sales
            </CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSales}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">courses sold</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-purple-100 dark:border-purple-900/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </CardTitle>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">total earnings</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-purple-100 dark:border-purple-900/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Average Revenue
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(averageRevenue)}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">per course</p>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-purple-100 dark:border-purple-900/20 shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Courses
            </CardTitle>
            <BookOpen className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {uniqueCourses}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">in total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-purple-100 dark:border-purple-900/20 shadow-lg col-span-1">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    className="text-xs" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      border: '1px solid rgba(147, 51, 234, 0.1)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#9333ea" strokeWidth={2} dot={{ fill: "#9333ea" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-purple-100 dark:border-purple-900/20 shadow-lg col-span-1">
          <CardHeader>
            <CardTitle>Course Pricing & Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={courseData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value)}
                    className="text-xs" 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '12px',
                      border: '1px solid rgba(147, 51, 234, 0.1)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="price" 
                    name="Revenue (ETB)" 
                    fill="#9333ea" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar dataKey="sales" name="Sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
