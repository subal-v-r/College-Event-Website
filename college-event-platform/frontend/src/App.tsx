import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Events = lazy(() => import('./pages/Events'));
const EventDetail = lazy(() => import('./pages/EventDetail'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Speakers = lazy(() => import('./pages/Speakers'));
const Registration = lazy(() => import('./pages/Registration'));
const MyRegistrations = lazy(() => import('./pages/MyRegistrations'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Contact = lazy(() => import('./pages/Contact'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Login = lazy(() => import('./pages/Login'));
const RegisterPage = lazy(() => import('./pages/Register'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminEvents = lazy(() => import('./pages/admin/Events'));
const AdminSchedules = lazy(() => import('./pages/admin/Schedules'));
const AdminSpeakers = lazy(() => import('./pages/admin/Speakers'));
const AdminAnnouncements = lazy(() => import('./pages/admin/Announcements'));
const AdminRegistrations = lazy(() => import('./pages/admin/Registrations'));

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </>
);

const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Public routes with Navbar + Footer */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
          <Route path="/events/:id" element={<PublicLayout><EventDetail /></PublicLayout>} />
          <Route path="/schedule" element={<PublicLayout><Schedule /></PublicLayout>} />
          <Route path="/speakers" element={<PublicLayout><Speakers /></PublicLayout>} />
          <Route path="/announcements" element={<PublicLayout><Announcements /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-account" element={<RegisterPage />} />

          {/* Protected student routes */}
          <Route path="/register" element={<PublicLayout><ProtectedRoute><Registration /></ProtectedRoute></PublicLayout>} />
          <Route path="/my-registrations" element={<PublicLayout><ProtectedRoute><MyRegistrations /></ProtectedRoute></PublicLayout>} />

          {/* Admin routes (no public layout) */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute requireAdmin><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/schedules" element={<ProtectedRoute requireAdmin><AdminSchedules /></ProtectedRoute>} />
          <Route path="/admin/speakers" element={<ProtectedRoute requireAdmin><AdminSpeakers /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute requireAdmin><AdminAnnouncements /></ProtectedRoute>} />
          <Route path="/admin/registrations" element={<ProtectedRoute requireAdmin><AdminRegistrations /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <PublicLayout>
              <div className="min-h-screen flex items-center justify-center text-center px-4">
                <div>
                  <div className="text-8xl font-display font-black text-gradient mb-4">404</div>
                  <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
                  <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="btn-primary">Go Home</a>
                </div>
              </div>
            </PublicLayout>
          } />
        </Routes>
      </Suspense>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0f172a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
