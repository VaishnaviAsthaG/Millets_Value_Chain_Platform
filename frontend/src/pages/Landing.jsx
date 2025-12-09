import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { 
  ArrowDown, 
  Users, 
  Factory, 
  Leaf, 
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  CheckCircle,
  Sprout,
  Package,
  Fuel,
  Building2,
  Info,
  ShoppingCart,
  List,
  BarChart3,
  FileText,
  Play
} from 'lucide-react';
import Button from '../components/Button';
import { useTranslation } from '../context/TranslationContext';
import LandingNavbar from '../components/LandingNavbar';

const Landing = ({ onNavigate }) => {
  const { t } = useTranslation();
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const handleStartTour = () => {
    localStorage.removeItem('annaconnect_tour_landing_completed');
    window.location.reload();
  };

  // Millet images - these should be placed in public/images/ folder
  const milletImages = {
    ragi: '/images/ragi-plant.jpg',
    foxtail: '/images/foxtail-millet.jpg',
    pearl: '/images/pearl-millet.jpg',
    grain: '/images/millet-grain.jpg'
  };

  // Scroll handler for section detection
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollPosition >= top && scrollPosition < bottom) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section variants for animations
  const sectionVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div ref={containerRef} className="relative overflow-x-hidden">
      {/* Landing Navbar */}
      <LandingNavbar onNavigate={onNavigate} />
      
      {/* Home Section with Background Video */}
      <section className="section relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/agriculture-sunset.mp4" type="video/mp4" />
            {/* Fallback gradient if video doesn't load */}
          </video>
          {/* Overlay to enhance text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight drop-shadow-lg"
          >
            {t('landing.title')}
          </motion.h1>

          {/* Quote Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-10 max-w-4xl mx-auto"
          >
            <p className="text-lg md:text-xl text-white font-medium mb-3 leading-relaxed drop-shadow-md">
              "The farmer is the only man in our economy who buys<br />
              everything at retail, sells everything at wholesale, and<br />
              pays the freight both ways."
            </p>
            <p className="text-base md:text-lg text-white/95 leading-relaxed drop-shadow-md">
              "किसान हमारी अर्थव्यवस्था में एकमात्र व्यक्ति है जो सब कुछ खुदरा में खरीदता है,<br />
              सब कुछ थोक में बेचता है, और दोनों तरफ से किराया भी देता है।"
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => onNavigate('login', 'farmer')}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            >
              {t('landing.getStarted', 'Get Started')}
            </Button>
            <Button
              size="lg"
              onClick={handleStartTour}
              className="bg-white border-2 border-white text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Play className="w-4 h-4 text-green-600" />
              <span>{t('landing.takeTour', 'Take a Tour')}</span>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="section relative min-h-screen py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Varieties of Millets
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('landing.aboutSubtitle')}
            </p>
          </motion.div>

          {/* Millet Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { name: 'Finger Millet (Ragi)', image: milletImages.ragi, color: 'from-green-500 to-emerald-600' },
              { name: 'Foxtail Millet', image: milletImages.foxtail, color: 'from-yellow-500 to-orange-600' },
              { name: 'Pearl Millet (Bajra)', image: milletImages.pearl, color: 'from-amber-500 to-yellow-600' },
              { name: 'Millet Grains', image: milletImages.grain, color: 'from-amber-400 to-amber-600' }
            ].map((millet, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative"
              >
                <div className="glass-card overflow-hidden h-full">
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={millet.image}
                      alt={millet.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${millet.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{millet.name}</h3>
                    <p className="text-gray-600 text-sm">
                      {t('landing.milletDescription')}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Typewriter Animation Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="text-center"
          >
            <div className="glass-card p-8 max-w-4xl mx-auto">
              <TypewriterText text={t('landing.typewriterText')} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="section relative min-h-screen py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
              Key Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Farmer Information Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl shadow-lg p-8 h-full"
            >
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-6">Farmer Information</h3>
              <div className="space-y-4">
                {[
                  { icon: Users, text: 'Farmer profile management' },
                  { icon: Package, text: 'Crop grown tracking' },
                  { icon: MapPin, text: 'Location-based services' },
                  { icon: Package, text: 'Quantity available tracking' },
                  { icon: TrendingUp, text: 'Market trends & insights' },
                  { icon: Phone, text: 'Support links & resources' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Industries & Buyers Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 h-full"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <Factory className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-6">Industries & Buyers</h3>
              <div className="space-y-4">
                {[
                  { icon: List, text: 'List of industries purchasing crop residues' },
                  { icon: Package, text: 'Required quantities & specifications' },
                  { icon: Package, text: 'Types of residues needed (millet straw, maize husk, etc.)' },
                  { icon: TrendingUp, text: 'Pricing range & market rates' },
                  { icon: Mail, text: 'Direct contact methods' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Buyer Details Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-8 h-full"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-6">Buyer Details</h3>
              <div className="space-y-4">
                {[
                  { icon: ShoppingCart, text: 'Buyer type (wholesale/retail)' },
                  { icon: Package, text: 'Crops/residues they need' },
                  { icon: Package, text: 'Estimated quantity requirements' },
                  { icon: TrendingUp, text: 'Preferred delivery timeline' },
                  { icon: Phone, text: 'Contact links & communication' }
                ].map((feature, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Farmer Details Section */}
      <section className="section relative min-h-screen py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('landing.farmerSectionTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.img
                src={milletImages.ragi}
                alt="Millet Plant"
                className="rounded-2xl shadow-2xl w-full"
                whileHover={{ scale: 1.02 }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {[
                { icon: Sprout, title: t('landing.yieldInfo'), desc: t('landing.yieldDesc') },
                { icon: Leaf, title: t('landing.soilType'), desc: t('landing.soilDesc') },
                { icon: TrendingUp, title: t('landing.benefits'), desc: t('landing.benefitsDesc') }
              ].map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="glass-card p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">{info.title}</h4>
                      <p className="text-gray-600">{info.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industrialist Information Section */}
      <section className="section relative min-h-screen py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              {t('landing.industrialSectionTitle')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Package, title: t('landing.processing'), desc: t('landing.processingDesc'), color: 'from-blue-500 to-cyan-600' },
              { icon: Leaf, title: t('landing.strawValue'), desc: t('landing.strawDesc'), color: 'from-green-500 to-emerald-600' },
              { icon: Fuel, title: t('landing.biofuel'), desc: t('landing.biofuelDesc'), color: 'from-orange-500 to-red-600' },
              { icon: Building2, title: t('landing.construction'), desc: t('landing.constructionDesc'), color: 'from-gray-500 to-gray-700' }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-card p-6 h-full"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">{card.title}</h4>
                <p className="text-gray-600 text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="section relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SA</span>
                </div>
                <h3 className="text-2xl font-bold">Shree Anna Connect</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering farmers, industries, and the future of sustainable agriculture through blockchain technology and digital innovation.
              </p>
              <div className="flex space-x-4 pt-4">
                {[
                  { icon: Facebook, link: 'https://facebook.com/shreeannaconnect', label: 'Facebook' },
                  { icon: Twitter, link: 'https://twitter.com/shreeannaconnect', label: 'Twitter' },
                  { icon: Instagram, link: 'https://instagram.com/shreeannaconnect', label: 'Instagram' },
                  { icon: Linkedin, link: 'https://linkedin.com/company/shreeannaconnect', label: 'LinkedIn' }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#about" 
                    className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const aboutSection = document.querySelector('.section:nth-of-type(2)');
                      if (aboutSection) {
                        aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Varieties of Millets
                  </a>
                </li>
                <li>
                  <a 
                    href="#features" 
                    className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const featuresSection = document.querySelector('.section:nth-of-type(3)');
                      if (featuresSection) {
                        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Features
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('traceability')}
                    className="text-gray-400 hover:text-white transition-colors text-sm text-left cursor-pointer"
                  >
                    Traceability
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-gray-400 hover:text-white transition-colors text-sm text-left cursor-pointer"
                  >
                    Login / Register
                  </button>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      const footer = document.querySelector('footer');
                      if (footer) {
                        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-400 text-sm">For Farmers</span>
                </li>
                <li>
                  <span className="text-gray-400 text-sm">For Buyers</span>
                </li>
                <li>
                  <span className="text-gray-400 text-sm">For FPOs</span>
                </li>
                <li>
                  <span className="text-gray-400 text-sm">Government Portal</span>
                </li>
                <li>
                  <span className="text-gray-400 text-sm">Blockchain Traceability</span>
                </li>
                <li>
                  <span className="text-gray-400 text-sm">Weather Alerts</span>
                </li>
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-4">{t('landing.contactTitle')}</h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a 
                    href="mailto:info@shreeannaconnect.com" 
                    className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    info@shreeannaconnect.com
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <a 
                    href="tel:+919876543210" 
                    className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer"
                  >
                    +91 98765 43210
                  </a>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-sm">
                    Bangalore, Karnataka, India
                  </span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-8 mt-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Shree Anna Connect. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#privacy" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </a>
                <a href="#terms" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </a>
                <a href="#cookies" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Cookie Policy
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

// Typewriter Component
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return (
    <p className="text-xl text-gray-700">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1 h-6 bg-primary-500 ml-1"
      />
    </p>
  );
};

export default Landing;
