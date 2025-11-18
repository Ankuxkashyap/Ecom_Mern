import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // adjust path if needed
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-[100vw] bg-white shadow-md z-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[90px] flex justify-between items-center">
        {/* Brand */}
        <h1 className="text-3xl font-bold">
          BEWAKOOF<span className="text-blue-600">.</span>
        </h1>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          {user?.isAdmin && (<Link to="/products" className="hover:text-blue-600">Products</Link>) }
          {!user?.isAdmin &&(<Link to="/cart" className="hover:text-blue-600">Cart</Link>)}
          <Link to={user ? "/profile" : "/auth"} className="hover:text-blue-600">
            My Account
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-3 text-lg font-medium">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">Home</Link>

        { user?.isAdmin &&( 
          <Link 
          to="/products" 
          onClick={() => setMobileMenuOpen(false)} 
          className="block hover:text-blue-600">
               Products
            </Link>
        )}

            { !user?.isAdmin && (
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:text-blue-600"
              >
                Cart
              </Link>
            )}
          <Link to={user ? "/profile" : "/auth"} onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600">
            My Account
          </Link>
        </div>
      )}
    </nav>
  );
};
