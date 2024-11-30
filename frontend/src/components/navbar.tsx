import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Logo from "../assets/Logo.png";

export default function Navbar() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const argentX = connectors.find((connector) => connector.id === "argentX");

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">            
                <div className="text-xl font-bold text-gray-200">StarkTuah</div>
                <img src={Logo} alt="A descriptive text" className="ml-2 w-6 h-6"/>
            </div>
          <div>
            {address ? (
              <Menu as={Fragment}>
                <div className="relative">
                  <Menu.Button className="flex items-center text-sm text-gray-300 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 hover:text-white transition-all">
                    <span className="font-mono">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </Menu.Button>
                  
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-gray-800 shadow-lg">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleDisconnect}
                            className={`${
                              active ? 'bg-gray-700 text-white' : 'text-gray-300'
                            } group flex w-full items-center rounded-lg px-4 py-2 text-sm`}
                          >
                            Disconnect
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </div>
              </Menu>
            ) : argentX && (
              <button
                onClick={() => connect({ connector: argentX })}
                className="text-sm bg-blue-600 text-blue-50 px-4 py-2 rounded-full hover:bg-blue-700 hover:text-white transition-all font-medium"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
