import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { Button } from "../UI";
import {
  setViewMode,
  setSortBy,
  toggleSortOrder,
  setDateRange,
  openModal,
  selectViewMode,
  selectSortBy,
  selectSortOrder,
  selectDateRange,
} from "../../redux/slices/trafficSlice";
import { VIEW_MODES, SORT_OPTIONS } from "../../utils/constants";

/**
 * Filter controls component for traffic dashboard
 * Manages view mode, sorting, date range filtering
 */
export const FilterControls = () => {
  const dispatch = useDispatch();

  // Get current filter states from Redux
  const viewMode = useSelector(selectViewMode);
  const sortBy = useSelector(selectSortBy);
  const sortOrder = useSelector(selectSortOrder);
  const dateRange = useSelector(selectDateRange);

  /**
   * Handle date range change
   * @param {string} field - 'start' or 'end'
   * @param {string} value - Date value
   */
  const handleDateRangeChange = (field, value) => {
    dispatch(
      setDateRange({
        ...dateRange,
        [field]: value,
      })
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Filter Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* View Mode Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            View Mode
          </label>
          <select
            value={viewMode}
            onChange={(e) => dispatch(setViewMode(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={VIEW_MODES.DAILY}>Daily</option>
            <option value={VIEW_MODES.WEEKLY}>Weekly</option>
            <option value={VIEW_MODES.MONTHLY}>Monthly</option>
          </select>
        </div>

        {/* Sort By Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value={SORT_OPTIONS.DATE}>Date</option>
            <option value={SORT_OPTIONS.VISITS}>Visits</option>
          </select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => handleDateRangeChange("start", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* End Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => handleDateRangeChange("end", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between items-center">
        {/* Sort Order Toggle */}
        <button
          onClick={() => dispatch(toggleSortOrder())}
          className="text-sm text-blue-600 hover:underline"
        >
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </button>

        {/* Add Entry Button */}
        <Button
          variant="primary"
          onClick={() => dispatch(openModal())}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Entry</span>
        </Button>
      </div>
    </div>
  );
};
