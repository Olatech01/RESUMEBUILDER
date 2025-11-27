"use client"
import { useUser } from '@/context/UserContext' // Import the custom hook
import React from 'react'
import Navbar from './Navbar'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { dashboardStyles as styles } from '@/assets/dummystyle'

const DashboardLayout = ({ activeMenu, children }) => {
    const { user, loading } = useUser() 
    const router = useRouter()

    // if (loading) {
    //     return (
    //         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    //             <div className="text-center">
    //                 <Loader2 className="animate-spin mx-auto mb-4" size={32} />
    //                 <p>Loading...</p>
    //             </div>
    //         </div>
    //     )
    // }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center flex flex-col gap-2.5">
                    <p className="text-lg font-semibold mb-2">Authentication Required</p>
                    <p>Please log in to access the dashboard</p>
                    <button className={styles.createButton} onClick={() => router.push("/")}>
                        <div className={styles.createButtonOverlay}></div>
                        <span className={styles.createButtonContent}>
                            Continue
                        </span>
                    </button>
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