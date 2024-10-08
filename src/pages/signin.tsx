import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../firebase';  // Importez la fonction Google

export function Signin() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Gestion de la connexion via Google
    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            navigate('/tasks');  // Redirige l'utilisateur après la connexion réussie
        } catch (error) {
            setError('Erreur lors de la connexion avec Google.');
            console.error('Erreur lors de la connexion avec Google : ', error);
        }
    };

    return (
        <div>
            <h2>Connexion avec Google</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <button onClick={handleGoogleSignIn} className="google-signin-button">
                Connexion avec Google
            </button>
        </div>
    );
}