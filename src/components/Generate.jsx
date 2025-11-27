"use client"
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import Inputs from './Inputs'
import { Loader2, Plus } from 'lucide-react'
import axiosInstance from '@/utils/axiosInstance'
import { API_PATH } from '@/utils/apiPaths'

const Generate = () => {
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const [jobTitle, setJobTitle] = useState("")
    const [title, setTitle] = useState("")
    const [error, setError] = useState("")

    const generateResume = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await axiosInstance.post(API_PATH.RESUME.GENERATE, {
                jobTitle,
                title
            })

            if (response?.data && response?.data?.resume || response?.data?.response?._id) {
                toast.success("Resume Generated Successfully!!")
                router.push(`/resume/${response.data?.resume?._id}`)
            }
        } catch (error) {
            console.log(error)
            toast.error("Failed to generate resume")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-lg'>
            <h3 className='text-2xl font-bold text-gray-900 mb-2'>
                AI-Powered Resume
            </h3>
            <p className='text-gray-600 mb-8'>
                Generate a professional resume tailored to your target job role.
            </p>


            <form onSubmit={generateResume}>
                <Inputs
                    value={jobTitle}
                    onChange={({ target }) => setJobTitle(target.value)}
                    label="Job Title"
                    placeholder="e.g Software Engineer"
                    type="text"
                />
                <Inputs
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                    label="Resume Title"
                    placeholder="e.g Frontend Developer Resume"
                    type="text"
                />
                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

                <button
                    type='submit'
                    className='w-full py-3 flex gap-2 cursor-pointer items-center justify-center bg-gradient-to-r from-rose-500 to-pink-600 text-white
                rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all'
                >
                    {loading ? <Loader2 size={16} className='animate-spin' /> : <Plus size={16} />}
                    {loading ? "Generating..." : "Generate"}
                </button>
            </form>
        </div>
    )
}

export default Generate