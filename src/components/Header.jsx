import React, { useState, useEffect } from "react";
import { FaRobot, FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "../components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../components/ui/dialog";
import Button1 from "../components/ui/Button1";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
// import {useNavigate } from "react-router-dom";


function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Login Success:", tokenResponse);

      try {
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        console.log("User Profile:", userInfo.data);
        localStorage.setItem("user", JSON.stringify(userInfo.data));
        setUser(userInfo.data);

        // toast.success(`Welcome, ${userInfo.data.name}!`);
        setOpenDialog(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // toast.error("Failed to fetch user details");
      }
    },
    onError: (error) => {
      console.log("Login Error:", error);
      // toast.error("Google login failed");
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null);
    setIsProfileMenuOpen(false);
    // toast.success("Logged out successfully");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900 bg-opacity-90 backdrop-blur-md"
          : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-opacity-70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo and Brand Name */}
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <FaRobot className="text-3xl text-blue-400" />
          <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            QuizGen
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {[
            { name: "Home", link: "/" },
            { name: "Features", link: "/features" },
            { name: "BookMarks", link: "/bookmarks" },
            { name: "MyNotes", link: "/Notes" },
          ].map((item) =>
            item.link.startsWith("") ? (
              // Keep <a> for scrolling within the same page
              <motion.a
                key={item.name}
                href={item.link}
                className="text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.name}
              </motion.a>
            ) : (
              // Use <Link> for React Router navigation
              <Link
                key={item.name}
                to={item.link}
                className="text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        {/* User Authentication or Profile Section */}
        <div className="flex items-center gap-6">
          {user ? (
            <div className="relative">
              {/* User Profile Button */}
              <motion.button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleProfileMenu}
              >
                <FaUser className="text-lg" />
                <span>{user.name}</span>
              </motion.button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                >
                  <button
                    className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      // Navigate to profile page or open profile modal
                      console.log("Profile clicked");
                      // navigate("/Profile")
                      setIsProfileMenuOpen(false);
                      
                    }}
                  >
                    <FaUser className="inline-block mr-2" />
                    <a href="/Profile">Profile</a>
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-700 transition-colors"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="inline-block mr-2" />
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              className="hidden md:block px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenDialog(true)}
            >
              Sign in
            </motion.button>
          )}
        </div>

        {/* Google Login Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-gradient-to-br from-gray-900 to-blue-900 text-white rounded-lg p-8 shadow-xl max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-bold mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Sign In With Google
                </span>
              </DialogTitle>
              <DialogDescription className="text-center text-gray-300 mb-6">
                <FaRobot className="text-5xl text-blue-400 mx-auto mb-4" />
                <span>
                  Access AI-powered quiz generation with Google authentication
                </span>
              </DialogDescription>
            </DialogHeader>
            <Button1
              onClick={login}
              className="w-full py-3 flex gap-4 items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 transform text-lg font-semibold"
            >
              <FcGoogle className="h-6 w-6" />
              Sign In With Google
            </Button1>
            <DialogFooter className="mt-6 text-center text-sm text-gray-400">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <motion.button
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl text-gray-300" />
            ) : (
              <FaBars className="text-2xl text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute w-full left-0 bg-gray-900 bg-opacity-95 backdrop-blur-md shadow-lg"
        >
          <nav className="flex flex-col p-4">
            {["Home", "Features", "Pricing", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="py-3 text-gray-300 hover:text-blue-400 transition-colors"
                onClick={closeMenu}
                whileHover={{ scale: 1.05, x: 10 }}
              >
                {item}
              </motion.a>
            ))}
            <motion.button
              className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Header;