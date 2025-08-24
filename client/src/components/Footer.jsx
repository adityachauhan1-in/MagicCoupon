import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10 text-center">
      {/* Brand */}
      <h2 className="text-xl font-bold text-white mb-3">MagicCoupon</h2>

      {/* Social Icons */}
      <div className="flex justify-center space-x-6 mb-3">
        <a
          href="https://github.com/adityachauhan1-in"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub className="text-2xl hover:text-white transition duration-300" />
        </a>
        <a href="https://www.linkedin.com/in/aditya-chauhan-103a6137b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " target="_blank" rel="noreferrer">
          <FaLinkedin className="text-2xl hover:text-white transition duration-300" />
        </a>
    
      </div>

      {/* Copyright */}
      <p className="text-sm text-gray-500">
        © {new Date().getFullYear()} MagicCoupon. All rights reserved. <br />
        <span className="text-gray-400">Made with ❤️ by Aditya Chauhan</span>
      </p>
    </footer>
  );
};

export default Footer;
