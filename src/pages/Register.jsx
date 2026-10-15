import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  User,
  Mail,
  Lock,
  Building2,
  BookOpen,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  RotateCw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import Button from '../components/common/Button';
import GoogleAuthButton from '../components/common/GoogleAuthButton';
import { isDisposableEmail } from '../utils/tempMailDetector';

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // If redirected from Login with verified Google details
  const initialGoogleUser = location.state?.googleProfile || null;

  const [googleProfile, setGoogleProfile] = useState(initialGoogleUser);
  const [name, setName] = useState(initialGoogleUser?.name || '');
  const [email, setEmail] = useState(initialGoogleUser?.email || '');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('1');
  const [formError, setFormError] = useState(null);

  // OTP Verification state for manual email registration
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [otpInfoMsg, setOtpInfoMsg] = useState(null);

  const {
    register,
    googleLogin,
    completeGoogleRegistration,
    sendRegistrationOtp,
    verifyOtp,
    isLoading,
    pendingDevOtp,
    error: storeError
  } = useAuthStore();

  // Check disposable email
  const isTempMail = isDisposableEmail(email);

  // Resend countdown timer effect
  useEffect(() => {
    let interval = null;
    if (isOtpStep && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpStep, resendTimer]);

  // Handler when user selects and verifies their Google Account
  const handleGoogleVerified = async (profile) => {
    setFormError(null);

    if (isDisposableEmail(profile.email)) {
      setFormError('Temporary or disposable emails are not permitted, even via Google.');
      return;
    }

    // Check if user is already registered
    const checkRes = await googleLogin(profile);
    if (checkRes.success && !checkRes.isNewUser) {
      // Already registered! Redirect to dashboard
      navigate('/dashboard');
      return;
    }

    // New user: Set verified profile and ask for College, Course, Year
    setGoogleProfile(profile);
    setName(profile.name || '');
    setEmail(profile.email || '');
  };

  // Handler for completing Google registration (entering remaining fields)
  const handleCompleteGoogleRegistration = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!college.trim() || !course.trim()) {
      setFormError('Please enter your College and Degree/Course to complete registration.');
      return;
    }

    const res = await completeGoogleRegistration({
      email: googleProfile.email,
      name: name || googleProfile.name,
      avatarUrl: googleProfile.avatarUrl,
      college: college.trim(),
      course: course.trim(),
      year: parseInt(year, 10)
    });

    if (res.success) {
      navigate('/setup');
    } else {
      setFormError(res.error || 'Failed to complete registration.');
    }
  };

  // Step 1 for manual email registration: Validate form, detect temp mails, send OTP
  const handleInitiateManualRegistration = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password || !college || !course || !year) {
      setFormError('All fields are required.');
      return;
    }

    if (isTempMail) {
      setFormError(
        'Disposable/temporary email addresses (e.g. mailinator, tempmail) are not permitted. Please use your official university or personal email.'
      );
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    // Request OTP
    const res = await sendRegistrationOtp(email);
    if (res.success) {
      setIsOtpStep(true);
      setResendTimer(60);
      setOtpInfoMsg(res.message || 'Verification code sent to your email.');
    } else {
      setFormError(res.error || 'Failed to send verification code.');
    }
  };

  // Resend OTP handler
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setFormError(null);

    const res = await sendRegistrationOtp(email);
    if (res.success) {
      setResendTimer(60);
      setOtpInfoMsg(res.message || 'New verification code sent to your email.');
    } else {
      setFormError(res.error || 'Failed to resend code.');
    }
  };

  // Step 2 for manual email: Verify OTP and finalize registration
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!otp || otp.trim().length !== 6) {
      setFormError('Please enter the 6-digit verification code.');
      return;
    }

    const verifyRes = await verifyOtp(email, otp);
    if (!verifyRes.success) {
      setFormError(verifyRes.error || 'Invalid verification code.');
      return;
    }

    // Finalize registration
    const result = await register(
      name,
      email,
      password,
      college,
      course,
      parseInt(year, 10),
      otp.trim()
    );

    if (result.success) {
      navigate('/setup');
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 py-12">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 right-1/4 w-[320px] h-[320px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse-slow"></div>

      <div className="glass-panel w-full max-w-lg p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden">
        {/* VIEW 1: GOOGLE VERIFIED REGISTRATION (Enter Remaining Fields) */}
        {googleProfile ? (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-1">
              <div className="inline-flex p-2.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-1">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                Complete Your Profile
              </h2>
              <p className="text-xs text-slate-400">
                Google account verified! Enter your academic details to finish registration.
              </p>
            </div>

            {/* Verified Google Account Summary Card */}
            <div className="bg-slate-900/80 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {googleProfile.avatarUrl ? (
                  <img
                    src={googleProfile.avatarUrl}
                    alt={googleProfile.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500/40"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-indigo-600/30 text-indigo-200 flex items-center justify-center font-bold">
                    {googleProfile.name?.charAt(0) || 'G'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{googleProfile.name}</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider border border-emerald-500/30">
                      ✓ Google Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{googleProfile.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGoogleProfile(null)}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Switch
              </button>
            </div>

            {(formError || storeError) && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{formError || storeError}</span>
              </div>
            )}

            {/* Form for Remaining Essential Fields */}
            <form onSubmit={handleCompleteGoogleRegistration} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    College / University
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Building2 size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NIT Trichy / BITS / IIT"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Degree / Course
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <BookOpen size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech Computer Science"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Academic Year
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <GraduationCap size={16} />
                  </span>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none cursor-pointer"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 mt-2"
                isLoading={isLoading}
              >
                Complete Registration & Join
              </Button>
            </form>
          </div>
        ) : isOtpStep ? (
          /* VIEW 2: OTP VERIFICATION SCREEN (For Manual Email Registration) */
          <div className="space-y-6 animate-fade-in">
            <button
              type="button"
              onClick={() => {
                setIsOtpStep(false);
                setFormError(null);
                setOtp('');
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>Back to Edit Details</span>
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 mb-1">
                <KeyRound size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Verify Your Email
              </h2>
              <p className="text-xs text-slate-400">
                We sent a 6-digit confirmation code to{' '}
                <span className="font-semibold text-slate-200">{email}</span>
              </p>
            </div>

            {/* Dev helper code preview banner */}
            {pendingDevOtp && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-indigo-300">
                <span>Verification Code:</span>
                <span className="font-mono font-bold tracking-widest text-sm bg-slate-900/80 px-2.5 py-0.5 rounded border border-indigo-500/40">
                  {pendingDevOtp}
                </span>
              </div>
            )}

            {(formError || storeError) && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{formError || storeError}</span>
              </div>
            )}

            {otpInfoMsg && !formError && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{otpInfoMsg}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAndRegister} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 text-center">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtp(val);
                    if (formError) setFormError(null);
                  }}
                  className="glass-input w-full text-center text-2xl font-mono tracking-[12px] py-3 rounded-xl font-bold text-white"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Didn't receive the email?</span>
                <button
                  type="button"
                  disabled={resendTimer > 0 || isLoading}
                  onClick={handleResendOtp}
                  className={`font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                    resendTimer > 0
                      ? 'text-slate-500 cursor-not-allowed'
                      : 'text-indigo-400 hover:text-indigo-300'
                  }`}
                >
                  <RotateCw size={12} className={isLoading ? 'animate-spin' : ''} />
                  <span>{resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}</span>
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                isLoading={isLoading}
              >
                Verify & Create Account
              </Button>
            </form>
          </div>
        ) : (
          /* VIEW 3: INITIAL REGISTRATION SCREEN */
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">Create Account</h2>
              <p className="mt-2 text-slate-400 text-sm">
                Join StudentForge to build teams and verified proof-of-work.
              </p>
            </div>

            {/* Authentic Google Authentication Button */}
            <div>
              <GoogleAuthButton
                text="Sign up with Google"
                onGoogleVerified={handleGoogleVerified}
              />
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                Or register with student email
              </span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {(formError || storeError) && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl text-sm flex items-center gap-3">
                <AlertTriangle size={18} className="shrink-0" />
                <span>{formError || storeError}</span>
              </div>
            )}

            <form onSubmit={handleInitiateManualRegistration} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Arjun Dev"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      placeholder="arjun@university.edu"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (formError) setFormError(null);
                      }}
                      className={`glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs ${
                        isTempMail ? 'border-rose-500 focus:border-rose-500' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Disposable Email Detection Warning */}
              {isTempMail && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0 text-rose-400" />
                  <span>
                    Temporary/disposable email domain detected. StudentForge requires a permanent college or personal email address.
                  </span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="Choose a strong password (6+ chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800/40 my-1 pt-3"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    College / University
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <Building2 size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. NIT Trichy / BITS / IIT"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Degree / Course
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                      <BookOpen size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. B.Tech Computer Science"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Academic Year
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                    <GraduationCap size={16} />
                  </span>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none cursor-pointer"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isTempMail}
                className="w-full py-3 mt-4"
                isLoading={isLoading}
              >
                Continue to Email Verification
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-450">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
