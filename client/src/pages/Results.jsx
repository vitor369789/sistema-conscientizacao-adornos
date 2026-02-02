import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, CheckCircle, XCircle, Home } from 'lucide-react';
import confetti from 'canvas-confetti';

function Results() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    const data = localStorage.getItem('quizResults');
    if (!data) {
      navigate('/');
      return;
    }
    const parsedResults = JSON.parse(data);
    setResults(parsedResults);
    
    // Submeter apenas uma vez
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      handleSubmit(parsedResults);
    }
  }, [navigate]);

  useEffect(() => {
    if (results && results.score >= results.totalQuestions * 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [results]);

  const handleSubmit = async (data) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
      const response = await fetch(`${apiUrl}/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error submitting results:', error);
    }
  };

  if (!results) return null;

  const percentage = (results.score / results.totalQuestions) * 100;
  const passed = percentage >= 70;

  const getMessage = () => {
    if (percentage === 100) return { title: 'Perfeito! 🎉', text: 'Você acertou todas as questões!', color: 'from-yellow-400 to-orange-500' };
    if (percentage >= 90) return { title: 'Excelente! 🌟', text: 'Desempenho excepcional!', color: 'from-green-400 to-emerald-500' };
    if (percentage >= 70) return { title: 'Muito Bem! ✨', text: 'Você está aprovado!', color: 'from-blue-400 to-cyan-500' };
    return { title: 'Continue Tentando! 💪', text: 'Revise o conteúdo e tente novamente.', color: 'from-orange-400 to-red-500' };
  };

  const message = getMessage();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="glass-effect rounded-3xl p-8 md:p-12">
          {results && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="text-center mb-8"
              >
                <div className={`inline-flex p-6 rounded-full bg-gradient-to-r ${message.color} mb-6`}>
                  <Trophy className="w-20 h-20 text-white" />
                </div>
                <h1 className={`text-5xl font-bold mb-4 bg-gradient-to-r ${message.color} bg-clip-text text-transparent`}>
                  {message.title}
                </h1>
                <p className="text-2xl text-gray-600 mb-6">{message.text}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {results.score}/{results.totalQuestions}
                    </div>
                    <div className="text-gray-600 font-medium">Acertos</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-pink-600 mb-2">
                      {percentage.toFixed(0)}%
                    </div>
                    <div className="text-gray-600 font-medium">Aproveitamento</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-indigo-600 mb-2 flex items-center justify-center gap-2">
                      {passed ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                    </div>
                    <div className="text-gray-600 font-medium">
                      {passed ? 'Aprovado' : 'Não Aprovado'}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-500" />
                  Suas Respostas
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {results.answers.map((answer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.05 }}
                      className={`p-4 rounded-xl border-2 ${
                        answer.isCorrect
                          ? 'bg-green-50 border-green-300'
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {answer.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 mb-2">{answer.question}</p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Sua resposta:</span> {answer.selectedAnswer}
                          </p>
                          {!answer.isCorrect && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Resposta correta:</span> {answer.correctAnswer}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-8"
              >
                <h3 className="font-bold text-blue-900 mb-2">📋 Informações do Participante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-blue-800">
                  <p><span className="font-semibold">Nome:</span> {results.name}</p>
                  <p><span className="font-semibold">Setor:</span> {results.sector}</p>
                  <p><span className="font-semibold">Formação:</span> {results.formation}</p>
                  <p><span className="font-semibold">Telefone:</span> {results.phone}</p>
                </div>
              </motion.div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6 text-center"
                >
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-green-900 text-xl mb-2">
                    ✅ Resultados Salvos Automaticamente!
                  </h3>
                  <p className="text-green-800">
                    Seus dados foram registrados com sucesso no sistema.
                  </p>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex justify-center"
              >
                <button
                  onClick={() => {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('quizResults');
                    navigate('/');
                  }}
                  className="btn-primary flex items-center justify-center gap-2 px-8"
                >
                  <Home className="w-5 h-5" />
                  Voltar ao Início
                </button>
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Results;
