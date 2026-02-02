import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertTriangle, Shield, XCircle, CheckCircle, Sparkles } from 'lucide-react';
import { RingIllustration, WatchIllustration, NecklaceIllustration, SafetyIllustration, MachineIllustration, WorkerIllustration } from '../components/AdornmentIllustration';

const API_URL = import.meta.env.VITE_API_URL?.includes('d36.com.br') 
  ? import.meta.env.VITE_API_URL + '/api'
  : 'http://localhost:4001/api';

// Fallback slides in case API fails or is empty
const defaultSlides = [
  {
    id: 1,
    title: 'Segurança em Primeiro Lugar',
    icon: Shield,
    color: 'from-blue-500 to-cyan-500',
    illustration: SafetyIllustration,
    content: [
      '🏥 Adornos não são permitidos durante a assistência',
      '🦠 O cuidado começa antes do contato com o paciente',
      '⚠️ Pequenos detalhes podem interferir na segurança de todos',
      '📖 Base legal: NR-32 - Segurança e Saúde no Trabalho em Serviços de Saúde',
      '🎀 Qualquer adorno que dificulte a higienização'
    ]
  },
  {
    id: 2,
    title: 'O Que São Adornos?',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    illustration: RingIllustration,
    content: [
      '💍 Anéis, alianças e alargadores',
      '⌚ Relógios e pulseiras',
      '📿 Colares e correntes',
      '👔 Gravatas soltas e lenços',
      '👂 Brincos',
      '💅 Unhas alongadas ou com esmalte',
      '🎀 Qualquer adorno que dificulte a higienização'
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
      '🦠 Contaminação em áreas estéreis',
      '🤕 Lesões por arrancamento ou esmagamento',
      '💥 Interferência em equipamentos de precisão',
      '🚨 Risco biológico e quebra de barreira de proteção'
    ]
  },
  {
    id: 4,
    title: 'Anéis e Alianças: Por Que Não?',
    icon: XCircle,
    color: 'from-yellow-500 to-red-500',
    illustration: RingIllustration,
    content: [
      '🦠 Dificultam a higienização das mãos',
      '⚠️ Favorecem a permanência de microrganismos',
      '🚫 Aumentam risco de contaminação cruzada',
      '💉 Podem romper luvas de procedimento',
      '🏥 Podem causar degloving (arrancamento da pele)',
      '📖 Base legal: NR-32 e diretrizes da ANVISA'
    ]
  },
  {
    id: 5,
    title: 'Relógios no Punho: Permitido?',
    icon: AlertTriangle,
    color: 'from-orange-500 to-red-500',
    illustration: WatchIllustration,
    content: [
      '❌ NÃO é permitido durante o plantão',
      '🧼 Impede a correta higiene das mãos e antebraços',
      '🦠 Aumenta o risco de contaminação cruzada',
      '⚠️ Interfere na paramentação adequada',
      '📖 Base legal: NR-32 e protocolos da SCIH'
    ]
  },
  {
    id: 6,
    title: 'Unhas e Esmaltes: Qual o Risco?',
    icon: AlertTriangle,
    color: 'from-pink-500 to-purple-500',
    illustration: WorkerIllustration,
    content: [
      '🦠 Unhas longas abrigam microrganismos',
      '💅 Esmaltes dificultam a higienização adequada',
      '⚠️ Aumentam o risco de infecção',
      '🚫 Podem romper luvas e contaminar procedimentos',
      '✅ Mantenha unhas curtas, limpas e sem esmalte'
    ]
  },
  {
    id: 7,
    title: 'Brincos, Pulseiras e Colares',
    icon: XCircle,
    color: 'from-red-500 to-pink-500',
    illustration: NecklaceIllustration,
    content: [
      '❌ NÃO são permitidos no setor assistencial',
      '🦠 Risco biológico - acúmulo de microrganismos',
      '⚠️ Risco de acidente - podem enroscar em equipamentos',
      '🚫 Quebra de barreira de proteção',
      '📖 Base legal: NR-32 e protocolos da SCIH'
    ]
  },
  {
    id: 8,
    title: 'Boas Práticas',
    icon: CheckCircle,
    color: 'from-green-500 to-emerald-500',
    illustration: WorkerIllustration,
    content: [
      '✅ Remova todos os adornos antes de iniciar o trabalho',
      '🔒 Guarde seus pertences em local seguro',
      '👀 Mantenha unhas curtas, limpas e sem esmalte',
      '🧼 Higienize as mãos corretamente',
      '🛡️ Utilize EPIs adequadamente',
      '📋 Siga sempre as normas de segurança'
    ]
  },
  {
    id: 9,
    title: 'Política Institucional - ADORNO ZERO',
    icon: Shield,
    color: 'from-indigo-500 to-purple-500',
    illustration: SafetyIllustration,
    content: [
      '💙 Proteger você é nosso compromisso',
      '🤝 Trabalho seguro é trabalho bem feito',
      '🏆 Sua família conta com você todos os dias',
      '✨ Pequenas atitudes salvam vidas',
      '� ADORNO ZERO - Nenhum adorno é permitido',
      '💡 "Adorno não é detalhe"',
      '🏥 Aqui, o cuidado começa antes do contato',
      '🤝 A SCIH orienta, apoia e conta com você',
      '🎯 Vamos juntos nessa? ADORNO ZERO!'
    ]
  }
];

// Map icon names to actual icon components
const iconMap = {
  Shield,
  Sparkles,
  AlertTriangle,
  XCircle,
  CheckCircle
};

// Map illustration names to actual illustration components
const illustrationMap = {
  SafetyIllustration,
  RingIllustration,
  WatchIllustration,
  NecklaceIllustration,
  MachineIllustration,
  WorkerIllustration
};

function Presentation() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch(`${API_URL}/slides`);
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Map API data to component format
        const formattedSlides = data.map(slide => ({
          ...slide,
          icon: iconMap[slide.icon] || Shield,
          illustration: illustrationMap[slide.illustration] || SafetyIllustration
        }));
        setSlides(formattedSlides);
      }
    } catch (error) {
      console.error('Error fetching slides, using defaults:', error);
    } finally {
      setLoading(false);
    }
  };

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
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
      await fetch(`${apiUrl}/api/presentation-view`, {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-2xl font-bold text-purple-600">Carregando apresentação...</div>
      </div>
    );
  }

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
