import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Smartphone, LockKeyhole } from 'lucide-react';

interface CitizenLoginProps {
  onSuccess: () => void;
  onBack: () => void;
}

const CitizenLogin: React.FC<CitizenLoginProps> = ({ onSuccess, onBack }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.length < 5) {
      setError('Please enter a valid mobile number or email');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pasted.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(index + pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = () => {
    const code = otp.join('');
    if (code === '123456') {
      onSuccess();
    } else {
      setError('Invalid code. Please use 123456 for the prototype.');
    }
  };

  // Auto verify when 6 digits are entered
  useEffect(() => {
    if (otp.every(digit => digit !== '') && step === 2) {
      verifyOtp();
    }
  }, [otp, step]);

  return (
    <div className="min-h-screen bg-gov-50 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 z-10 relative">
        <button 
          onClick={step === 1 ? onBack : () => setStep(1)} 
          className="text-sm text-slate-500 hover:text-slate-800 mb-6 font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 
          Back
        </button>

        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Citizen Login</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">Enter your mobile number or email to receive a secure login code.</p>

            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Mobile or Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-blue flex gap-2">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. 09123 456 789"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all font-medium text-slate-900"
                  />
                </div>
                {error && <p className="text-brand-red text-sm mt-2 font-bold animate-pulse">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2 group"
              >
                Send Code
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="inline-flex items-center justify-center p-4 bg-brand-yellow/20 rounded-full mb-6 text-brand-yellow">
              <LockKeyhole className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Enter OTP</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              We've sent a 6-digit code to <strong className="text-slate-700">{contact}</strong>
              <br/>
              <span className="text-xs text-brand-blue mt-1 inline-block">(Use 123456 for this prototype)</span>
            </p>

            <div className="flex gap-2 sm:gap-3 mb-6 justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-2xl font-bold rounded-xl border-2 border-slate-200 focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all bg-slate-50 text-slate-900 shadow-sm"
                />
              ))}
            </div>

            {error && <p className="text-brand-red text-sm mb-6 font-bold text-center bg-brand-red/10 py-2 rounded-lg">{error}</p>}

            <button
              onClick={verifyOtp}
              className="w-full py-4 bg-brand-blue text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
            >
              Verify & Login
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenLogin;
