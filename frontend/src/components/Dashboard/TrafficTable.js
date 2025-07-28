import { useDispatch, useSelector } from "react-redux";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import {
  selectFilteredData,
  selectTrafficLoading,
  openModal,
  deleteTrafficEntry,
} from "../../redux/slices/trafficSlice";
import { Loader } from "../UI";

/**
 * Traffic data table component
 * Displays traffic entries with edit/delete actions
 */
export const TrafficTable = () => {
  const dispatch = useDispatch();
  const filteredData = useSelector(selectFilteredData);
  const loading = useSelector(selectTrafficLoading);

  /**
   * Handle delete entry with confirmation
   * @param {string} id - Entry ID to delete
   */
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      dispatch(deleteTrafficEntry(id));
    }
  };

  /**
   * Format date for display (DD/MM/YYYY)
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ru-RU");
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <Loader size="lg" text="Loading traffic data..." />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Traffic Data</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Visits
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium">{item.visits}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => dispatch(openModal(item))}
                      className="text-blue-600 hover:text-blue-900 mr-4 transition"
                      aria-label="Edit entry"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-900 transition"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                  No entries found for the selected criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with count */}
      {filteredData.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 text-right text-sm text-gray-600">
          Showing {filteredData.length} entries
        </div>
      )}
    </div>
  );
};
