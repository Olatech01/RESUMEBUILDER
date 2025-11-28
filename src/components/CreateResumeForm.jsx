"use client"
import React, { useState } from 'react'
// import { Inputs } from './Inputs'
import { useRouter } from 'next/navigation'
import axiosInstance from '@/utils/axiosInstance'
import { API_PATH } from '@/utils/apiPaths'
import Inputs from './Inputs'
import { Loader2, Save } from 'lucide-react'
import { Plus } from 'react-feather'
import toast from 'react-hot-toast'
import UploadResumeModal from './Upload'


const CreateResumeForm = () => {

    const [title, setTitle] = useState("")
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState('create');
    const router = useRouter()


    const handleCreateResume = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await axiosInstance.post(API_PATH.RESUME.CREATE, {
                title
            })

            if (response?.data?._id) {
                toast.success("Resume created successfully!")
                router.push(`/resume/${response.data?._id}`)
            }
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message)
            } else {
                setError("Something went wrong. Please try again")
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-full max-w-md py-8 px-4 bg-white rounded-2xl border border-gray-100 shadow-lg'>
            {activeTab === "create" && (
                <h2 className='text-2xl font-semibold mb-2'>Create a New Resume</h2>
            )}
            {activeTab === "upload" && (
                <h2 className='text-2xl font-semibold mb-2'>Upload Your Resume</h2>
            )}
            {activeTab === "create" && (
                <p className='text-gray-600 mb-6'>Start from scratch and build your resume step by step.</p>
            )}
            {activeTab === "upload" && (
                <p className='text-gray-600 mb-6'>Upload an existing resume to edit and enhance it.</p>
            )}

            <div className='flex gap-4 pb-8'>
                <button onClick={() => setActiveTab("create")} className={`w-full pb-2.5 ${activeTab === "create" ? "border-b-2 border-yellow-400" : ""}`}>
                    Create
                </button>
                <button onClick={() => setActiveTab("upload")} className={`w-full pb-2.5 ${activeTab === "upload" ? "border-b-2 border-yellow-400" : ""}`}>
                    Upload
                </button>
            </div>


            {activeTab === "create" && (
                <form onSubmit={handleCreateResume}>
                    <Inputs
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        label="Resume Title"
                        placeholder="e.g John Doe - Software Engineer"
                        type="text"
                    />
                    {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

                    <button
                        type='submit'
                        className='w-full py-3 flex gap-2 items-center justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white
                rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all'
                    >
                        {loading ? <Loader2 size={16} className='animate-spin' /> : <Plus size={16} />}
                        {loading ? "Creating..." : "Create Resume"}
                    </button>
                </form>
            )}

            {activeTab === "upload" && (
                <UploadResumeModal />
            )}
        </div>
    )
}

export default CreateResumeForm