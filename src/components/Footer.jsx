import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest, FaTiktok } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Shop */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.shop')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.men')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.women')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.kids')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.newArrivals')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.bestSellers')}</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.customerService')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.helpCenter')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.shipping')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.returns')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.trackOrder')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.sizeGuide')}</a></li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.company')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.about')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.careers')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.press')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.affiliate')}</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition">{t('footer.links.contact')}</a></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.stayConnected')}</h4>
          <p className="text-sm mb-4">{t('footer.newsletterText')}</p>
          <form className="flex items-center space-x-2 mb-4">
            <input
              type="email"
              placeholder={t('footer.emailPlaceholder')}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700 transition"
            >
              {t('footer.subscribe')}
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
        © {new Date().getFullYear()} LogicNosh. {t('footer.bottom')}
      </div>
    </footer>
  );
};

export default Footer;
