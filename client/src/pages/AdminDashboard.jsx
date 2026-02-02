import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Users, TrendingUp, Award, Calendar, 
  LogOut, Printer, Trash2, Search, 
  BarChart3, CheckCircle, XCircle, Filter, QrCode, Download, X
} from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [viewers, setViewers] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSector, setFilterSector] = useState('all');
  const [viewMode, setViewMode] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth) {
      navigate('/admin');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
      const [participantsRes, viewersRes, statsRes] = await Promise.all([
        fetch(`${apiUrl}/api/participants`),
        fetch(`${apiUrl}/api/viewers`),
        fetch(`${apiUrl}/api/stats`)
      ]);

      const participantsData = await participantsRes.json();
      const viewersData = await viewersRes.json();
      const statsData = await statsRes.json();

      setParticipants(participantsData);
      setViewers(viewersData);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const handleDelete = async (id, type = 'participant') => {
    const message = type === 'participant' 
      ? 'Tem certeza que deseja excluir este participante?' 
      : 'Tem certeza que deseja excluir este visualizador?';
    
    if (!confirm(message)) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
      const endpoint = type === 'participant' 
        ? `${apiUrl}/api/participants/${id}`
        : `${apiUrl}/api/viewers/${id}`;
      
      await fetch(endpoint, {
        method: 'DELETE'
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode-adornos.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const filteredParticipants = participants.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = filterSector === 'all' || p.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  const filteredViewers = viewers.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         v.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = filterSector === 'all' || v.sector === filterSector;
    return matchesSearch && matchesSector;
  });

  const allSectors = [...new Set([
    ...participants.map(p => p.sector),
    ...viewers.map(v => v.sector)
  ])];

  const displayData = viewMode === 'participants' ? filteredParticipants 
                    : viewMode === 'viewers' ? filteredViewers 
                    : [...filteredParticipants, ...filteredViewers];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-purple-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="hidden print:block mb-8 border-b-2 border-gray-300 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Sistema de Conscientização sobre Uso de Adornos
          </h1>
          <p className="text-center text-gray-600 text-sm">
            Relatório Gerencial - {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="mt-4 grid grid-cols-6 gap-3 text-center">
            <div className="border border-gray-300 p-2 rounded bg-indigo-50">
              <div className="text-xl font-bold text-indigo-700">{stats?.total_access || 0}</div>
              <div className="text-xs text-gray-700 font-medium">Total Acessos</div>
            </div>
            <div className="border border-gray-300 p-2 rounded bg-blue-50">
              <div className="text-xl font-bold text-blue-700">{stats?.total_participants || 0}</div>
              <div className="text-xs text-gray-700 font-medium">Fizeram Quiz</div>
            </div>
            <div className="border border-gray-300 p-2 rounded bg-orange-50">
              <div className="text-xl font-bold text-orange-700">{stats?.total_viewers || 0}</div>
              <div className="text-xs text-gray-700 font-medium">Só Visualizaram</div>
            </div>
            <div className="border border-gray-300 p-2 rounded bg-green-50">
              <div className="text-xl font-bold text-green-700">{stats?.average_score ? stats.average_score.toFixed(1) : '0'}</div>
              <div className="text-xs text-gray-700 font-medium">Média Acertos</div>
            </div>
            <div className="border border-gray-300 p-2 rounded bg-yellow-50">
              <div className="text-xl font-bold text-yellow-700">{stats?.highest_score || 0}</div>
              <div className="text-xs text-gray-700 font-medium">Maior Nota</div>
            </div>
            <div className="border border-gray-300 p-2 rounded bg-purple-50">
              <div className="text-xl font-bold text-purple-700">{stats?.lowest_score !== undefined ? stats.lowest_score : '0'}</div>
              <div className="text-xs text-gray-700 font-medium">Menor Nota</div>
            </div>
          </div>
        </div>
        
        <div className="print:hidden mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Painel Administrativo
              </h1>
              <p className="text-gray-600 mt-2">Gerencie os participantes e visualize estatísticas</p>
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQRCode(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <QrCode className="w-5 h-5" />
                QR Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Imprimir
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-indigo-600" />
                <span className="text-3xl font-bold text-indigo-600">
                  {stats?.total_access || 0}
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm">Total de Acessos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <span className="text-3xl font-bold text-blue-600">
                  {stats?.total_participants || 0}
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm">Fizeram Quiz</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-orange-600" />
                <span className="text-3xl font-bold text-orange-600">
                  {stats?.total_viewers || 0}
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm">Só Visualizaram</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-3xl font-bold text-green-600">
                  {stats?.average_score ? stats.average_score.toFixed(1) : '0'}
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm">Média de Acertos</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-yellow-600" />
                <span className="text-3xl font-bold text-yellow-600">
                  {stats?.highest_score || 0}
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm">Maior Pontuação</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                <span className="text-3xl font-bold text-purple-600">
                  {stats?.lowest_score !== undefined ? stats.lowest_score : '0'}
                </span>
              </div>
              <p className="text-gray-600 font-medium text-sm">Menor Pontuação</p>
            </motion.div>
          </div>

          <div className="glass-effect rounded-2xl p-6 mb-8">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setViewMode('all')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'all'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Todos ({(stats?.total_participants || 0) + (stats?.total_viewers || 0)})
                </button>
                <button
                  onClick={() => setViewMode('participants')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'participants'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Fizeram Quiz ({stats?.total_participants || 0})
                </button>
                <button
                  onClick={() => setViewMode('viewers')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    viewMode === 'viewers'
                      ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Só Visualizaram ({stats?.total_viewers || 0})
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou setor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterSector}
                    onChange={(e) => setFilterSector(e.target.value)}
                    className="pl-10 pr-8 py-3 rounded-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all outline-none appearance-none bg-white"
                  >
                    <option value="all">Todos os Setores</option>
                    {allSectors.map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-6 overflow-x-auto print:shadow-none">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2 print:text-xl print:border-b-2 print:border-gray-300 print:pb-3">
            <Users className="w-6 h-6 print:hidden" />
            {viewMode === 'participants' ? 'Participantes do Quiz' 
             : viewMode === 'viewers' ? 'Visualizadores da Apresentação'
             : 'Todos os Acessos'} ({displayData.length})
          </h2>

          {displayData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Nenhum registro encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full print:text-sm border-collapse">
                <thead className="print:bg-gray-100">
                  <tr className="border-b-2 border-gray-200 print:border-2 print:border-gray-400">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Setor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Formação</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Telefone</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Tipo</th>
                    {viewMode !== 'viewers' && (
                      <>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Pontuação</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Status</th>
                      </>
                    )}
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 print:py-2 print:px-2 print:border print:border-gray-400">Data</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700 print:hidden">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {viewMode === 'all' && (
                    <>
                      {filteredParticipants.map((participant, index) => {
                        const percentage = (participant.score / participant.total_questions) * 100;
                        const passed = percentage >= 70;

                        return (
                          <motion.tr
                            key={`p-${participant.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors"
                          >
                            <td className="py-4 px-4 font-medium text-gray-800 print:py-2 print:px-2 print:border print:border-gray-300">{participant.name}</td>
                            <td className="py-4 px-4 text-gray-600 print:py-2 print:px-2 print:border print:border-gray-300">{participant.sector}</td>
                            <td className="py-4 px-4 text-gray-600 print:py-2 print:px-2 print:border print:border-gray-300">{participant.formation}</td>
                            <td className="py-4 px-4 text-gray-600 print:py-2 print:px-2 print:border print:border-gray-300">{participant.phone}</td>
                            <td className="py-4 px-4 text-center print:py-2 print:px-2 print:border print:border-gray-300">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                <CheckCircle className="w-4 h-4" />
                                Quiz
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center print:py-2 print:px-2 print:border print:border-gray-300">
                              <span className="inline-flex items-center gap-1 font-bold text-purple-600">
                                {participant.score}/{participant.total_questions}
                                <span className="text-sm text-gray-500">({percentage.toFixed(0)}%)</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center print:py-2 print:px-2 print:border print:border-gray-300">
                              {passed ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                  <CheckCircle className="w-4 h-4" />
                                  Aprovado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                  <XCircle className="w-4 h-4" />
                                  Reprovado
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-600 text-sm print:py-2 print:px-2 print:border print:border-gray-300">
                              {new Date(participant.completed_at).toLocaleString('pt-BR')}
                            </td>
                            <td className="py-4 px-4 text-center print:hidden">
                              <button
                                onClick={() => handleDelete(participant.id, 'participant')}
                                className="text-red-600 hover:text-red-800 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })}
                      {filteredViewers.map((viewer, index) => (
                        <motion.tr
                          key={`v-${viewer.id}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (filteredParticipants.length + index) * 0.05 }}
                          className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors"
                        >
                          <td className="py-4 px-4 font-medium text-gray-800 print:py-2 print:px-2 print:border print:border-gray-300">{viewer.name}</td>
                          <td className="py-4 px-4 text-gray-600 print:py-2 print:px-2 print:border print:border-gray-300">{viewer.sector}</td>
                          <td className="py-4 px-4 text-gray-600 print:py-2 print:px-2 print:border print:border-gray-300">{viewer.formation}</td>
                          <td className="py-4 px-4 text-gray-600 print:py-2 print:px-2 print:border print:border-gray-300">{viewer.phone}</td>
                          <td className="py-4 px-4 text-center print:py-2 print:px-2 print:border print:border-gray-300">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                              👁️ Visualizou
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-gray-400 print:py-2 print:px-2 print:border print:border-gray-300">-</td>
                          <td className="py-4 px-4 text-center text-gray-400 print:py-2 print:px-2 print:border print:border-gray-300">-</td>
                          <td className="py-4 px-4 text-center text-gray-600 text-sm print:py-2 print:px-2 print:border print:border-gray-300">
                            {new Date(viewer.viewed_at).toLocaleString('pt-BR')}
                          </td>
                          <td className="py-4 px-4 text-center print:hidden">
                            <button
                              onClick={() => handleDelete(viewer.id, 'viewer')}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </>
                  )}
                  {viewMode === 'participants' && filteredParticipants.map((participant, index) => {
                    const percentage = (participant.score / participant.total_questions) * 100;
                    const passed = percentage >= 70;

                    return (
                      <motion.tr
                        key={participant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors"
                      >
                        <td className="py-4 px-4 font-medium text-gray-800">{participant.name}</td>
                        <td className="py-4 px-4 text-gray-600">{participant.sector}</td>
                        <td className="py-4 px-4 text-gray-600">{participant.formation}</td>
                        <td className="py-4 px-4 text-gray-600">{participant.phone}</td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Quiz
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1 font-bold text-purple-600">
                            {participant.score}/{participant.total_questions}
                            <span className="text-sm text-gray-500">({percentage.toFixed(0)}%)</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {passed ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                              <CheckCircle className="w-4 h-4" />
                              Aprovado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                              <XCircle className="w-4 h-4" />
                              Reprovado
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center text-gray-600 text-sm">
                          {new Date(participant.completed_at).toLocaleString('pt-BR')}
                        </td>
                        <td className="py-4 px-4 text-center print:hidden">
                          <button
                            onClick={() => handleDelete(participant.id, 'participant')}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                  {viewMode === 'viewers' && filteredViewers.map((viewer, index) => (
                    <motion.tr
                      key={viewer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-gray-800">{viewer.name}</td>
                      <td className="py-4 px-4 text-gray-600">{viewer.sector}</td>
                      <td className="py-4 px-4 text-gray-600">{viewer.formation}</td>
                      <td className="py-4 px-4 text-gray-600">{viewer.phone}</td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                          👁️ Visualizou
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-gray-600 text-sm">
                        {new Date(viewer.viewed_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="py-4 px-4 text-center print:hidden">
                        <button
                          onClick={() => handleDelete(viewer.id, 'viewer')}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="hidden print:block mt-8 border-t-2 border-gray-300 pt-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Relatório de Conscientização sobre Uso de Adornos
            </h1>
            <p className="text-sm text-gray-600">
              Relatório gerado em {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
          
          <div className="grid grid-cols-6 gap-4 mb-6 text-center">
            <div className="border border-gray-300 p-3 rounded">
              <div className="text-2xl font-bold text-indigo-600">{stats?.total_access || 0}</div>
              <div className="text-xs text-gray-600">Total Acessos</div>
            </div>
            <div className="border border-gray-300 p-3 rounded">
              <div className="text-2xl font-bold text-blue-600">{stats?.total_participants || 0}</div>
              <div className="text-xs text-gray-600">Fizeram Quiz</div>
            </div>
            <div className="border border-gray-300 p-3 rounded">
              <div className="text-2xl font-bold text-orange-600">{stats?.total_viewers || 0}</div>
              <div className="text-xs text-gray-600">Só Visualizaram</div>
            </div>
            <div className="border border-gray-300 p-3 rounded">
              <div className="text-2xl font-bold text-green-600">{stats?.average_score ? stats.average_score.toFixed(1) : '0'}</div>
              <div className="text-xs text-gray-600">Média Acertos</div>
            </div>
            <div className="border border-gray-300 p-3 rounded">
              <div className="text-2xl font-bold text-yellow-600">{stats?.highest_score || 0}</div>
              <div className="text-xs text-gray-600">Maior Pontuação</div>
            </div>
            <div className="border border-gray-300 p-3 rounded">
              <div className="text-2xl font-bold text-purple-600">{stats?.lowest_score !== undefined ? stats.lowest_score : '0'}</div>
              <div className="text-xs text-gray-600">Menor Pontuação</div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:bg-white print:relative print:p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full relative print:max-w-full print:rounded-none print:p-12"
          >
            <button
              onClick={() => setShowQRCode(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 print:hidden"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Print-only header */}
            <div className="hidden print:block text-center mb-8">
              <h1 className="text-4xl font-bold text-purple-700 mb-4">
                Sistema de Conscientização sobre Uso de Adornos
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto mb-6"></div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent print:text-purple-700 print:text-3xl print:mb-4">
              QR Code de Acesso
            </h2>
            <p className="text-center text-gray-600 mb-6 print:text-xl print:mb-8">
              Escaneie para acessar o sistema
            </p>

            <div className="flex justify-center mb-6 bg-white p-6 rounded-xl border-4 border-purple-200 print:border-8 print:p-8 print:mb-8">
              <QRCodeSVG
                id="qr-code-svg"
                value={window.location.origin}
                size={256}
                level="H"
                includeMargin={true}
                bgColor="#ffffff"
                fgColor="#7c3aed"
                className="print:w-96 print:h-96"
              />
            </div>

            <div className="text-center mb-6 print:mb-8">
              <p className="text-sm text-gray-600 mb-1 print:text-lg print:mb-2">URL de Acesso:</p>
              <p className="text-lg font-semibold text-purple-600 break-all print:text-2xl">
                {window.location.origin}
              </p>
            </div>

            {/* Print-only footer */}
            <div className="hidden print:block text-center mt-12 pt-8 border-t-2 border-gray-300">
              <p className="text-gray-600 text-lg">
                Desenvolvido para promover segurança no ambiente de trabalho
              </p>
              <p className="text-gray-500 text-sm mt-2">
                {new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex gap-3 print:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadQR}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Baixar QR Code
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Printer className="w-5 h-5" />
                Imprimir
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
