import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import ControlTower from './pages/ControlTower';
import FOResponses from './pages/FOResponses';
import RunnerDashboard from './pages/RunnerDashboard';
import TripDetails from './pages/TripDetails';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Redirect to role-based default route
  const getDefaultRoute = () => {
    switch (user.role) {
      case 'control_tower':
        return '/';
      case 'runner':
        return '/runner';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={getDefaultRoute()} replace />} />
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute allowedRoles={['control_tower']}>
              <ControlTower />
            </ProtectedRoute>
          }
        />
        <Route
          path="fo-responses"
          element={
            <ProtectedRoute allowedRoles={['control_tower']}>
              <FOResponses />
            </ProtectedRoute>
          }
        />
        <Route
          path="runner"
          element={
            <ProtectedRoute allowedRoles={['runner']}>
              <RunnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="trip/:id"
          element={
            <ProtectedRoute allowedRoles={['control_tower']}>
              <TripDetails />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;