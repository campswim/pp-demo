import { NextRequest, NextResponse } from 'next/server'
import { deleteAllVoiceCalls } from '@/utils/userActions'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    await deleteAllVoiceCalls(formData)
    
    return NextResponse.json(
      { success: true, message: 'Voice calls deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting voice calls:', error)
    return NextResponse.json(
      { error: 'Failed to delete voice calls' },
      { status: 500 }
    )
  }
}
