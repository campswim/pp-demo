import DemoBackground from '@/components/ui/demo-background'

export default function DemoAccount() {
  return (
    <div>
      <div className='p-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
              className='bg-white dark:bg-gray-900 border border-gray-300 shadow-lg rounded-lg py-4 px-4 h-40 min-w-[20rem] flex flex-col justify-center'
            >
              <div className='flex flex-col items-center justify-between h-full'>
                <div className='w-full flex justify-between mt-4'>
                  <h2 className='text-xl font-semibold break-words whitespace-normal w-0 flex-1'>{account.type}</h2>
                  <p className='text-2xl font-bold text-gray-700 dark:text-gray-200'>{account.amount}</p>
                </div>
                <button className='w-full  bg-blue-100 dark:bg-white/70 text-white p-2 rounded hover:bg-sky-400 dark:hover:bg-sky-700 transition-colors'>
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