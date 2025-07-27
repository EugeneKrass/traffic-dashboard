import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Filter,
  TrendingUp,
  User,
  Lock,
} from "lucide-react";

// Sample data as provided in the task
const SAMPLE_DATA = [
  { id: "1", date: "2025-03-01", visits: 120 },
  { id: "2", date: "2025-03-02", visits: 140 },
  { id: "3", date: "2025-03-03", visits: 98 },
  { id: "4", date: "2025-03-04", visits: 132 },
  { id: "5", date: "2025-03-05", visits: 101 },
  { id: "6", date: "2025-03-06", visits: 87 },
  { id: "7", date: "2025-03-07", visits: 94 },
  { id: "8", date: "2025-03-08", visits: 178 },
  { id: "9", date: "2025-03-09", visits: 164 },
  { id: "10", date: "2025-03-10", visits: 112 },
  { id: "11", date: "2025-03-11", visits: 106 },
  { id: "12", date: "2025-03-12", visits: 133 },
  { id: "13", date: "2025-03-13", visits: 90 },
  { id: "14", date: "2025-03-14", visits: 124 },
  { id: "15", date: "2025-03-15", visits: 110 },
  { id: "16", date: "2025-03-16", visits: 175 },
  { id: "17", date: "2025-03-17", visits: 188 },
  { id: "18", date: "2025-03-18", visits: 147 },
  { id: "19", date: "2025-03-19", visits: 133 },
  { id: "20", date: "2025-03-20", visits: 119 },
  { id: "21", date: "2025-03-21", visits: 102 },
  { id: "22", date: "2025-03-22", visits: 111 },
  { id: "23", date: "2025-03-23", visits: 154 },
  { id: "24", date: "2025-03-24", visits: 162 },
  { id: "25", date: "2025-03-25", visits: 120 },
  { id: "26", date: "2025-03-26", visits: 108 },
  { id: "27", date: "2025-03-27", visits: 113 },
  { id: "28", date: "2025-03-28", visits: 95 },
  { id: "29", date: "2025-03-29", visits: 142 },
  { id: "30", date: "2025-03-30", visits: 170 },
  { id: "31", date: "2025-03-31", visits: 128 },
  { id: "32", date: "2025-04-01", visits: 105 },
  { id: "33", date: "2025-04-02", visits: 87 },
  { id: "34", date: "2025-04-03", visits: 156 },
  { id: "35", date: "2025-04-04", visits: 131 },
  { id: "36", date: "2025-04-05", visits: 122 },
  { id: "37", date: "2025-04-06", visits: 149 },
  { id: "38", date: "2025-04-07", visits: 95 },
  { id: "39", date: "2025-04-08", visits: 143 },
  { id: "40", date: "2025-04-09", visits: 137 },
  { id: "41", date: "2025-04-10", visits: 128 },
  { id: "42", date: "2025-04-11", visits: 109 },
  { id: "43", date: "2025-04-12", visits: 117 },
  { id: "44", date: "2025-04-13", visits: 138 },
  { id: "45", date: "2025-04-14", visits: 160 },
  { id: "46", date: "2025-04-15", visits: 151 },
  { id: "47", date: "2025-04-16", visits: 100 },
  { id: "48", date: "2025-04-17", visits: 134 },
  { id: "49", date: "2025-04-18", visits: 141 },
  { id: "50", date: "2025-04-19", visits: 108 },
  { id: "51", date: "2025-04-20", visits: 157 },
  { id: "52", date: "2025-04-21", visits: 120 },
  { id: "53", date: "2025-04-22", visits: 99 },
  { id: "54", date: "2025-04-23", visits: 126 },
  { id: "55", date: "2025-04-24", visits: 153 },
  { id: "56", date: "2025-04-25", visits: 115 },
  { id: "57", date: "2025-04-26", visits: 130 },
  { id: "58", date: "2025-04-27", visits: 98 },
  { id: "59", date: "2025-04-28", visits: 118 },
  { id: "60", date: "2025-04-29", visits: 167 },
  { id: "61", date: "2025-04-30", visits: 148 },
];

export default function TrafficDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState(SAMPLE_DATA);
  const [filteredData, setFilteredData] = useState(SAMPLE_DATA);
  const [viewMode, setViewMode] = useState("daily");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState({ date: "", visits: "" });

  // Auth states
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [trafficData, sortBy, sortOrder, dateRange]);

  const applyFiltersAndSort = () => {
    let filtered = [...trafficData];

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(
        (item) => item.date >= dateRange.start && item.date <= dateRange.end
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc"
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      } else {
        return sortOrder === "asc" ? a.visits - b.visits : b.visits - a.visits;
      }
    });

    setFilteredData(filtered);
  };

  const aggregateData = () => {
    if (viewMode === "daily") return filteredData;

    const aggregated = {};
    filteredData.forEach((item) => {
      const date = new Date(item.date);
      let key;

      if (viewMode === "weekly") {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        // monthly
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }

      if (!aggregated[key]) {
        aggregated[key] = { date: key, visits: 0, count: 0 };
      }
      aggregated[key].visits += item.visits;
      aggregated[key].count += 1;
    });

    return Object.values(aggregated).map((item) => ({
      date: item.date,
      visits:
        viewMode === "weekly"
          ? Math.round(item.visits / item.count)
          : item.visits,
    }));
  };

  const handleAuth = () => {
    if (!authData.email || !authData.password) {
      setAuthError("Please fill in all fields");
      return;
    }

    // Simulate authentication
    if (authData.password.length < 6) {
      setAuthError("Password must be at least 6 characters");
      return;
    }

    setUser({ email: authData.email });
    setAuthError("");
  };

  const handleLogout = () => {
    setUser(null);
    setAuthData({ email: "", password: "" });
  };

  const handleSubmit = () => {
    if (!formData.date || !formData.visits) {
      alert("Please fill in all fields");
      return;
    }

    const newEntry = {
      id: editingEntry ? editingEntry.id : Date.now().toString(),
      date: formData.date,
      visits: parseInt(formData.visits),
    };

    if (editingEntry) {
      setTrafficData(
        trafficData.map((item) =>
          item.id === editingEntry.id ? newEntry : item
        )
      );
    } else {
      setTrafficData([...trafficData, newEntry]);
    }

    setShowModal(false);
    setEditingEntry(null);
    setFormData({ date: "", visits: "" });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setFormData({ date: entry.date, visits: entry.visits.toString() });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Traffic Dashboard
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={authData.email}
                onChange={(e) =>
                  setAuthData({ ...authData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={authData.password}
                onChange={(e) =>
                  setAuthData({ ...authData, password: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            {authError && (
              <div className="text-red-500 text-sm">{authError}</div>
            )}

            <button
              onClick={handleAuth}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {authMode === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            {authMode === "login"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() =>
                setAuthMode(authMode === "login" ? "signup" : "login")
              }
              className="text-blue-600 hover:underline"
            >
              {authMode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  const chartData = aggregateData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Traffic Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="visits">Visits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="text-sm text-blue-600 hover:underline"
            >
              Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
            </button>

            <button
              onClick={() => {
                setEditingEntry(null);
                setFormData({ date: "", visits: "" });
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Traffic Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="visits"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Traffic Data</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visits
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item, index) => (
                  <tr key={item.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{item.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.visits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingEntry ? "Edit Entry" : "Add New Entry"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visits
                </label>
                <input
                  type="number"
                  value={formData.visits}
                  onChange={(e) =>
                    setFormData({ ...formData, visits: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingEntry(null);
                    setFormData({ date: "", visits: "" });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingEntry ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
