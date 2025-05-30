import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Shop */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600 transition">Men</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Women</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Kids</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">New Arrivals</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Best Sellers</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600 transition">Help Center</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Shipping</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Returns</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Track Order</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Size Guide</a></li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600 transition">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Careers</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Press</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Affiliate Program</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">Contact</a></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
          <p className="text-sm mb-4">Join our newsletter to get updates on offers & new products.</p>
          <form className="flex items-center space-x-2 mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition"
            >
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-gray-500 hover:text-indigo-600" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="text-gray-500 hover:text-indigo-600" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="text-gray-500 hover:text-indigo-600" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="text-gray-500 hover:text-indigo-600" aria-label="Pinterest"><FaPinterest /></a>
            <a href="#" className="text-gray-500 hover:text-indigo-600" aria-label="TikTok"><FaTiktok /></a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} LogicNosh. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
