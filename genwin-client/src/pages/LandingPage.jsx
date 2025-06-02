"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Icons as SVG components
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const UsersIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const MessageHeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
  </svg>
);

const GiftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600&family=Pacifico&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Add base styles
    const style = document.createElement("style");
    style.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        font-family: "Fredoka", sans-serif;
        color: #333333;
        background-color: #f9f8fd;
        background-image: 
          radial-gradient(#ff9a8b 2px, transparent 2px),
          radial-gradient(#fad0c4 2px, transparent 2px);
        background-size: 40px 40px;
        background-position: 0 0, 20px 20px;
        min-height: 100vh;
      }
    `;
    document.head.appendChild(style);

    setIsLoaded(true);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(style);
    };
  }, []);

  // CSS Styles as objects
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: '"Fredoka", sans-serif',
    },
    header: {
      textAlign: "center",
      padding: "1.5rem 1rem 2.5rem",
      background:
        "linear-gradient(45deg, #FF3CAC 0%, #FF9A5F 50%, #FFC83D 100%)",
      color: "white",
      fontWeight: "bold",
      textShadow: "3px 3px 0px rgba(0, 0, 0, 0.15)",
      borderBottomLeftRadius: "30% 30px",
      borderBottomRightRadius: "30% 30px",
      position: "relative",
      boxShadow: "0 5px 15px rgba(255, 60, 172, 0.3)",
      zIndex: 10,
    },
    headerTitle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "15px",
      fontFamily: '"Pacifico", cursive',
      fontSize: "2.5rem",
      transform: "rotate(-2deg)",
    },
    headerSubtitle: {
      marginTop: "0.5rem",
      fontSize: "1.25rem",
      maxWidth: "400px",
      margin: "0 auto",
    },
    main: {
      flex: 1,
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem 1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    card: {
      background: "rgba(255, 255, 255, 0.95)",
      padding: "2rem",
      borderRadius: "24px",
      boxShadow:
        "rgba(255, 60, 172, 0.4) 5px 5px, rgba(255, 154, 95, 0.3) 10px 10px, rgba(255, 200, 61, 0.2) 15px 15px",
      transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
      border: "3px solid #FF9A5F",
      maxWidth: "800px",
      width: "100%",
      margin: "0 auto",
      position: "relative",
      zIndex: 1,
      transform: isLoaded ? "translateY(0)" : "translateY(20px)",
      opacity: isLoaded ? 1 : 0,
    },
    cardHover: {
      transform: "translateY(-5px) translateX(-5px)",
      boxShadow:
        "rgba(255, 60, 172, 0.4) 10px 10px, rgba(255, 154, 95, 0.3) 15px 15px, rgba(255, 200, 61, 0.2) 20px 20px",
    },
    titleSection: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#333333",
      fontFamily: '"Fredoka", sans-serif',
      position: "relative",
      display: "inline-block",
    },
    highlight: {
      background: "linear-gradient(120deg, #FFC83D 0%, #FFC83D 100%)",
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 40%",
      backgroundPosition: "0 90%",
      transition: "background-size 0.25s ease-in",
      padding: "0 5px",
    },
    subtitle: {
      fontSize: "1.25rem",
      color: "#666",
      maxWidth: "600px",
      margin: "0 auto",
    },
    featuresGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "1.5rem",
      marginBottom: "2.5rem",
    },
    featureItem: {
      textAlign: "center",
      padding: "1rem",
      transition: "transform 0.3s ease",
    },
    featureIcon: {
      width: "64px",
      height: "64px",
      margin: "0 auto 0.75rem",
      background: "linear-gradient(45deg, #FF3CAC 0%, #FF9A5F 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    },
    featureTitle: {
      fontWeight: "bold",
      fontSize: "1.25rem",
      marginBottom: "0.5rem",
      animation: "colorPulse 3s infinite alternate",
    },
    featureText: {
      color: "#666",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginTop: "1.5rem",
      width: "100%",
      justifyContent: "center",
    },
    button: {
      display: "inline-block",
      background: "#FF3CAC",
      color: "white",
      fontSize: "1.2rem",
      fontWeight: "600",
      padding: "12px 24px",
      borderRadius: "50px",
      border: "none",
      transition: "all 0.3s ease",
      boxShadow: "0 6px 0 #d03090",
      cursor: "pointer",
      position: "relative",
      top: 0,
      letterSpacing: "1px",
      textTransform: "uppercase",
      textAlign: "center",
      textDecoration: "none",
    },
    buttonHover: {
      transform: "translateY(-3px)",
      boxShadow: "0 9px 0 #d03090",
    },
    buttonActive: {
      transform: "translateY(3px)",
      boxShadow: "0 3px 0 #d03090",
    },
    signUpButton: {
      background: "#FF9A5F",
      boxShadow: "0 6px 0 #e06a34",
      position: "relative",
      overflow: "hidden",
    },
    signUpButtonHover: {
      boxShadow: "0 9px 0 #e06a34",
    },
    signUpButtonActive: {
      boxShadow: "0 3px 0 #e06a34",
    },
    testimonials: {
      marginTop: "4rem",
      maxWidth: "1000px",
      width: "100%",
    },
    testimonialsTitle: {
      fontSize: "1.75rem",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: "2rem",
      position: "relative",
      display: "inline-block",
      paddingBottom: "0.5rem",
    },
    testimonialsBorder: {
      position: "relative",
    },
    testimonialsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "1.5rem",
    },
    testimonialCard: {
      padding: "1.5rem",
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "24px",
      boxShadow: "5px 5px 0 rgba(255, 60, 172, 0.4)",
      border: "2px solid #FF9A5F",
    },
    testimonialText: {
      fontStyle: "italic",
      marginBottom: "1rem",
    },
    testimonialAuthor: {
      fontWeight: "bold",
    },
    footer: {
      padding: "1.5rem 1rem",
      borderTop: "1px solid #ffcce0",
      textAlign: "center",
    },
    footerText: {
      fontSize: "0.875rem",
      color: "#666",
    },
    footerLinks: {
      display: "flex",
      justifyContent: "center",
      gap: "1rem",
      marginTop: "0.75rem",
    },
    footerLink: {
      fontSize: "0.875rem",
      color: "#FF3CAC",
      textDecoration: "none",
    },
    footerLinkHover: {
      textDecoration: "underline",
    },
    // Media queries handled with inline conditions
  };

  // Animation keyframes
  const keyframes = `
    @keyframes bounce {
      0% { transform: translateY(0) rotate(0deg); }
      100% { transform: translateY(-10px) rotate(10deg); }
    }
    
    @keyframes colorPulse {
      0% { color: #FF3CAC; }
      50% { color: #FFC83D; }
      100% { color: #FF9A5F; }
    }
    
    @keyframes gradientMove {
      0% { background-position: 0% 0%; }
      100% { background-position: 200% 0%; }
    }
    
    @keyframes confettiDrop {
      0% { top: -20px; opacity: 0; }
      50% { opacity: 1; }
      100% { top: 120%; opacity: 0; }
    }
    
    .heart-icon {
      animation: bounce 0.8s ease infinite alternate;
      fill: white;
    }
    
    .pulse-element {
      animation: colorPulse 3s infinite alternate;
    }
    
    .fun-border::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(45deg, #FF3CAC 0%, #FF9A5F 50%, #FFC83D 100%);
      background-size: 200% 100%;
      animation: gradientMove 3s linear infinite;
    }
    
    .confetti-button::before {
      content: "🎉";
      position: absolute;
      top: -20px;
      left: 50%;
      opacity: 0;
      transform: translateX(-50%);
      transition: all 0.5s ease;
    }
    
    .confetti-button:hover::before {
      animation: confettiDrop 0.5s forwards;
    }
  `;

  // Add keyframes to document
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = keyframes;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [keyframes]);

  // Button hover states
  const [loginHover, setLoginHover] = useState(false);
  const [loginActive, setLoginActive] = useState(false);
  const [signUpHover, setSignUpHover] = useState(false);
  const [signUpActive, setSignUpActive] = useState(false);
  const [cardHover, setCardHover] = useState(false);
  const [footerLinkHover, setFooterLinkHover] = useState({});

  // Responsive styles
  const isMobile = window.innerWidth < 768;

  return (
    <div style={styles.container}>
      {/* Add keyframes style */}
      <style>{keyframes}</style>

      {/* Valentine's Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>
          <span>Genwin</span>
          <HeartIcon className="heart-icon" />
        </h1>
        <p style={styles.headerSubtitle}>Find your best connections!</p>
      </header>

      <main style={styles.main}>
        {/* Main Card */}
        <div
          style={{
            ...styles.card,
            ...(cardHover ? styles.cardHover : {}),
          }}
          onMouseEnter={() => setCardHover(true)}
          onMouseLeave={() => setCardHover(false)}
        >
          <div style={styles.titleSection}>
            <h2 style={styles.title}>
              <span style={styles.highlight}>Welcome to Genwin</span>
            </h2>
            <p style={styles.subtitle}>
              Connect with amazing people and build meaningful relationships in
              a fun and engaging way.
            </p>
          </div>

          {/* Features */}
          <div style={styles.featuresGrid}>
            <div
              style={{
                ...styles.featureItem,
                transform: isMobile ? "none" : "scale(1)",
                ":hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <div style={styles.featureIcon}>
                <UsersIcon />
              </div>
              <h3 className="pulse-element" style={styles.featureTitle}>
                Find Connections
              </h3>
              <p style={styles.featureText}>
                Discover people with similar interests and passions
              </p>
            </div>
            <div style={styles.featureItem}>
              <div
                style={{
                  ...styles.featureIcon,
                  background:
                    "linear-gradient(45deg, #FF9A5F 0%, #FFC83D 100%)",
                }}
              >
                <MessageHeartIcon />
              </div>
              <h3 className="pulse-element" style={styles.featureTitle}>
                Chat & Connect
              </h3>
              <p style={styles.featureText}>
                Engage in meaningful conversations with new friends
              </p>
            </div>
            <div style={styles.featureItem}>
              <div
                style={{
                  ...styles.featureIcon,
                  background:
                    "linear-gradient(45deg, #FFC83D 0%, #FF3CAC 100%)",
                }}
              >
                <GiftIcon />
              </div>
              <h3 className="pulse-element" style={styles.featureTitle}>
                Share Experiences
              </h3>
              <p style={styles.featureText}>
                Create lasting memories with your new connections
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div
            style={{
              ...styles.buttonContainer,
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <button
              onClick={() => navigate("/login")}
              style={{
                ...styles.button,
                ...(loginHover ? styles.buttonHover : {}),
                ...(loginActive ? styles.buttonActive : {}),
              }}
              onMouseEnter={() => setLoginHover(true)}
              onMouseLeave={() => setLoginHover(false)}
              onMouseDown={() => setLoginActive(true)}
              onMouseUp={() => setLoginActive(false)}
              onTouchStart={() => setLoginActive(true)}
              onTouchEnd={() => setLoginActive(false)}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="confetti-button"
              style={{
                ...styles.button,
                ...styles.signUpButton,
                ...(signUpHover ? styles.buttonHover : {}),
                ...(signUpHover ? styles.signUpButtonHover : {}),
                ...(signUpActive ? styles.buttonActive : {}),
                ...(signUpActive ? styles.signUpButtonActive : {}),
              }}
              onMouseEnter={() => setSignUpHover(true)}
              onMouseLeave={() => setSignUpHover(false)}
              onMouseDown={() => setSignUpActive(true)}
              onMouseUp={() => setSignUpActive(false)}
              onTouchStart={() => setSignUpActive(true)}
              onTouchEnd={() => setSignUpActive(false)}
            >
              Sign Up{" "}
              <ArrowRightIcon
                style={{
                  display: "inline",
                  marginLeft: "5px",
                  verticalAlign: "middle",
                }}
              />
            </button>
          </div>
        </div>

        {/* Testimonials */}
        <div style={styles.testimonials}>
          <h3
            className="fun-border"
            style={{
              ...styles.testimonialsTitle,
              ...styles.testimonialsBorder,
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              display: "table",
            }}
          >
            What Our Users Say
          </h3>
          <div style={styles.testimonialsGrid}>
            <div style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "Genwin helped me find amazing friends with similar interests.
                The platform is so fun to use!"
              </p>
              <p style={styles.testimonialAuthor}>- Sarah J.</p>
            </div>
            <div style={styles.testimonialCard}>
              <p style={styles.testimonialText}>
                "I've made meaningful connections that turned into real
                friendships. Highly recommend!"
              </p>
              <p style={styles.testimonialAuthor}>- Michael T.</p>
            </div>
          </div>
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          &copy; {new Date().getFullYear()} Genwin. All rights reserved.
        </p>
        <div style={styles.footerLinks}>
          <a
            href="/terms"
            style={{
              ...styles.footerLink,
              ...(footerLinkHover.terms ? styles.footerLinkHover : {}),
            }}
            onMouseEnter={() =>
              setFooterLinkHover({ ...footerLinkHover, terms: true })
            }
            onMouseLeave={() =>
              setFooterLinkHover({ ...footerLinkHover, terms: false })
            }
          >
            Terms
          </a>
          <a
            href="/privacy"
            style={{
              ...styles.footerLink,
              ...(footerLinkHover.privacy ? styles.footerLinkHover : {}),
            }}
            onMouseEnter={() =>
              setFooterLinkHover({ ...footerLinkHover, privacy: true })
            }
            onMouseLeave={() =>
              setFooterLinkHover({ ...footerLinkHover, privacy: false })
            }
          >
            Privacy
          </a>
          <a
            href="/contact"
            style={{
              ...styles.footerLink,
              ...(footerLinkHover.contact ? styles.footerLinkHover : {}),
            }}
            onMouseEnter={() =>
              setFooterLinkHover({ ...footerLinkHover, contact: true })
            }
            onMouseLeave={() =>
              setFooterLinkHover({ ...footerLinkHover, contact: false })
            }
          >
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
