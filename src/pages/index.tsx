import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import ChatBox from '../components/chatbox';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Gaia Experiences Agent</title>
        <meta name="description" content="Gaia Experiences Agent Comment Section" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Gaia Experiences Agent</span>
              </div>
            </div>

           <div className="flex items-center space-x-4">
  <button
    onClick={() => window.open('https://www.gaianet.ai/chat?subdomain=0x14c209deffc1a7c658c0870e885b27e061c0ae21.us.gaianet.network', '_blank')}
    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
  >
    GAIA Agent Chat
  </button>
  <ConnectButton />
</div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <ChatBox />
      </main>
    </div>
  );
};

export default Home;