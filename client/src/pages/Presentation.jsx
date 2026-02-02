import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertTriangle, Shield, XCircle, CheckCircle, Sparkles } from 'lucide-react';
import { RingIllustration, WatchIllustration, NecklaceIllustration, SafetyIllustration, MachineIllustration, WorkerIllustration } from '../components/AdornmentIllustration';

const slides = [
  {
    id: 1,
    title: 'Segurança em Primeiro Lugar',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    illustration: SafetyIllustration,
    content: [
      'Adornos podem parecer inofensivos, mas em ambientes de trabalho podem representar sérios riscos',
      'Vamos entender juntos por que a segurança deve sempre vir em primeiro lugar',
      'Esta apresentação vai mostrar situações reais e como prevenir acidentes'
    ]
  },
  {
    id: 2,
    title: 'O Que São Adornos?',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    illustration: RingIllustration,
    content: [
      '💍 Anéis, alianças e joias nas mãos',
      '⌚ Relógios e pulseiras',
      '📿 Colares e correntes',
      '👂 Brincos grandes ou pendentes',
      '💅 Unhas postiças ou muito longas',
      '👔 Gravatas soltas e lenços'
    ]
  },
  {
    id: 3,
    title: 'Riscos de Acidentes',
    icon: AlertTriangle,
    color: 'from-red-500 to-orange-500',
    illustration: MachineIllustration,
    content: [
      '⚠️ Enroscamento em máquinas e equipamentos',
      '⚡ Condução de corrente elétrica (anéis e pulseiras metálicas)',
      '🔥 Contato com produtos químicos',
      '🤕 Lesões por arrancamento ou esmagamento',
      '💥 Interferência em equipamentos de precisão',
      '🚨 Contaminação em áreas estéreis'
    ]
  },
  {
    id: 4,
    title: 'Casos Reais',
    icon: XCircle,
    color: 'from-yellow-500 to-red-500',
    illustration: WatchIllustration,
    content: [
      '📊 Estudos mostram que 15% dos acidentes de trabalho envolvem adornos',
      '🏥 Anéis podem causar degloving (arrancamento da pele)',
      '⚡ Relógios metálicos já causaram choques elétricos fatais',
      '🔧 Colares podem ser puxados por máquinas rotativas',
      '💍 Anéis podem prender em equipamentos causando amputações'
    ]
  },
  {
    id: 5,
    title: 'Boas Práticas',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500',
    illustration: WorkerIllustration,
    content: [
      '✅ Remova todos os adornos antes de iniciar o trabalho',
      '🔒 Guarde seus pertences em local seguro',
      '👀 Mantenha unhas curtas e limpas',
      '👕 Use apenas uniformes adequados',
      '🛡️ Utilize EPIs corretamente',
      '📋 Siga sempre as normas de segurança da empresa'
    ]
  },
  {
    id: 6,
    title: 'Sua Segurança, Nossa Prioridade',
    icon: Shield,
    color: 'from-indigo-500 to-purple-500',
    illustration: SafetyIllustration,
    content: [
      '💙 Proteger você é nosso compromisso',
      '🤝 Trabalho seguro é trabalho bem feito',
      '🏆 Sua família conta com você todos os dias',
      '✨ Pequenas atitudes salvam vidas',
      '📢 Reporte situações de risco',
      '🎯 Juntos construímos um ambiente mais seguro'
    ]
  }
];

function Presentation() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    // Scroll para o topo antes de mudar de slide
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate('/quiz');
    }
  };

  const handleSkipQuiz = async () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    try {
      await fetch('http://localhost:3001/api/presentation-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      localStorage.removeItem('userData');
      alert('Obrigado por assistir à apresentação!');
      navigate('/');
    } catch (error) {
      console.error('Error recording view:', error);
      navigate('/');
    }
  };

  const prevSlide = () => {
    // Scroll para o topo antes de mudar de slide
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const Illustration = slide.illustration;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="glass-effect rounded-3xl p-8 md:p-12">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-gray-500">
                Slide {currentSlide + 1} de {slides.length}
              </span>
              <div className="flex gap-1">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 bg-gradient-to-r ' + slide.color
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className={`inline-flex p-6 rounded-full bg-gradient-to-r ${slide.color} mb-6`}
                >
                  <Icon className="w-16 h-16 text-white" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r ${slide.color} bg-clip-text text-transparent`}
                >
                  {slide.title}
                </motion.h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center"
                >
                  <div className="w-64 h-64 bg-white/30 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
                    <Illustration />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  {slide.content.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-lg text-gray-700 hover:bg-white/70 transition-all"
                    >
                      {item}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentSlide === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-purple-600 hover:shadow-lg border-2 border-purple-600'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                Anterior
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextSlide}
                className="flex items-center gap-2 btn-primary"
              >
                {currentSlide === slides.length - 1 ? 'Ir para o Quiz' : 'Próximo'}
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>

            {currentSlide === slides.length - 1 && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSkipQuiz}
                className="w-full py-3 px-6 rounded-lg font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all text-sm"
              >
                Pular Quiz e Finalizar
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Presentation;
