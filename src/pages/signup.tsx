import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function SignUp() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      navigate('.tasks') //Rediriger vers la page tasks
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
        <button type="submit">Sign Up</button>
      </form>
    );
  }