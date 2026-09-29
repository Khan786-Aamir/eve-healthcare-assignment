import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Centres from './pages/Centres';
import CentreDetails from './pages/Centres/CentreDetails';
import Bookings from './pages/Bookings';
import BookingForm from './pages/Bookings/BookingForm';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-slate-50">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/centres" element={
                <ProtectedRoute>
                  <Centres />
                </ProtectedRoute>
              } />
              
              <Route path="/centres/:id" element={
                <ProtectedRoute>
                  <CentreDetails />
                </ProtectedRoute>
              } />

              <Route path="/book/:testId/:centreId" element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              } />
              
              <Route path="/bookings" element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;