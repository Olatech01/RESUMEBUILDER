"se client";
import { UserContext } from '@/context/UserContext';
import { API_PATH } from '@/utils/apiPaths';
import axiosInstance from '@/utils/axiosInstance';
import { validateEmail } from '@/utils/helper';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { authStyles as styles } from '@/assets/dummystyle';
import Inputs from './Inputs';
import toast from 'react-hot-toast';

const Login = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { updateUser } = useContext(UserContext);

  const router = useRouter();


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    if (!password) {
      setError('Password cannot be empty');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }


    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, { email, password });

      const { statusCode, user } = response.data;

      console.log('Login Response:', response);

      if (statusCode === "00" && user?.token) {
        localStorage.setItem('token', user.token);
        updateUser({ ...user, token: user.token });
        toast.success("Logged in successfully");
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong, please try again")
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <h3 className={styles.title}>
          Welcome Back!
        </h3>
        <p className={styles.subtitle}>
          Sign in to continue building amazing resumes.
        </p>
      </div>

      <form onSubmit={handleLogin} className={styles.signupForm}>
        <Inputs
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          label="Email Address"
          placeholder="example@gmail.com"
          type='email'
        />
        <Inputs
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          label="Password"
          placeholder="Min 8 Characters"
          type='password'
        />

        {error && <div className={styles.errorMessage}>{error}</div>}
        <button type='submit' className={styles.signupSubmit}>
          Sign In
        </button>


        <p className={styles.switchText}>
         Dont have an account{' '}
          <button onClick={() => setCurrentPage('signup')}
            type='button'
            className={styles.signupSwitchButton}>
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}

export default Login