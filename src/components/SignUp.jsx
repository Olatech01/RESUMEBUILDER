"use client"
import React, { useContext, useState } from 'react'
import { authStyles as styles } from '@/assets/dummystyle'
import { UserContext } from '@/context/UserContext';
import { validateEmail } from '@/utils/helper';
import axiosInstance from '@/utils/axiosInstance';
import { API_PATH } from '@/utils/apiPaths';
import { useRouter } from 'next/navigation';
import Inputs from './Inputs';
import toast from 'react-hot-toast';

const SignUp = ({ setCurrentPage }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { updateUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);


    const router = useRouter()


    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!fullName) {
            setError("Please enter fillName")
            return
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address")
            return
        }

        if (!password) {
            setError("Please enter password")
            return
        }

        setError('')
        try {
            setLoading
            const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
                name: fullName,
                email,
                password
            })

            const { user } = response.data

            if (user?.token) {
                localStorage.setItem('token', user.token)
                updateUser({ ...user, token: user.token })
                router.push('/dashboard')
                toast.success("Account created successfully")
            }
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong, please try again")
        } finally {
            setLoading(false);
        }

    }


    return (
        <div className={styles.signupContainer}>
            <div className={styles.headerWrapper}>
                <h1 className={styles.signupTitle}>
                    Create Account
                </h1>
                <p className={styles.signupSubtitle}>
                    Join thousands of professionals today
                </p>
            </div>

            <form onSubmit={handleSignUp} className={styles.signupForm}>
                <Inputs
                    value={fullName}
                    onChange={({ target }) => setFullName(target.value)}
                    label="Full Name"
                    placeholder="John Doe"
                    type='text'
                />
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>


                <p className={styles.switchText}>
                    Already have an account {' '}
                    <button onClick={() => setCurrentPage('login')}
                        type='button'
                        className={styles.signupSwitchButton}>
                        Sign In
                    </button>
                </p>
            </form>
        </div>
    )
}

export default SignUp