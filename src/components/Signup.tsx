import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { env } from "../shared/config/env";

const API_URL = env.API_URL;

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface SignupResponse {
  message: string;
}

function Signup() {
  const [formData, setFormData] = useState<
    SignupData & { confirmPassword: string }
  >({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Password validation when the password field changes
    if (name === "password") {
      validatePassword(value);
    }

    // Confirm password validation
    if (name === "confirmPassword") {
      validateConfirmPassword(value);
    }
  };

  const validatePassword = (password: string) => {
    const newErrors: string[] = [];

    if (password.length < 6) {
      newErrors.push("La contraseña debe tener al menos 6 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      newErrors.push(
        "La contraseña debe contener al menos una letra mayúscula"
      );
    }
    if (!/[a-z]/.test(password)) {
      newErrors.push(
        "La contraseña debe contener al menos una letra minúscula"
      );
    }
    if (!/[0-9]/.test(password)) {
      newErrors.push("La contraseña debe contener al menos un número");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      newErrors.push(
        "La contraseña debe contener al menos un caracter especial"
      );
    }

    // Keep any confirm password error if it exists
    const confirmPasswordError = errors.find(
      (error) => error === "Las contraseñas no coinciden"
    );

    setErrors([
      ...newErrors,
      ...(confirmPasswordError ? [confirmPasswordError] : []),
    ]);

    return newErrors.length === 0;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword !== formData.password) {
      if (!errors.includes("Las contraseñas no coinciden")) {
        setErrors((prev) => [
          ...prev.filter((e) => e !== "Las contraseñas no coinciden"),
          "Las contraseñas no coinciden",
        ]);
      }
      return false;
    } else {
      setErrors((prev) =>
        prev.filter((error) => error !== "Las contraseñas no coinciden")
      );
      return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errors.length > 0) {
      return; // Don't submit if there are validation errors
    }

    try {
      // Extract only the fields needed for the API
      const { name, email, password } = formData;

      const response = await fetch(`${API_URL}/users/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data: SignupResponse = await response.json();

      if (response.ok) {
        // Show success toast using DaisyUI
        document.body.appendChild(
          createToast("¡Registro exitoso! Por favor inicia sesión.", "success")
        );
        navigate("/login");
      } else {
        document.body.appendChild(
          createToast(data.message || "Error en el registro", "error")
        );
      }
    } catch (error) {
      document.body.appendChild(
        createToast("Error de conexión. Intente nuevamente.", "error")
      );
      console.error("Signup error:", error);
    }
  };

  // Helper function to create toast notifications
  const createToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const toast = document.createElement("div");
    toast.className = `toast toast-top toast-end`;

    const alert = document.createElement("div");
    alert.className = `alert ${
      type === "success" ? "alert-success" : "alert-error"
    }`;
    alert.textContent = message;

    toast.appendChild(alert);

    // Auto remove after 3 seconds
    setTimeout(() => toast.remove(), 3000);

    return toast;
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-6">
        <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold mb-4 text-center">
              Registro
            </h2>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Nombre</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Nombre del usuario"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Correo electrónico"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Contraseña</span>
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Contraseña"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirmar Contraseña</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input input-bordered"
                placeholder="Confirmar contraseña"
              />
            </div>

            {errors.length > 0 && (
              <div className="alert alert-error shadow-lg mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <ul className="list-disc pl-5">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={errors.length > 0}
              >
                Registrarse
              </button>
            </div>
          </div>
        </form>

        <div className="text-center mt-4">
          <p>
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="link link-primary">
              Iniciar Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
