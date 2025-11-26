"use client"
import { useUser } from '@/context/UserContext' // Import the custom hook
import React from 'react'
import Navbar from './Navbar'
import { Loader2 } from 'lucide-react'

const DashboardLayout = ({ activeMenu, children }) => {
    const { user, loading } = useUser() // Use the custom hook

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg font-semibold mb-2">Authentication Required</p>
                    <p>Please log in to access the dashboard</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Navbar activeMenu={activeMenu} />
            <div className='container mx-auto pt-4 pb-4'>
                {children}
            </div>
        </div>
    )
}

export default DashboardLayout