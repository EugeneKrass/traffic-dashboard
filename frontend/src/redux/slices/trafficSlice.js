import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiService } from "../../services/api";
import {
  SAMPLE_DATA,
  VIEW_MODES,
  SORT_OPTIONS,
  SORT_ORDER,
} from "../../utils/constants";

/**
 * Initial state for traffic data management
 */
const initialState = {
  data: [],
  filteredData: [],
  loading: false,
  error: null,
  // Filter and sort settings
  viewMode: VIEW_MODES.DAILY,
  sortBy: SORT_OPTIONS.DATE,
  sortOrder: SORT_ORDER.ASC,
  dateRange: { start: "", end: "" },
  // Modal state
  modalOpen: false,
  editingEntry: null,
};

/**
 * Async thunk to fetch traffic data from API
 */
export const fetchTrafficData = createAsyncThunk(
  "traffic/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiService.getTrafficData();
      return data;
    } catch (error) {
      // Fallback to sample data if API fails
      console.warn("Using sample data due to API error:", error);
      return SAMPLE_DATA;
    }
  }
);

/**
 * Async thunk to create new traffic entry
 */
export const createTrafficEntry = createAsyncThunk(
  "traffic/createEntry",
  async (entryData, { rejectWithValue }) => {
    try {
      const newEntry = await apiService.createTrafficEntry(entryData);
      return newEntry;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk to update existing traffic entry
 */
export const updateTrafficEntry = createAsyncThunk(
  "traffic/updateEntry",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedEntry = await apiService.updateTrafficEntry(id, data);
      return updatedEntry;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Async thunk to delete traffic entry
 */
export const deleteTrafficEntry = createAsyncThunk(
  "traffic/deleteEntry",
  async (id, { rejectWithValue }) => {
    try {
      await apiService.deleteTrafficEntry(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Helper function to apply filters and sorting
 */
const applyFiltersAndSort = (state) => {
  let filtered = [...state.data];

  // Apply date range filter
  if (state.dateRange.start && state.dateRange.end) {
    filtered = filtered.filter(
      (item) =>
        item.date >= state.dateRange.start && item.date <= state.dateRange.end
    );
  }

  // Apply sorting
  filtered.sort((a, b) => {
    if (state.sortBy === SORT_OPTIONS.DATE) {
      return state.sortOrder === SORT_ORDER.ASC
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date);
    } else {
      return state.sortOrder === SORT_ORDER.ASC
        ? a.visits - b.visits
        : b.visits - a.visits;
    }
  });

  state.filteredData = filtered;
};

/**
 * Traffic slice with reducers and actions
 */
const trafficSlice = createSlice({
  name: "traffic",
  initialState,
  reducers: {
    // Set view mode (daily/weekly/monthly)
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    // Set sort field
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      applyFiltersAndSort(state);
    },
    // Toggle sort order
    toggleSortOrder: (state) => {
      state.sortOrder =
        state.sortOrder === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
      applyFiltersAndSort(state);
    },
    // Set date range filter
    setDateRange: (state, action) => {
      state.dateRange = action.payload;
      applyFiltersAndSort(state);
    },
    // Modal management
    openModal: (state, action) => {
      state.modalOpen = true;
      state.editingEntry = action.payload || null;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.editingEntry = null;
    },
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch data cases
    builder
      .addCase(fetchTrafficData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrafficData.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        applyFiltersAndSort(state);
      })
      .addCase(fetchTrafficData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create entry cases
      .addCase(createTrafficEntry.fulfilled, (state, action) => {
        state.data.push(action.payload);
        applyFiltersAndSort(state);
        state.modalOpen = false;
      })
      .addCase(createTrafficEntry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update entry cases
      .addCase(updateTrafficEntry.fulfilled, (state, action) => {
        const index = state.data.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
        }
        applyFiltersAndSort(state);
        state.modalOpen = false;
      })
      .addCase(updateTrafficEntry.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete entry cases
      .addCase(deleteTrafficEntry.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
        applyFiltersAndSort(state);
      })
      .addCase(deleteTrafficEntry.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  setViewMode,
  setSortBy,
  toggleSortOrder,
  setDateRange,
  openModal,
  closeModal,
  clearError,
} = trafficSlice.actions;

// Export selectors
export const selectTrafficData = (state) => state.traffic.data;
export const selectFilteredData = (state) => state.traffic.filteredData;
export const selectTrafficLoading = (state) => state.traffic.loading;
export const selectTrafficError = (state) => state.traffic.error;
export const selectViewMode = (state) => state.traffic.viewMode;
export const selectSortBy = (state) => state.traffic.sortBy;
export const selectSortOrder = (state) => state.traffic.sortOrder;
export const selectDateRange = (state) => state.traffic.dateRange;
export const selectModalOpen = (state) => state.traffic.modalOpen;
export const selectEditingEntry = (state) => state.traffic.editingEntry;

// Export reducer
export default trafficSlice.reducer;
