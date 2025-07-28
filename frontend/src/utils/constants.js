/**
 * Sample traffic data for development/fallback
 * This data is used when API is unavailable or for initial testing
 */
export const SAMPLE_DATA = [
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

/**
 * View modes for traffic data visualization
 */
export const VIEW_MODES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
};

/**
 * Sort options for traffic table
 */
export const SORT_OPTIONS = {
  DATE: "date",
  VISITS: "visits",
};

/**
 * Sort order options
 */
export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

/**
 * Form validation rules
 */
export const VALIDATION_RULES = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters",
    },
  },
  date: {
    required: "Date is required",
  },
  visits: {
    required: "Number of visits is required",
    min: {
      value: 0,
      message: "Visits cannot be negative",
    },
    pattern: {
      value: /^\d+$/,
      message: "Visits must be a whole number",
    },
  },
};
