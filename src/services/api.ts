import axios  from 'axios';
const API_BASE_URL = "https://project-management-9oxy.onrender.com";

export const registerUser = async (name: string, email: string,phone : string , password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/register`, {
      name,
      email,
      password, 
      phone 
    });

    return response.data;
    
    
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else if (error instanceof Error) {
      console.error('Generic error:', error.message);
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred during registration.');
    }
  }
};

export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/user/log_in`, {
      emailOrPhone : email,
      password,
    });

    const token = response.data.result.user.token;

    console.log("Token from response:", token); 

    localStorage.setItem('Usertoken', token);
    return true;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Login error:', error.response?.data || error.message);
    } else {
      console.error('Login error:', error);
    }
    return false;
  }
};



