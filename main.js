import React, { useEffect, useRef, useState, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import * as THREE from 'three';

// Theme context
const ThemeContext = createContext();

// Theme provider component
const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const theme = {
    isDark,
    colors: {
      background: isDark ? '#1a1a1a' : '#f5f5f5',
      text: isDark ? '#ffffff' : '#333333',
      cube: isDark ? 0xff00ff : 0x00ffff,
      buttonBg: isDark ? '#ffffff20' : '#00000020',
      buttonHover: isDark ? '#ffffff40' : '#00000040',
      buttonText: isDark ? '#ffffff' : '#333333',
      buttonBorder: isDark ? '#ffffff30' : '#00000030',
    },
    toggleTheme: () => setIsDark(!isDark),
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

// [ChatAIClass code remains unchanged...]

const App = () => {
  const mountRef = useRef(null);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(pixelRatio);
      
      camera.position.z = 5;
    };
    
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: theme.colors.cube, wireframe: true });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
    
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme.colors.cube]);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.colors.background,
      transition: 'background-color 0.3s ease',
      overflow: 'hidden',
    }}>
      <div ref={mountRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        fontFamily: "'Segoe UI', 'Roboto', sans-serif",
        color: theme.colors.text,
        transition: 'color 0.3s ease',
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '2rem',
          textShadow: theme.isDark ? '0 0 10px rgba(255,255,255,0.3)' : '0 0 10px rgba(0,0,0,0.1)',
          letterSpacing: '0.1em',
          transition: 'all 0.3s ease',
        }}>
          Hello World
        </h1>
        <button
          onClick={theme.toggleTheme}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '25px',
            border: `2px solid ${theme.colors.buttonBorder}`,
            backgroundColor: theme.colors.buttonBg,
            color: theme.colors.buttonText,
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            boxShadow: theme.isDark 
              ? '0 4px 6px rgba(0,0,0,0.2)' 
              : '0 4px 6px rgba(0,0,0,0.1)',
            ':hover': {
              backgroundColor: theme.colors.buttonHover,
              transform: 'translateY(-2px)',
              boxShadow: theme.isDark 
                ? '0 6px 8px rgba(0,0,0,0.3)' 
                : '0 6px 8px rgba(0,0,0,0.2)',
            },
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.buttonHover;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.buttonBg;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {theme.isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById('renderDiv');
const root = ReactDOM.createRoot(container);
root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);