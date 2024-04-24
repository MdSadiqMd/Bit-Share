"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ui/toggleButton";
import { Button } from "./button";

export const initialNavigation = [
  { name: "Home", href: "/", current: false },
  { name: "My Files", href: "/myfiles", current: false },
  { name: "Share", href: "/share", current: false },
  { name: "Profile", href: "/profile", current: false },
];

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Navbar: React.FC<{ search?: string }> = () => {
  const [navigation, setNavigation] = useState(initialNavigation);
  const router = useRouter();

  const handleNavigationClick = (name: string) => {
    const updatedNavigation = initialNavigation.map((item) => ({
      ...item,
      current: item.name === name,
    }));
    setNavigation(updatedNavigation);
  };

  const logout = async () => {};

  return (
    <>
      <Disclosure
        as="nav"
        className="bg-gray-150 dark:bg-gray-950 scrollbar-hide shadow transition hover:shadow-md z-40 m-5 ml-18 mr-18 rounded-2xl"
      >
        {({ open }): React.JSX.Element => (
          <>
            <div className="shadow transition hover:shadow-md z-40 rounded-2xl">
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-800 dark:text-gray-200 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      <b>Bit Share</b>
                    </div>
                    <div className="hidden sm:ml-80 sm:block">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={`http://localhost:3000${item.href}`}
                            onClick={() => handleNavigationClick(item.name)}
                            className={classNames(
                              item.current
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                                : "text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute space-x-5 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <ModeToggle />

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full bg-gray-300 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-00">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREl1TQtDYX5h2D_zEWAcR7uZge3w8w-BVjd-4QqFc4ZncS05EcIP7oVgvJWHY7ETxPp8Y&usqp=CAU"
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-200 dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/profile"
                                className={classNames(
                                  active ? "bg-gray-300 dark:bg-gray-800" : "",
                                  "block px-4 py-2 text-sm text-gray-800 dark:text-gray-300"
                                )}
                              >
                                Your Profile
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/profile"
                                className={classNames(
                                  active ? "bg-gray-300 dark:bg-gray-800" : "",
                                  "block px-4 py-2 text-sm text-gray-800 dark:text-gray-300"
                                )}
                              >
                                Settings
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                href="/signout"
                                className={classNames(
                                  active ? "bg-gray-300 dark:bg-gray-800" : "",
                                  "block px-4 py-2 text-sm text-gray-800 dark:text-gray-300"
                                )}
                                onClick={() => logout()}
                              >
                                Sign out
                              </Link>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>

                    <div className="space-x-2 hidden sm:flex">
                      <Button variant="secondary">
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button variant="secondary">
                        <Link href="/signup">Signup</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Disclosure.Panel className="sm:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      onClick={() => handleNavigationClick(item.name)}
                      className={classNames(
                        item.current
                          ? "bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
                          : "text-gray-800 dark:text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-600 hover:text-black dark:hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </div>
          </>
        )}
      </Disclosure>
    </>
  );
};

export default Navbar;
