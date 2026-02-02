import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserCircle, Briefcase, GraduationCap, Phone, ArrowRight, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.includes('d36.com.br') 
  ? import.meta.env.VITE_API_URL + '/api'
  : 'http://localhost:4001/api';

function Registration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sector: '',
    formation: '',
    phone: ''
  });
  const [siteConfig, setSiteConfig] = useState({
    site_title: 'Conscientização sobre Adornos',
    welcome_message: 'Bem-vindo! Vamos começar uma jornada interativa de aprendizado'
  });
  const [logo1Error, setLogo1Error] = useState(false);
  const [logo2Error, setLogo2Error] = useState(false);
  const [logo3Error, setLogo3Error] = useState(false);
  const [logo4Error, setLogo4Error] = useState(false);
  const [logo5Error, setLogo5Error] = useState(false);

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/config`);
      const data = await response.json();
      setSiteConfig(data);
    } catch (error) {
      console.error('Error fetching site config:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.sector && formData.formation && formData.phone) {
      localStorage.setItem('userData', JSON.stringify(formData));
      navigate('/presentation');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-effect rounded-3xl p-8 md:p-12 max-w-2xl w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center items-center gap-6 mb-6 flex-wrap"
        >
          {/* Renderizar logos do cabeçalho (1, 2, 3) */}
          {!logo1Error && (
            <img 
              src="/logo.png" 
              alt="Logo 1" 
              className="h-24 w-auto object-contain"
              onError={() => setLogo1Error(true)}
            />
          )}
          {!logo2Error && (
            <img 
              src="/logo2.png" 
              alt="Logo 2" 
              className="h-24 w-auto object-contain"
              onError={() => setLogo2Error(true)}
            />
          )}
          {!logo3Error && (
            <img 
              src="/logo3.png" 
              alt="Logo 3" 
              className="h-24 w-auto object-contain"
              onError={() => setLogo3Error(true)}
            />
          )}
          
          {/* Se nenhuma logo do cabeçalho existe, mostrar ícone padrão */}
          {logo1Error && logo2Error && logo3Error && (
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-center mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          {siteConfig.site_title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-gray-600 mb-8 text-lg"
        >
          {siteConfig.welcome_message}
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <UserCircle className="inline w-5 h-5 mr-2" />
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              placeholder="Digite seu nome completo"
            />
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Briefcase className="inline w-5 h-5 mr-2" />
              Setor
            </label>
            <input
              type="text"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              placeholder="Ex: Produção, Administrativo, etc."
            />
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <GraduationCap className="inline w-5 h-5 mr-2" />
              Formação
            </label>
            <input
              type="text"
              name="formation"
              value={formData.formation}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              placeholder="Ex: Ensino Médio, Técnico, Superior, etc."
            />
          </motion.div>

          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Phone className="inline w-5 h-5 mr-2" />
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
              placeholder="(00) 00000-0000"
            />
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2 text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Começar Apresentação
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center"
        >
          <a
            href="/admin"
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            Acesso Administrativo
          </a>
        </motion.div>

        {/* Footer com logos adicionais e crédito do desenvolvedor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-8 pt-6 border-t border-gray-200"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Logo 4 - Esquerda */}
            <div className="flex-shrink-0">
              {!logo4Error ? (
                <img 
                  src="/logo4.png" 
                  alt="Logo 4" 
                  className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  onError={() => setLogo4Error(true)}
                />
              ) : (
                <div className="w-12"></div>
              )}
            </div>

            {/* Texto central - Desenvolvido por iCore Soluções */}
            <div className="flex-grow text-center">
              <p className="text-xs text-gray-500">
                Desenvolvido por <span className="font-semibold text-purple-600">iCore Soluções</span>
              </p>
            </div>

            {/* Logo 5 - Direita */}
            <div className="flex-shrink-0">
              {!logo5Error ? (
                <img 
                  src="/logo5.png" 
                  alt="Logo 5" 
                  className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  onError={() => setLogo5Error(true)}
                />
              ) : (
                <div className="w-12"></div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Registration;
