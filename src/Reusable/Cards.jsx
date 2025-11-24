"use client";
import { cardStyles } from "@/assets/dummystyle";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useContext } from "react";



export const ProfileInfoCard = () => {
    const router = useRouter();

    const [user, clearUser] = useContext(UserContext);

    const handleLogout = () => {
        localStorage.clear();
        clearUser()
        router.push('/')
    }

    return (
        user && (
            <div className={cardStyles.profileCard}>
                <div className={cardStyles.profileInitialsContainer}>
                    <span className={cardStyles.profileInitialsText}>
                        {user.name ? user.name.charAt(0).toupperCase() : ""}
                    </span>
                </div>

                <div>
                    <div className={cardStyles.profileName}>
                        {user.name || ""}
                    </div>
                    <button
                        className={cardStyles.logoutButton}
                        onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        )
    )
}