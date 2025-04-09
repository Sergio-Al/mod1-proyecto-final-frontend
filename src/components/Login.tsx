import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Verificando si el usuario ya tiene un token
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Token encontrado:", token);
      navigate("/tasks");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    
    try {
      // Creando una llamada utilizando fetch api
      const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
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
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-10 rounded-lg"
      >
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}
        
        <fieldset className="fieldset w-xs mx-auto bg-base-200 border border-base-300 p-4 rounded-box">
          <legend className="fieldset-legend text-2xl">Iniciar Sesion</legend>

          <label className="fieldset-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            placeholder="Correo electronico"
          />

          <label className="fieldset-label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="btn btn-neutral mt-4">
            Enviar
          </button>
        </fieldset>
      </form>
      <p className="mt-4">
        No tienes cuenta?{" "}
        <Link to="/signup" className="text-blue-500">
          Registrate
        </Link>
      </p>
    </>
  );
}

export default Login;
