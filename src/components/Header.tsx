import { FaBeer } from "react-icons/fa";

function Header() {
  return (
    <div className="navbar bg-base-100 shadow-sm w-full">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <FaBeer className="text-2xl" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <a className="btn btn-ghost text-xl">Gestor de tareas</a>
      </div>
      <div className="navbar-end">
        <button className="btn btn-circle mx-1">
          <div className="indicator">
            <FaBeer className="text-2xl text-white" />
          </div>
        </button>
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <FaBeer className="text-xl text-white" />
            <span className="badge badge-xs badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Header;
