import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  User,
  Camera,
  FileText,
  QrCode,
  Calendar,
  Bell,
  CheckCircle2,
  ChevronLeft,
  RefreshCw,
  Smartphone,
  MapPin,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface CitizenPortalProps {
  onBack: () => void;
  initialView?: CitizenState;
}

type CitizenState = "login" | "register_ocr" | "register_face" | "dashboard";

const CitizenPortal: React.FC<CitizenPortalProps> = ({ onBack, initialView = "login" }) => {
  const [viewState, setViewState] = useState<CitizenState>(initialView);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [notifications, setNotifications] = useState<
    { id: string; message: string; read: boolean }[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock User Data
  const [userData, setUserData] = useState({
    name: "",
    idNumber: "",
    address: "",
    dob: "",
    nextVerification: "2027-01-15",
    schedule: "Tomorrow, 10:00 AM - 11:00 AM",
    scheduleLocation: "Barangay Hall, Quezon City",
    status: "Pending Verification",
  });

  const handleSimulateOCR = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUserData((prevData) => ({
            ...prevData,
            name: "JUAN DELA CRUZ",
            idNumber: "CRN-0111-2222-3333-4",
            address: "123 Sampaguita St, Brgy. Pag-asa, Quezon City",
            dob: "1985-08-15",
          }));
          setIsScanning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleSimulateFaceScan = () => {
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUserData((prevData) => ({
            ...prevData,
            status: "Verified",
          }));
          setIsScanning(false);
          setViewState("dashboard");

          // Add mock notification
          setNotifications([
            {
              id: "1",
              message:
                "Registration successful. Your AI-assisted schedule has been generated.",
              read: false,
            },
          ]);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };



  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto px-6">
      <div className="w-16 h-16 bg-brand-yellow rounded-2xl flex items-center justify-center text-gov-900 mb-8 shadow-[0_0_30px_rgba(252,209,22,0.3)]">
        <User className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-black text-white mb-2 text-center">
        Mamamayan Portal
      </h2>
      <p className="text-slate-400 text-center mb-8">
        Access your social aid, verify identity, and manage disbursements
        securely.
      </p>

      <div className="w-full space-y-4">
        <button
          onClick={() => setViewState("register_ocr")}
          className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold text-lg hover:bg-brand-red transition-all shadow-[0_0_15px_rgba(0,56,168,0.3)]"
        >
          Register with National ID
        </button>
        <button
          onClick={() => setViewState("dashboard")}
          className="w-full py-4 bg-gov-800 text-white border border-gov-500 rounded-xl font-bold text-lg hover:bg-gov-700 transition-all"
        >
          Login to Existing Account
        </button>
      </div>
    </div>
  );

  const renderOCR = () => (
    <div className="flex flex-col items-center max-w-lg mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Step 1: ID Verification (OCR)
      </h2>
      <p className="text-slate-400 text-center mb-8">
        Upload your National ID. Our AI will automatically extract your details
        to prevent manual errors.
      </p>

      <div className="w-full aspect-[1.6] bg-gov-800 border-2 border-dashed border-gov-500 rounded-2xl flex flex-col items-center justify-center mb-8 relative overflow-hidden">
        {isScanning ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gov-900/80 backdrop-blur-sm z-10">
            <RefreshCw className="w-10 h-10 text-brand-yellow animate-spin mb-4" />
            <div className="w-48 h-2 bg-gov-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-yellow transition-all duration-200"
                style={{ width: `${scanProgress}%` }}
              ></div>
            </div>
            <p className="text-brand-yellow mt-2 font-mono text-sm">
              Extracting text via OCR... {scanProgress}%
            </p>
          </div>
        ) : userData.name ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-blue/10 border border-brand-blue/30 z-10">
            <CheckCircle2 className="w-12 h-12 text-brand-blue mb-2" />
            <p className="text-brand-blue font-bold">ID Successfully Scanned</p>
          </div>
        ) : (
          <>
            <FileText className="w-12 h-12 text-slate-500 mb-4" />
            <button
              onClick={handleSimulateOCR}
              className="px-6 py-2 bg-gov-700 text-white rounded-lg hover:bg-gov-600 transition-colors"
            >
              Simulate ID Upload
            </button>
          </>
        )}
      </div>

      {userData.name && (
        <div className="w-full bg-gov-800 border border-gov-500 rounded-xl p-6 mb-8 space-y-4">
          <h3 className="text-brand-yellow font-bold text-sm uppercase tracking-wider border-b border-gov-600 pb-2">
            Extracted Data
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Full Name</p>
              <p className="text-white font-medium">{userData.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">ID Number</p>
              <p className="text-white font-mono">{userData.idNumber}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-slate-500">Address</p>
              <p className="text-white font-medium">{userData.address}</p>
            </div>
          </div>
        </div>
      )}

      <button
        disabled={!userData.name}
        onClick={() => setViewState("register_face")}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${userData.name ? "bg-brand-blue text-white hover:bg-brand-red shadow-[0_0_15px_rgba(0,56,168,0.3)]" : "bg-gov-800 text-slate-500 cursor-not-allowed"}`}
      >
        Proceed to Facial Recognition
      </button>
    </div>
  );

  const renderFaceScan = () => (
    <div className="flex flex-col items-center max-w-lg mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Step 2: Liveness & Facial Recognition
      </h2>
      <p className="text-slate-400 text-center mb-8">
        Position your face in the frame to verify your identity against the
        national database.
      </p>

      <div className="w-64 h-64 bg-gov-800 border-4 border-gov-500 rounded-full flex flex-col items-center justify-center mb-12 relative overflow-hidden">
        {isScanning ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gov-900/80 backdrop-blur-sm z-10">
            <div className="w-full h-1 bg-brand-yellow absolute top-0 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_#facc15]"></div>
            <p className="text-brand-yellow font-mono text-sm mt-8">
              Analyzing biometrics...
            </p>
          </div>
        ) : (
          <>
            <Camera className="w-16 h-16 text-slate-500 mb-4" />
            <button
              onClick={handleSimulateFaceScan}
              className="px-6 py-2 bg-gov-700 text-white rounded-lg hover:bg-gov-600 transition-colors"
            >
              Start Scan
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );

  const renderDashboard = () => (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">
            Welcome, {userData.name || "Juan"}
          </h1>
          <p className="text-slate-400">
            Citizen ID: {userData.idNumber || "CRN-XXXX-XXXX-XXXX-X"}
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-12 h-12 bg-gov-800 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-gov-700 transition-colors relative border border-gov-600"
          >
            <Bell className="w-5 h-5" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-gov-800"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-gov-800 border border-gov-500 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-gov-600 bg-gov-900/50">
                <h3 className="font-bold text-white">
                  Notifications (SMS/Email)
                </h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 border-b border-gov-600/50 ${!n.read ? "bg-brand-blue/5" : ""}`}
                    >
                      <p className="text-sm text-slate-300">{n.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 text-sm">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* QR Code Section */}
        <div className="bg-gov-800 border border-gov-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-red"></div>
          <h3 className="text-lg font-bold text-white mb-2">
            Claiming QR Code
          </h3>
          <p className="text-xs text-slate-400 mb-6 font-medium">
            Present this QR code physically at your assigned distribution center for secure verification and fund release.
          </p>
          <div className="bg-white p-4 rounded-xl mb-4">
            <QRCodeSVG value={userData.idNumber || "dummy-data"} size={150} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
            <CheckCircle2 className="w-3 h-3" /> VERIFIED
          </div>
        </div>

        {/* Schedule & Verification */}
        <div className="space-y-6">
          <div className="bg-gov-800 border border-gov-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-blue/20 rounded-lg flex items-center justify-center text-brand-blue">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">AI-Assisted Schedule</h3>
                <p className="text-xs text-slate-400">
                  Optimized to prevent crowding
                </p>
              </div>
            </div>
            <div className="bg-gov-900 rounded-xl p-4 border border-gov-600">
              <p className="text-brand-yellow font-bold mb-1">
                {userData.schedule}
              </p>
              <p className="text-sm text-slate-300">
                {userData.scheduleLocation}
              </p>
            </div>
          </div>

          <div className="bg-gov-800 border border-gov-500 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-yellow/20 rounded-lg flex items-center justify-center text-brand-yellow">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">Annual Re-verification</h3>
                <p className="text-xs text-slate-400">
                  Required to maintain active status
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Next Due:</span>
              <span className="font-mono text-white bg-gov-900 px-3 py-1 rounded border border-gov-600">
                {userData.nextVerification}
              </span>
            </div>
          </div>
        </div>

        {/* Face-to-Face Instructions */}
        <div className="space-y-6">
          <div className="bg-gov-800 border border-gov-500 rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-blue/5 -mr-8 -mt-8 rounded-full border border-brand-blue/10"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center text-brand-red border border-brand-red/20 shadow-inner">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Face-to-Face Claiming</h3>
                <p className="text-xs text-brand-red font-bold uppercase tracking-widest">Mandatory Physical Presence</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gov-900/80 rounded-xl border border-gov-600 relative">
                <p className="text-sm text-slate-300 leading-relaxed">
                  To ensure maximum security and prevent fraud, all social aid disbursements are now conducted <strong className="text-white">strictly face-to-face</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
                <ShieldCheck className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                <p className="text-xs text-slate-200">
                  Please bring your <strong className="text-white">National ID</strong> and the <strong className="text-white">Claiming QR Code</strong> shown on this dashboard.
                </p>
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Verification Status</span>
                  <span className="text-[10px] font-bold text-brand-yellow px-2 py-0.5 bg-brand-yellow/10 rounded-full border border-brand-yellow/20">Awaiting Arrival</span>
                </div>
                <div className="w-full h-1.5 bg-gov-900 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-brand-yellow animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gov-800 border border-gov-500 rounded-2xl p-6 shadow-lg border-t-4 border-t-brand-blue">
             <h4 className="text-sm font-bold text-white mb-3">Claiming Process</h4>
             <ul className="space-y-3">
               {[
                 "Arrive at Barangay Hall during your slot",
                 "Present your physical ID for scanning",
                 "Show the Claiming QR Code on your phone",
                 "Receive funds after biometric confirmation"
               ].map((step, i) => (
                 <li key={i} className="flex gap-3 text-xs text-slate-400 font-medium">
                   <span className="flex items-center justify-center w-5 h-5 bg-gov-900 rounded-full text-brand-blue text-[10px] border border-gov-600 shrink-0">{i+1}</span>
                   {step}
                 </li>
               ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gov-900 font-sans flex flex-col">
      {/* Header */}
      <header className="shrink-0 border-b border-gov-500 bg-gov-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gov-800 flex items-center justify-center text-slate-300 hover:text-white hover:bg-gov-700 transition-colors border border-gov-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-yellow rounded flex items-center justify-center text-gov-900">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white leading-none block">
                VeriFund PH
              </span>
              <span className="text-[10px] font-mono text-brand-yellow uppercase tracking-widest block">
                Citizen Portal
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-12">
        {viewState === "login" && renderLogin()}
        {viewState === "register_ocr" && renderOCR()}
        {viewState === "register_face" && renderFaceScan()}
        {viewState === "dashboard" && renderDashboard()}
      </main>
    </div>
  );
};

export default CitizenPortal;
