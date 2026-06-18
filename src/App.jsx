import React, { useState } from 'react';
// Import your image assets
import bgImage from './IMAGE.jpeg';
import signBgImage from './SIGN.jpg';

export default function App() {
  // Navigation State Layout: 'landing', 'signin', 'signup', 'forgot', 'about', 'dashboard'
  const [currentView, setCurrentView] = useState('landing');
  const [showPassword, setShowPassword] = useState(false);
  const [language, setLanguage] = useState('English'); // Dashboard language state
  
  // Interactive Overlays
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Form Input Tracking States
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Active Session State
  const [currentUser, setCurrentUser] = useState(null);

  // API Backend Base URL
  const BACKEND_URL = 'http://localhost:5000';

  // Mock emails from your Google workflow simulation window
  const mockGoogleAccounts = [
    { name: 'Jordan Kirumira', email: 'joriana800@gmail.com', initials: 'JK', color: '#E61B9B' },
    { name: 'Jordan', email: 'jordankir449@gmail.com', initials: 'J', color: '#7614EC' },
    { name: 'Kigenyi Erisa', email: 'mstr.erisa@gmail.com', initials: 'KE', color: '#FFB300' },
    { name: 'Kigenyi Emmanuel', email: 'kigenyierisa66@gmail.com', initials: 'KE', color: '#2b9348' },
    { name: 'Victoria Marvis', email: 'victoriamarvis18@gmail.com', initials: 'VM', color: '#00b4d8' }
  ];

  const themeColors = {
    magenta: '#D81B9E',
    purple: '#9023F0',
    gradientBg: 'linear-gradient(135deg, #D81B9E 0%, #9023F0 100%)',
    textDark: '#1A1A1A',
    textMuted: '#666666'
  };

  /* ==========================================================================
     API INTEGRATION HANDLERS (CONNECTING UI TO BACKEND)
     ========================================================================= */

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      alert("Passwords do not match! Please check again.");
      return;
    }
    if (!agreeToTerms) {
      alert("You must accept the Terms and Conditions to register.");
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: regFullName,
          email: regEmail,
          password: regPassword,
          agreeToTerms: agreeToTerms
        })
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        setRegFullName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setAgreeToTerms(false);
        setCurrentView('signin');
      } else {
        alert(`Registration Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Signup Connection Error:", error);
      alert("Could not connect to the backend server.");
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        localStorage.setItem('bigsister_token', data.token);
        setCurrentUser(data.user);
        setAuthEmail('');
        setAuthPassword('');
        // Route immediately to post-login Dashboard interface
        setCurrentView('dashboard');
      } else {
        alert(`Login Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Signin Connection Error:", error);
      alert("Backend connection error.");
    }
  };

  const handleGoogleAccountSelect = async (account) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/google-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: account.email, name: account.name })
      });
      const data = await response.json();
      if (data.success) {
        setShowGooglePopup(false);
        alert(`Google Sync Complete! Welcome back.`);
        localStorage.setItem('bigsister_token', data.token);
        setCurrentUser(data.user);
        // Route immediately to post-login Dashboard interface
        setCurrentView('dashboard');
      } else {
        alert(`Google Auth Failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Google Sync API Error:", error);
      alert("Error syncing Google profile with backend.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bigsister_token');
    setCurrentUser(null);
    alert("You have logged out successfully.");
    setCurrentView('landing');
  };

  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#FFF8FD', // Subtle pink hue background for user dashboard feel
      fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      overflow: 'hidden',
      margin: 0,
      padding: 0
    },
    navbar: {
      width: '100%',
      height: '64px',
      backgroundColor: '#FFFFFF',
      padding: '0 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box',
      borderBottom: '1px solid #EAEAEA',
      zIndex: 50
    },
    navBrandGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '30px'
    },
    navBrandText: {
      fontSize: '24px',
      fontWeight: '800',
      color: themeColors.magenta,
      cursor: 'pointer'
    },
    navLinkItem: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#A155B9',
      textDecoration: 'none',
      cursor: 'pointer',
      marginRight: '20px'
    },
    navAuthButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    navLoginBtn: {
      background: '#FFFFFF',
      color: themeColors.purple,
      border: `1.5px solid ${themeColors.purple}`,
      borderRadius: '20px',
      padding: '6px 20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    navRegisterBtn: {
      background: themeColors.gradientBg,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '20px',
      padding: '7px 22px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer'
    },
    userProfileTag: {
      fontSize: '13px',
      fontWeight: '600',
      color: themeColors.textDark,
      marginRight: '8px'
    },
    contentBody: {
      display: 'flex',
      flexDirection: 'column',
      height: 'calc(100vh - 64px)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    },
    landingMainContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      backgroundColor: '#FFFFFF'
    },
    landingHeroSection: {
      display: 'flex',
      width: '100%',
      flex: '1.2',
      backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 15%, rgba(255, 255, 255, 0) 35%), url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '20px 60px',
      boxSizing: 'border-box',
      position: 'relative'
    },
    landingHeroLeft: {
      width: '100%',
      maxWidth: '550px',
      textAlign: 'left',
      zIndex: 2
    },
    landingHeroTag: {
      fontSize: '11px',
      fontWeight: '800',
      color: themeColors.magenta,
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      marginBottom: '8px'
    },
    landingHeroTitle: {
      fontSize: '38px',
      fontWeight: '800',
      color: themeColors.textDark,
      lineHeight: '1.15',
      margin: '0 0 12px 0'
    },
    landingHeroDesc: {
      fontSize: '14px',
      color: '#444444',
      lineHeight: '1.5',
      marginBottom: '20px',
      fontWeight: '500'
    },
    landingHeroBtnGroup: {
      display: 'flex',
      gap: '14px'
    },
    landingGridSection: {
      padding: '20px 60px',
      flex: '0.8',
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      backgroundColor: '#FDF8FF',
      borderTop: '1px solid #F5E6FA'
    },
    landingInfoCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '14px',
      padding: '20px',
      flex: '1',
      height: '85%',
      minWidth: '260px',
      maxWidth: '360px',
      boxSizing: 'border-box',
      border: '1px solid #EFE0F5',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    },
    landingCardTitle: {
      fontSize: '15px',
      fontWeight: '700',
      color: themeColors.textDark,
      marginBottom: '6px'
    },
    landingCardDesc: {
      fontSize: '12.5px',
      color: themeColors.textMuted,
      lineHeight: '1.45',
      margin: 0
    },
    authCardWrapper: {
      display: 'flex',
      flex: 1,
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url(${signBgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
      boxSizing: 'border-box'
    },
    authMainCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      width: '100%',
      maxWidth: '375px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
      boxSizing: 'border-box',
      padding: '24px 24px',
      textAlign: 'center',
      overflow: 'hidden'
    },
    authCardTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: themeColors.textDark,
      margin: '0 0 16px 0',
      letterSpacing: '-0.3px'
    },
    authSubmitBtn: {
      background: themeColors.gradientBg,
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '25px',
      padding: '11px 24px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      width: '100%',
      marginTop: '6px',
      marginBottom: '10px'
    },
    inputGroup: {
      marginBottom: '10px',
      textAlign: 'left',
      position: 'relative'
    },
    inputLabel: {
      display: 'block',
      fontSize: '11px',
      fontWeight: '700',
      color: '#A0A0A0',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    inputField: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '10px',
      border: 'none',
      backgroundColor: '#F4F5F7',
      fontSize: '13px',
      color: '#333333',
      boxSizing: 'border-box',
      outline: 'none'
    },
    privacyFooterText: {
      fontSize: '11px',
      color: '#8A8A8A',
      marginTop: '12px',
      textAlign: 'center',
      fontWeight: '400'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    },
    popupBox: {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      width: '90%',
      maxWidth: '360px',
      padding: '24px',
      boxShadow: '0px 8px 24px rgba(0,0,0,0.3)',
      textAlign: 'left',
      boxSizing: 'border-box'
    },

    /* ==========================================================================
       DASHBOARD COMPONENT STYLES (FROM SCREENSHOT (61).jpg)
       ========================================================================= */
    dashboardWrapper: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      overflowY: 'auto',
      boxSizing: 'border-box'
    },
    dashboardWelcomeBar: {
      width: '100%',
      backgroundColor: '#C51FA0',
      padding: '14px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxSizing: 'border-box',
      color: '#FFFFFF'
    },
    dashboardWelcomeText: {
      fontSize: '18px',
      fontWeight: '700',
      letterSpacing: '-0.2px'
    },
    dashboardControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    langSelectorWrapper: {
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.18)',
      borderRadius: '20px',
      padding: '2px 4px',
      alignItems: 'center'
    },
    langBtn: {
      border: 'none',
      borderRadius: '16px',
      padding: '5px 14px',
      fontSize: '13px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    dashboardExitBtn: {
      backgroundColor: '#E11D48',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      padding: '6px 14px',
      fontSize: '13px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    dashboardMainView: {
      padding: '24px 40px',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      width: '100%'
    },
    tipOfTheDayCard: {
      width: '100%',
      backgroundColor: '#FA539B',
      borderRadius: '16px',
      padding: '16px 20px',
      color: '#FFFFFF',
      boxSizing: 'border-box',
      marginBottom: '28px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      boxShadow: '0 4px 15px rgba(250, 83, 155, 0.15)'
    },
    tipTitle: {
      fontSize: '11px',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      opacity: 0.9,
      marginBottom: '3px'
    },
    tipBody: {
      fontSize: '14px',
      fontWeight: '500',
      margin: 0,
      lineHeight: '1.4'
    },
    featuresGridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '20px',
      width: '100%',
      boxSizing: 'border-box',
      paddingBottom: '30px'
    },
    featureCard: {
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      textAlign: 'left',
      boxSizing: 'border-box',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 10px rgba(0,0,0,0.02)',
      minHeight: '140px'
    },
    featureIcon: {
      fontSize: '24px',
      marginBottom: '12px',
      display: 'block'
    },
    featureTitle: {
      fontSize: '15px',
      fontWeight: '700',
      marginBottom: '6px'
    },
    featureDesc: {
      fontSize: '12px',
      lineHeight: '1.4',
      margin: 0,
      fontWeight: '500'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* Top Navbar Header bar */}
      <header style={styles.navbar}>
        <div style={styles.navBrandGroup}>
          <div style={styles.navBrandText} onClick={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}>
            Big Sister
          </div>
          <nav>
            <span style={styles.navLinkItem} onClick={() => setCurrentView(currentUser ? 'dashboard' : 'landing')}>Home</span>
            <span style={styles.navLinkItem} onClick={() => setCurrentView('about')}>About</span>
          </nav>
        </div>
        
        <div style={styles.navAuthButtons}>
          {currentUser ? (
            <>
              <span style={styles.userProfileTag}>Hi, {currentUser.fullName || 'User'} 👋</span>
              <button style={styles.navLoginBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button style={styles.navLoginBtn} onClick={() => setCurrentView('signin')}>
                Login
              </button>
              <button style={styles.navRegisterBtn} onClick={() => setCurrentView('signup')}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Screen Content Router Area */}
      <div style={styles.contentBody}>

        {/* ================= VIEW 1: LANDING SCREEN ================= */}
        {currentView === 'landing' && (
          <div style={styles.landingMainContainer}>
            <section style={styles.landingHeroSection}>
              <div style={styles.landingHeroLeft}>
                <div style={styles.landingHeroTag}>Uganda Youth & Health Support</div>
                <h1 style={styles.landingHeroTitle}>Big Sister Platform</h1>
                <p style={styles.landingHeroDesc}>
                  A free, private platform that gives teens in Uganda access to critical reproductive health information, guidance, and financial support through dynamic community-driven donations and sponsorships.
                </p>
                
                {!currentUser && (
                  <div style={styles.landingHeroBtnGroup}>
                    <button style={styles.navRegisterBtn} onClick={() => setCurrentView('signup')}>
                      Register as Teenager
                    </button>
                    <button style={styles.navLoginBtn} onClick={() => setCurrentView('signin')}>
                      Login
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* Information Grid Summary */}
            <section style={styles.landingGridSection}>
              <div style={styles.landingInfoCard}>
                <h4 style={styles.landingCardTitle}>Private Education</h4>
                <p style={styles.landingCardDesc}>
                  Access sensitive, reliable, and completely private sexual and reproductive health insights curated to ensure safety and awareness.
                </p>
              </div>
              
              <div style={styles.landingInfoCard}>
                <h4 style={styles.landingCardTitle}>Support Networks</h4>
                <p style={styles.landingCardDesc}>
                  Directly receive micro-sponsorships or donation structures targeted toward immediate wellness provisions and personal education goals.
                </p>
              </div>

              <div style={styles.landingInfoCard}>
                <h4 style={styles.landingCardTitle}>Safe Decisions</h4>
                <p style={styles.landingCardDesc}>
                  Empowering individuals with resources built to minimize teenage pregnancy metrics through direct, simplified access pipelines.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* ================= VIEW 2: SIGN IN VIEW ================= */}
        {currentView === 'signin' && (
          <div style={styles.authCardWrapper}>
            <div style={styles.authMainCard}>
              <h2 style={styles.authCardTitle}>Sign in to Big Sister</h2>

              <button 
                type="button"
                onClick={() => setShowGooglePopup(true)}
                style={{
                  width: '100%',
                  padding: '9px',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #EAEAEA',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#444444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.65-5.17 3.65-8.58z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.46l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0', color: '#D0D0D0', fontSize: '11px' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#EAEAEA' }}></div>
                <span style={{ padding: '0 8px' }}>or</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#EAEAEA' }}></div>
              </div>

              <form onSubmit={handleSignInSubmit}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Email</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    style={styles.inputField} 
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    required
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Password</label>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Enter password" 
                    style={styles.inputField} 
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    required
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', bottom: '9px', cursor: 'pointer', color: '#888888', fontSize: '13px' }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </span>
                </div>

                <button type="submit" style={styles.authSubmitBtn}>
                  Log in
                </button>
              </form>

              <div style={{ fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ color: themeColors.purple, fontWeight: '600', cursor: 'pointer' }} onClick={() => setCurrentView('forgot')}>
                  Forgot password?
                </span>
                <div style={{ color: '#555555' }}>
                  No account? <span style={{ color: themeColors.purple, fontWeight: '700', cursor: 'pointer' }} onClick={() => setCurrentView('signup')}>Create one</span>
                </div>
              </div>

              <div style={styles.privacyFooterText}>Your data is kept private and secure</div>
            </div>
          </div>
        )}

        {/* ================= VIEW 3: SIGN UP VIEW ================= */}
        {currentView === 'signup' && (
          <div style={styles.authCardWrapper}>
            <div style={styles.authMainCard}>
              <h2 style={styles.authCardTitle}>Create Account</h2>

              <form onSubmit={handleSignUpSubmit}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your full name" 
                    style={styles.inputField} 
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Email</label>
                  <input 
                    type="email" 
                    placeholder="you@example.com" 
                    style={styles.inputField} 
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Password</label>
                  <input 
                    type="password" 
                    placeholder="Create a strong password" 
                    style={styles.inputField} 
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm your password" 
                    style={styles.inputField} 
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required 
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', margin: '10px 0 8px 2px' }}>
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    style={{ cursor: 'pointer', width: '14px', height: '14px', accentColor: themeColors.purple }}
                  />
                  <label htmlFor="terms" style={{ fontSize: '11.5px', color: '#555555', cursor: 'pointer', userSelect: 'none' }}>
                    I accept the <span style={{ color: themeColors.purple, fontWeight: '600' }}>Terms & Conditions</span>
                  </label>
                </div>

                <button type="submit" style={styles.authSubmitBtn}>
                  Register
                </button>
              </form>

              <div style={{ fontSize: '12.5px', color: '#555555', marginTop: '8px' }}>
                Already have an account? <span style={{ color: themeColors.purple, fontWeight: '700', cursor: 'pointer' }} onClick={() => setCurrentView('signin')}>Log in</span>
              </div>

              <div style={styles.privacyFooterText}>Your data is kept private and secure</div>
            </div>
          </div>
        )}

        {/* ================= VIEW 4: FORGOT PASSWORD VIEW ================= */}
        {currentView === 'forgot' && (
          <div style={styles.authCardWrapper}>
            <div style={styles.authMainCard}>
              <h2 style={styles.authCardTitle}>Forgot Password?</h2>
              <p style={{ fontSize: '12.5px', color: '#666666', margin: '0 0 16px 0', lineHeight: '1.4' }}>
                Enter your email address below and we'll send you a link to reset your password safely.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); alert("Reset link dispatched."); }}>
                <div style={styles.inputGroup}>
                  <label style={styles.inputLabel}>Account Email Address</label>
                  <input type="email" placeholder="enter your email address" style={styles.inputField} required />
                </div>

                <button type="submit" style={styles.authSubmitBtn}>
                  Send Reset Link
                </button>
              </form>

              <div style={{ fontSize: '12.5px', color: '#555555' }}>
                Remembered your password? <span style={{ color: themeColors.purple, fontWeight: '700', cursor: 'pointer' }} onClick={() => setCurrentView('signin')}>Log in</span>
              </div>

              <div style={styles.privacyFooterText}>Your data is kept private and secure</div>
            </div>
          </div>
        )}

        {/* ================= VIEW 5: ABOUT US VIEW ================= */}
        {currentView === 'about' && (
          <div style={styles.authCardWrapper}>
            <div style={{ ...styles.authMainCard, maxWidth: '480px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: themeColors.purple, margin: '0 0 12px 0' }}>About Big Sister</h2>
              
              <h4 style={{ color: '#1A1A1A', margin: '8px 0 2px 0', fontSize: '14px' }}>The Platform</h4>
              <p style={{ color: '#555555', fontSize: '12.5px', lineHeight: '1.4', margin: '0 0 8px 0' }}>
                Big Sister is a free, private platform that gives teens in Uganda access to reproductive health information and financial support through donations and sponsorships.
              </p>
              
              <h4 style={{ color: '#1A1A1A', margin: '8px 0 2px 0', fontSize: '14px' }}>Our Core Mission</h4>
              <p style={{ color: '#555555', fontSize: '12.5px', lineHeight: '1.4', margin: '0 0 8px 0' }}>
                To zero down the rates of teenage pregnancies by improving and easing access to health and sex education, basic needs and economic support systems.
              </p>
              
              <h4 style={{ color: '#1A1A1A', margin: '8px 0 2px 0', fontSize: '14px' }}>Development Team</h4>
              <p style={{ color: '#555555', fontSize: '12.5px', lineHeight: '1.4', margin: '0 0 12px 0' }}>
                Uganda Christian University Computing Students and reviewed by Mr. Kisomose Tony.
              </p>
              
              <div style={{ borderTop: '1px solid #EAEAEA', paddingTop: '10px', marginTop: '12px', fontSize: '12.5px', color: themeColors.purple, fontWeight: '600' }}>
                Contact Email: info@bigsister.ucu.ac.ug
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 6: PROTECTED LOGGED IN USER DASHBOARD VIEW (FROM SCREENSHOT (61).jpg) ================= */}
        {currentView === 'dashboard' && (
          <div style={styles.dashboardWrapper}>
            {/* Top Purple Welcome Strip Line Layout */}
            <div style={styles.dashboardWelcomeBar}>
              <div style={styles.dashboardWelcomeText}>Welcome to Big Sister</div>
              
              <div style={styles.dashboardControls}>
                {/* Interactive Language Selection Button Toggle Pill */}
                <div style={styles.langSelectorWrapper}>
                  <button 
                    onClick={() => setLanguage('English')}
                    style={{
                      ...styles.langBtn,
                      backgroundColor: language === 'English' ? '#FFFFFF' : 'transparent',
                      color: language === 'English' ? '#C51FA0' : '#FFFFFF'
                    }}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('Luganda')}
                    style={{
                      ...styles.langBtn,
                      backgroundColor: language === 'Luganda' ? '#FFFFFF' : 'transparent',
                      color: language === 'Luganda' ? '#C51FA0' : '#FFFFFF'
                    }}
                  >
                    Luganda
                  </button>
                </div>

                {/* Exit Action Button */}
                <button style={styles.dashboardExitBtn} onClick={handleLogout}>
                  🚪 Exit
                </button>
              </div>
            </div>

            {/* Main Interactive App Dashboard Workspace Layout Grid */}
            <div style={styles.dashboardMainView}>
              
              {/* Tip of the Day Banner Card Block */}
              <div style={styles.tipOfTheDayCard}>
                <span style={{ fontSize: '20px' }}>💡</span>
                <div>
                  <div style={styles.tipTitle}>Health Tip of the Day</div>
                  <p style={styles.tipBody}>
                    {language === 'English' 
                      ? "Stay hydrated! Drinking enough water helps regulate your menstrual cycle and reduces cramps."
                      : "Nywa amazzi agamala! Okunywa amazzi amangi kukuuyamba okutereeza n'okukendeeza obulumi bw'omukyala."}
                  </p>
                </div>
              </div>

              {/* Core App Feature Action Cards Grid layout */}
              <div style={styles.featuresGridContainer}>
                
                {/* Card 1: Ask AI */}
                <div style={{ ...styles.featureCard, backgroundColor: '#CCFBF1' }} onClick={() => alert("Launching Secure AI Health Chatbot module...")}>
                  <span style={styles.featureIcon}>💬</span>
                  <h3 style={{ ...styles.featureTitle, color: '#0D9488' }}>Ask AI Health Bot</h3>
                  <p style={{ ...styles.featureDesc, color: '#115E59' }}>Get instant, private answers to your health questions</p>
                </div>

                {/* Card 2: Get Support */}
                <div style={{ ...styles.featureCard, backgroundColor: '#DBEAFE' }} onClick={() => alert("Opening Support, Grants and Provisions hub...")}>
                  <span style={styles.featureIcon}>🤝</span>
                  <h3 style={{ ...styles.featureTitle, color: '#2563EB' }}>Get Support</h3>
                  <p style={{ ...styles.featureDesc, color: '#1E40AF' }}>Access sanitary pads, school fees, and other support</p>
                </div>

                {/* Card 3: Talk to Counsellor */}
                <div style={{ ...styles.featureCard, backgroundColor: '#F3E8FF' }} onClick={() => alert("Connecting live chat with certified professionals...")}>
                  <span style={styles.featureIcon}>🧑‍⚕️</span>
                  <h3 style={{ ...styles.featureTitle, color: '#9333EA' }}>Talk to Counsellor</h3>
                  <p style={{ ...styles.featureDesc, color: '#6B21A8' }}>Book a session or chat live with a professional</p>
                </div>

                {/* Card 4: Learn Skills */}
                <div style={{ ...styles.featureCard, backgroundColor: '#FEF3C7' }} onClick={() => alert("Opening video portal and certification track maps...")}>
                  <span style={styles.featureIcon}>🎓</span>
                  <h3 style={{ ...styles.featureTitle, color: '#D97706' }}>Learn Skills</h3>
                  <p style={{ ...styles.featureDesc, color: '#92400E' }}>Watch videos, earn certificates, find opportunities</p>
                </div>

                {/* Card 5: Emergency Help */}
                <div style={{ ...styles.featureCard, backgroundColor: '#FEE2E2' }} onClick={() => alert("Locating nearest integrated clinic networks...")}>
                  <span style={styles.featureIcon}>🚨</span>
                  <h3 style={{ ...styles.featureTitle, color: '#DC2626' }}>Emergency Help</h3>
                  <p style={{ ...styles.featureDesc, color: '#991B1B' }}>Find nearby clinics and emergency contacts</p>
                </div>

                {/* Card 6: Track Health */}
                <div style={{ ...styles.featureCard, backgroundColor: '#FCE7F3' }} onClick={() => alert("Opening Menstrual Cycle & Symptoms analytical charts...")}>
                  <span style={styles.featureIcon}>📊</span>
                  <h3 style={{ ...styles.featureTitle, color: '#DB2777' }}>Track Health</h3>
                  <p style={{ ...styles.featureDesc, color: '#9D174D' }}>Monitor your cycle, symptoms, and health trends</p>
                </div>

                {/* Card 7: Explore More Topics */}
                <div style={{ ...styles.featureCard, backgroundColor: '#E0F2FE' }} onClick={() => alert("Loading safe educational content database library...")}>
                  <span style={styles.featureIcon}>📚</span>
                  <h3 style={{ ...styles.featureTitle, color: '#0284C7' }}>Explore More Topics</h3>
                  <p style={{ ...styles.featureDesc, color: '#075985' }}>Explore info about sex, menstruation, body changes and decision crises. Read about people's stories</p>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* ================= INTERACTIVE GOOGLE POPUP MODAL WORKFLOW ================= */}
      {showGooglePopup && (
        <div style={styles.overlay}>
          <div style={styles.popupBox}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.61c-.29 1.53-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.65-5.17 3.65-8.58z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.11-6.68-4.96H1.21v3.15C3.18 21.88 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.32 14.24A7.16 7.16 0 0 1 4.91 12c0-.79.13-1.57.38-2.31V6.54H1.21A11.94 11.94 0 0 0 0 12c0 1.92.45 3.74 1.21 5.39l4.11-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.18 2.12 1.21 5.46l4.11 3.15c.94-2.85 3.57-4.96 6.68-4.96z"/>
              </svg>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#3c4043' }}>Sign in with Google</span>
            </div>

            <p style={{ fontSize: '14px', color: '#202124', margin: '0 0 4px 0', fontWeight: '500' }}>Choose an account</p>
            <p style={{ fontSize: '12px', color: '#5f6368', margin: '0 0 16px 0' }}>to continue to <span style={{ color: themeColors.purple, fontWeight: '600' }}>Big Sister</span></p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '240px', overflowY: 'auto' }}>
              {mockGoogleAccounts.map((account) => (
                <div 
                  key={account.email}
                  onClick={() => handleGoogleAccountSelect(account)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: '#FFFFFF',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: account.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {account.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#3c4043' }}>{account.name}</div>
                    <div style={{ fontSize: '11px', color: '#5f6368' }}>{account.email}</div>
                  </div>
                </div>
              ))}
            </div>

            <div 
              style={{
                padding: '12px 8px 0 8px',
                borderTop: '1px solid #e8eaed',
                marginTop: '10px',
                fontSize: '13px',
                color: '#1a73e8',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'center'
              }}
              onClick={() => { setShowGooglePopup(false); alert("Custom email input form."); }}
            >
              Use another account
            </div>

            <button 
              onClick={() => setShowGooglePopup(false)}
              style={{
                width: '100%',
                marginTop: '14px',
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#f1f3f4',
                color: '#3c4043',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </div>
  );
}