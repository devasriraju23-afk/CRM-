import { NavLink } from 'react-router-dom';
import { X, BookOpen, LayoutDashboard, Library, Bookmark, Download, Megaphone, CalendarDays, Bell, User, Upload, BarChart2, Users, Building2, BookMarked, CheckSquare, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const studentNav = [
  { to: '/student',               label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/student/resources',     label: 'Resource Library', icon: Library },
  { to: '/student/bookmarks',     label: 'My Bookmarks',   icon: Bookmark },
  { to: '/student/downloads',     label: 'My Downloads',   icon: Download },
  { to: '/student/announcements', label: 'Announcements',  icon: Megaphone },
  { to: '/student/events',        label: 'Events',         icon: CalendarDays },
  { to: '/student/notifications', label: 'Notifications',  icon: Bell },
  { to: '/student/profile',       label: 'Profile',        icon: User },
];

const facultyNav = [
  { to: '/faculty',               label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/faculty/upload',        label: 'Upload Resource', icon: Upload },
  { to: '/faculty/resources',     label: 'My Resources',   icon: Library },
  { to: '/faculty/announcements', label: 'Announcements',  icon: Megaphone },
  { to: '/faculty/analytics',     label: 'Analytics',      icon: BarChart2 },
  { to: '/faculty/notifications', label: 'Notifications',  icon: Bell },
  { to: '/faculty/profile',       label: 'Profile',        icon: User },
];

const adminNav = [
  { to: '/admin',                 label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/admin/users',           label: 'Users',          icon: Users },
  { to: '/admin/departments',     label: 'Departments',    icon: Building2 },
  { to: '/admin/subjects',        label: 'Subjects',       icon: BookMarked },
  { to: '/admin/resources',       label: 'Resources',      icon: Library },
  { to: '/admin/approvals',       label: 'Approvals',      icon: CheckSquare },
  { to: '/admin/announcements',   label: 'Announcements',  icon: Megaphone },
  { to: '/admin/events',          label: 'Events',         icon: CalendarDays },
  { to: '/admin/notifications',   label: 'Notifications',  icon: Bell },
  { to: '/admin/analytics',       label: 'Analytics',      icon: BarChart2 },
  { to: '/admin/settings',        label: 'Settings',       icon: Settings },
];

const navMap = { student: studentNav, faculty: facultyNav, admin: adminNav };
const roleLabel = { student: 'Student Portal', faculty: 'Faculty Portal', admin: 'Admin Panel' };
const roleColor = { student: 'bg-primary-600', faculty: 'bg-emerald-600', admin: 'bg-violet-600' };

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth();
  const navItems = navMap[user?.role] || studentNav;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 shadow-lg
        transform transition-transform duration-300 ease-in-out flex flex-col
        lg:static lg:translate-x-0 lg:shadow-none
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className={`flex items-center justify-between h-16 px-4 ${roleColor[user?.role] || 'bg-primary-600'}`}>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-white" />
            <div>
              <p className="text-white font-bold text-sm leading-none">EduVault</p>
              <p className="text-white/70 text-xs">{roleLabel[user?.role] || 'Portal'}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/80 hover:text-white p-1" aria-label="Close sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar space-y-0.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/student' || to === '/faculty' || to === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-700">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            {user?.role === 'admin' && <ShieldCheck className="w-4 h-4 text-violet-500 shrink-0" />}
          </div>
        </div>
      </aside>
    </>
  );
}
