'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { href: '/', label: 'Home', exact: true },
    { href: '/categorie', label: 'Categorie' },
    { href: '/mappa', label: 'Mappa' },
    { href: '/about', label: 'About' },
    { href: '/contatti', label: 'Contatti' }
  ];

  const isActiveLink = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <Link href="/" className="header__logo">
            <span className="header__logo-text">I Miei Viaggi</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav" role="navigation" aria-label="Menu principale">
            <ul className="header__nav-list">
              {navigationItems.map((item) => (
                <li key={item.href} className="header__nav-item">
                  <Link
                    href={item.href}
                    className={`header__nav-link ${
                      isActiveLink(item.href, item.exact) ? 'header__nav-link--active' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="header__menu-button"
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Apri menu di navigazione"
          >
            <span className="header__menu-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav
            className="header__mobile-nav"
            id="mobile-menu"
            role="navigation"
            aria-label="Menu mobile"
          >
            <ul className="header__mobile-nav-list">
              {navigationItems.map((item) => (
                <li key={item.href} className="header__mobile-nav-item">
                  <Link
                    href={item.href}
                    className={`header__mobile-nav-link ${
                      isActiveLink(item.href, item.exact) ? 'header__mobile-nav-link--active' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <style jsx>{`
        .header {
          background: #ffffff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 0;
          min-height: 70px;
        }

        .header__logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }

        .header__logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header__nav {
          display: none;
        }

        .header__nav-list {
          display: flex;
          list-style: none;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }

        .header__nav-item {
          margin: 0;
        }

        .header__nav-link {
          display: block;
          padding: 0.5rem 0;
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
          position: relative;
        }

        .header__nav-link:hover {
          color: #667eea;
        }

        .header__nav-link--active {
          color: #667eea;
        }

        .header__nav-link--active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background: #667eea;
          border-radius: 2px;
        }

        .header__menu-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        .header__menu-icon {
          display: flex;
          flex-direction: column;
          width: 24px;
          height: 18px;
          justify-content: space-between;
        }

        .header__menu-icon span {
          display: block;
          height: 2px;
          width: 100%;
          background: #4a5568;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .header__mobile-nav {
          display: block;
          background: #f8f9fa;
          border-top: 1px solid #e2e8f0;
          padding: 1rem 0;
        }

        .header__mobile-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .header__mobile-nav-item {
          margin: 0;
        }

        .header__mobile-nav-link {
          display: block;
          padding: 0.75rem 0;
          color: #4a5568;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .header__mobile-nav-link:hover,
        .header__mobile-nav-link--active {
          color: #667eea;
        }

        /* Desktop styles */
        @media (min-width: 768px) {
          .header__nav {
            display: block;
          }

          .header__menu-button {
            display: none;
          }

          .header__mobile-nav {
            display: none;
          }
        }

        /* Focus styles */
        .header__nav-link:focus,
        .header__mobile-nav-link:focus,
        .header__menu-button:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Hover states for menu button */
        .header__menu-button:hover .header__menu-icon span {
          background: #667eea;
        }

        /* Animation for menu icon when active */
        ${isMenuOpen ? `
          .header__menu-icon span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
          }
          .header__menu-icon span:nth-child(2) {
            opacity: 0;
          }
          .header__menu-icon span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
          }
        ` : ''}
      `}</style>
    </header>
  );
}