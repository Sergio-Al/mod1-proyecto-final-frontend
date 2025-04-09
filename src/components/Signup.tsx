import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (errors.length > 0) {
      alert(errors[0]);
      return;
    }

    // Llamada al backend para el registro 
    const response = await fetch('http://localhost:3000/users/crear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert('Signup successful! Please login.');
      navigate('/login');
    } else {
      alert(data.message);
    }
  };

  const validatePassword = (password: string) => {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('La contraseña debe tener al menos 6 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('La contraseña debe contener al menos una letra minúscula');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un número');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('La contraseña debe contener al menos un caracter especial');
    }

    return errors;
  }

  const updatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors([]); // Limpiar errores al escribir
    const newPassword = e.target.value;
    setPassword(newPassword);
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setErrors((prev) => [...prev, ...passwordErrors]);
    } else {
      setErrors((prev) => prev.filter((error) => !passwordErrors.includes(error)));
    }
  }


  const updateConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      if (!errors.includes('Las contraseñas no coinciden')) {
        setErrors((prev) => [...prev, 'Las contraseñas no coinciden']);
      }
    } else {
      setErrors((prev) => prev.filter((error) => error !== 'Las contraseñas no coinciden'));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="fieldset w-xs mx-auto bg-base-200 border border-base-300 p-4 rounded-box ">
        <legend className='fieldset-legend text-2xl'>Registro</legend>
        <label className="fieldset-label">Email</label>
        <input
          type="text"
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className='input'
          placeholder="Nombre del usuario"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          placeholder="Correo electronico"
        />
        <input
          type='password'
          required
          className='input'
          placeholder='Contraseña'
          value={password}
          onChange={(e) => updatePassword(e)}
        />
        <input
          type="password"
          required
          className="input"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => updateConfirmPassword(e)}
        />
        {errors.length > 0 && (
          <div className="alert alert-error shadow-lg mt-4">
            <ol>
              {errors.map((error) => (<li>- {error}</li>))}
            </ol>
          </div>
        )}
        <button type="submit" className="btn btn-neutral mt-4 bg-gray-800">
          <span className='text-md font-medium'>Registrarse</span>
        </button>
      </fieldset>
    </form>
  );
}

export default Signup;
