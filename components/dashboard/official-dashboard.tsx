"use client"

import { useState, useEffect, useMemo } from "react"
import { 
  FileText, 
  Award, 
  TreePine, 
  XCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  Users,
  Building2,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  ComposedChart
} from "recharts"

const API_BASE_URL = 'http://127.0.0.1:8000';

const parseSafeNumber = (value: any): number => {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
        const num = parseFloat(value.replace(/,/g, ''));
        return isNaN(num) ? 0 : num;
    }
    return 0;
};

const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null || isNaN(num)) return 'N/A';
    return Math.round(num).toLocaleString('en-IN');
};

const formatLargeNumber = (num: number): string => {
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

interface OfficialStats {
    State: string; 
    Individual_Claims: number; 
    Community_Claims: number; 
    Total_Claims: number;
    Individual_Titles: number; 
    Community_Titles: number; 
    Total_Titles: number;
    Individual_Forest_Land: number; 
    Community_Forest_Land: number; 
    Total_Forest_Land: number;
    Claims_Rejected: number; 
    Total_Claims_Disposed: number; 
    Percent_Claims_Disposed: number;
    Percent_Titles_Distributed: number;
}

interface DashboardData {
    state: string; 
    official_stats: OfficialStats; 
    district_drilldown_stats: Array<{district: string, total_claims: number}>;
}

export default function OfficialDashboard() {
  const [availableStates] = useState([
    "Madhya Pradesh", "Odisha", 
    "Telangana", "Tripura",
  ]);
  const [selectedState, setSelectedState] = useState("Madhya Pradesh");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call - replace with actual API call
      const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/?state=${selectedState}`);
      
      if (!response.ok) {
        throw new Error('API call failed');
      }
      
      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to fetch data from API");
      
      // Mock data for demonstration
      setDashboardData({
        "state": selectedState,
        "official_stats": {
            "State": selectedState,
            "Individual_Claims": 585326,
            "Community_Claims": 42187,
            "Total_Claims": 627513,
            "Individual_Titles": 266901,
            "Community_Titles": 27976,
            "Total_Titles": 294877,
            "Individual_Forest_Land": 903533.1,
            "Community_Forest_Land": 1463614.0,
            "Total_Forest_Land": 2367148.0,
            "Claims_Rejected": 332407,
            "Total_Claims_Disposed": 627284,
            "Percent_Claims_Disposed": 98.37,
            "Percent_Titles_Distributed": 46.99
        },
        "district_drilldown_stats": [
            {"district": "Ashoknagar", "total_claims": 132},
            {"district": "Gwalior", "total_claims": 119},
            {"district": "Jabalpur", "total_claims": 118},
            {"district": "Satna", "total_claims": 117},
            {"district": "Chhatarpur", "total_claims": 117},
            {"district": "Bhopal", "total_claims": 116},
            {"district": "Rajgarh", "total_claims": 115},
            {"district": "Singrauli", "total_claims": 114},
            {"district": "Seoni", "total_claims": 114},
            {"district": "Shahdol", "total_claims": 112}
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedState]);

  // Enhanced statistics cards with icons and better styling
  const enhancedStats = useMemo(() => {
    if (!dashboardData?.official_stats) return [];
    const stats = dashboardData.official_stats;
    
    return [
      {
        icon: FileText,
        title: "Total Claims Received",
        value: formatNumber(stats.Total_Claims),
        subtitle: `Individual: ${formatLargeNumber(stats.Individual_Claims)} | Community: ${formatLargeNumber(stats.Community_Claims)}`,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100"
      },
      {
        icon: Award,
        title: "Titles Distributed",
        value: formatNumber(stats.Total_Titles),
        subtitle: `${stats.Percent_Titles_Distributed?.toFixed(1)}% of total claims`,
        color: "text-green-600",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100"
      },
      {
        icon: TreePine,
        title: "Forest Land Titled",
        value: `${formatLargeNumber(stats.Total_Forest_Land)} Ha`,
        subtitle: `Individual: ${formatLargeNumber(stats.Individual_Forest_Land)} Ha`,
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        iconBg: "bg-emerald-100"
      },
      {
        icon: XCircle,
        title: "Claims Rejected",
        value: formatNumber(stats.Claims_Rejected),
        subtitle: `${((stats.Claims_Rejected / stats.Total_Claims_Disposed) * 100).toFixed(1)}% rejection rate`,
        color: "text-red-600",
        bgColor: "bg-red-50",
        iconBg: "bg-red-100"
      },
      {
        icon: CheckCircle,
        title: "Claims Disposed",
        value: formatNumber(stats.Total_Claims_Disposed),
        subtitle: `${stats.Percent_Claims_Disposed?.toFixed(1)}% completion rate`,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100"
      },
      {
        icon: Clock,
        title: "Claims Pending",
        value: formatNumber(stats.Total_Claims - stats.Total_Claims_Disposed),
        subtitle: `${((1 - (stats.Percent_Claims_Disposed / 100)) * 100).toFixed(1)}% remaining`,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        iconBg: "bg-orange-100"
      }
    ];
  }, [dashboardData]);

  const claimsStatusData = useMemo(() => {
    if (!dashboardData?.official_stats) return [];
    const stats = dashboardData.official_stats;
    
    const distributed = parseSafeNumber(stats.Percent_Titles_Distributed);
    const disposed = parseSafeNumber(stats.Total_Claims_Disposed);
    const rejectedRaw = parseSafeNumber(stats.Claims_Rejected);
    
    const rejected = disposed > 0 ? (rejectedRaw / disposed) * 100 : 0;
    const pending = Math.max(0, 100 - (distributed + rejected));
    
    return [
      { name: "Titles Distributed", value: parseFloat(distributed.toFixed(2)), color: "#22c55e" },
      { name: "Claims Rejected", value: parseFloat(rejected.toFixed(2)), color: "#ef4444" },
      { name: "Claims Pending", value: parseFloat(pending.toFixed(2)), color: "#f59e0b" },
    ];
  }, [dashboardData]);

  // Claims vs Titles comparison data
  const claimsVsTitlesData = useMemo(() => {
    if (!dashboardData?.official_stats) return [];
    const stats = dashboardData.official_stats;
    
    return [
      {
        category: 'Individual',
        Claims: stats.Individual_Claims,
        Titles: stats.Individual_Titles,
        'Success Rate': ((stats.Individual_Titles / stats.Individual_Claims) * 100).toFixed(1)
      },
      {
        category: 'Community',
        Claims: stats.Community_Claims,
        Titles: stats.Community_Titles,
        'Success Rate': ((stats.Community_Titles / stats.Community_Claims) * 100).toFixed(1)
      }
    ];
  }, [dashboardData]);

  if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Loading Forest Rights Dashboard...</p>
            <p className="text-sm text-gray-600 mt-2">Fetching data for {selectedState}</p>
          </div>
        </div>
      )
  }
  
  if (!dashboardData || !dashboardData.official_stats) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg">
            <XCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <p className="text-lg font-medium text-red-600">Failed to Load Dashboard</p>
            <p className="text-sm text-gray-600 mt-2">Could not load data for {selectedState}</p>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4 inline mr-2 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}
            <button 
              onClick={fetchData}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        </div>
      )
  }
  
  const officialStats = dashboardData.official_stats;

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central" 
        fontSize={12} 
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-lg border-b">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-4 rounded-lg">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  Forest Rights Act Dashboard
                </h1>
                <p className="text-xl text-gray-600">{dashboardData.state}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Select State
                </label>
                <select 
                  value={selectedState} 
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-56 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  {availableStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {enhancedStats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-shadow rounded-lg p-6`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className={`inline-flex p-3 rounded-lg ${stat.iconBg} mb-4`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-2">{stat.title}</h3>
                  <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Statistics Table */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="bg-gray-50 border-b p-6 rounded-t-lg">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              Official Statistics Breakdown - {selectedState}
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left p-4 font-semibold">Metric</th>
                    <th className="text-right p-4 font-semibold">Individual</th>
                    <th className="text-right p-4 font-semibold">Community</th>
                    <th className="text-right p-4 font-semibold">Total</th>
                    <th className="text-right p-4 font-semibold">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Claims Filed</td>
                    <td className="text-right p-4">{formatNumber(officialStats.Individual_Claims)}</td>
                    <td className="text-right p-4">{formatNumber(officialStats.Community_Claims)}</td>
                    <td className="text-right p-4 font-bold">{formatNumber(officialStats.Total_Claims)}</td>
                    <td className="text-right p-4">-</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Titles Distributed</td>
                    <td className="text-right p-4 text-green-600">{formatNumber(officialStats.Individual_Titles)}</td>
                    <td className="text-right p-4 text-green-600">{formatNumber(officialStats.Community_Titles)}</td>
                    <td className="text-right p-4 font-bold text-green-600">{formatNumber(officialStats.Total_Titles)}</td>
                    <td className="text-right p-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        {((officialStats.Total_Titles / officialStats.Total_Claims) * 100).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">Forest Land Titled (Ha)</td>
                    <td className="text-right p-4">{formatNumber(officialStats.Individual_Forest_Land)}</td>
                    <td className="text-right p-4">{formatNumber(officialStats.Community_Forest_Land)}</td>
                    <td className="text-right p-4 font-bold">{formatNumber(officialStats.Total_Forest_Land)}</td>
                    <td className="text-right p-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {formatLargeNumber(officialStats.Total_Forest_Land / officialStats.Total_Titles)} Ha/Title
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Claims vs Titles Comparison */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-gray-50 border-b p-6 rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Claims vs Titles Distribution
              </h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={claimsVsTitlesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Claims" fill="#3b82f6" name="Claims Filed" />
                  <Bar dataKey="Titles" fill="#10b981" name="Titles Distributed" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Claims Status Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="bg-gray-50 border-b p-6 rounded-t-lg">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Claims Status Distribution
              </h3>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={claimsStatusData} 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={100} 
                    dataKey="value" 
                    nameKey="name" 
                    labelLine={false} 
                    label={renderCustomizedLabel}
                  >
                    {claimsStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* District-wise Claims Distribution */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="bg-gray-50 border-b p-6 rounded-t-lg">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              District-wise Claims Distribution
            </h3>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={dashboardData.district_drilldown_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="district" 
                  angle={-45} 
                  textAnchor="end" 
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="total_claims" 
                  fill="#8884d8" 
                  name="Total Claims"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Forest Rights Act Dashboard - Ministry of Tribal Affairs
          </p>
          <p className="text-xs mt-2">
            Data refreshed automatically. Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}