import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'database.db'));

console.log('🌱 Iniciando seed do banco de dados...');

// Limpar dados existentes
db.prepare('DELETE FROM slides').run();
db.prepare('DELETE FROM quiz_questions').run();

console.log('🗑️  Dados antigos removidos');

// Inserir slides
const slides = [
  {
    title: 'Segurança em Primeiro Lugar',
    icon: 'Shield',
    color: 'from-blue-500 to-cyan-500',
    illustration: 'SafetyIllustration',
    content: JSON.stringify([
      '🏥 Adornos não são permitidos durante a assistência',
      '🦠 O cuidado começa antes do contato com o paciente',
      '⚠️ Pequenos detalhes podem interferir na segurança de todos',
      '📖 Base legal: NR-32 - Segurança e Saúde no Trabalho em Serviços de Saúde',
      '🎀 Qualquer adorno que dificulte a higienização'
    ]),
    slide_order: 1
  },
  {
    title: 'O Que São Adornos?',
    icon: 'Sparkles',
    color: 'from-purple-500 to-pink-500',
    illustration: 'RingIllustration',
    content: JSON.stringify([
      '💍 Anéis, alianças e alargadores',
      '⌚ Relógios e pulseiras',
      '📿 Colares e correntes',
      '👔 Gravatas soltas e lenços',
      '👂 Brincos',
      '💅 Unhas alongadas ou com esmalte',
      '🎀 Qualquer adorno que dificulte a higienização'
    ]),
    slide_order: 2
  },
  {
    title: 'Riscos de Acidentes',
    icon: 'AlertTriangle',
    color: 'from-red-500 to-orange-500',
    illustration: 'MachineIllustration',
    content: JSON.stringify([
      '⚠️ Enroscamento em máquinas e equipamentos',
      '⚡ Condução de corrente elétrica (anéis e pulseiras metálicas)',
      '🦠 Contaminação em áreas estéreis',
      '🤕 Lesões por arrancamento ou esmagamento',
      '💥 Interferência em equipamentos de precisão',
      '🚨 Risco biológico e quebra de barreira de proteção'
    ]),
    slide_order: 3
  },
  {
    title: 'Anéis e Alianças: Por Que Não?',
    icon: 'XCircle',
    color: 'from-yellow-500 to-red-500',
    illustration: 'RingIllustration',
    content: JSON.stringify([
      '🦠 Dificultam a higienização das mãos',
      '⚠️ Favorecem a permanência de microrganismos',
      '🚫 Aumentam risco de contaminação cruzada',
      '💉 Podem romper luvas de procedimento',
      '🏥 Podem causar degloving (arrancamento da pele)',
      '📖 Base legal: NR-32 e diretrizes da ANVISA'
    ]),
    slide_order: 4
  },
  {
    title: 'Relógios no Punho: Permitido?',
    icon: 'AlertTriangle',
    color: 'from-orange-500 to-red-500',
    illustration: 'WatchIllustration',
    content: JSON.stringify([
      '❌ NÃO é permitido durante o plantão',
      '🧼 Impede a correta higiene das mãos e antebraços',
      '🦠 Aumenta o risco de contaminação cruzada',
      '⚠️ Interfere na paramentação adequada',
      '📖 Base legal: NR-32 e protocolos da SCIH'
    ]),
    slide_order: 5
  },
  {
    title: 'Unhas e Esmaltes: Qual o Risco?',
    icon: 'AlertTriangle',
    color: 'from-pink-500 to-purple-500',
    illustration: 'WorkerIllustration',
    content: JSON.stringify([
      '🦠 Unhas longas abrigam microrganismos',
      '💅 Esmaltes dificultam a higienização adequada',
      '⚠️ Aumentam o risco de infecção',
      '🚫 Podem romper luvas e contaminar procedimentos',
      '✅ Mantenha unhas curtas, limpas e sem esmalte'
    ]),
    slide_order: 6
  },
  {
    title: 'Brincos, Pulseiras e Colares',
    icon: 'XCircle',
    color: 'from-red-500 to-pink-500',
    illustration: 'NecklaceIllustration',
    content: JSON.stringify([
      '❌ NÃO são permitidos no setor assistencial',
      '🦠 Risco biológico - acúmulo de microrganismos',
      '⚠️ Risco de acidente - podem enroscar em equipamentos',
      '🚫 Quebra de barreira de proteção',
      '📖 Base legal: NR-32 e protocolos da SCIH'
    ]),
    slide_order: 7
  },
  {
    title: 'Boas Práticas',
    icon: 'CheckCircle',
    color: 'from-green-500 to-emerald-500',
    illustration: 'WorkerIllustration',
    content: JSON.stringify([
      '✅ Remova todos os adornos antes de iniciar o trabalho',
      '🔒 Guarde seus pertences em local seguro',
      '👀 Mantenha unhas curtas, limpas e sem esmalte',
      '🧼 Higienize as mãos corretamente',
      '🛡️ Utilize EPIs adequadamente',
      '📋 Siga sempre as normas de segurança'
    ]),
    slide_order: 8
  },
  {
    title: 'Política Institucional - ADORNO ZERO',
    icon: 'Shield',
    color: 'from-indigo-500 to-purple-500',
    illustration: 'SafetyIllustration',
    content: JSON.stringify([
      '💙 Proteger você é nosso compromisso',
      '🤝 Trabalho seguro é trabalho bem feito',
      '🏆 Sua família conta com você todos os dias',
      '✨ Pequenas atitudes salvam vidas',
      '🚫 ADORNO ZERO - Nenhum adorno é permitido',
      '💡 "Adorno não é detalhe"',
      '🏥 Aqui, o cuidado começa antes do contato',
      '🤝 A SCIH orienta, apoia e conta com você',
      '🎯 Vamos juntos nessa? ADORNO ZERO!'
    ]),
    slide_order: 9
  }
];

const insertSlide = db.prepare(`
  INSERT INTO slides (title, icon, color, illustration, content, slide_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);

slides.forEach(slide => {
  insertSlide.run(slide.title, slide.icon, slide.color, slide.illustration, slide.content, slide.slide_order);
});

console.log(`✅ ${slides.length} slides inseridos`);

// Inserir perguntas do quiz
const questions = [
  {
    question: 'Anel, aliança ou alargador: pode durante a assistência?',
    options: JSON.stringify([
      'Pode, se for discreto',
      'Pode, se higienizar bem',
      'Não pode',
      'Pode, apenas aliança de casamento'
    ]),
    correct: 2,
    explanation: 'Anéis e alianças dificultam a higienização das mãos e favorecem a permanência de microrganismos. Base legal: NR-32 e diretrizes da ANVISA.',
    question_order: 1
  },
  {
    question: 'Relógio no punho durante o plantão: permitido?',
    options: JSON.stringify([
      'Sim, se for digital',
      'Não',
      'Sim, se for de silicone',
      'Sim, se higienizar antes'
    ]),
    correct: 1,
    explanation: 'O relógio impede a correta higiene das mãos e antebraços, aumentando o risco de contaminação cruzada. Base legal: NR-32.',
    question_order: 2
  },
  {
    question: 'Unha alongada ou esmalte: qual o risco real?',
    options: JSON.stringify([
      'Nenhum risco',
      'Abriga microrganismos e dificulta a higienização',
      'Apenas questão estética',
      'Risco apenas se estiver descascado'
    ]),
    correct: 1,
    explanation: 'Unhas longas e esmaltes favorecem o acúmulo de microrganismos e dificultam a higiene das mãos, aumentando o risco de infecção. Por isso, não são permitidos na assistência.',
    question_order: 3
  },
  {
    question: 'Brincos, pulseiras e colares no setor assistencial: pode?',
    options: JSON.stringify([
      'Pode, se forem pequenos',
      'Não. Há risco biológico e de acidente',
      'Pode, se estiverem escondidos',
      'Pode apenas brincos pequenos'
    ]),
    correct: 1,
    explanation: 'Não. Além do risco biológico, há risco de acidente e quebra de barreira de proteção. Base legal: NR-32 e protocolos da SCIH.',
    question_order: 4
  },
  {
    question: 'Por que devemos evitar o uso de anéis no ambiente de trabalho?',
    options: JSON.stringify([
      'Podem enroscar em máquinas e causar lesões graves',
      'Porque são caros e podem ser perdidos',
      'Porque não combinam com o uniforme',
      'Porque podem arranhar as mesas'
    ]),
    correct: 0,
    explanation: 'Anéis podem enroscar em equipamentos e causar lesões por arrancamento (degloving), esmagamento ou até amputação. Base legal: NR-32.',
    question_order: 5
  },
  {
    question: 'Em áreas estéreis (como laboratórios ou saúde), por que adornos são proibidos?',
    options: JSON.stringify([
      'Por questões de moda',
      'Porque podem contaminar o ambiente',
      'Para economizar tempo',
      'Porque são desconfortáveis'
    ]),
    correct: 1,
    explanation: 'Adornos acumulam bactérias e microrganismos, podendo contaminar ambientes que precisam ser estéreis, como hospitais e laboratórios. Base legal: NR-32 e ANVISA.',
    question_order: 6
  },
  {
    question: 'O que é "degloving"?',
    options: JSON.stringify([
      'Um tipo de luva de segurança',
      'Arrancamento da pele causado por anéis presos',
      'Uma técnica de limpeza',
      'Um procedimento de segurança'
    ]),
    correct: 1,
    explanation: 'Degloving é o arrancamento traumático da pele, comum quando anéis ficam presos em equipamentos ou durante quedas. É uma lesão grave que pode levar à amputação.',
    question_order: 7
  },
  {
    question: 'Qual a melhor atitude ao ver um colega usando adornos em área de risco?',
    options: JSON.stringify([
      'Ignorar, não é problema meu',
      'Alertá-lo sobre os riscos de forma educada',
      'Tirar foto e postar nas redes sociais',
      'Apenas comentar com outros colegas'
    ]),
    correct: 1,
    explanation: 'Segurança é responsabilidade de todos. Alertar colegas de forma educada pode prevenir acidentes graves. A SCIH orienta, apoia e conta com você para um ambiente mais seguro.',
    question_order: 8
  },
  {
    question: 'Qual o principal objetivo das normas sobre adornos no trabalho?',
    options: JSON.stringify([
      'Padronizar a aparência dos funcionários',
      'Proteger a vida e integridade física dos trabalhadores',
      'Reduzir custos da empresa',
      'Facilitar a identificação dos funcionários'
    ]),
    correct: 1,
    explanation: 'O objetivo principal é sempre a segurança e proteção da vida e integridade física de todos os trabalhadores. Base legal: NR-32 – Segurança e Saúde no Trabalho em Serviços de Saúde.',
    question_order: 9
  },
  {
    question: 'Qual a política da instituição sobre adornos na assistência?',
    options: JSON.stringify([
      'Uso moderado é permitido',
      'ADORNO ZERO - nenhum adorno é permitido',
      'Apenas alianças são permitidas',
      'Depende do setor'
    ]),
    correct: 1,
    explanation: 'A política é ADORNO ZERO! Adorno não é detalhe. Aqui, o cuidado começa antes do contato. Pequenos detalhes podem interferir na segurança de todos. Vamos juntos nessa!',
    question_order: 10
  }
];

const insertQuestion = db.prepare(`
  INSERT INTO quiz_questions (question, options, correct, explanation, question_order)
  VALUES (?, ?, ?, ?, ?)
`);

questions.forEach(q => {
  insertQuestion.run(q.question, q.options, q.correct, q.explanation, q.question_order);
});

console.log(`✅ ${questions.length} perguntas inseridas`);

db.close();

console.log('🎉 Seed concluído com sucesso!');
console.log('📊 Total: 9 slides e 10 perguntas no banco de dados');
