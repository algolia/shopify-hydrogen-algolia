import {useEffect, useState} from 'react';
import {Link} from '@shopify/hydrogen';

import CartToggle from './CartToggle.client';
import {useCartUI} from './CartUIProvider.client';
import AccountIcon from './account/AccountIcon';
import CountrySelector from './CountrySelector.client';
import Navigation from './Navigation.client';
import MobileNavigation from './MobileNavigation.client';
import SearchIcon from './SearchIcon';
import CloseIcon from './CloseIcon';
import AlgoliaAutocomplete from './search/AlgoliaAutocomplete.client';

/**
 * A client component that specifies the content of the header on the website
 */
export default function Header({collections, storeName}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const {isCartOpen} = useCartUI();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    setScrollbarWidth(scrollbarWidth);
  }, [isCartOpen]);

  return (
    <header className="h-20 lg:h-32" role="banner">
      <div
        className={`fixed z-20 h-20 lg:h-32 w-full border-b border-gray-200 px-6 md:px-8 md:py-6 lg:pt-8 lg:pb-0 mx-auto bg-white ${
          isMobileNavOpen ? '' : 'bg-opacity-95'
        }`}
      >
        <div
          className="flex h-full lg:flex-col place-content-between"
          style={{
            paddingRight: isCartOpen ? scrollbarWidth : 0,
          }}
        >
          <div className="flex items-center justify-between w-full text-center">
            <div className="w-20 lg:w-40">
              <CountrySelector />
              <MobileNavigation
                collections={collections}
                isOpen={isMobileNavOpen}
                setIsOpen={setIsMobileNavOpen}
              />
            </div>
            <Link
              className="flex-grow text-3xl font-black tracking-widest uppercase"
              to="/"
            >
              {storeName}
            </Link>
            <div className="flex justify-end w-20 lg:w-40">
              {/* Add a toggle search icon */}
              <button className="mr-2" onClick={() => setHidden((s) => !s)}>
                {hidden ? <SearchIcon /> : <CloseIcon />}
              </button>
              <Link to="/account" className="mr-2">
                <AccountIcon />
              </Link>
              <CartToggle
                handleClick={() => {
                  if (isMobileNavOpen) setIsMobileNavOpen(false);
                }}
              />
            </div>
          </div>
          <Navigation collections={collections} storeName={storeName} />
        </div>
        {/* Add a Algolia Autocomplete panel */}
        {!hidden ? (
          <div className="flex h-auto w-full font-black mx-auto bg-white bg-opacity-95 rounded-md">
            <div className="w-4/5 text-2xl mt-5 mb-5 content-center mx-auto">
              <AlgoliaAutocomplete />
            </div>
            <button className="mr-3 mt-1" onClick={() => setHidden((s) => !s)}>
              <CloseIcon />
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
