'use client'

import { useLoggedIn } from '@/context/loggedIn'

export default function Profile() {

  const { loggedIn, role } = useLoggedIn()

  console.log({ loggedIn, role })

  return (
    <div>
      <h1>Profile</h1>
      <p>This is the profile page.</p>
    </div>
  )
}