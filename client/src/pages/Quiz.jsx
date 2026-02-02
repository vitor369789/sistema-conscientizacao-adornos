import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL?.includes('d36.com.br') 
  ? import.meta.env.VITE_API_URL + '/api'
  : 'http://localhost:4001/api';

// Função para embaralhar array
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Fallback questions in case API fails or is empty
const defaultQuestions = [
  {
    id: 1,
    question: 'Anel, aliança ou alargador: pode durante a assistência?',
    options: [
      'Pode, se for discreto',
      'Pode, se higienizar bem',
      'Não pode',
      'Pode, apenas aliança de casamento'
    ],
    correct: 2,
    explanation: 'Anéis e alianças dificultam a higienização das mãos e favorecem a permanência de microrganismos. Base legal: NR-32 e diretrizes da ANVISA.'
  },
  {
    id: 2,
    question: 'Relógio no punho durante o plantão: permitido?',
    options: [
      'Sim, se for digital',
      'Não',
      'Sim, se for de silicone',
      'Sim, se higienizar antes'
    ],
    correct: 1,
    explanation: 'O relógio impede a correta higiene das mãos e antebraços, aumentando o risco de contaminação cruzada. Base legal: NR-32.'
  },
  {
    id: 3,
    question: 'Unha alongada ou esmalte: qual o risco real?',
    options: [
      'Nenhum risco',
      'Abriga microrganismos e dificulta a higienização',
      'Apenas questão estética',
      'Risco apenas se estiver descascado'
    ],
    correct: 1,
    explanation: 'Unhas longas e esmaltes favorecem o acúmulo de microrganismos e dificultam a higiene das mãos, aumentando o risco de infecção. Por isso, não são permitidos na assistência.'
  },
  {
    id: 4,
    question: 'Brincos, pulseiras e colares no setor assistencial: pode?',
    options: [
      'Pode, se forem pequenos',
      'Não. Há risco biológico e de acidente',
      'Pode, se estiverem escondidos',
      'Pode apenas brincos pequenos'
    ],
    correct: 1,
    explanation: 'Não. Além do risco biológico, há risco de acidente e quebra de barreira de proteção. Base legal: NR-32 e protocolos da SCIH.'
  },
  {
    id: 5,
    question: 'Por que devemos evitar o uso de anéis no ambiente de trabalho?',
    options: [
      'Podem enroscar em máquinas e causar lesões graves',
      'Porque são caros e podem ser perdidos',
      'Porque não combinam com o uniforme',
      'Porque podem arranhar as mesas'
    ],
    correct: 0,
    explanation: 'Anéis podem enroscar em equipamentos e causar lesões por arrancamento (degloving), esmagamento ou até amputação. Base legal: NR-32.'
  },
  {
    id: 6,
    question: 'Em áreas estéreis (como laboratórios ou saúde), por que adornos são proibidos?',
    options: [
      'Por questões de moda',
      'Porque podem contaminar o ambiente',
      'Para economizar tempo',
      'Porque são desconfortáveis'
    ],
    correct: 1,
    explanation: 'Adornos acumulam bactérias e microrganismos, podendo contaminar ambientes que precisam ser estéreis, como hospitais e laboratórios. Base legal: NR-32 e ANVISA.'
  },
  {
    id: 7,
    question: 'O que é "degloving"?',
    options: [
      'Um tipo de luva de segurança',
      'Arrancamento da pele causado por anéis presos',
      'Uma técnica de limpeza',
      'Um procedimento de segurança'
    ],
    correct: 1,
    explanation: 'Degloving é o arrancamento traumático da pele, comum quando anéis ficam presos em equipamentos ou durante quedas. É uma lesão grave que pode levar à amputação.'
  },
  {
    id: 8,
    question: 'Qual a melhor atitude ao ver um colega usando adornos em área de risco?',
    options: [
      'Ignorar, não é problema meu',
      'Alertá-lo sobre os riscos de forma educada',
      'Tirar foto e postar nas redes sociais',
      'Apenas comentar com outros colegas'
    ],
    correct: 1,
    explanation: 'Segurança é responsabilidade de todos. Alertar colegas de forma educada pode prevenir acidentes graves. A SCIH orienta, apoia e conta com você para um ambiente mais seguro.'
  },
  {
    id: 9,
    question: 'Qual o principal objetivo das normas sobre adornos no trabalho?',
    options: [
      'Padronizar a aparência dos funcionários',
      'Proteger a vida e integridade física dos trabalhadores',
      'Reduzir custos da empresa',
      'Facilitar a identificação dos funcionários'
    ],
    correct: 1,
    explanation: 'O objetivo principal é sempre a segurança e proteção da vida e integridade física de todos os trabalhadores. Base legal: NR-32 – Segurança e Saúde no Trabalho em Serviços de Saúde.'
  },
  {
    id: 10,
    question: 'Qual a política da instituição sobre adornos na assistência?',
    options: [
      'Uso moderado é permitido',
      'ADORNO ZERO - nenhum adorno é permitido',
      'Apenas alianças são permitidas',
      'Depende do setor'
    ],
    correct: 1,
    explanation: 'A política é ADORNO ZERO! Adorno não é detalhe. Aqui, o cuidado começa antes do contato. Pequenos detalhes podem interferir na segurança de todos. Vamos juntos nessa!'
  }
];

function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);

  // Fetch questions from API and shuffle options
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_URL}/quiz-questions`);
      const data = await response.json();
      
      const questionsToUse = (data && data.length > 0) ? data : defaultQuestions;
      
      // Shuffle options for each question
      const shuffledQuestions = questionsToUse.map(q => {
        const correctAnswer = q.options[q.correct];
        const shuffledOptions = shuffleArray(q.options);
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
        
        return {
          ...q,
          options: shuffledOptions,
          correct: newCorrectIndex
        };
      });
      
      setQuestions(shuffledQuestions);
    } catch (error) {
      console.error('Error fetching questions, using defaults:', error);
      // Use default questions if API fails
      const shuffledQuestions = defaultQuestions.map(q => {
        const correctAnswer = q.options[q.correct];
        const shuffledOptions = shuffleArray(q.options);
        const newCorrectIndex = shuffledOptions.indexOf(correctAnswer);
        
        return {
          ...q,
          options: shuffledOptions,
          correct: newCorrectIndex
        };
      });
      setQuestions(shuffledQuestions);
    }
  };

  if (questions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl font-bold text-purple-600">Carregando...</div>
    </div>;
  }

  const question = questions[currentQuestion];

  const handleSelectAnswer = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleConfirm = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === question.correct;
    const newAnswers = [...answers, {
      questionId: question.id,
      question: question.question,
      selectedAnswer: question.options[selectedAnswer],
      correctAnswer: question.options[question.correct],
      isCorrect
    }];

    setAnswers(newAnswers);
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    // Scroll para o topo antes de mudar de pergunta
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const userData = JSON.parse(localStorage.getItem('userData'));
      localStorage.setItem('quizResults', JSON.stringify({
        ...userData,
        score,
        totalQuestions: questions.length,
        answers
      }));
      navigate('/results');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 md:p-12"
        >
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <span className="text-lg font-bold text-gray-700">
                  Pontuação: {score}/{questions.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-semibold text-gray-600">
                  Questão {currentQuestion + 1}/{questions.length}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
                {question.question}
              </h2>

              <div className="space-y-4 mb-8">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correct;
                  const showResult = showExplanation;

                  let bgColor = 'bg-white hover:bg-purple-50';
                  let borderColor = 'border-gray-200';
                  let icon = null;

                  if (showResult) {
                    if (isCorrect) {
                      bgColor = 'bg-green-50';
                      borderColor = 'border-green-500';
                      icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                    } else if (isSelected && !isCorrect) {
                      bgColor = 'bg-red-50';
                      borderColor = 'border-red-500';
                      icon = <XCircle className="w-6 h-6 text-red-500" />;
                    }
                  } else if (isSelected) {
                    bgColor = 'bg-purple-50';
                    borderColor = 'border-purple-500';
                  }

                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: showExplanation ? 1 : 1.02 }}
                      whileTap={{ scale: showExplanation ? 1 : 0.98 }}
                      onClick={() => handleSelectAnswer(index)}
                      disabled={showExplanation}
                      className={`w-full p-4 rounded-xl border-2 ${borderColor} ${bgColor} text-left transition-all flex items-center justify-between ${
                        showExplanation ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <span className="text-lg text-gray-700 font-medium">{option}</span>
                      {icon}
                    </motion.button>
                  );
                })}
              </div>

              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6"
                >
                  <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Explicação
                  </h3>
                  <p className="text-blue-800">{question.explanation}</p>
                </motion.div>
              )}

              <div className="flex justify-end">
                {!showExplanation ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleConfirm}
                    disabled={selectedAnswer === null}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                      selectedAnswer === null
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'btn-primary'
                    }`}
                  >
                    Confirmar Resposta
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="btn-primary"
                  >
                    {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultados'}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default Quiz;
