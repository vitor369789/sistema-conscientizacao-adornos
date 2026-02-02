import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Edit, Trash2, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.includes('d36.com.br') 
  ? import.meta.env.VITE_API_URL + '/api'
  : 'http://localhost:4001/api';

function QuestionsManager({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    options: ['', '', '', ''],
    correct: 0,
    explanation: '',
    question_order: 1
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      console.log('Fetching from:', `${API_URL}/quiz-questions`);
      const response = await fetch(`${API_URL}/quiz-questions`);
      const data = await response.json();
      console.log('Questions received:', data);
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingQuestion 
        ? `${API_URL}/quiz-questions/${editingQuestion.id}`
        : `${API_URL}/quiz-questions`;
      
      const method = editingQuestion ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      fetchQuestions();
      resetForm();
      alert(editingQuestion ? 'Pergunta atualizada!' : 'Pergunta criada!');
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Erro ao salvar pergunta');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir esta pergunta?')) return;
    
    try {
      await fetch(`${API_URL}/quiz-questions/${id}`, { method: 'DELETE' });
      fetchQuestions();
      alert('Pergunta excluída!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Erro ao excluir pergunta');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question: question.question,
      options: question.options,
      correct: question.correct,
      explanation: question.explanation,
      question_order: question.question_order
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setEditingQuestion(null);
    setIsCreating(false);
    setFormData({
      question: '',
      options: ['', '', '', ''],
      correct: 0,
      explanation: '',
      question_order: questions.length + 1
    });
  };

  const updateOption = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

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

        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
          ❓ Gerenciar Perguntas do Quiz
        </h2>

        {!isCreating ? (
          <>
            <button
              onClick={() => setIsCreating(true)}
              className="mb-6 flex items-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Adicionar Nova Pergunta
            </button>

            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {q.question_order}. {q.question}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Opções:</strong> {q.options.length}</p>
                        <p><strong>Resposta correta:</strong> Opção {q.correct + 1}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(q)}
                        className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(q.id)}
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Pergunta</label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Opções de Resposta</label>
              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="radio"
                      name="correct"
                      checked={formData.correct === index}
                      onChange={() => setFormData({ ...formData, correct: index })}
                      className="w-5 h-5"
                    />
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                      placeholder={`Opção ${index + 1}`}
                    />
                    <span className="text-sm text-gray-500 w-20">
                      {formData.correct === index ? '✅ Correta' : ''}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Clique no círculo para marcar a resposta correta</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Explicação</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                rows="3"
                placeholder="Explicação da resposta correta..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ordem</label>
              <input
                type="number"
                value={formData.question_order}
                onChange={(e) => setFormData({ ...formData, question_order: parseInt(e.target.value) })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700"
              >
                <Save className="w-5 h-5" />
                {editingQuestion ? 'Atualizar Pergunta' : 'Criar Pergunta'}
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

export default QuestionsManager;
