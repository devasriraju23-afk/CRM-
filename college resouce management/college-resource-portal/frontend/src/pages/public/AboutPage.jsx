import { BookOpen, Users, Shield, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">About EduVault</h1>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
          EduVault is a modern college resource portal that centralises academic materials for students, faculty, and administrators.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Users,  title: 'For Everyone',    desc: 'Tailored dashboards for students, faculty, and administrators.' },
          { icon: Shield, title: 'Secure & Private', desc: 'Role-based access, JWT auth, and safe file handling.' },
          { icon: Zap,    title: 'Fast & Reliable',  desc: 'PostgreSQL-backed, optimised search with full-text indexing.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-6 text-center">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>

      <div className="card p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['React 18 + Vite','Tailwind CSS','React Router v6','Node.js + Express','PostgreSQL 15','JWT + bcrypt','Multer (file uploads)','Winston (logging)','Recharts (analytics)'].map(t => (
            <div key={t} className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
              <span className="text-sm text-gray-700">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
