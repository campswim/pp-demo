import React from 'react';

const PublicHomePage: React.FC = () => {
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white font-sans antialiased">
      <header className="text-center p-8">
        <h1 className="text-4xl font-bold">Phone and PIN</h1>
        <p className="mt-2 text-lg font-medium">Multi-Factor Authentication</p>
        <p className="mt-2 text-base">
          The end of the Authenticity Nightmare for every enterprise and person, globally
        </p>
        <p className="mt-2 italic">Welcome to the revolutionary new Cloud Based solution...</p>
      </header>

      <section className="text-center py-8 bg-gray-50 dark:bg-gray-800">
        <p className="text-xl font-semibold">
          Unparalleled (Security + Simplicity + Speed) + Low Cost = Phone and PIN
        </p>
      </section>

      <section className="py-8 text-center">
        <h2 className="text-2xl font-semibold">If you have one of these</h2>
        <div className="mt-4 mb-4 text-lg font-bold">🧠 A Brain</div>
        <h2 className="text-2xl font-semibold">...and one of these</h2>
        <div className="flex flex-wrap justify-center gap-4 mt-4 text-lg">
          <div>📞 Any Landline Phone</div>
          <div>📱 Any Smart Phone</div>
          <div>📲 Any Cell Phone</div>
        </div>
      </section>

      <section className="bg-red-50 dark:bg-gray-800 text-center py-8">
        <h3 className="text-2xl font-bold">Then you NEVER need to use these EVER AGAIN</h3>

        <div className="mt-4 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-lg underline mb-2">Password Rules</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>More than 8 Characters</li>
            <li>Cannot start with a letter</li>
            <li>Contain upper &amp; lower case</li>
            <li>Must have 1 special character</li>
            <li>Never have been used before</li>
          </ul>
          <div className="mt-4 space-x-4">
            <span>🔐 Access Codes</span>
            <span>🔑 Security Tokens</span>
            <span>🧾 Passwords</span>
          </div>
        </div>
      </section>

      <section className="py-8 text-center">
        <h3 className="text-xl font-semibold mb-2">Instead use this unhackable device</h3>
        <div className="text-3xl mb-4">🧠 A Brain</div>
        <p className="max-w-xl mx-auto">
          to create and store one 4-digit PIN of your choosing and use that with your phone to access any
          ©Phone and PIN secured site or have your identity authenticated, all in under 10 seconds.
        </p>
      </section>

      <section className="bg-gray-100 dark:bg-gray-800 text-center py-8">
        <h3 className="text-xl font-bold">Now we’ve cracked it, the solution is clear</h3>
      </section>

      <footer className="text-center py-8">
        <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
        <div className="flex flex-col md:flex-row justify-center gap-8 text-sm">
          <div>
            <p className="font-bold">USA, Asia &amp; Americas</p>
            <p>Melanie Waite</p>
            <p>
              <a href="tel:+19094351630" className="text-blue-500 hover:underline">
                +1 909 435 1630
              </a>
            </p>
            <p>
              <a href="mailto:mel@phoneandpin.com" className="text-blue-500 hover:underline">
                mel@phoneandpin.com
              </a>
            </p>
          </div>
          <div>
            <p className="font-bold">UK &amp; EMEA</p>
            <p>Arnold Wilson</p>
            <p>
              <a href="tel:+442891857398" className="text-blue-500 hover:underline">
                +44 (0) 2891 857398
              </a>
            </p>
            <p>
              <a href="mailto:arnie@phoneandpin.com" className="text-blue-500 hover:underline">
                arnie@phoneandpin.com
              </a>
            </p>
          </div>
        </div>
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          © Phone and PIN — phoneandpin.com
        </p>
      </footer>
    </div>
  );
};

export default PublicHomePage;
