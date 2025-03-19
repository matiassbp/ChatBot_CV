import React from "react";
import { SiGooglegemini } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="mt-6 text-center text-sm text-blue-200 opacity-70 py-4">
      <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-4">
        <p>Proyecto realizado por fines educativos</p>
        <span>-</span>
        <div className="flex items-center">
          <span>API y recursos proporcionados por</span>
          <SiGooglegemini className="h-5 w-auto mx-2 bg-violet-500 rounded-2xl" viewBox="0 0 24 24" />
          <span>Google Gemini</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;