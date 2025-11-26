// app/resume/[id]/page.js
import EditResume from '@/pages/EditResume'
import React from 'react'

export const dynamic = 'force-dynamic';

const Page = () => {
  return <EditResume />
}

export default Page