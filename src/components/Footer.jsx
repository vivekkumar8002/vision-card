import { Link } from 'react-router-dom';
import telIcon from '../assets/icons/icon-phone.avif';
import chatIcon from '../assets/icons/icon-chat.webp';
import emailIcon from '../assets/icons/icon-email.webp';

function Footer() {
  return (
    <footer className="footer">
      <section className="nletter">
        <div className="nletter--wrapper">
          <h3 className="nletter__title">Be a part of Vivek</h3>
          <span className="nletter__promo">
            Enjoy 10% off your first purchase when you sign up!
          </span>
          <form
            className="nletter__form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              className="nletter__email"
              placeholder="Enter your email here"
            />
            <button type="submit" className="nletter__submit">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

      <div className="footer-main">
        <div className="footer-sv">
          <section className="footer-sv__links--container">
            <ul className="footer-sv__links">
              <h5 className="footer-sv__link--header">Company</h5>
              <li><Link to="/" className="footer-sv__link">Our Story</Link></li>
              <li><Link to="/" className="footer-sv__link">Shop Locations</Link></li>
              <li><Link to="/tryon" className="footer-sv__link">Virtual Try-On</Link></li>
              <li><Link to="/" className="footer-sv__link">Eyecare</Link></li>
              <li><Link to="/" className="footer-sv__link">Philanthropy</Link></li>
            </ul>

            <ul className="footer-sv__links">
              <h5 className="footer-sv__link--header">Brand</h5>
              <li><Link to="/" className="footer-sv__link">Style & Fit</Link></li>
              <li><Link to="/" className="footer-sv__link">Craftsmanship</Link></li>
              <li><Link to="/" className="footer-sv__link">Reviews</Link></li>
              <li><Link to="/" className="footer-sv__link">Blog</Link></li>
              <li><Link to="/" className="footer-sv__link">Press</Link></li>
            </ul>

            <ul className="footer-sv__links">
              <h5 className="footer-sv__link--header">Help</h5>
              <li><Link to="/" className="footer-sv__link">Shipping & Returns</Link></li>
              <li><Link to="/" className="footer-sv__link">Repairs</Link></li>
              <li><Link to="/" className="footer-sv__link">Warranty</Link></li>
              <li><Link to="/" className="footer-sv__link">FAQ</Link></li>
              <li><Link to="/" className="footer-sv__link">Contact Us</Link></li>
            </ul>
          </section>

          <section className="footer-sv__contact">
            <h4 className="footer-sv__contact-title">
              Ask a Vivek Specialist
            </h4>
            <p className="footer-sv__contact-text">
              Whether you&apos;re a collector or visiting for the first time,
              we&apos;re here to assist!
            </p>
            <ul className="footer-sv__contact-info">
              <li>
                <img src={telIcon} alt="Phone" />
                <span>(000)-VIVEK</span>
              </li>
              <li>
                <img src={emailIcon} alt="Email" />
                <span>support@vivek.xyz</span>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event('es-chat-toggle'))}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', background: 'transparent', border: 'none', padding: 0 }}
                >
                  <img src={chatIcon} alt="Chat" />
                  <span>Chat with Us</span>
                </button>
              </li>
            </ul>
          </section>
        </div>

        <ul className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Vivek</span>
          <Link to="/">Privacy</Link>
          <Link to="/">Accessibility</Link>
          <Link to="/">Terms of Service</Link>
          <Link to="/">Refund Policy</Link>
          <Link to="/">Conformity</Link>
        </ul>
      </div>


    </footer>
  );
}

export default Footer;
