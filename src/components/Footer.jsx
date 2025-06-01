import { FaFacebookF, FaInstagram, FaTwitter, FaPinterest, FaTiktok } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Shop */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.shop')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.men')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.women')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.kids')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.newArrivals')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.bestSellers')}</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.customerService')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.helpCenter')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.shipping')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.returns')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.trackOrder')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.sizeGuide')}</a></li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.company')}</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.about')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.careers')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.press')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.affiliate')}</a></li>
            <li><a href="#" className="hover:text-gray-300 transition">{t('footer.links.contact')}</a></li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h4 className="text-lg font-semibold mb-4">{t('footer.stayConnected')}</h4>
          <p className="text-sm mb-4 text-gray-400">{t('footer.newsletterText')}</p>
          <form className="flex items-center space-x-2 mb-4">
            <input
              type="email"
              placeholder={t('footer.emailPlaceholder')}
              className="w-full px-3 py-2 text-sm bg-white text-black border border-gray-400 rounded-md focus:ring-white focus:border-white"
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 text-sm rounded-md hover:bg-gray-200 transition"
            >
              {t('footer.subscribe')}
            </button>
          </form>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="Pinterest"><FaPinterest /></a>
            <a href="#" className="text-gray-400 hover:text-white" aria-label="TikTok"><FaTiktok /></a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-neutral-900 border-t border-gray-800 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} LogicNosh. {t('footer.bottom')}
      </div>
    </footer>
  );
};

export default Footer;
