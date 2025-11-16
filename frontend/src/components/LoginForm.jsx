import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../services/api';

export default function LoginForm() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            const response = await AuthService.login({
                username: credentials.email, // Corrige para enviar 'username' ao backend
                password: credentials.password,
            });
            console.log('Resposta do backend:', response);
            localStorage.setItem('token', response.access_token);
            navigate('/');
        } catch (error) {
            console.error('Erro ao autenticar:', error);
            const backendError = error.response?.data?.detail || 'Erro ao conectar ao servidor';
            setErrorMessage(backendError);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <TextField
                        label="Email"
                        type="email"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                        required
                    />
                    <TextField
                        label="Senha"
                        type="password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Entrar
                    </Button>
                </form>
            </CardContent>
            <Snackbar 
                open={Boolean(errorMessage)} 
                autoHideDuration={6000} 
                onClose={() => setErrorMessage('')}
            >
                <Alert severity="error" onClose={() => setErrorMessage('')}>
                    {typeof errorMessage === 'string' ? errorMessage : 'Erro desconhecido'}
                </Alert>
            </Snackbar>
        </Card>
    );
}