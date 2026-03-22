import React, { useState } from 'react';

type ViewState = 
  | 'portal_selection' 
  | 'admin_login' 
  | 'admin_workspace' 
  | 'enrollment' 
  | 'verification' 
  | 'listahan' 
  | 'success_registration' 
  | 'duplicate_error';

interface FieldConsoleProps {
  onBack: () => void;
}

const FieldConsole: React.FC<FieldConsoleProps> = ({ onBack }) => {
  const [view, setView] = useState<ViewState>('portal_selection');
  
  // Mock Data
  const [searchQuery, setSearchQuery] = useState('');
  
  const renderHeader = (title: string = "VeriFund", showDemo = true) => (
    <header className="bg-[#f7f9fe] dark:bg-slate-950 shadow-[0_8px_32px_rgba(0,56,168,0.06)] fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('portal_selection')}>
        <span className="material-symbols-outlined text-[#0038A8] dark:text-blue-400">account_balance</span>
        <h1 className="font-headline font-bold tracking-tight text-xl font-black text-[#0038A8] dark:text-blue-400">VeriFund</h1>
      </div>
      {showDemo && (
        <div className="flex items-center gap-4">
          <span className="text-[#0038A8] dark:text-blue-400 font-bold px-3 py-1 rounded-full bg-primary-fixed/30 text-xs">Demo Mode</span>
        </div>
      )}
    </header>
  );

  const renderBottomNav = (active: 'enroll' | 'verify' | 'list') => (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-[0_-4px_16px_rgba(0,56,168,0.04)] border-t border-[#c4c5d5]/15 rounded-t-2xl">
      <button 
        onClick={() => setView('enrollment')}
        className={`flex flex-col items-center justify-center py-1 px-4 transition-transform active:scale-90 ${active === 'enroll' ? 'bg-[#0038A8] text-white rounded-xl' : 'text-[#181c20] dark:text-slate-400'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: active === 'enroll' ? "'FILL' 1" : "'FILL' 0" }}>add_circle</span>
        <span className="font-headline text-xs font-bold mt-1">I-Enroll</span>
      </button>
      <button 
        onClick={() => setView('verification')}
        className={`flex flex-col items-center justify-center py-1 px-4 transition-transform active:scale-90 ${active === 'verify' ? 'bg-[#0038A8] text-white rounded-xl' : 'text-[#181c20] dark:text-slate-400'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: active === 'verify' ? "'FILL' 1" : "'FILL' 0" }}>qr_code_scanner</span>
        <span className="font-headline text-xs font-bold mt-1">I-Verify</span>
      </button>
      <button 
        onClick={() => setView('listahan')}
        className={`flex flex-col items-center justify-center py-1 px-4 transition-transform active:scale-90 ${active === 'list' ? 'bg-[#0038A8] text-white rounded-xl' : 'text-[#181c20] dark:text-slate-400'}`}
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: active === 'list' ? "'FILL' 1" : "'FILL' 0" }}>format_list_bulleted</span>
        <span className="font-headline text-xs font-bold mt-1">Listahan</span>
      </button>
    </nav>
  );

  // 1. Portal Selection View
  if (view === 'portal_selection') {
    return (
      <div className="bg-background font-body text-on-surface min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-fixed opacity-20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-tertiary-fixed opacity-30 rounded-full blur-[120px]"></div>
          <div className="max-w-4xl w-full z-10">
            <div className="flex flex-col items-center mb-16 space-y-4">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-4xl text-primary-container">account_balance</span>
                <h1 className="text-4xl font-black tracking-tight text-primary-container font-headline">VeriFund</h1>
              </div>
              <div className="h-1 w-12 bg-tertiary-container rounded-full"></div>
              <h2 className="text-on-surface-variant font-medium tracking-wide">PUMILI NG PORTAL NA NAIS PASUKIN</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <button 
                onClick={onBack}
                className="group flex flex-col text-left bg-surface-container-lowest rounded-xl p-8 transition-all duration-300 shadow-[0_8px_32px_rgba(0,56,168,0.04)] border-b-4 border-transparent hover:border-primary-container active:scale-[0.98]"
              >
                <div className="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl text-primary">person</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">Portal ng Mamamayan</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">Mag-apply para sa pondo, tingnan ang katayuan ng iyong aplikasyon, at i-verify ang iyong pagkakakilanlan.</p>
                <div className="mt-auto flex items-center text-primary font-bold">
                  <span>Pumasok sa Portal</span>
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </button>
              <button 
                onClick={() => setView('admin_login')}
                className="group flex flex-col text-left bg-surface-container-lowest rounded-xl p-8 transition-all duration-300 shadow-[0_8px_32px_rgba(0,56,168,0.04)] border-b-4 border-transparent hover:border-tertiary-container active:scale-[0.98]"
              >
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl text-tertiary">admin_panel_settings</span>
                </div>
                <h3 className="text-2xl font-bold text-on-surface mb-2 font-headline">Portal ng Admin</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6">Pamahalaan ang mga aplikasyon, mag-apruba ng mga benepisyaryo, at suriin ang mga ulat ng pondo.</p>
                <div className="mt-auto flex items-center text-tertiary font-bold">
                  <span>Admin Access</span>
                  <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform">shield</span>
                </div>
              </button>
            </div>
            <div className="mt-16 text-center space-y-6">
              <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-on-surface-variant">
                <a className="hover:text-primary transition-colors" href="#">Tulong at Suporta</a>
                <span className="text-outline-variant opacity-30">•</span>
                <a className="hover:text-primary transition-colors" href="#">Patakaran sa Privacy</a>
                <span className="text-outline-variant opacity-30">•</span>
                <a className="hover:text-primary transition-colors" href="#">Mga Tuntunin</a>
              </div>
              <p className="text-xs text-outline font-medium tracking-widest uppercase">Republika ng Pilipinas • VeriFund Framework</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 2. Admin Login View
  if (view === 'admin_login') {
    return (
      <div className="bg-background font-body text-on-surface antialiased min-h-screen flex flex-col overflow-x-hidden">
        <main className="flex-grow flex items-center justify-center px-6 py-20 relative overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-primary-fixed/30 rounded-full blur-[120px] -z-10"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-secondary-fixed/20 rounded-full blur-[100px] -z-10"></div>
          <div className="w-full max-w-[440px] z-10">
            <div className="mb-12 text-center md:text-left">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-12 vinta-gradient flex items-center justify-center rounded-xl shadow-[0_8px_32px_rgba(0,56,168,0.12)] bg-gradient-to-br from-[#002576] to-[#0038a8]">
                  <span className="material-symbols-outlined text-white text-2xl">account_balance</span>
                </div>
                <span className="text-2xl font-black text-primary tracking-tighter">VeriFund</span>
              </div>
              <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight leading-tight mb-3">Admin Login</h1>
              <p className="text-on-surface-variant font-medium">Ipasok ang iyong mga kredensyal para sa ligtas na pag-access.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_8px_32px_rgba(0,56,168,0.06)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-tertiary-fixed"></div>
              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setView('admin_workspace'); }}>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-primary uppercase tracking-wider" htmlFor="username">Pangalan ng User</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">person</span>
                    </div>
                    <input className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none border-b-2 border-surface-dim focus:ring-0 focus:border-primary focus:bg-primary-fixed/10 transition-all rounded-t-lg font-medium text-on-surface" id="username" name="username" placeholder="Hal. juan_delacruz" type="text" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold text-primary uppercase tracking-wider" htmlFor="password">Password</label>
                    <a className="text-xs font-bold text-secondary hover:text-on-secondary-fixed-variant transition-colors" href="#">Nakalimutan?</a>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                    </div>
                    <input className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-none border-b-2 border-surface-dim focus:ring-0 focus:border-primary focus:bg-primary-fixed/10 transition-all rounded-t-lg font-medium text-on-surface" id="password" name="password" placeholder="••••••••" type="password" />
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-[#002576] to-[#0038a8] text-white py-4 px-6 rounded-xl font-bold text-lg shadow-[0_8px_20px_rgba(0,37,118,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
                  Mag-login sa System
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Admin Workspace View
  if (view === 'admin_workspace') {
    return (
      <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
        {renderHeader("Admin Workspace", false)}
        <main className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4">Admin Workspace</h1>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">Pumili ng workspace na gagamitin para sa iyong mga operasyon at pagsusuri ng datos.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
            <button 
              onClick={() => setView('enrollment')}
              className="group relative flex flex-col items-start p-8 bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(0,56,168,0.06)] border-l-4 border-primary-container text-left transition-all hover:scale-[1.02] active:scale-95 duration-300 overflow-hidden"
            >
              <div className="bg-tertiary-container p-4 rounded-full mb-6">
                <span className="material-symbols-outlined text-on-tertiary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>construction</span>
              </div>
              <h2 className="text-2xl font-bold text-primary-container mb-3">Field Console</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">Gamitin ito para sa on-the-ground enrollment, verification, at listahan ng mga miyembro sa bawat komunidad.</p>
              <div className="flex items-center gap-2 text-primary-container font-bold">
                <span>Pumasok sa Console</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </button>
            <button className="group relative flex flex-col items-start p-8 bg-surface-container-lowest rounded-xl shadow-[0_4px_16px_rgba(0,56,168,0.04)] text-left transition-all hover:shadow-[0_8px_32px_rgba(0,56,168,0.08)] hover:scale-[1.02] active:scale-95 duration-300 overflow-hidden">
              <div className="bg-surface-container-high p-4 rounded-full mb-6 group-hover:bg-tertiary-fixed transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant text-3xl group-hover:text-on-tertiary-fixed transition-colors">dashboard</span>
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-3">Dashboard</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">Suriin ang kabuuang datos, bumuo ng mga ulat, at bantayan ang daloy ng pondo sa real-time.</p>
              <div className="flex items-center gap-2 text-on-surface-variant font-bold group-hover:text-primary transition-colors">
                <span>Buksan ang Dashboard</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </button>
          </div>
          <div className="mt-16 bg-surface-container-low p-6 rounded-full flex items-center gap-4 max-w-xl">
            <div className="h-10 w-10 rounded-full overflow-hidden bg-surface-container-highest">
              <img alt="Admin Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlAWE_gU5-3YkTiqqqfvKhMGo-57y4L3oGD9uFun--nBV4M95Io5T5knR6Z7EnqK6iDReO2_ixYvIRvFlkcw-x0oO4ZUOqXhgHTV866tdjGn9yUtg-2tdZaa-WrYy27NwiXA0Sk8cBtGu5S5rMfdFBVh5yuWpue7n8R4OmzsYMHa3xWLckXp7nTMLvYPowrGkBi7hMit4O7E6laQp2hPN5xNpJgp7ACgQEWmwLY4yj0r7gU2J2f6jRV97VoP4HoE2bnEhYcHMNLcRo" />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-on-surface">Juan Dela Cruz</p>
              <p className="text-xs text-on-surface-variant">Regional Supervisor - NCR</p>
            </div>
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Verified</span>
          </div>
        </main>
      </div>
    );
  }

  // 4. Enrollment View
  if (view === 'enrollment') {
    return (
      <div className="bg-surface text-on-surface min-h-screen pb-32">
        {renderHeader()}
        <main className="pt-24 px-6 max-w-2xl mx-auto">
          <section className="mb-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">I-Enroll</h2>
            <p className="text-on-surface-variant font-medium">Mag-rehistro ng bagong miyembro sa systema.</p>
          </section>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm group active:scale-95 transition-all cursor-pointer border-b-2 border-surface-dim">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-3xl">badge</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-on-surface">ID Photo</p>
                  <p className="text-xs text-on-surface-variant mt-1">Kuhanan ang harap ng ID</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm group active:scale-95 transition-all cursor-pointer border-b-2 border-surface-dim">
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-3xl">face</span>
                </div>
                <div className="text-center">
                  <p className="font-bold text-on-surface">Face Photo</p>
                  <p className="text-xs text-on-surface-variant mt-1">Kuhanan ang mukha</p>
                </div>
              </div>
            </div>
          </section>
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); setView('success_registration'); }}>
            <div className="space-y-6 bg-surface-container-low p-8 rounded-2xl">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">person</span> Personal na Impormasyon
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 px-1">Buong Pangalan</label>
                  <input className="w-full bg-surface-container-lowest border-none border-b-2 border-surface-dim focus:border-primary focus:ring-0 text-lg p-4 rounded-t-lg transition-colors" placeholder="Hal: Juan Dela Cruz" type="text" />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2 px-1">Petsa ng Kapanganakan</label>
                  <input className="w-full bg-surface-container-lowest border-none border-b-2 border-surface-dim focus:border-primary focus:ring-0 text-lg p-4 rounded-t-lg transition-colors" type="date" />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button className="w-full bg-gradient-to-r from-[#002576] to-[#0038a8] text-white font-bold py-5 rounded-xl shadow-[0_8px_32px_rgba(0,56,168,0.15)] active:scale-95 transition-transform flex items-center justify-center gap-3" type="submit">
                <span className="material-symbols-outlined">how_to_reg</span> I-SUBMIT ANG REGISTRATION
              </button>
            </div>
          </form>
        </main>
        {renderBottomNav('enroll')}
      </div>
    );
  }

  // 5. Verification View
  if (view === 'verification') {
    return (
      <div className="bg-background text-on-surface antialiased min-h-screen">
        {renderHeader()}
        <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">I-Verify</h2>
            <p className="text-on-surface-variant text-lg">I-scan ang QR code ng benepisyaryo para sa mabilis na beripikasyon.</p>
          </div>
          <div 
            onClick={() => setView('duplicate_error')}
            className="relative aspect-square w-full max-w-md mx-auto overflow-hidden rounded-3xl bg-slate-900 shadow-2xl group border-4 border-surface-container-lowest cursor-pointer"
          >
            <img alt="Blurred scanning background" className="w-full h-full object-cover opacity-60 scale-110 blur-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyMU9PRQ-Ju9VwVKSxERSJq89Q0xqr8CpjpDTMOQyC5Dg1uKEFjk8CKRzw6SYK6OeEgyG_vWzECjip9uiyrK2_xawS59hX71aFOFxlGzkm6iCHdksqMZB8Uk_Y6_cJI5hXg7cSkwT7791ifp-o4fTOHsX9u9P49oftpl6YfgULfZIhxlwh2W5CyMHizStf-nguE_xa7ru2EN83ifkaVb5ojhrrLi0OzzPuoqpFfBdkSFdiXywbsOWlS_cyY0HK62E8XmM2FqKuu29a" />
            <div className="absolute inset-0 p-12">
              <div className="relative w-full h-full">
                <div className="absolute top-0 left-0 w-10 h-10 border-t-[6px] border-l-[6px] border-[#0038A8] rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-10 h-10 border-t-[6px] border-r-[6px] border-[#0038A8] rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[6px] border-l-[6px] border-tertiary-container rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[6px] border-r-[6px] border-tertiary-container rounded-br-2xl"></div>
                <div className="absolute top-0 left-4 right-4 h-1 bg-gradient-to-r from-transparent via-primary-fixed-dim to-transparent opacity-50 shadow-[0_0_15px_rgba(182,196,255,0.8)] animate-scan"></div>
              </div>
            </div>
            <div className="absolute bottom-8 w-full text-center">
              <span className="bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">I-sentro ang QR Code</span>
            </div>
          </div>
          <div className="mt-12 space-y-4">
            <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-tertiary-fixed">
              <div className="flex items-start gap-4">
                <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm">
                  <span className="material-symbols-outlined text-primary">info</span>
                </div>
                <div>
                  <h3 className="text-on-surface font-bold text-lg leading-tight">Handa na sa Pag-scan</h3>
                  <p className="text-on-surface-variant text-sm mt-1">Awtomatikong lalabas dito ang detalye ng benepisyaryo pagkatapos ma-detect ang code.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        {renderBottomNav('verify')}
      </div>
    );
  }

  // 6. Listahan View
  if (view === 'listahan') {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
        {renderHeader()}
        <main className="flex-1 mt-16 mb-32 px-6 pt-8 max-w-2xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Listahan Ngayon</h2>
            <div className="bg-surface-container-lowest px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-sm text-outline">calendar_today</span>
              <span className="text-xs font-bold">Okt 24, 2023</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-primary p-5 rounded-2xl text-white flex flex-col justify-between aspect-[1.5/1]">
              <span className="material-symbols-outlined opacity-80">group</span>
              <div>
                <div className="text-3xl font-black">128</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Kabuuang Tao</div>
              </div>
            </div>
            <div className="bg-tertiary-fixed p-5 rounded-2xl text-on-tertiary-fixed flex flex-col justify-between aspect-[1.5/1]">
              <span className="material-symbols-outlined opacity-80">payments</span>
              <div>
                <div className="text-3xl font-black">₱45k</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-70">Naipamahagi</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { init: 'JD', name: 'Juan Dela Cruz', time: '08:45 AM', brgy: 'Brgy. Uno', status: 'Nakuha', color: 'bg-green-100 text-green-800' },
              { init: 'MS', name: 'Maria Santos', time: '09:12 AM', brgy: 'Brgy. Dos', status: 'Tinanggihan', color: 'bg-secondary-container text-on-secondary-container' },
              { init: 'RP', name: 'Ricardo Patag', time: '09:30 AM', brgy: 'Brgy. Tres', status: 'Nakuha', color: 'bg-green-100 text-green-800' },
              { init: 'EL', name: 'Elena Luna', time: '10:05 AM', brgy: 'Brgy. Uno', status: 'Nakuha', color: 'bg-green-100 text-green-800' },
            ].map((item, idx) => (
              <div key={idx} className="bg-surface-container-lowest p-3 rounded-2xl flex items-center justify-between border-l-4 border-tertiary-fixed">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed font-bold text-sm">{item.init}</div>
                  <div>
                    <div className="text-[#0038A8] font-bold text-sm">{item.name}</div>
                    <div className="text-[10px] text-on-surface-variant font-medium">{item.time} • {item.brgy}</div>
                  </div>
                </div>
                <span className={`${item.color} text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter`}>{item.status}</span>
              </div>
            ))}
          </div>
        </main>
        <div className="fixed bottom-24 left-0 w-full px-6 pointer-events-none">
          <div className="bg-[#002576] text-white p-4 rounded-3xl shadow-2xl flex items-center justify-between pointer-events-auto">
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-xs opacity-60 font-bold uppercase tracking-tighter">Natapos</div>
                <div className="text-lg font-black leading-none">84</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <div className="text-xs opacity-60 font-bold uppercase tracking-tighter">Naiwan</div>
                <div className="text-lg font-black leading-none">44</div>
              </div>
            </div>
            <button className="bg-tertiary-fixed text-on-tertiary-fixed px-5 py-2 rounded-2xl font-black text-xs uppercase tracking-tight shadow-lg active:scale-95 transition-transform">
              I-download
            </button>
          </div>
        </div>
        {renderBottomNav('list')}
      </div>
    );
  }

  // 7. Success Registration View
  if (view === 'success_registration') {
    return (
      <div className="bg-background font-body text-on-surface min-h-screen flex flex-col">
        {renderHeader("Success Registration")}
        <main className="flex-grow pt-24 pb-32 px-6 max-w-lg mx-auto w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed mb-4">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">Success Registration</h2>
            <p className="text-on-surface-variant font-medium">Matagumpay na nairerehistro ang iyong impormasyon sa systema.</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_8px_32px_rgba(0,56,168,0.06)] overflow-hidden">
            <div className="p-8 flex flex-col items-center border-b-2 border-dashed border-surface-container">
              <div className="bg-white p-4 rounded-xl shadow-inner border border-outline-variant/15">
                <img alt="QR Code" className="w-60 h-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnZcfavZh3z5THNkkwxF9H3TIsn2op6JWcWMHBihT-9_0IzwbwtnZNhFVJ8YYmFZVmqlYTh_ZurNLCIbCfq4xKsr2HeyT5AU-7OIIdLxZ8get66jwW4woOiyNJ9a-cDd3pvSEJYB8Sdr44RiakM3G6IeFyB35yuBRYJ4ottU2_0exgcjzRx-ZqyUIXz1TROAj-p8MKMzV06oymLYb8g1Ch70RTqMBd4cWX1tmuLkPJnVLPKFm8Ct27G772q1kd3aQi-frOFXuEn1kv" />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-outline">Scan to Verify</p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Pangalan</label>
                <p className="text-xl font-bold text-on-surface">JUAN DELA CRUZ JR.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">ID Number</label>
                  <p className="text-lg font-bold text-primary">PH-2024-9912</p>
                </div>
                <div className="text-right">
                  <label className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Status</label>
                  <span className="inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span> VERIFIED
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 space-y-3">
            <button 
              onClick={() => setView('enrollment')}
              className="w-full bg-gradient-to-r from-[#002576] to-[#0038a8] text-white font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Bumalik sa Pag-enroll
            </button>
          </div>
        </main>
      </div>
    );
  }

  // 8. Duplicate Error View
  if (view === 'duplicate_error') {
    return (
      <div className="bg-background font-body text-on-surface antialiased min-h-screen">
        {renderHeader()}
        <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface">Duplicate Error</h2>
            <p className="text-on-surface-variant mt-2">Natuklasan ang isang umiiral na claim sa system.</p>
          </div>
          <div className="bg-secondary-container rounded-xl p-6 mb-8 shadow-lg flex items-start gap-4 border-l-8 border-secondary">
            <span className="material-symbols-outlined text-white text-3xl shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <div>
              <h3 className="text-white font-headline font-black text-xl tracking-wide">MALI: DUPLICATE CLAIM ATTEMPT</h3>
              <p className="text-white/90 font-medium mt-1">Ang indibidwal na ito ay nakatanggap na ng pondo para sa kasalukuyang batch.</p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl overflow-hidden mb-6">
            <div className="p-6 bg-surface-container-high border-b border-outline-variant/15 flex justify-between items-center">
              <span className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Impormasyon ng Recipient</span>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>history</span> NA-PROSESO NA
              </span>
            </div>
            <div className="p-8 space-y-6 bg-surface-container-lowest">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-container-highest border-2 border-primary-fixed">
                  <img alt="Recipient" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABs5kul-aOmmZtRHMADzT2w7hjGxmjkdJMAYjqLEwny-xtaGTtldOpE7JKJ3PQMFOdDJdWl4P23T3Y7ob_U7-mE_S4eJrOJJHCwdSXUswZgbTFhbgMSLE4tO-HL6En2Z5QVW0PD0WuqrCB12g-95a7mxVUKIF6VlSXHYMR3t47Dfam3AU5jMthw5gvzOY8rMzAbQYUpc7uQbJK9gDXDYCIMYciwAdbrHH4m7uWiPdcJv7bycp27ici_wraHFeP5m8rYHcFe-BzP2UL" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-on-surface">Elena M. Santos</h4>
                  <p className="text-on-surface-variant font-medium">National ID: ****-****-9021</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low border-b-2 border-surface-dim">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">Petsa ng Pag-claim</p>
                  <p className="text-lg font-bold text-on-surface">October 24, 2023</p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low border-b-2 border-surface-dim">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter mb-1">Lokasyon</p>
                  <p className="text-lg font-bold text-on-surface">Brgy. Hall - District 4</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setView('verification')}
              className="bg-gradient-to-r from-[#002576] to-[#0038a8] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 duration-200 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">refresh</span> MAG-SCAN MULI
            </button>
          </div>
        </main>
        {renderBottomNav('verify')}
      </div>
    );
  }

  return null;
};

export default FieldConsole;
