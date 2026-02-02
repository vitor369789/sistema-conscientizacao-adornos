import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Edit, Trash2, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.includes('d36.com.br') 
  ? import.meta.env.VITE_API_URL + '/api'
  : 'http://localhost:4001/api';

function SlidesManager({ onClose }) {
  const [slides, setSlides] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    icon: 'Shield',
    color: 'from-blue-500 to-cyan-500',
    illustration: 'SafetyIllustration',
    content: [''],
    slide_order: 1
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      console.log('Fetching from:', `${API_URL}/slides`);
      const response = await fetch(`${API_URL}/slides`);
      const data = await response.json();
      console.log('Slides received:', data);
      setSlides(data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingSlide 
        ? `${API_URL}/slides/${editingSlide.id}`
        : `${API_URL}/slides`;
      
      const method = editingSlide ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      fetchSlides();
      resetForm();
      alert(editingSlide ? 'Slide atualizado!' : 'Slide criado!');
    } catch (error) {
      console.error('Error saving slide:', error);
      alert('Erro ao salvar slide');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este slide?')) return;
    
    try {
      await fetch(`${API_URL}/slides/${id}`, { method: 'DELETE' });
      fetchSlides();
      alert('Slide excluído!');
    } catch (error) {
      console.error('Error deleting slide:', error);
      alert('Erro ao excluir slide');
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      icon: slide.icon,
      color: slide.color,
      illustration: slide.illustration,
      content: slide.content,
      slide_order: slide.slide_order
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setEditingSlide(null);
    setIsCreating(false);
    setFormData({
      title: '',
      icon: 'Shield',
      color: 'from-blue-500 to-cyan-500',
      illustration: 'SafetyIllustration',
      content: [''],
      slide_order: slides.length + 1
    });
  };

  const addContentLine = () => {
    setFormData({ ...formData, content: [...formData.content, ''] });
  };

  const updateContentLine = (index, value) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData({ ...formData, content: newContent });
  };

  const removeContentLine = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
          📊 Gerenciar Slides da Apresentação
        </h2>

        {!isCreating ? (
          <>
            <button
              onClick={() => setIsCreating(true)}
              className="mb-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adicionar Novo Slide
            </button>

            <div className="space-y-4">
              {slides.map((slide) => (
                <div key={slide.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {slide.slide_order}. {slide.title}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Ícone:</strong> {slide.icon}</p>
                        <p><strong>Cor:</strong> {slide.color}</p>
                        <p><strong>Conteúdo:</strong> {slide.content.length} itens</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Título do Slide</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ícone</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                >
                  <option value="Shield">Shield</option>
                  <option value="Sparkles">Sparkles</option>
                  <option value="AlertTriangle">AlertTriangle</option>
                  <option value="XCircle">XCircle</option>
                  <option value="CheckCircle">CheckCircle</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ordem</label>
                <input
                  type="number"
                  value={formData.slide_order}
                  onChange={(e) => setFormData({ ...formData, slide_order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gradiente de Cor</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Ex: from-blue-500 to-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ilustração</label>
              <select
                value={formData.illustration}
                onChange={(e) => setFormData({ ...formData, illustration: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="SafetyIllustration">SafetyIllustration</option>
                <option value="RingIllustration">RingIllustration</option>
                <option value="WatchIllustration">WatchIllustration</option>
                <option value="NecklaceIllustration">NecklaceIllustration</option>
                <option value="MachineIllustration">MachineIllustration</option>
                <option value="WorkerIllustration">WorkerIllustration</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-gray-700">Conteúdo do Slide</label>
                <button
                  onClick={addContentLine}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                >
                  + Adicionar Linha
                </button>
              </div>
              <div className="space-y-2">
                {formData.content.map((line, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => updateContentLine(index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="Digite o conteúdo..."
                    />
                    {formData.content.length > 1 && (
                      <button
                        onClick={() => removeContentLine(index)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
              >
                <Save className="w-5 h-5" />
                {editingSlide ? 'Atualizar Slide' : 'Criar Slide'}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default SlidesManager;
