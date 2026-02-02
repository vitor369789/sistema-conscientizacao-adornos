import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Trophy, Clock } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'Por que devemos evitar o uso de anéis no ambiente de trabalho?',
    options: [
      'Porque podem enroscar em máquinas e causar lesões graves',
      'Porque são caros e podem ser perdidos',
      'Porque não combinam com o uniforme',
      'Porque podem arranhar as mesas'
    ],
    correct: 0,
    explanation: 'Anéis podem enroscar em equipamentos e causar lesões por arrancamento (degloving), esmagamento ou até amputação.'
  },
  {
    id: 2,
    question: 'Qual é o principal risco de usar relógios metálicos em áreas com eletricidade?',
    options: [
      'Podem parar de funcionar',
      'Podem conduzir corrente elétrica e causar choque',
      'Podem arranhar os equipamentos',
      'Podem atrapalhar a visão do tempo'
    ],
    correct: 1,
    explanation: 'Metais conduzem eletricidade. Um relógio metálico pode criar um caminho para a corrente elétrica, causando choques graves ou fatais.'
  },
  {
    id: 3,
    question: 'Qual dessas opções NÃO é considerada um adorno perigoso?',
    options: [
      'Colar comprido',
      'Brincos grandes',
      'Óculos de segurança',
      'Pulseiras'
    ],
    correct: 2,
    explanation: 'Óculos de segurança são EPIs (Equipamentos de Proteção Individual) e são obrigatórios em muitas áreas. Não são adornos.'
  },
  {
    id: 4,
    question: 'O que fazer com seus adornos antes de começar o trabalho?',
    options: [
      'Esconder debaixo do uniforme',
      'Remover e guardar em local seguro',
      'Deixar no carro',
      'Usar apenas um de cada vez'
    ],
    correct: 1,
    explanation: 'A única forma segura é remover completamente todos os adornos e guardá-los em local seguro antes de iniciar as atividades.'
  },
  {
    id: 5,
    question: 'Unhas postiças ou muito longas podem causar qual problema?',
    options: [
      'Apenas problemas estéticos',
      'Nenhum problema se forem bem feitas',
      'Podem quebrar, contaminar produtos ou enroscar em equipamentos',
      'Apenas desconforto pessoal'
    ],
    correct: 2,
    explanation: 'Unhas longas podem quebrar e contaminar produtos, enroscar em máquinas, dificultar o uso de luvas e EPIs, além de acumular sujeira.'
  },
  {
    id: 6,
    question: 'Qual a porcentagem aproximada de acidentes de trabalho que envolvem adornos?',
    options: [
      '5%',
      '15%',
      '25%',
      '35%'
    ],
    correct: 1,
    explanation: 'Estudos indicam que aproximadamente 15% dos acidentes de trabalho têm relação com o uso de adornos.'
  },
  {
    id: 7,
    question: 'Em áreas estéreis (como laboratórios ou saúde), por que adornos são proibidos?',
    options: [
      'Por questões de moda',
      'Porque podem contaminar o ambiente',
      'Para economizar tempo',
      'Porque são desconfortáveis'
    ],
    correct: 1,
    explanation: 'Adornos acumulam bactérias e microrganismos, podendo contaminar ambientes que precisam ser estéreis, como hospitais e laboratórios.'
  },
  {
    id: 8,
    question: 'O que é "degloving"?',
    options: [
      'Um tipo de luva de segurança',
      'Arrancamento da pele causado por anéis presos',
      'Uma técnica de limpeza',
      'Um procedimento de segurança'
    ],
    correct: 1,
    explanation: 'Degloving é o arrancamento traumático da pele, comum quando anéis ficam presos em equipamentos ou durante quedas.'
  },
  {
    id: 9,
    question: 'Qual a melhor atitude ao ver um colega usando adornos em área de risco?',
    options: [
      'Ignorar, não é problema meu',
      'Alertá-lo sobre os riscos de forma educada',
      'Tirar foto e postar nas redes sociais',
      'Apenas comentar com outros colegas'
    ],
    correct: 1,
    explanation: 'Segurança é responsabilidade de todos. Alertar colegas de forma educada pode prevenir acidentes graves.'
  },
  {
    id: 10,
    question: 'Qual o principal objetivo das normas sobre adornos no trabalho?',
    options: [
      'Padronizar a aparência dos funcionários',
      'Proteger a vida e integridade física dos trabalhadores',
      'Reduzir custos da empresa',
      'Facilitar a identificação dos funcionários'
    ],
    correct: 1,
    explanation: 'O objetivo principal é sempre a segurança e proteção da vida e integridade física de todos os trabalhadores.'
  }
];

function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

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
