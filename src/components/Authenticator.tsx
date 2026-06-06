import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Lock, ArrowRight, ArrowLeft, Key, Sparkles, Terminal, Cpu, Shield, HelpCircle, Activity, Globe, Check, AlertCircle } from "lucide-react";

interface AuthenticatorProps {
  onLoginSuccess: (userEmail: string) => void;
  onGoBack?: () => void;
}

export default function Authenticator({ onLoginSuccess, onGoBack }: AuthenticatorProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [operatorName, setOperatorName] = useState("");
  const [email, setEmail] = useState("muhd.arshadra@gmail.com");
  const [password, setPassword] = useState("••••••••••••");
  const [passcode, setPasscode] = useState("");
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Social Login Simulator
  const handleSocialSignIn = (provider: "google" | "github") => {
    setIsLoading(true);
    setError(null);
    setLoadingText(
      mode === "signup"
        ? `Preparing account via ${provider === "google" ? "Google G-Suite" : "GitHub Auth"}...`
        : `Connecting via ${provider === "google" ? "Google G-Suite" : "GitHub Auth"}...`
    );
    
    setTimeout(() => {
      setLoadingText("Configuring workspace variables...");
      setTimeout(() => {
        setIsLoading(false);
        const demoEmail = provider === "google" ? "muhd.arshadra@gmail.com" : "arshad-dev@github.com";
        onLoginSuccess(demoEmail);
      }, 900);
    }, 1100);
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !operatorName.trim()) {
      setError("Please provide your Name to register your account");
      return;
    }
    if (!email.trim()) {
      setError("Please provide a valid email address");
      return;
    }
    setIsLoading(true);
    setLoadingText(
      mode === "signup"
        ? "Generating secure access credentials..."
        : "Checking details with secure key manager..."
    );
    setError(null);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep("mfa");
    }, 1400);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length !== 6) {
      setError("Passcode must be a 6-digit verification code");
      return;
    }
    setIsLoading(true);
    setLoadingText("Establishing connection. Building your app workspace...");
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 1400);
  };

  const triggerBypass = () => {
    setIsLoading(true);
    setLoadingText("Skipping login checks for demo system...");
    setTimeout(() => {
      onLoginSuccess(email || "guest@routelm.com");
    }, 800);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#09090B] text-white flex items-center justify-center p-0 select-none font-sans overflow-hidden">
      
      {/* Decorative Grid and Background Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-cyan-950/20 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-purple-950/15 blur-[120px] pointer-events-none" />

      {/* Main Immersive Split Container */}
      <div className="relative w-full h-full lg:grid lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side: Cybernetic Intelligence Display */}
        <div className="hidden lg:flex lg:col-span-5 bg-black/40 border-r border-neutral-900 flex-col justify-between p-12 relative overflow-hidden">
          
          {/* Cyber Lines Decor */}
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent" />
          
          <div className="space-y-8 z-10">
            {/* Corner Bracket Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-cyan-500 rounded-lg blur opacity-30 animate-pulse" />
                <div className="relative w-10 h-10 bg-black border border-neutral-800 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg tracking-tighter">
                  R
                </div>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#71717A] block font-bold">SMART API ROUTER</span>
                <span className="font-semibold text-sm tracking-tight text-white block">RouteLM Core Console</span>
              </div>
            </div>

            {/* Core Message */}
            <div className="space-y-4">
              <h1 className="text-2xl font-light tracking-tight text-neutral-300 leading-tight">
                Secure AI Gateway & <span className="font-bold text-white">Smart Failover Policy</span> Engine.
              </h1>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
                Log in to our safe sandbox interface. RouteLM keeps your keys private while automatically switching between backup models during downtime.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-[#0C0C0E]/80 border border-neutral-850 p-3.5 rounded-lg space-y-1">
                <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 block">SYSTEM STATUS</span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  ONLINE
                </span>
              </div>
              <div className="bg-[#0C0C0E]/80 border border-neutral-850 p-3.5 rounded-lg space-y-1">
                <span className="font-mono text-[8px] uppercase tracking-wider text-neutral-400 block">AVAILABLE BACKUPS</span>
                <span className="text-xs font-mono font-bold text-cyan-400">9 BACKUPS READY</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Log Ticker */}
          <div className="bg-black/60 border border-neutral-850 p-4 rounded-lg font-mono text-[10px] text-neutral-500 space-y-2 z-10 max-w-md">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-1.5">
              <span className="flex items-center gap-1.5 text-neutral-400 font-bold">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>WORKSPACE LOGS</span>
              </span>
              <span className="text-[9px] text-[#A1A1AA] bg-neutral-900 px-1.5 py-0.5 rounded">0ms delay</span>
            </div>
            <div className="space-y-1.5 select-text leading-relaxed">
              <p><span className="text-cyan-500">[SYSTEM]</span> Initializing secure local session...</p>
              <p><span className="text-purple-500">[SECURITY]</span> Local connection channel is active.</p>
              <p><span className="text-amber-500">[ROUTING]</span> Offline-safe routers are loaded.</p>
              <p><span className="text-emerald-500">[GUIDE]</span> Log in to continue to the control panel.</p>
            </div>
          </div>

          {/* Footer of Left Col */}
          <div className="z-10 pt-4 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-mono text-[#71717A]">
            <span>VER: 2.1.8-RELEASE</span>
            <span>SECURE GATEWAY</span>
          </div>

        </div>

        {/* Right Side: High-Fidelity Authentication Form */}
        <div className="col-span-12 lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 md:p-20 relative h-full overflow-y-auto">
          
          {/* Elegant Go Back Button */}
          {onGoBack && (
            <button
              type="button"
              onClick={onGoBack}
              className="absolute top-6 left-6 lg:top-8 lg:left-8 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-800 bg-[#0C0C0E] text-neutral-400 hover:text-white hover:border-neutral-700 transition font-mono text-[11px] font-bold tracking-wider cursor-pointer group active:scale-[0.98] z-30"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-cyan-400" />
              <span>PRODUCT PORTAL</span>
            </button>
          )}
          
          <div className="w-full max-w-md space-y-8 my-auto relative z-10">
            
            {/* Header with Mobile display compatibility */}
            <div className="text-center lg:text-left space-y-2.5">
              <div className="lg:hidden w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-extrabold text-2xl mx-auto shadow-xl shadow-cyan-500/5 mb-2">
                R
              </div>
              <h2 className="text-2xl tracking-tight font-extrabold text-white">
                {mode === "login" ? "Sign In to Workspace" : "Register a Workspace"}
              </h2>
              <p className="text-xs text-neutral-400">
                {mode === "login" 
                  ? "Provide your details to connect to your easy-to-use API gateway."
                  : "Register a fresh account to configure backup models and manage latency policies."}
              </p>
            </div>

            {/* Error Notification Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-rose-950/20 border border-rose-900/60 p-3.5 rounded text-xs text-rose-400 font-mono flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block tracking-wide uppercase text-[10px]">Error Notification</span>
                  <p className="mt-0.5 leading-relaxed text-neutral-300">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Elegant Custom Sliding Tab Control */}
            <div className="relative bg-[#0C0C0E] border border-neutral-850 p-1 rounded-xl flex items-center overflow-hidden">
              <div className="absolute inset-y-1 left-1 right-1 grid grid-cols-2 pointer-events-none">
                <motion.div
                  layoutId="auth-active-tab-highlight"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="bg-neutral-800 border border-neutral-750/30 rounded-lg shadow-inner h-full w-full"
                  style={{
                    gridColumnStart: mode === "login" ? 1 : 2,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`flex-1 relative z-10 py-2.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-colors duration-250 select-none cursor-pointer text-center outline-none ${
                  mode === "login" ? "text-white animate-pulse" : "text-neutral-500 hover:text-neutral-400"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                className={`flex-1 relative z-10 py-2.5 text-[10px] font-mono font-bold tracking-widest uppercase transition-colors duration-250 select-none cursor-pointer text-center outline-none ${
                  mode === "signup" ? "text-white animate-pulse" : "text-neutral-500 hover:text-neutral-400"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* SOCIAL SSO BUTTONS WITH HIGH FIDELITY HOVERS */}
            <div className="grid grid-cols-2 gap-3 pb-1">
              
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialSignIn("google")}
                disabled={isLoading}
                className="flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-neutral-850 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition duration-200 select-none cursor-pointer group active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5 text-white fill-current group-hover:scale-105 transition" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-350">
                  {mode === "login" ? "GOOGLE SSO" : "GOOGLE SIGNUP"}
                </span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => handleSocialSignIn("github")}
                disabled={isLoading}
                className="flex items-center justify-center gap-2.5 py-2.5 rounded-lg border border-neutral-850 bg-neutral-900/40 hover:bg-neutral-800/60 hover:border-neutral-700 transition duration-200 select-none cursor-pointer group active:scale-[0.98]"
              >
                <svg className="w-4 h-4 text-white fill-current group-hover:scale-105 transition" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span className="text-[11px] font-mono font-bold tracking-wider text-neutral-350">
                  {mode === "login" ? "GITHUB SSO" : "GITHUB SIGNUP"}
                </span>
              </button>

            </div>

            {/* Separator */}
            <div className="relative flex items-center justify-center py-2">
              <div className="absolute w-full border-t border-neutral-850" />
              <span className="relative px-3 bg-[#09090B] font-mono text-[8px] font-bold tracking-widest text-[#52525B] uppercase">
                {mode === "login" ? "Or Connect Via Email & Password" : "Or Register Your Credentials"}
              </span>
            </div>

            {/* LOADING OVERLAY STATE (WHEN PROCESSED) */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-neutral-900/60 border border-neutral-800 p-8 rounded-lg flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 border-2 border-cyan-500/10 border-t-2 border-t-cyan-400 rounded-full animate-spin" />
                    <Cpu className="w-5 h-5 text-cyan-400 absolute animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-cyan-450 text-cyan-400 block font-bold tracking-wider uppercase">Connecting to App</span>
                    <p className="text-[10px] text-neutral-400 max-w-xs">{loadingText}</p>
                  </div>
                </motion.div>
              ) : step === "credentials" ? (
                
                // Form 1: Standard email registration or login credentials
                <motion.form key="form-creds" onSubmit={handleCredentialsSubmit} className="space-y-4.5">
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={operatorName}
                        onChange={(e) => setOperatorName(e.target.value)}
                        className="w-full bg-[#121214] text-xs font-mono text-white border border-neutral-800 hover:border-neutral-700 rounded px-3.5 py-3 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/10 placeholder-neutral-600 transition"
                        placeholder="Elena Arshad"
                        required={mode === "signup"}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#121214] text-xs font-mono text-white border border-neutral-800 hover:border-neutral-700 rounded px-3.5 py-3 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/10 placeholder-neutral-600 transition"
                      placeholder="operator@routelm.co"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-[9px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        Password
                      </label>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#121214] text-xs font-mono text-white border border-neutral-800 hover:border-neutral-700 rounded px-3.5 py-3 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/10 placeholder-neutral-600 transition"
                      placeholder="Enter your security password..."
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-white hover:bg-neutral-100 text-black text-xs font-bold font-mono tracking-wider rounded transition flex items-center justify-center gap-2 select-none cursor-pointer active:scale-[0.99]"
                    >
                      <span>
                        {mode === "login" ? "SIGN IN TO WORKSPACE" : "CREATE WORKSPACE ACCOUNT"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-black shrink-0" />
                    </button>
                  </div>
                </motion.form>
              ) : (
                
                // Form 2: MFA Code Check
                <motion.form key="form-mfa" onSubmit={handleMfaSubmit} className="space-y-5">
                  <div className="space-y-2.5 text-center">
                    <div className="p-3 bg-cyan-950/25 border border-cyan-500/30 rounded-full inline-flex text-cyan-400 mb-1">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      {mode === "login" ? "TWO-FACTOR VERIFICATION" : "CONFIRM NEW SIGNUP"}
                    </h4>
                    <p className="text-[10px] text-neutral-400 leading-relaxed max-w-sm mx-auto">
                      {mode === "login" 
                        ? "A 6-digit verification code has been sent to your device. Please enter it below."
                        : "To secure your workspace, enter the 6-digit code shown in your authenticator app."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={passcode}
                      onChange={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, "");
                        setPasscode(cleaned);
                      }}
                      className="w-full text-center bg-[#121214] text-xl font-mono tracking-[0.35em] text-white border border-neutral-800 rounded py-3.5 outline-none focus:border-cyan-500 transition"
                      placeholder="000000"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setStep("credentials")}
                      className="py-2.5 bg-transparent border border-neutral-800 hover:border-neutral-700 text-neutral-400 text-xs font-mono font-bold rounded transition select-none cursor-pointer text-center"
                    >
                      BACK
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 bg-white text-black hover:bg-neutral-100 text-xs font-mono font-bold rounded transition text-center select-none cursor-pointer"
                    >
                      {mode === "login" ? "VERIFY CODE" : "CONFIRM ACCOUNT"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* command bypass system */}
            <div className="border-t border-neutral-900/80 pt-6 text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/20 border border-cyan-900/40 rounded-full">
                <Globe className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wide font-bold">
                  DEMO SYSTEM BYPASS ACTIVE
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 leading-normal max-w-xs mx-auto">
                For easy testing, you can skip the code-entry requirement by using the bypass button below.
              </p>
              <button
                type="button"
                onClick={triggerBypass}
                disabled={isLoading}
                className="text-xs text-white hover:text-cyan-400 font-bold font-mono transition mt-1 select-none cursor-pointer block mx-auto underline decoration-neutral-800 hover:decoration-cyan-400 decoration-1 underline-offset-4"
              >
                🔒 BYPASS THE CODE & SIGN IN NOW &rarr;
              </button>
            </div>

          </div>

          <div className="absolute bottom-6 left-6 text-[10px] text-neutral-600 font-mono hidden lg:block">
            <span>RouteLM Workspace Gateway Console.</span>
          </div>

        </div>

      </div>
    </div>
  );
}
