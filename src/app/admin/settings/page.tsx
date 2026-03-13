import { User, Bell, Shield, Smartphone, Globe, Save } from "lucide-react";

export default function AdminSettings() {
  const settings = [
    { title: "General Settings", description: "Manage site title, description, and metadata.", icon: Globe },
    { title: "Security & Auth", description: "Admin password, 2FA, and access control.", icon: Shield },
    { title: "Notifications", description: "Telegram bot, order alerts, and review alerts.", icon: Bell },
    { title: "System Info", description: "Database status, API connections, and storage.", icon: Smartphone },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Settings</h1>
          <p className="text-slate-500 font-medium tracking-tight">Configure your system preferences and integrations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-xl shadow-orange-500/20 hover:scale-105 transition-all duration-500 active:scale-95">
            <Save className="w-5 h-5 text-white" />
            Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {settings.map((setting, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group cursor-pointer">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                    <setting.icon className="w-6 h-6 group-hover:text-orange-500" />
                </div>
                <div>
                   <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase leading-none mb-1">{setting.title}</h3>
                   <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{setting.description}</p>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-orange-500 rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Connected</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
               <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center border border-slate-100 shadow-inner">
                    <User className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase">Profile Settings</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Update your admin profile information</p>
               </div>
          </div>

          <form className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Full Name</label>
                      <input type="text" defaultValue="Frozen Master" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-orange-500/10 transition-all" />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
                      <input type="email" defaultValue="frozen_admin_2026@frozen-market.ua" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-orange-500/10 transition-all opacity-50" disabled />
                  </div>
              </div>

              <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Admin Password</label>
                  <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 text-sm font-bold text-slate-900 focus:ring-4 focus:ring-orange-500/10 transition-all" />
              </div>
          </form>
      </div>
    </div>
  );
}
