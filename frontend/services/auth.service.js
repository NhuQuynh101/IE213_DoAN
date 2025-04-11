const Login = async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    return response.json();
};
