import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/contatti', label: 'Contatti' },
    { href: '/mappa', label: 'Mappa' }
  ];

  const socialLinks = [
    // Puoi aggiungere i tuoi social links qui
    // { href: 'https://instagram.com/yourprofile', label: 'Instagram', icon: 'instagram' },
    // { href: 'https://facebook.com/yourprofile', label: 'Facebook', icon: 'facebook' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">I Miei Viaggi</h3>
            <p className="footer__description">
              Una collezione personale dei luoghi che ho visitato, 
              dalle meraviglie storiche ai tesori naturali.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__section-title">Navigazione</h4>
            <ul className="footer__links">
              {footerLinks.map((link) => (
                <li key={link.href} className="footer__link-item">
                  <Link href={link.href} className="footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__section">
            <h4 className="footer__section-title">Informazioni</h4>
            <ul className="footer__links">
              <li className="footer__link-item">
                <span className="footer__text">
                  Luoghi visitati in continuo aggiornamento
                </span>
              </li>
              <li className="footer__link-item">
                <span className="footer__text">
                  Foto e commenti personali
                </span>
              </li>
              <li className="footer__link-item">
                <span className="footer__text">
                  Geolocalizzazione precisa
                </span>
              </li>
            </ul>
          </div>

          {socialLinks.length > 0 && (
            <div className="footer__section">
              <h4 className="footer__section-title">Seguimi</h4>
              <div className="footer__social">
                {socialLinks.map((social) => (
                  <a
                    key={social.href}
                    href={social.href}
                    className="footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>
              © {currentYear} I Miei Viaggi. Tutti i diritti riservati.
            </p>
          </div>
          <div className="footer__credits">
            <p className="footer__credits-text">
              Realizzato con{' '}
              <span className="footer__heart" role="img" aria-label="cuore">
                ❤️
              </span>{' '}
              e{' '}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__tech-link"
              >
                Next.js
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: #1a202c;
          color: white;
          padding: 3rem 0 1rem 0;
          margin-top: auto;
        }

        .footer__content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer__section {
          display: flex;
          flex-direction: column;
        }

        .footer__title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .footer__description {
          color: #a0aec0;
          line-height: 1.6;
          margin: 0;
        }

        .footer__section-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #e2e8f0;
        }

        .footer__links {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer__link-item {
          margin-bottom: 0.5rem;
        }

        .footer__link {
          color: #a0aec0;
          text-decoration: none;
          transition: color 0.3s ease;
          display: inline-block;
        }

        .footer__link:hover {
          color: #667eea;
        }

        .footer__text {
          color: #a0aec0;
          font-size: 0.9rem;
        }

        .footer__social {
          display: flex;
          gap: 1rem;
        }

        .footer__social-link {
          color: #a0aec0;
          text-decoration: none;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.1);
        }

        .footer__social-link:hover {
          color: white;
          background: #667eea;
          transform: translateY(-2px);
        }

        .footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid #2d3748;
          gap: 1rem;
        }

        .footer__copyright p {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .footer__credits {
          display: flex;
          align-items: center;
        }

        .footer__credits-text {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .footer__heart {
          animation: pulse 2s infinite;
        }

        .footer__tech-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .footer__tech-link:hover {
          color: #5a6fd8;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        /* Focus styles */
        .footer__link:focus,
        .footer__social-link:focus,
        .footer__tech-link:focus {
          outline: 2px solid #667eea;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Responsive design */
        @media (max-width: 1024px) {
          .footer__content {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        @media (max-width: 768px) {
          .footer {
            padding: 2rem 0 1rem 0;
          }

          .footer__content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer__bottom {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }

          .footer__social {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .footer__content {
            gap: 1.5rem;
          }

          .footer__title {
            font-size: 1.25rem;
          }

          .footer__section-title {
            font-size: 1rem;
          }
        }
      `}</style>
    </footer>
  );
}