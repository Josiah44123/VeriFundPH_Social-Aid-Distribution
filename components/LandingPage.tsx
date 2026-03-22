import React, { useRef } from "react";
import {
  ShieldCheck,
  Users,
  AlertTriangle,
  Scan,
  ChevronRight,
  Lock,
  Activity,
  ChevronDown,
} from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
  onEnterCitizen: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onEnter,
  onEnterCitizen,
}) => {
  const featuresRef = useRef<HTMLDivElement>(null);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gov-900 flex flex-col font-sans relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(2,6,23,0.9),rgba(2,6,23,0.95)),url('https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 border-b border-gov-500 bg-gov-900/80 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-blue rounded-lg flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,56,168,0.5)] border border-brand-blue/50">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-xl tracking-tight leading-none block">
              VeriFund PH
            </span>
            <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-widest block">
              Republika ng Pilipinas
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-300">
          <button
            onClick={scrollToFeatures}
            className="hover:text-brand-yellow transition-colors"
          >
            Platform
          </button>
          <button
            onClick={scrollToFeatures}
            className="hover:text-brand-yellow transition-colors"
          >
            Security
          </button>
          <button
            onClick={scrollToFeatures}
            className="hover:text-brand-yellow transition-colors"
          >
            Integration
          </button>
        </div>

        <button
          onClick={onEnter}
          className="bg-brand-blue text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-brand-red transition-all hover:shadow-[0_0_15px_rgba(206,17,38,0.4)] active:translate-y-0.5 border border-brand-blue hover:border-brand-red"
        >
          Initialize Field Unit
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative z-10 pt-32 pb-20 px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 max-w-7xl mx-auto min-h-screen">
        <div className="lg:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 bg-brand-blue/20 border border-brand-blue/40 text-blue-300 px-4 py-1.5 rounded-full shadow-[0_0_10px_rgba(0,56,168,0.3)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-yellow opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-yellow"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase font-mono">
              System Operational • V2.5.0
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
            Next-Gen <br />
            <span
              style={{
                backgroundImage:
                  "linear-gradient(to right, #facc15, #f97316, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
                display: "inline-block",
              }}
            >
              Social Aid
            </span>{" "}
            <br />
            Distribution.
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
            Eliminate leakage and ghost beneficiaries with{" "}
            <span className="text-brand-yellow font-bold">VeriFund PH</span>.
            The national standard for biometric-verified, blockchain-audited
            disbursements.
          </p>

          <div className="pagesSection flex flex-col sm:flex-row gap-4 pt-4 flex-wrap">
            <button
              onClick={onEnter}
              className="accessFieldConsole px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(0,56,168,0.4)] hover:bg-brand-red hover:shadow-[0_0_20px_rgba(206,17,38,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3 border border-brand-blue hover:border-brand-red"
            >
              Access Field Console
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onEnter}
              className="adminPortal px-8 py-4 bg-brand-blue text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(0,56,168,0.4)] hover:bg-brand-red hover:shadow-[0_0_20px_rgba(206,17,38,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3 border border-brand-blue hover:border-brand-red"
            >
              Admin Portal
              <ChevronRight className="w-5 h-5" />
            </button>
            <button
              onClick={onEnterCitizen}
              className="px-8 py-4 bg-brand-yellow text-gov-900 rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(252,209,22,0.4)] hover:bg-white transition-all hover:-translate-y-1 flex items-center justify-center gap-3 border border-brand-yellow"
            >
              Citizen Portal
              <Users className="w-5 h-5" />
            </button>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 bg-gov-800/50 text-slate-300 border border-gov-500 rounded-xl font-bold text-lg hover:bg-gov-800 hover:text-white transition-all flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              Learn Architecture
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-8 pt-8 border-t border-gov-500/50">
            <div>
              <p className="text-3xl font-black text-white">₱45B+</p>
              <p className="text-xs font-bold text-brand-yellow uppercase tracking-widest">
                Processed Securely
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">0%</p>
              <p className="text-xs font-bold text-brand-yellow uppercase tracking-widest">
                Fraud Rate
              </p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">1.2M</p>
              <p className="text-xs font-bold text-brand-yellow uppercase tracking-widest">
                Verified Citizens
              </p>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="lg:w-1/2 relative w-full hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-yellow/20 via-brand-red/20 to-brand-blue/20 blur-3xl rounded-full opacity-60 animate-pulse"></div>
          <div className="relative bg-gov-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gov-500 overflow-hidden transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            <div className="bg-gov-900 border-b border-gov-500 p-4 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-brand-red"></div>
                <div className="w-3 h-3 rounded-full bg-brand-yellow"></div>
                <div className="w-3 h-3 rounded-full bg-brand-blue"></div>
              </div>
              <div className="text-xs font-mono text-slate-500">
                secure_session_active
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gov-900/50 rounded-xl border border-gov-500">
                <div className="w-12 h-12 rounded-full bg-gov-800 border border-gov-500"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-slate-600 rounded w-3/4"></div>
                  <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                </div>
                <div className="px-3 py-1 bg-brand-blue/20 text-blue-400 border border-brand-blue/30 text-xs font-bold rounded">
                  VERIFIED
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-brand-red/10 rounded-xl border border-brand-red/30">
                <div className="w-12 h-12 rounded-full bg-brand-red/20 flex items-center justify-center text-brand-red border border-brand-red/30">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-red-900/50 rounded w-3/4"></div>
                  <div className="h-2 bg-red-900/30 rounded w-1/2"></div>
                </div>
                <div className="px-3 py-1 bg-brand-red/20 text-brand-red border border-brand-red/30 text-xs font-bold rounded">
                  FRAUD
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Feature Grid */}
      <section
        ref={featuresRef}
        className="relative z-10 py-24 bg-gov-900 px-6 lg:px-12 border-t border-gov-500 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-brand-yellow font-bold tracking-widest uppercase text-sm mb-3">
              Core Architecture
            </h2>
            <h3 className="text-4xl font-black text-white mb-6">
              Designed for the complexities of national scale.
            </h3>
            <p className="text-slate-400 text-lg">
              VeriFund PH combines rigorous biometric standards with distributed
              ledger technology to ensure integrity at every step.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gov-800/50 backdrop-blur-sm border border-gov-500 hover:border-brand-blue hover:shadow-[0_0_30px_rgba(0,56,168,0.2)] transition-all group">
              <div className="w-14 h-14 bg-gov-900 rounded-xl shadow-inner border border-brand-blue/50 flex items-center justify-center text-brand-blue mb-6 group-hover:scale-110 transition-transform">
                <Scan className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Liveness Detection
              </h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Proprietary AI models analyze micro-expressions and depth maps
                to ensure the beneficiary is present, alive, and not a static
                image or deepfake.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gov-800/50 backdrop-blur-sm border border-gov-500 hover:border-brand-red hover:shadow-[0_0_30px_rgba(206,17,38,0.2)] transition-all group">
              <div className="w-14 h-14 bg-gov-900 rounded-xl shadow-inner border border-brand-red/50 flex items-center justify-center text-brand-red mb-6 group-hover:scale-110 transition-transform">
                <Lock className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Immutable Audit
              </h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Every transaction is hashed and stored on a private permissioned
                blockchain, providing an unalterable history accessible by COA
                and DSWD.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gov-800/50 backdrop-blur-sm border border-gov-500 hover:border-brand-yellow hover:shadow-[0_0_30px_rgba(252,209,22,0.2)] transition-all group">
              <div className="w-14 h-14 bg-gov-900 rounded-xl shadow-inner border border-brand-yellow/50 flex items-center justify-center text-brand-yellow mb-6 group-hover:scale-110 transition-transform">
                <Activity className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">
                Real-time Velocity
              </h4>
              <p className="text-slate-400 leading-relaxed text-sm">
                Command centers view fund depletion and disbursement rates live,
                allowing for rapid reallocation of resources to slower areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gov-900 border-t border-gov-500 text-slate-400 py-12 px-6 lg:px-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-brand-yellow" />
            <span className="font-bold text-white text-lg tracking-tight">
              VeriFund PH
            </span>
          </div>
          <div className="text-xs font-mono">
            © 2026 Republika ng Pilipinas.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
