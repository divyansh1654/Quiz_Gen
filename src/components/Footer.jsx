import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa6"; // If using fa6 icons

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10 w-full ">
      {/* Use the same max-width and padding as the header */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Footer Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Brand Info */}
          <div>
            <h2 className="text-lg font-semibold text-blue-400">🌍 QuizGen</h2>
            <p className="text-gray-400 text-sm">Learn smart, test better! ✈️</p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="text-lg font-semibold text-blue-400">Quick Links</h2>
            <ul className="mt-2 text-gray-400 text-sm space-y-1">
              <li>
                <a href="/" className="hover:text-blue-400 transition">🏠 Home</a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-400 transition">ℹ️ About</a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-400 transition">📞 Contact</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-blue-400 transition">🔒 Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h2 className="text-lg font-semibold text-blue-400">Follow Us</h2>
            <div className="flex justify-center md:justify-start gap-4 mt-2">
              <a
                href="mailto:divyansh.sharma1654@gmail.com"
                className="text-gray-400 hover:text-blue-400 transition"
              >
                <FaEnvelope size={20} />
              </a>
              <a
                href="https://www.instagram.com/being_hydrogen1654/"
                className="text-gray-400 hover:text-blue-400 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/divyansh-sharma1654/"
                className="text-gray-400 hover:text-blue-400 transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} QuizGen. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;