import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../shared/context/AuthContext";
import { env } from "../shared/config/env";

const API_URL = env.API_URL;

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  message?: string;
}

function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const {login }= useAuth();

  useEffect(() => {
    // Check if user already has a token
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token found:", token);
      navigate("/tasks");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      const data: LoginResponse = await response.json();
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        login(data.token);
        navigate("/tasks");
      } else {
        setErrorMessage(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      setErrorMessage("Error de conexión. Intente nuevamente.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-6">
        <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
            
            {errorMessage && (
              <div className="alert alert-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{errorMessage}</span>
              </div>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Correo electrónico"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered w-full"
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">
                Iniciar Sesión
              </button>
            </div>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p>
            ¿No tienes cuenta?{" "}
            <Link to="/signup" className="link link-primary">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
