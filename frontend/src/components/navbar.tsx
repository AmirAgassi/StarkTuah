import { useAccount, useConnect } from "@starknet-react/core";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export default function Navbar() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();

  const argentX = connectors.find((connector) => connector.id === "argentX");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-bold text-white">StarkTuah</div>
          
          <div>
            {address ? (
              <Menu as="div" className="relative">
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
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }: { active: boolean }) => (
                        <button
                          className={`${
                            active ? "bg-gray-700" : ""
                          } block w-full px-4 py-2 text-sm text-gray-300 text-left hover:text-white`}
                          onClick={() => {/* Add disconnect function here */}}
                        >
                          Disconnect
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : argentX && (
              <button
                onClick={() => connect({ connector: argentX })}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
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
