import Link from 'next/link'
import { DollarSign } from 'lucide-react'
// import DemoBackground from '@/components/ui/demo-background'

export default function DemoAccount() {
  return (
    <div className='w-full max-w-[90%] mb-6'>      
      <div className='mt-36 py-6 w-full max-w-none'>
        {/* <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>           */}
        <div className='flex flex-col justify-center w-[90%] m-auto'>          
          {[
            // { type: 'Credit Card', amount: '$1,254.67' },
            { type: 'Personal Checking', amount: '$12,562.34' },
            { type: 'Savings', amount: '$5,209.87' },
            { type: 'Business Checking', amount: '$23,400.51' },
            { type: 'CD', amount: '$15,421.30' },
            { type: 'Money Market', amount: '$10,378.44' },
            { type: 'Child\'s Savings', amount: '$3,290.11' },
          ].map((account, index, arr) => (
            <Link
              key={index}
              href={`/demo/account/${account.type.toLowerCase().replace(/\s+/g, '-')}`}
              className={`bg-[#293F61] dark:bg-[#293F61] shadow-lg p-4 ${index === 0 ? 'rounded-t-lg' : ''} ${index === arr.length - 1 ? 'rounded-b-lg' : ''} ${index !== arr.length - 1 ? 'border-b border-gray-500' : ''} hover:bg-[#325a94] transition-colors`}
            >
              <div className='flex flex-row items-start w-full'>
                {/* Icon on the left */}
                <div className="flex-shrink-0 mr-3 mt-1">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#3661A5] p-2">
                    <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </span>
                </div>
                
                {/* Account name and amount on the right */}
                <div className='flex-1 flex flex-col md:flex-row md:items-center md:justify-between w-full'>
                  <h2 className='text-white text-2xl font-semibold break-words'>
                    {account.type}
                  </h2>
                  <div className='flex flex-col items-start md:items-end mt-2 md:mt-0'>
                    <p className='hidden md:block text-white text-lg font-semibold'>Available Balance</p>
                    <p className='text-white text-2xl md:text-4xl font-bold'>{account.amount}</p>
                  </div>
                </div>
              </div>
              {/* <button className='mt-6 bg-blue-100 dark:bg-white/70 text-black dark:text-white p-2 rounded hover:bg-sky-400 dark:hover:bg-sky-700 transition-colors'>
                View Account
              </button> */}
            </Link>
          ))}
        </div>
      </div>
      {/* <DemoBackground /> */}
    </div>
  )
}