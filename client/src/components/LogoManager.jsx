import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.includes('d36.com.br') 
  ? import.meta.env.VITE_API_URL + '/api'
  : 'http://localhost:4001/api';

function LogoManager({ onClose }) {
  const [logos, setLogos] = useState({
    logo1: false,
    logo2: false,
    logo3: false
  });
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchLogosStatus();
  }, []);

  const fetchLogosStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/logos/status`);
      const data = await response.json();
      setLogos(data);
    } catch (error) {
      console.error('Error fetching logos status:', error);
    }
  };

  const handleUpload = async (logoNumber, file) => {
    if (!file) return;

    setUploading(logoNumber);
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch(`${API_URL}/logo/${logoNumber}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert(`Logo ${logoNumber} enviada com sucesso!`);
        fetchLogosStatus();
        // Force reload images by adding timestamp
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert('Erro ao enviar logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Erro ao enviar logo');
    } finally {
      setUploading(null);
    }
  };

  const handleDelete = async (logoNumber) => {
    if (!confirm(`Tem certeza que deseja excluir a Logo ${logoNumber}?`)) return;

    try {
      const response = await fetch(`${API_URL}/logo/${logoNumber}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert(`Logo ${logoNumber} excluída com sucesso!`);
        fetchLogosStatus();
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        alert('Erro ao excluir logo');
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
      alert('Erro ao excluir logo');
    }
  };

  const LogoCard = ({ number, exists }) => (
    <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Logo {number}</h3>
      
      {exists ? (
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
            <img 
              src={`/logo${number}.png?t=${Date.now()}`}
              alt={`Logo ${number}`}
              className="max-h-32 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <button
            onClick={() => handleDelete(number)}
            className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Excluir Logo
          </button>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 text-sm mb-4">Nenhuma logo enviada</p>
        </div>
      )}

      <label className={`mt-4 w-full flex items-center justify-center gap-2 ${exists ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-purple-600 text-white hover:bg-purple-700'} px-4 py-2 rounded-lg transition-colors cursor-pointer`}>
        <Upload className="w-4 h-4" />
        {uploading === number ? 'Enviando...' : exists ? 'Substituir Logo' : 'Enviar Logo'}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(number, e.target.files[0])}
          disabled={uploading === number}
        />
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
          🖼️ Gerenciar Logos do Cabeçalho
        </h2>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>ℹ️ Informação:</strong> Gerencie as logos 1, 2 e 3 que aparecem no cabeçalho da página inicial. 
            As logos 4 e 5 (rodapé) não podem ser alteradas por aqui.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <LogoCard number="1" exists={logos.logo1} />
          <LogoCard number="2" exists={logos.logo2} />
          <LogoCard number="3" exists={logos.logo3} />
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Atenção:</strong> Após enviar ou excluir uma logo, a página será recarregada automaticamente para aplicar as mudanças.
            Use imagens PNG com fundo transparente para melhor resultado.
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default LogoManager;
