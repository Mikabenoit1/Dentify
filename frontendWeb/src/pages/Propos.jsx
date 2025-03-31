import AboutSection from "../components/À propos/About";
import InfoSection from "../components/À propos/Info";
import "../styles/Propos.css";
import React from 'react';

const Propos = () => {
  return (
    <div className="propos-page">
      <AboutSection />
      <InfoSection />
    </div>
  );
};

export default Propos;