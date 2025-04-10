'use client'

import { useState } from 'react'
import { deleteUser } from '@/utils/userActions'
import { GridLoader } from "react-spinners"


const DeleteUserButton = ({ userId }: { userId: string }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await deleteUser(userId)

      setError(response.error ?? null);
    } catch (error) {
      console.error('Error deleting user:', error)
      if (error instanceof Error) {
        setError(error.message ?? 'An error occurred while deleting the user.')
      } else {
        setError('An error occurred while deleting the user.')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <p 
        className='md:hidden cursor-pointer' 
        onClick={handleDelete}
      >
        {error ? error : isDeleting ? <GridLoader /> : 'X'}
      </p>
      <p 
        className='hidden md:block md:border border-white rounded md:p-2 cursor-pointer hover:bg-blue-500 hover:border-black transition-colors duration-300'
        onClick={handleDelete}
      >
        {error ? error : isDeleting ? <GridLoader color='#36d7b7' size={5} /> : 'Delete'}
      </p>    
    </>
  )
}

export default DeleteUserButton