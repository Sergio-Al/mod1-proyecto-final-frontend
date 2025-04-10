import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaTasks, FaBars, FaTimes } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleLogout = () => {
    logout();
    // Redirect to login or home page can be handled in your AppRoutes component
  };

  return (
    <header className="sticky top-0 z-10">
      <div className="navbar bg-base-200 shadow-lg px-4">
        <div className="navbar-start">
          <div className="flex items-center gap-2">
            <FaTasks className="text-primary text-xl" />
            <h2 className="text-xl md:text-2xl font-bold truncate max-w-[150px] md:max-w-full">
              {title}
            </h2>
          </div>
        </div>

        <div className="navbar-center hidden md:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/tasks">Tareas</Link>
            </li>
          </ul>
        </div>

        <div className="navbar-end">
          {isAuthenticated && (
            <div className="tooltip tooltip-left" data-tip="Cerrar Sesión">
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-primar btn-sm md:btn-md"
                aria-label="Cerrar Sesión"
              >
                <span className="hidden sm:inline">
                  <MdLogout />
                </span>
                <span className="inline sm:hidden">
                  <MdLogout />
                </span>
              </button>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="btn btn-outline btn-sm btn-primary md:hidden ml-2"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg">
          <ul className="menu menu-vertical p-2">
            <li>
              <Link to="/tasks" onClick={toggleMenu}>
                Tareas
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
