import { Link } from 'react-router-dom';
import { BookOpen, Search, Shield, Users, Download, Star, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  { icon: BookOpen,  title: 'Centralised Resources',   desc: 'Notes, question papers, assignments, and more — all in one place.' },
  { icon: Search,    title: 'Powerful Search',          desc: 'Find any resource instantly by subject, semester, department, or tag.' },
  { icon: Shield,    title: 'Secure & Role-Based',      desc: 'Students, faculty, and admins each have tailored access and controls.' },
  { icon: Download,  title: 'Easy Downloads',           desc: 'Download approved materials instantly. Track your history anytime.' },
  { icon: Users,     title: 'Faculty Uploads',          desc: 'Faculty can upload and manage study materials with approval workflow.' },
  { icon: Star,      title: 'Bookmarks & Notifications',desc: 'Bookmark favourites and get notified about new resources and events.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-primary-800 to-primary-600 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <Star className="w-4 h-4 text-yellow-300" />
            Academic Resource Hub for Modern Colleges
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Your College Resources,<br />
            <span className="text-primary-300">All in One Place</span>
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl mx-auto mb-10">
            EduVault is a professional digital portal where students access notes, question papers,
            lab manuals and more — while faculty and admins manage everything seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors">
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center px-4">
          {[['500+','Resources'],['8','Departments'],['1000+','Students'],['50+','Faculty']].map(([n,l]) => (
            <div key={l}>
              <p className="text-3xl font-extrabold text-primary-600">{n}</p>
              <p className="text-sm text-gray-500 mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need</h2>
            <p className="text-gray-500 mt-2">Designed for students, faculty, and administrators alike.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 hover:shadow-card-hover transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-primary-600 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-primary-100 mb-8">Join thousands of students and faculty on EduVault.</p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
          Create Free Account <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-primary-400" />
          <span className="text-white font-semibold">EduVault</span>
        </div>
        <p>© {new Date().getFullYear()} EduVault. College Resource Digital Portal.</p>
      </footer>
    </div>
  );
}
