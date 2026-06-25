import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts & Protection
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminRoute from './routes/AdminRoute';
import PageTransition from './components/PageTransition';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import Howitworks from './pages/Howitworks';
import Contact from './pages/Contact';
import Terms from './pages/Terms';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Analytics from './pages/admin/Analytics';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* PUBLIC CUSTOMER ROUTES */}
        <Route path="/" element={<MainLayout><PageTransition><Home /></PageTransition></MainLayout>} />
        <Route path="/products" element={<MainLayout><PageTransition><Products /></PageTransition></MainLayout>} />
        <Route path="/contact" element={<MainLayout><PageTransition><Contact /></PageTransition></MainLayout>} />
        <Route path="/how-it-works" element={<MainLayout><PageTransition><Howitworks /></PageTransition></MainLayout>} />
        <Route path="/terms" element={<MainLayout><PageTransition><Terms /></PageTransition></MainLayout>} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="inventory" element={<PageTransition><Inventory /></PageTransition>} />
          <Route path="analytics" element={<PageTransition><Analytics /></PageTransition>} />
        </Route>

      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;