import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  selectFilteredData,
  selectViewMode,
} from "../../redux/slices/trafficSlice";
import { VIEW_MODES } from "../../utils/constants";

/**
 * Traffic data visualization component
 * Displays line chart with daily/weekly/monthly aggregation
 */
export const TrafficChart = () => {
  const filteredData = useSelector(selectFilteredData);
  const viewMode = useSelector(selectViewMode);

  /**
   * Aggregate data based on view mode
   * @returns {Array} Aggregated data for chart
   */
  const getAggregatedData = () => {
    if (viewMode === VIEW_MODES.DAILY) return filteredData;

    const aggregated = {};

    filteredData.forEach((item) => {
      const date = new Date(item.date);
      let key;

      if (viewMode === VIEW_MODES.WEEKLY) {
        // Get start of week (Sunday)
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split("T")[0];
      } else {
        // Monthly aggregation
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

    // Calculate averages for weekly view
    return Object.values(aggregated).map((item) => ({
      date: item.date,
      visits:
        viewMode === VIEW_MODES.WEEKLY
          ? Math.round(item.visits / item.count)
          : item.visits,
    }));
  };

  const chartData = getAggregatedData();

  /**
   * Custom tooltip for chart
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-medium">{`Date: ${label}`}</p>
          <p className="text-sm text-blue-600">
            {`Visits: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  /**
   * Format X-axis labels based on view mode
   */
  const formatXAxisLabel = (tickItem) => {
    if (viewMode === VIEW_MODES.MONTHLY) {
      const [year, month] = tickItem.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    return tickItem;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">
        Traffic Overview ({viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
        )
      </h2>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              style={{ fontSize: "12px" }}
            />
            <YAxis style={{ fontSize: "12px" }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="visits"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: "#3B82F6", r: 4 }}
              activeDot={{ r: 6 }}
              name="Visits"
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No data available for the selected period
        </div>
      )}
    </div>
  );
};
