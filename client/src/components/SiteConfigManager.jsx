import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Settings } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.includes('d36.com.br') 
  ? import.meta.env.VITE_API_URL + '/api'
  : 'http://localhost:4001/api';

function SiteConfigManager({ onClose }) {
  const [config, setConfig] = useState({
    site_title: '',
    welcome_message: '',
    final_message: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${API_URL}/config`);
      const data = await response.json();
      setConfig(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching config:', error);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      alert('Configurações salvas com sucesso!');
      onClose();
      // Reload page to apply changes
      window.location.reload();
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Erro ao salvar configurações');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full relative my-8 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          ⚙️ Configurações do Site
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título do Site
            </label>
            <input
              type="text"
              value={config.site_title}
              onChange={(e) => setConfig({ ...config, site_title: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Ex: Conscientização sobre Adornos"
            />
            <p className="text-xs text-gray-500 mt-1">
              Aparece no topo da página inicial e em vários lugares do site
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem de Boas-vindas
            </label>
            <textarea
              value={config.welcome_message}
              onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              rows="3"
              placeholder="Ex: Bem-vindo! Vamos começar uma jornada interativa de aprendizado"
            />
            <p className="text-xs text-gray-500 mt-1">
              Mensagem exibida na página inicial
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mensagem Final (Aviso de Conscientização)
            </label>
            <textarea
              value={config.final_message}
              onChange={(e) => setConfig({ ...config, final_message: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
              rows="10"
              placeholder="Ex: CONSCIENTIZAÇÃO - ADORNO ZERO..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Mensagem exibida ao final da apresentação
            </p>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
            <h3 className="text-lg font-bold text-indigo-900 mb-4">📋 Prévia</h3>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-2">{config.site_title}</h4>
              <p className="text-gray-600">{config.welcome_message}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Atenção:</strong> Após salvar, a página será recarregada automaticamente para aplicar as mudanças.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-5 h-5" />
            Salvar Configurações
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default SiteConfigManager;
