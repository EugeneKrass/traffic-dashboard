import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { TrendingUp, LogOut } from "lucide-react";
import { auth } from "./services/firebase";
import {
  setUser,
  selectUser,
  selectAuthLoading,
  logoutUser,
} from "./redux/slices/authSlice";
import { fetchTrafficData } from "./redux/slices/trafficSlice";
import { LoginForm } from "./components/Auth";
import {
  FilterControls,
  TrafficChart,
  TrafficTable,
  AddEditModal,
} from "./components/Dashboard";
import { Loader, Button } from "./components/UI";

/**
 * Main App component
 * Orchestrates authentication state and conditionally renders login or dashboard
 */
function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const loading = useSelector(selectAuthLoading);

  /**
   * Monitor Firebase auth state changes
   * Sets user in Redux store when auth state changes
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          })
        );
        // Fetch traffic data when user logs in
        dispatch(fetchTrafficData());
      } else {
        // User is signed out
        dispatch(setUser(null));
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [dispatch]);

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Show loading screen while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Show dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Traffic Dashboard
              </h1>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Controls */}
        <FilterControls />

        {/* Traffic Chart */}
        <TrafficChart />

        {/* Traffic Table */}
        <TrafficTable />

        {/* Add/Edit Modal */}
        <AddEditModal />
      </main>
    </div>
  );
}

export default App;
