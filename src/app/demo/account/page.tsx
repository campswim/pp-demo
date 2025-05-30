import DemoBackground from '@/components/ui/demo-background'

export default function DemoAccount() {
  return (
    <div className='w-full max-w-[90%] mb-6 min-h-screen'>      
      <div className='py-6 w-full max-w-none'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>          
          {[
            { type: 'Credit Card', amount: '$1,254.67' },
            { type: 'Savings', amount: '$8,942.20' },
            { type: 'Checking', amount: '$2,114.55' },
            { type: 'CD', amount: '$15,421.30' },
            { type: 'Money Market', amount: '$10,378.44' },
            { type: 'Child\'s Savings', amount: '$3,290.11' },
          ].map((account, index) => (
            <div
              key={index}
              className='bg-white dark:bg-gray-900 border border-gray-300 shadow-lg rounded-lg p-4 flex flex-col'
            >
              <div className='flex flex-col justify-between'>
                <div className='flex justify-between mt-4'>
                  <h2 className='text-xl font-semibold md:break-words md:whitespace-normal w-0 flex-1'>{account.type}</h2>
                  <p className='text-2xl font-bold text-gray-700 dark:text-gray-200'>{account.amount}</p>
                </div>
                <button className='mt-6 bg-blue-100 dark:bg-white/70 text-black dark:text-white p-2 rounded hover:bg-sky-400 dark:hover:bg-sky-700 transition-colors'>
                  View Account
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DemoBackground />
    </div>
  )
}