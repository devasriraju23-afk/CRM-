import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Layouts
import PublicLayout    from '../layouts/PublicLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';

// Public pages
import LandingPage  from '../pages/public/LandingPage.jsx';
import LoginPage    from '../pages/public/LoginPage.jsx';
import RegisterPage from '../pages/public/RegisterPage.jsx';
import AboutPage    from '../pages/public/AboutPage.jsx';

// Student pages
import StudentDashboard    from '../pages/student/StudentDashboard.jsx';
import ResourceLibrary     from '../pages/student/ResourceLibrary.jsx';
import ResourceDetail      from '../pages/student/ResourceDetail.jsx';
import MyBookmarks         from '../pages/student/MyBookmarks.jsx';
import MyDownloads         from '../pages/student/MyDownloads.jsx';
import AnnouncementsPage   from '../pages/student/AnnouncementsPage.jsx';
import EventsPage          from '../pages/student/EventsPage.jsx';
import NotificationsPage   from '../pages/student/NotificationsPage.jsx';
import ProfilePage         from '../pages/student/ProfilePage.jsx';

// Faculty pages
import FacultyDashboard    from '../pages/faculty/FacultyDashboard.jsx';
import UploadResource      from '../pages/faculty/UploadResource.jsx';
import MyResources         from '../pages/faculty/MyResources.jsx';
import EditResource        from '../pages/faculty/EditResource.jsx';
import FacultyAnalytics    from '../pages/faculty/FacultyAnalytics.jsx';
import FacultyProfile      from '../pages/faculty/FacultyProfile.jsx';

// Admin pages
import AdminDashboard      from '../pages/admin/AdminDashboard.jsx';
import UserManagement      from '../pages/admin/UserManagement.jsx';
import DepartmentManagement from '../pages/admin/DepartmentManagement.jsx';
import SubjectManagement   from '../pages/admin/SubjectManagement.jsx';
import ResourceManagement  from '../pages/admin/ResourceManagement.jsx';
import ResourceApprovals   from '../pages/admin/ResourceApprovals.jsx';
import AdminAnnouncements  from '../pages/admin/AdminAnnouncements.jsx';
import AdminEvents         from '../pages/admin/AdminEvents.jsx';
import AdminNotifications  from '../pages/admin/AdminNotifications.jsx';
import AdminAnalytics      from '../pages/admin/AdminAnalytics.jsx';
import AdminSettings       from '../pages/admin/AdminSettings.jsx';

// Guards
const RequireAuth = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" /></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/unauthorized" replace />;
  return children;
};

const RedirectIfAuth = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    if (user?.role === 'admin')   return <Navigate to="/admin"   replace />;
    if (user?.role === 'faculty') return <Navigate to="/faculty" replace />;
    return <Navigate to="/student" replace />;
  }
  return children;
};

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<RedirectIfAuth><LandingPage /></RedirectIfAuth>} />
        <Route path="/login"    element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><RegisterPage /></RedirectIfAuth>} />
        <Route path="/about"    element={<AboutPage />} />
        <Route path="/unauthorized" element={<div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">403 — Access Denied</div>} />
      </Route>

      {/* Student */}
      <Route path="/student" element={<RequireAuth roles={['student']}><DashboardLayout /></RequireAuth>}>
        <Route index                element={<StudentDashboard />} />
        <Route path="resources"     element={<ResourceLibrary />} />
        <Route path="resources/:id" element={<ResourceDetail />} />
        <Route path="bookmarks"     element={<MyBookmarks />} />
        <Route path="downloads"     element={<MyDownloads />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="events"        element={<EventsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile"       element={<ProfilePage />} />
      </Route>

      {/* Faculty */}
      <Route path="/faculty" element={<RequireAuth roles={['faculty']}><DashboardLayout /></RequireAuth>}>
        <Route index                element={<FacultyDashboard />} />
        <Route path="upload"        element={<UploadResource />} />
        <Route path="resources"     element={<MyResources />} />
        <Route path="resources/:id/edit" element={<EditResource />} />
        <Route path="analytics"     element={<FacultyAnalytics />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="profile"       element={<FacultyProfile />} />
        <Route path="resources/:id" element={<ResourceDetail />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      {/* Admin */}
      <Route path="/admin" element={<RequireAuth roles={['admin']}><DashboardLayout /></RequireAuth>}>
        <Route index                    element={<AdminDashboard />} />
        <Route path="users"             element={<UserManagement />} />
        <Route path="departments"       element={<DepartmentManagement />} />
        <Route path="subjects"          element={<SubjectManagement />} />
        <Route path="resources"         element={<ResourceManagement />} />
        <Route path="approvals"         element={<ResourceApprovals />} />
        <Route path="announcements"     element={<AdminAnnouncements />} />
        <Route path="events"            element={<AdminEvents />} />
        <Route path="notifications"     element={<AdminNotifications />} />
        <Route path="analytics"         element={<AdminAnalytics />} />
        <Route path="settings"          element={<AdminSettings />} />
        <Route path="resources/:id"     element={<ResourceDetail />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
