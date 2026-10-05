import { BookOpen, Server, Database, Shield } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Settings</h1>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary-600" /> Portal Information
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {[['Portal Name','EduVault'],['Version','1.0.0'],['Environment','Development'],['Storage Provider','Local']].map(([k,v])=>(
            <div key={k} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-400">{k}</p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" /> Security Settings
        </h2>
        <div className="space-y-3">
          {[['JWT Authentication','Enabled','green'],['Password Hashing (bcrypt)','12 rounds','green'],['Rate Limiting','300 req / 15 min','green'],['File Upload Limit','50 MB','blue'],['CORS','Configured','green']].map(([k,v,c])=>(
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{k}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c==='green'?'bg-green-100 text-green-700':'bg-blue-100 text-blue-700'}`}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-600" /> Database
        </h2>
        <div className="space-y-3">
          {[['Database','PostgreSQL 15'],['Connection Pooling','Max 20 connections'],['Full-Text Search','Enabled (tsvector)'],['Migrations','Run manually via npm run migrate']].map(([k,v])=>(
            <div key={k} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{k}</span>
              <span className="text-xs text-gray-500">{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-sm text-amber-800 font-medium">⚠️ Production Setup</p>
        <p className="text-xs text-amber-700 mt-1">Before deploying to production, update all environment variables in <code className="bg-amber-100 px-1 rounded">.env</code>, enable HTTPS, and configure a cloud storage provider.</p>
      </div>
    </div>
  );
}
