
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  QrCode, 
  ChevronLeft, 
  CreditCard, 
  Smartphone, 
  CheckCircle2, 
  Eye, 
  EyeOff,
  Camera,
  LogOut,
  Coffee,
  UserCheck,
  Scan,
  RefreshCw,
  Clock,
  Trash2,
  ChevronDown,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Share2,
  Users,
  Package,
  Truck,
  AlertCircle
} from 'lucide-react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { createClient } from '@supabase/supabase-js';
import { Product, User, CartItem, CoffeeConfig } from './types';
import { COLORS, LOGOS, MOCK_PRODUCTS, SUBSCRIPTION_PLAN } from './constants';

// --- Supabase Client ---
// Use as variáveis de ambiente para segurança e para funcionar na Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Inicializa o Mercado Pago usando a sua chave pública que deve estar na Vercel
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

// --- Components ---

const Header = ({ user }: { user: User | null }) => {
  const navigate = useNavigate();
  return (
    // Aplicamos a cor exata da sua logo (#D52927) como fundo do header
    <header className="relative w-full z-10 bg-[#D52927] flex flex-col items-center">
      {/* Container que limita a largura da logo no PC */}
      <Link to="/" className="w-full max-w-[1200px] flex justify-center">
        <img 
          src="https://i.imgur.com/wzPfJj0.jpeg" 
          alt="Supernova Coffee" 
          // h-auto e max-h impedem que a logo cresça demais no desktop
          // object-contain garante que ela não estique
          className="w-full h-auto max-h-[160px] md:max-h-[220px] object-contain transition-all" 
          referrerPolicy="no-referrer" 
        />
      </Link>
      
      {/* Barra de utilitários - mantemos um leve fundo escuro para leitura do texto */}
      <div className="w-full flex justify-center bg-black/10 backdrop-blur-sm border-t border-white/10">
        <div className="w-full max-w-[1200px] flex justify-end p-2 px-6">
          <button 
            onClick={() => navigate(user ? '/cliente' : '/cadastro')} 
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-white flex items-center gap-2"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {user ? 'Minha Conta' : 'Entrar'}
            </span>
            <UserIcon size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

const HomePage = ({ user }: any) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-black text-white"
    >
      {/* O Header fica fora do container max-w para o fundo colorido ocupar a tela toda */}
      <Header user={user} />

      {/* Este container garante que o conteúdo do site não "esparrame" no PC */}
      <div className="max-w-[1200px] mx-auto">
        <main className="px-6 py-12 space-y-12">
          {/* O restante do seu código da Home continua aqui... */}

const CoffeeConfigModal = ({ product, onConfirm, onClose }: { product: Product, onConfirm: (config: CoffeeConfig) => void, onClose: () => void }) => {
  const [type, setType] = useState<'grain' | 'ground'>('grain');
  const [grind, setGrind] = useState<'fine' | 'medium' | 'coarse'>('medium');

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="w-full max-w-md bg-zinc-900 rounded-[32px] p-8 space-y-8 shadow-2xl border border-white/5"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tighter text-white">Configurar Café</h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-white"><ChevronLeft size={20} className="rotate-[-90deg]" /></button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Tipo de Grão</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setType('grain')}
                className={`py-4 rounded-2xl border-2 font-bold transition-all ${type === 'grain' ? 'border-[#E53E3E] bg-[#E53E3E]/10 text-white' : 'border-white/5 text-gray-500'}`}
              >
                Em Grãos
              </button>
              <button 
                onClick={() => setType('ground')}
                className={`py-4 rounded-2xl border-2 font-bold transition-all ${type === 'ground' ? 'border-[#E53E3E] bg-[#E53E3E]/10 text-white' : 'border-white/5 text-gray-500'}`}
              >
                Moído
              </button>
            </div>
          </div>

          {type === 'ground' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Moagem</p>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'fine', label: 'Fina (Espresso)' },
                  { id: 'medium', label: 'Média (Filtro/Hario V60)' },
                  { id: 'coarse', label: 'Grossa (Prensa Francesa)' }
                ].map((opt) => (
                  <button 
                    key={opt.id}
                    onClick={() => setGrind(opt.id as any)}
                    className={`p-4 rounded-xl border-2 text-left font-bold transition-all ${grind === opt.id ? 'border-[#E53E3E] bg-[#E53E3E]/10 text-white' : 'border-white/5 text-gray-500'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <button 
          onClick={() => onConfirm({ type, grind: type === 'ground' ? grind : undefined })}
          className="w-full py-5 bg-[#E53E3E] text-white font-bold rounded-2xl shadow-xl shadow-red-500/20"
        >
          Adicionar ao Carrinho
        </button>
      </motion.div>
    </div>
  );
};

const HomePage = ({ user }: any) => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-black text-white"
    >
      <div className="max-w-[1200px] mx-auto">
        <Header user={user} />

        <main className="px-6 py-12 space-y-12">
          {/* Hero Section */}
          <section className="relative overflow-hidden rounded-[40px] bg-zinc-900 text-white p-10 lg:p-20 shadow-2xl border border-white/5 min-h-[400px] flex items-center">
            <div className="relative z-10 max-w-xl space-y-6">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none uppercase">
                Energia <br />
                <span className="text-[#E53E3E]">Ilimitada.</span>
              </h2>
              <p className="text-gray-400 text-lg lg:text-xl font-medium max-w-md">
                Assine agora e beba café à vontade em nossa loja física. A revolução do consumo local chegou.
              </p>
              <button 
                onClick={() => navigate('/planos')}
                className="px-10 py-5 bg-[#E53E3E] text-white font-black uppercase tracking-[0.2em] text-sm rounded-2xl hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl shadow-red-500/40"
              >
                Assinar Agora
              </button>
            </div>
            
            <div className="absolute -right-20 -bottom-20 opacity-10 lg:opacity-20 rotate-12 pointer-events-none">
              <Coffee size={600} strokeWidth={1} />
            </div>
          </section>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-zinc-900/50 rounded-[32px] border border-white/5 space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#E53E3E]">
                <Coffee size={24} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Café de Origem</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Grãos selecionados das melhores regiões produtoras do Brasil.</p>
            </div>
            <div className="p-8 bg-zinc-900/50 rounded-[32px] border border-white/5 space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#E53E3E]">
                <Smartphone size={24} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Check-in Digital</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Identificação rápida via QR Code diretamente no balcão.</p>
            </div>
            <div className="p-8 bg-zinc-900/50 rounded-[32px] border border-white/5 space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[#E53E3E]">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Comunidade</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Faça parte de um ecossistema de apaixonados por café.</p>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
};

const SignUpPage = ({ onSignUp }: any) => {
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: ''
  });

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Usando o domínio do app no AI Studio para garantir funcionamento do redirect
          redirectTo: window.location.origin + '/cliente'
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Erro no login com Google:', error.message);
      setError('Erro ao entrar com Google. Tente novamente.');
    }
  };

    const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      
      // Redirecionamento por e-mail no login manual
      if (data.user?.email === 'barbara.supernova@gmail.com') {
        navigate('/balcao');
      } else {
        navigate('/cliente');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError(null);
    try {
      // 1. Tentar Login primeiro se o usuário já existir
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (!signInError && signInData.user) {
        // Usuário já existe e logou com sucesso
        navigate('/cliente');
        return;
      }

      // 2. Se falhar por credenciais inválidas, mas o e-mail existir, avisar sobre a senha
      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // Verificar se o e-mail existe para dar feedback melhor
        const { data: emailCheck } = await supabase.from('clientes').select('id').eq('email', formData.email).maybeSingle();
        if (emailCheck) {
          setError('Este e-mail já está cadastrado. Verifique sua senha.');
          setLoading(false);
          return;
        }
      }

      // 3. Se não existe, tentar Cadastro
      // Validação Prévia para Cadastro
      if (!formData.name.trim()) {
        setError('Por favor, informe seu nome completo para realizar o cadastro.');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }

      await onSignUp(e, formData);
    } catch (err: any) {
      console.error('Erro detalhado no processo de auth:', err);
      
      if (err.message?.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.');
      } else if (err.message.includes('User already registered')) {
        setError('Este e-mail já está cadastrado. Tente fazer login.');
      } else {
        setError(err.message || 'Erro ao processar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      className="w-full min-h-screen bg-black text-white"
    >
      <div className="max-w-[1200px] mx-auto p-6 flex flex-col min-h-screen">
        <header className="mb-12 max-w-md mx-auto w-full">
          <button onClick={() => navigate('/')} className="mb-8 p-2 -ml-2 hover:bg-zinc-800 rounded-full transition-colors text-white">
            <ChevronLeft size={24} />
          </button>
          <img src={LOGOS.HORIZONTAL} alt="Supernova" className="w-full h-auto object-cover mb-4" referrerPolicy="no-referrer" />
          <h1 className="text-3xl font-bold tracking-tighter text-white">{isLoginMode ? 'Entrar' : 'Criar Conta'}</h1>
        </header>

        <div className="space-y-4 flex-1 max-w-md mx-auto w-full">
        <button 
          onClick={handleGoogleLogin}
          className="w-full py-4 border-2 border-white/5 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-zinc-800 transition-all mb-8 text-white"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {isLoginMode ? 'Entrar com Google' : 'Cadastrar com Google'}
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-500">
            <span className="bg-black px-4">Ou use seu e-mail</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && !error.includes('senha') && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          {!isLoginMode && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Nome Completo</label>
              <input 
                required 
                type="text" 
                placeholder="Seu nome" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-4 bg-zinc-900 border-none rounded-2xl text-white focus:ring-2 focus:ring-[#E53E3E] transition-all" 
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">E-mail</label>
            <input 
              required 
              type="email" 
              placeholder="seu@email.com" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-4 bg-zinc-900 border-none rounded-2xl text-white focus:ring-2 focus:ring-[#E53E3E] transition-all" 
            />
          </div>
          {!isLoginMode && (
            <>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">WhatsApp</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="(00) 00000-0000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-4 bg-zinc-900 border-none rounded-2xl text-white focus:ring-2 focus:ring-[#E53E3E] transition-all" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">CPF (Obrigatório)</label>
                <input 
                  required 
                  type="text" 
                  placeholder="000.000.000-00" 
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full p-4 bg-zinc-900 border-none rounded-2xl text-white focus:ring-2 focus:ring-[#E53E3E] transition-all" 
                />
              </div>
            </>
          )}
          <div className="space-y-1 relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">{isLoginMode ? 'Senha' : 'Criar Senha'}</label>
            <div className="relative">
              <input 
                required 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full p-4 bg-zinc-900 border-none rounded-2xl text-white focus:ring-2 transition-all ${error?.includes('senha') ? 'ring-2 ring-red-500' : 'focus:ring-[#E53E3E]'}`} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {error?.includes('senha') && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-[11px] font-bold text-red-500 mt-1 ml-1 flex items-center gap-1"
              >
                <AlertCircle size={12} />
                {error}
              </motion.p>
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-[#E53E3E] text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <RefreshCw size={20} className="animate-spin" /> : (isLoginMode ? 'Entrar' : 'Cadastrar e Continuar')}
          </button>
        </form>
      </div>

      <footer className="mt-8 text-center space-y-4">
        <button 
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="text-sm text-gray-500"
        >
          {isLoginMode ? (
            <>Não tem uma conta? <span className="text-white font-bold">Cadastre-se</span></>
          ) : (
            <>Já tem uma conta? <span className="text-white font-bold">Fazer Login</span></>
          )}
        </button>
        <p className="text-[10px] text-gray-400 uppercase tracking-wider">
          Ao se cadastrar, você concorda com nossos <span className="underline">Termos de Uso</span>
        </p>
      </footer>
      </div>
    </motion.div>
  );
};

const CheckoutPage = ({ cart, cartTotal, user }: any) => {
  const navigate = useNavigate();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('https://owpeosbyhcugwikjbahn.supabase.co/functions/v1/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((item: any) => ({
            title: item.product.name,
            unit_price: item.product.price,
            quantity: item.quantity,
          }))
        }),
      });

      const data = await response.json();
      if (data.id) {
        setPreferenceId(data.id);
      } else {
        throw new Error("ID de preferência não retornado");
      }
    } catch (error) {
      console.error("Erro no checkout:", error);
      alert("Erro ao gerar pagamento. Verifique sua conexão.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="w-full min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto space-y-8">
        <header className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-zinc-800 rounded-full text-white">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold tracking-tighter">Finalizar Pedido</h1>
        </header>

        <section className="bg-zinc-900 rounded-[24px] p-6 border border-white/5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">Resumo do Carrinho</h2>
          {cart.map((item: any) => (
            <div key={item.product.id} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.product.name}</span>
              <span className="font-bold">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="pt-4 border-t border-white/10 flex justify-between items-center">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-2xl text-[#E53E3E]">R$ {cartTotal.toFixed(2)}</span>
          </div>
        </section>

        <div className="space-y-4">
          {!preferenceId ? (
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-5 bg-[#E53E3E] text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : 'Confirmar e Pagar'}
            </button>
          ) : (
            <div className="bg-white rounded-2xl p-2 overflow-hidden">
               <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
            </div>
          )}
        </div>
        
        <p className="text-[10px] text-center text-gray-500 uppercase tracking-widest">
          Pagamento processado com segurança pelo Mercado Pago
        </p>
      </div>
    </motion.div>
  );
};

const SuccessPage = () => {
  const navigate = useNavigate();
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full min-h-screen bg-black text-white flex items-center justify-center"
    >
      <div className="max-w-[1200px] mx-auto p-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-md mx-auto space-y-8">
          <div className="flex justify-center text-[#E53E3E]">
            <CheckCircle2 size={120} strokeWidth={1} />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter text-white">Pedido Confirmado!</h1>
          <p className="text-gray-400">Verifique seu e-mail para mais detalhes e o recibo da sua compra.</p>
          
          <button 
            onClick={() => navigate('/cliente')}
            className="w-full py-5 bg-[#E53E3E] text-white font-bold rounded-2xl shadow-xl shadow-red-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Ir para minha área de cliente
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const PlanosPage = ({ user, setCart }: any) => {
  const [planos, setPlanos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPlanosEDetalhes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('--- Iniciando busca de planos no Supabase ---');
      // 1. Buscar planos na tabela 'produtos' (categoria = 'assinatura')
      const { data: produtosPlanos, error: errorPlanos } = await supabase
        .from('produtos')
        .select('*')
        .eq('categoria', 'assinatura');
      
      if (errorPlanos) throw errorPlanos;

      console.log('Produtos de assinatura encontrados:', produtosPlanos?.length || 0);
      if (produtosPlanos) {
        console.log('Detalhes dos planos:', produtosPlanos);
      }

      if (produtosPlanos && produtosPlanos.length > 0) {
        // 2. Para cada plano, buscar os itens relacionados em 'assinatura_itens'
        // Tentamos buscar itens, mas se falhar não travamos o carregamento do plano principal
        const planosComItens = await Promise.all(produtosPlanos.map(async (plano) => {
          try {
            const { data: itensRelacao, error: errorItens } = await supabase
              .from('assinatura_itens')
              .select('produto_id')
              .eq('plano_id', plano.nome);

            if (errorItens || !itensRelacao || itensRelacao.length === 0) {
              return { ...plano, itens: [] };
            }

            const produtoIds = itensRelacao.map(i => i.produto_id);
            const { data: produtosItens } = await supabase
              .from('produtos')
              .select('nome, descricao')
              .in('id', produtoIds);
            
            return { ...plano, itens: produtosItens || [] };
          } catch (e) {
            console.warn(`Erro ao carregar itens para o plano ${plano.nome}:`, e);
            return { ...plano, itens: [] };
          }
        }));

        setPlanos(planosComItens);
      } else {
        console.log('Nenhum plano encontrado com categoria "assinatura". Usando fallback.');
        // Fallback se não houver planos no banco
        setPlanos([{
          id: SUBSCRIPTION_PLAN.id,
          nome: SUBSCRIPTION_PLAN.name,
          preco: SUBSCRIPTION_PLAN.price,
          descricao: SUBSCRIPTION_PLAN.description,
          itens: [{ nome: 'Café Ilimitado na loja' }, { nome: 'Acesso a eventos exclusivos' }, { nome: 'Desconto em grãos' }]
        }]);
      }
    } catch (err: any) {
      console.error('Erro crítico ao buscar planos:', err);
      setError(err.message || 'Erro ao carregar planos');
      // Fallback em caso de erro
      setPlanos([{
        id: SUBSCRIPTION_PLAN.id,
        nome: SUBSCRIPTION_PLAN.name,
        preco: SUBSCRIPTION_PLAN.price,
        descricao: SUBSCRIPTION_PLAN.description,
        itens: [{ nome: 'Café Ilimitado na loja' }, { nome: 'Acesso a eventos exclusivos' }, { nome: 'Desconto em grãos' }]
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanosEDetalhes();
  }, []);

  const handleSelectPlan = (plano: any) => {
    setCart([{ 
      product: { 
        id: plano.id, 
        name: plano.nome, 
        price: plano.preco, 
        description: plano.descricao,
        image: plano.imagem || '' 
      } as any, 
      quantity: 1 
    }]);
    navigate(user ? '/checkout' : '/cadastro');
  };

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="max-w-[1200px] mx-auto p-6 lg:p-12">
        <header className="mb-12 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 bg-zinc-800/50 hover:bg-zinc-800 rounded-full text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl lg:text-5xl font-black tracking-tighter uppercase">Planos de Assinatura</h1>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <RefreshCw className="animate-spin text-[#E53E3E]" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Carregando planos da Supernova...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6 bg-zinc-900/40 border border-white/5 rounded-[40px]">
            <AlertCircle size={48} className="text-[#E53E3E]" />
            <div className="text-center space-y-2">
              <p className="text-lg font-bold">Ops! Tivemos um problema.</p>
              <p className="text-sm text-gray-400">Não foi possível carregar os planos no momento.</p>
            </div>
            <button 
              onClick={fetchPlanosEDetalhes}
              className="px-8 py-3 bg-[#E53E3E] text-white font-bold rounded-2xl hover:bg-[#C53030] transition-all flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Tentar Novamente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planos.map(plano => (
              <div key={plano.id} className="bg-zinc-900/40 border border-white/5 rounded-[40px] p-8 lg:p-10 space-y-8 shadow-2xl backdrop-blur-sm flex flex-col hover:border-[#E53E3E]/30 transition-all group">
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-tighter text-white uppercase group-hover:text-[#E53E3E] transition-colors">{plano.nome}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{plano.descricao}</p>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tighter text-white">R$ {Number(plano.preco).toFixed(2)}</span>
                  <span className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">/mês</span>
                </div>

                <div className="space-y-6 py-6 border-t border-white/5 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#E53E3E]">O que está incluso:</p>
                  <ul className="space-y-4">
                    {plano.itens && plano.itens.length > 0 ? (
                      plano.itens.map((item: any, idx: number) => (
                        <li key={idx} className="flex items-start gap-4 text-sm text-gray-300">
                          <div className="w-6 h-6 mt-0.5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={16} className="text-green-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-white tracking-tight">{item.nome}</span>
                            {item.descricao && (
                              <span className="text-[11px] text-gray-500 leading-tight mt-1">{item.descricao}</span>
                            )}
                          </div>
                        </li>
                      ))
                    ) : (
                      <li className="text-xs italic text-gray-500">Consulte os benefícios no balcão.</li>
                    )}
                  </ul>
                </div>

                <button 
                  onClick={() => handleSelectPlan(plano)}
                  className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-[#E53E3E] hover:text-white transition-all shadow-xl shadow-black/20"
                >
                  Assinar Agora
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
);
};

const ClientAreaPage = ({ user, setUser, onLogout }: any) => {
  const navigate = useNavigate();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    nome: '',
    telefone: '',
    metodo_pagamento: 'pix'
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setSupabaseUser(authUser);
        
        // Fetch Client Data from 'clientes' table
        const { data: client, error: clientError } = await supabase
          .from('clientes')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (client) {
          setClientData(client);
          setProfileForm({
            nome: client.nome || '',
            telefone: client.telefone || '',
            metodo_pagamento: client.metodo_pagamento || 'pix'
          });

          // Fetch Subscription Data
          const { data: subData } = await supabase
            .from('assinaturas')
            .select('*')
            .eq('cliente_id', authUser.id)
            .eq('status', 'ativo')
            .gt('data_expiracao', new Date().toISOString())
            .maybeSingle();
          
          setSubscription(subData);
          
          // Update local user state if needed
          setUser({
            ...user,
            id: client.id,
            name: client.nome,
            email: client.email,
            phone: client.telefone,
            cpf: client.cpf,
            subscriptionActive: !!subData
          });
        }

        // Register presence in the shop
        const name = client?.nome || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || 'Cliente';
        try {
          await supabase
            .from('presenca_loja')
            .upsert([
              { 
                cliente_id: authUser.id, 
                nome_cliente: name,
                status_assinatura: !!subscription ? 'Platinum' : 'Free'
              }
            ], { onConflict: 'cliente_id' });
        } catch (err) {
          console.error('Erro ao registrar presença:', err);
        }

        // Fetch Orders
        fetchOrders(authUser.id);
      }
    };
    fetchUserAndData();
  }, [user]);

  // Realtime for Orders and Subscriptions
  useEffect(() => {
    if (!user?.id) return;

    const ordersChannel = supabase
      .channel(`user_orders_${user.id}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'vendas_webapp',
        filter: `cliente_id=eq.${user.id}`
      }, () => {
        fetchOrders(user.id);
      })
      .subscribe();

    const subChannel = supabase
      .channel(`user_sub_${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'assinaturas',
        filter: `cliente_id=eq.${user.id}`
      }, async () => {
        console.log('Mudança na assinatura detectada via Realtime!');
        // Re-fetch subscription data
        const { data: subData } = await supabase
          .from('assinaturas')
          .select('*')
          .eq('cliente_id', user.id)
          .eq('status', 'ativo')
          .gt('data_expiracao', new Date().toISOString())
          .maybeSingle();
        
        setSubscription(subData);
        setUser((prev: any) => ({ ...prev, subscriptionActive: !!subData }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(subChannel);
    };
  }, [user?.id]);

  const fetchOrders = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('vendas_webapp')
        .select('*')
        .eq('cliente_id', uid)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('clientes')
        .update({
          nome: profileForm.nome,
          telefone: profileForm.telefone,
          metodo_pagamento: profileForm.metodo_pagamento
        })
        .eq('id', authUser.id);

      if (error) throw error;

      // Update local state
      setClientData({ ...clientData, ...profileForm });
      setUser({
        ...user,
        name: profileForm.nome,
        phone: profileForm.telefone
      });
      
      setIsEditingProfile(false);
      alert('Dados atualizados com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      alert('Erro ao salvar: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pagamento pendente':
        return { color: 'text-orange-500 bg-orange-50', label: 'Pagamento Pendente' };
      case 'em preparação':
      case 'aguardando envio':
        return { color: 'text-blue-500 bg-blue-50', label: status };
      case 'em trânsito':
        return { color: 'text-purple-500 bg-purple-50', label: 'Em Trânsito' };
      case 'entregue':
        return { color: 'text-green-500 bg-green-50', label: 'Entregue' };
      default:
        return { color: 'text-gray-500 bg-gray-50', label: status || 'Processando' };
    }
  };

  const displayName = clientData?.nome || user?.name || supabaseUser?.user_metadata?.full_name || supabaseUser?.email || 'Cliente';
  const qrValue = user?.cpf || supabaseUser?.id || 'ID_CARREGANDO...';
  const displayId = user?.cpf || supabaseUser?.id || 'ID_CARREGANDO...';
  const isPlatinum = !!subscription;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-black text-white"
    >
      <div className="max-w-[1200px] mx-auto min-h-screen flex flex-col">
        <header className="relative h-64 lg:h-80 overflow-hidden rounded-b-[60px] lg:rounded-[60px] lg:mt-6">
          <img 
            src="https://i.imgur.com/wzPfJj0.jpeg" 
            alt="Supernova Header" 
            className="w-full h-full object-cover" 
            referrerPolicy="no-referrer" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <button 
              onClick={() => navigate('/')} 
              className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={onLogout} 
              className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full transition-all text-white flex items-center gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-widest px-1">Sair</span>
              <LogOut size={20} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-zinc-900 rounded-3xl shadow-xl mb-4 border-4 border-white/5">
              <UserCheck size={40} className="text-[#E53E3E]" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-black tracking-tighter text-white uppercase">Olá, {displayName.split(' ')[0]}</h1>
          </div>
        </header>

        <main className="px-8 py-12 flex-1 flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 items-start">
          <div className="w-full space-y-12">
            <div className="text-center lg:text-left space-y-4">
              <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-3xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 ${isPlatinum ? 'bg-emerald-500 text-white shadow-emerald-500/40 border border-white/10' : 'bg-red-600 text-white shadow-red-500/40 border border-white/10'}`}>
                {isPlatinum ? (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                    ATIVO
                  </>
                ) : (
                  <>
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    INATIVO
                  </>
                )}
              </div>
              {!isPlatinum && (
                <button 
                  onClick={() => navigate('/planos')}
                  className="block w-full lg:w-auto px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all"
                >
                  Ver Planos Disponíveis
                </button>
              )}
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sua identificação para consumo local</p>
            </div>

            <section className="flex flex-col items-center lg:items-start">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#E53E3E]/20 to-orange-500/20 rounded-[40px] blur-2xl opacity-50 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative w-full aspect-square max-w-[280px] bg-white rounded-[32px] shadow-2xl p-8 flex flex-col items-center justify-center border border-white/5">
                  <QRCodeCanvas 
                    value={qrValue} 
                    size={200}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "https://www.google.com/favicon.ico",
                      x: undefined,
                      y: undefined,
                      height: 24,
                      width: 24,
                      excavate: true,
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-10 text-center lg:text-left space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Apresente ao barista</p>
                <p className="text-[8px] font-mono text-gray-600 uppercase tracking-widest">{displayId}</p>
              </div>
            </section>
          </div>

          <div className="w-full space-y-8 mt-12 lg:mt-0">
            {/* Seção Meus Dados */}
            <section className="bg-zinc-900/50 rounded-[40px] p-8 space-y-8 border border-white/5 shadow-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">Meus Dados</h3>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs font-black uppercase tracking-[0.2em] text-[#E53E3E] hover:underline"
                >
                  {isEditingProfile ? 'Cancelar' : 'Editar'}
                </button>
              </div>

              {isEditingProfile ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Dados Pessoais</p>
                  <input 
                    type="text" placeholder="Nome Completo" 
                    value={profileForm.nome} onChange={(e) => setProfileForm({...profileForm, nome: e.target.value})}
                    className="w-full p-4 bg-zinc-800 border-none rounded-xl text-sm text-white focus:ring-2 focus:ring-[#E53E3E]" 
                  />
                  <input 
                    type="tel" placeholder="Telefone/WhatsApp" 
                    value={profileForm.telefone} onChange={(e) => setProfileForm({...profileForm, telefone: e.target.value})}
                    className="w-full p-4 bg-zinc-800 border-none rounded-xl text-sm text-white focus:ring-2 focus:ring-[#E53E3E]" 
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Pagamento Preferencial</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setProfileForm({...profileForm, metodo_pagamento: 'pix'})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${profileForm.metodo_pagamento === 'pix' ? 'bg-[#E53E3E] text-white' : 'bg-zinc-800 text-gray-500 border border-white/5'}`}
                    >
                      PIX
                    </button>
                    <button 
                      onClick={() => setProfileForm({...profileForm, metodo_pagamento: 'card'})}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${profileForm.metodo_pagamento === 'card' ? 'bg-[#E53E3E] text-white' : 'bg-zinc-800 text-gray-500 border border-white/5'}`}
                    >
                      CARTÃO
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="w-full py-4 bg-[#E53E3E] text-white font-bold rounded-xl text-sm shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isSaving ? <RefreshCw size={16} className="animate-spin" /> : 'Salvar Alterações'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Nome</p>
                    <p className="text-sm font-bold text-white">{clientData?.nome || 'Não informado'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Telefone</p>
                    <p className="text-sm font-bold text-white">{clientData?.telefone || 'Não informado'}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Plano Atual</p>
                    <p className="text-sm font-bold flex items-center gap-2 text-white">
                      {isPlatinum ? 'Platinum' : 'Free'}
                      <span className={`w-1.5 h-1.5 rounded-full ${isPlatinum ? 'bg-green-500' : 'bg-gray-500'}`} />
                    </p>
                  </div>
                  <button 
                    onClick={() => navigate('/planos')}
                    className="text-[10px] font-bold text-[#E53E3E] uppercase tracking-widest border border-red-500/20 px-3 py-1.5 rounded-lg"
                  >
                    Alterar Plano
                  </button>
                </div>

                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Pagamento Preferencial</p>
                  <p className="text-sm font-bold uppercase text-white">{clientData?.metodo_pagamento || 'Pix'}</p>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Histórico de Pedidos</h3>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Realtime
              </div>
            </div>

            <div className="space-y-4">
              {loadingOrders ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="animate-spin text-gray-600" size={24} />
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-20">
                  <p className="text-xs font-bold uppercase tracking-widest">Nenhum pedido encontrado</p>
                </div>
              ) : (
                orders.map((order, idx) => {
                  const status = getStatusConfig(order.status);
                  const items = typeof order.itens === 'string' ? JSON.parse(order.itens) : order.itens;
                  
                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={order.id || idx}
                      className="bg-zinc-900 border border-white/5 rounded-[24px] p-5 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </p>
                          <h4 className="font-bold text-sm text-white">
                            {items?.[0]?.nome || 'Pedido'} {items?.length > 1 ? `+ ${items.length - 1}` : ''}
                          </h4>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${status.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                          {status.label}
                        </div>
                      </div>

                      <div className="flex justify-between items-end pt-2 border-t border-white/5">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Detalhes</p>
                          <div className="flex gap-2">
                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-md font-bold text-gray-400">
                              {order.preferencia_moagem}
                            </span>
                            <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded-md font-bold text-gray-400">
                              {order.tipo_entrega}
                            </span>
                          </div>
                        </div>
                        <p className="font-bold text-lg text-white">R$ {Number(order.valor).toFixed(2)}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </section>
        </div>
        
        {!isPlatinum && (
          <button 
            onClick={() => navigate('/')}
            className="mt-12 w-full py-5 bg-zinc-800 text-white font-bold rounded-2xl shadow-xl hover:bg-zinc-700 transition-all"
          >
            Assinar Plano Platinum
          </button>
        )}
      </main>
      </div>
    </motion.div>
  );
};

const BaristaPanelPage = ({ notification, setNotification }: any) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'presenca' | 'pedidos'>('presenca');
  const [scannedId, setScannedId] = useState<string | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [recentConsumptions, setRecentConsumptions] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedPresence, setSelectedPresence] = useState<any>(null);
  const [planItems, setPlanItems] = useState<any[]>([]);
  const [customerStatus, setCustomerStatus] = useState<{ status: string; plano: string } | null>(null);
  const [sessionConsumptions, setSessionConsumptions] = useState<any[]>([]);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);

  // Função para carregar presença na loja (Polling)
  const carregarPresenca = async () => {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('presenca_loja')
      .select('*, clientes(nome, plano_ativo)')
      .is('data_saida', null)
      .gte('created_at', fourHoursAgo)
      .order('created_at', { ascending: false });
    
    if (data) {
      setClientes(data);
    }
    if (error) console.error('Erro ao carregar presença:', error);
  };

  // Realtime para presenca_loja
  useEffect(() => {
    const channel = supabase
      .channel('presenca_realtime')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'presenca_loja' 
      }, () => {
        carregarPresenca();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const carregarPedidos = async () => {
    const { data, error } = await supabase
      .from('vendas_webapp')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      setOrders(data);
    }
    if (error) console.error('Erro ao carregar pedidos:', error);
  };

  // Função para Sincronizar Dados (Correção de Dados)
  const syncData = async () => {
    setLoading(true);
    try {
      console.log('Iniciando sincronização de assinaturas...');
      // 1. Buscar todas as assinaturas ativas e não expiradas
      const { data: activeSubs, error: subError } = await supabase
        .from('assinaturas')
        .select('cliente_id')
        .eq('status', 'ativo')
        .gt('data_expiracao', new Date().toISOString());
      
      if (subError) throw subError;
      
      if (activeSubs && activeSubs.length > 0) {
        const clientIds = Array.from(new Set(activeSubs.map(s => s.cliente_id)));
        console.log(`Encontrados ${clientIds.length} clientes com assinaturas ativas.`);
        
        // 2. Atualizar todos esses clientes para plano_ativo = true
        const { error: updateError } = await supabase
          .from('clientes')
          .update({ plano_ativo: true })
          .in('id', clientIds);
        
        if (updateError) throw updateError;
        
        // 3. Opcional: Resetar plano_ativo para false para quem NÃO tem assinatura ativa
        // (Isso garante uma sincronização completa bidirecional)
        const { error: resetError } = await supabase
          .from('clientes')
          .update({ plano_ativo: false })
          .not('id', 'in', `(${clientIds.join(',')})`);
        
        if (resetError) console.warn('Erro ao resetar plano_ativo para inativos:', resetError);

        setNotification({ message: `${clientIds.length} clientes sincronizados com sucesso!`, type: 'success' });
      } else {
        // Se não houver ninguém ativo, resetamos todos para false
        await supabase.from('clientes').update({ plano_ativo: false }).neq('id', '00000000-0000-0000-0000-000000000000');
        setNotification({ message: 'Nenhuma assinatura ativa. Todos os status resetados.', type: 'success' });
      }
    } catch (err: any) {
      console.error('Erro na sincronização:', err);
      setNotification({ message: 'Erro na sincronização: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Fetch inicial e Polling automático
  useEffect(() => {
    const fetchConsumptions = async () => {
      const { data } = await supabase
        .from('historico_consumo')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setRecentConsumptions(data);
    };

    // Busca inicial
    fetchConsumptions();
    carregarPresenca();
    carregarPedidos();

    // Configura o intervalo de Polling para presença e pedidos (3 segundos)
    const intervalo = setInterval(() => {
      carregarPresenca();
      carregarPedidos();
    }, 3000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  // Realtime Subscription para consumos
  useEffect(() => {
    let activeChannel: any = null;
    let isMounted = true;

    const setupRealtime = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !isMounted) return;

      const channelName = `barista_consumos_${Date.now()}`;
      activeChannel = supabase
        .channel(channelName)
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'historico_consumo' 
        }, (payload) => {
          console.log('Realtime Change:', payload);
          const cid = (scannedId ? customer?.id : null) || selectedPresence?.cliente_id;
          if (cid) fetchConsumos(cid);
          
          supabase
            .from('historico_consumo')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)
            .then(({ data }) => {
              if (data && isMounted) setRecentConsumptions(data);
            });
        })
        .subscribe();
      
      if (!isMounted && activeChannel) {
        supabase.removeChannel(activeChannel);
      }
    };

    setupRealtime();

    return () => {
      isMounted = false;
      if (activeChannel) supabase.removeChannel(activeChannel);
    };
  }, [scannedId, selectedPresence, customer?.id]);

  // Scanner Logic
  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    if (isScannerOpen) {
      // fps: 10, qrbox: 250, videoConstraints: { facingMode: "environment" } para forçar câmera traseira
      scanner = new Html5QrcodeScanner("reader", { 
        fps: 10, 
        qrbox: 250,
        videoConstraints: { facingMode: "environment" }
      }, false);
      
      scanner.render((decodedText) => {
        setScannedId(decodedText.trim());
        setIsScannerOpen(false);
        scanner?.clear();
        
        // Feedback tátil (vibração) se disponível
        if (navigator.vibrate) navigator.vibrate(100);
        
        // Feedback sonoro (beep)
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
          console.warn('Áudio não suportado ou bloqueado');
        }
      }, (error) => {
        // console.warn(error);
      });
    }
    return () => {
      if (scanner) scanner.clear();
    };
  }, [isScannerOpen]);

  // Função para buscar consumos do cliente hoje
  const fetchConsumos = async (clienteId: string) => {
    const hoje = new Date().toISOString().split('T')[0];
    try {
      const { data, error } = await supabase
        .from('historico_consumo')
        .select('*')
        .eq('cliente_id', clienteId)
        .gte('created_at', `${hoje}T00:00:00`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Lista atualizada:', data);
      setSessionConsumptions(data || []);
    } catch (error) {
      console.error('Erro ao buscar consumos da sessão:', error);
    }
  };

  // Função para buscar itens do plano
  const buscarItensDoPlano = async (planoNome: string) => {
    if (!planoNome || planoNome === 'Nenhum') {
      setPlanItems([]);
      return;
    }

    try {
      // 1. Buscar produto_id na tabela assinatura_itens vinculados ao plano
      const { data: itens, error: errItens } = await supabase
        .from('assinatura_itens')
        .select('produto_id')
        .eq('plano_id', planoNome);
      
      if (errItens) throw errItens;

      if (itens && itens.length > 0) {
        const ids = itens.map(i => i.produto_id);
        // 2. Buscar nomes e detalhes na tabela produtos
        const { data: prods, error: errProds } = await supabase
          .from('produtos')
          .select('*')
          .in('id', ids);
        
        if (errProds) throw errProds;
        setPlanItems(prods || []);
      } else {
        setPlanItems([]);
      }
    } catch (err) {
      console.error('Erro ao buscar itens do plano:', err);
      setPlanItems([]);
    }
  };

  // Função para verificar assinatura na tabela 'clientes'
  const verificarAssinatura = async (inputId: string) => {
    setLoading(true);
    try {
      console.log('--- INÍCIO DA VERIFICAÇÃO DE ASSINATURA ---');
      console.log('Valor bruto lido pelo scanner:', inputId);
      
      let clienteUuid = null;
      let clienteNome = '';
      let clientePlanoAtivo = false;

      // 1. Verificar se o inputId é um UUID válido (8-4-4-4-12)
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(inputId);

      if (isUuid) {
        console.log('Identificado como UUID. Buscando...');
        const { data: clientById, error: uuidError } = await supabase
          .from('clientes')
          .select('id, nome, plano_ativo')
          .eq('id', inputId)
          .maybeSingle();
        
        if (uuidError) {
          console.error('Erro ao buscar por UUID:', uuidError);
          if (uuidError.code === '42501') throw new Error('Permissão Negada: O Barista não tem acesso à tabela de clientes (RLS).');
          throw uuidError;
        }

        if (clientById) {
          clienteUuid = clientById.id;
          clienteNome = clientById.nome;
          clientePlanoAtivo = clientById.plano_ativo;
          console.log('Cliente encontrado (UUID):', clientById);
        }
      } else {
        // Se não for UUID, assume que é CPF e busca por CPF
        const cleanCpf = String(inputId).replace(/\D/g, '');
        console.log('Identificado como CPF. Valor sanitizado (apenas números):', cleanCpf);
        
        if (cleanCpf.length < 11) {
          console.warn('CPF sanitizado parece curto demais:', cleanCpf);
        }

        // Busca Flexível: Tentamos encontrar o CPF sanitizado
        // Adicionamos logs detalhados para depuração
        console.log('Iniciando busca no banco para CPF:', cleanCpf);
        
        const { data: clientByCpf, error: cpfError, status, statusText } = await supabase
          .from('clientes')
          .select('id, nome, plano_ativo, cpf')
          .or(`cpf.eq.${cleanCpf},cpf.ilike.%${cleanCpf}%`) // Tenta match exato ou aproximado
          .maybeSingle();
        
        console.log('Resposta do Banco (Status):', status, statusText);
        
        if (cpfError) {
          console.error('ERRO SUPABASE (CPF):', cpfError);
          console.error('Código do erro:', cpfError.code);
          console.error('Mensagem:', cpfError.message);
          
          if (cpfError.code === '42501') {
            throw new Error('Permissão Negada (RLS): O perfil atual não tem permissão de leitura na tabela "clientes".');
          }
          if (cpfError.code === 'PGRST116') {
            throw new Error('Erro de Duplicidade: Mais de um cliente encontrado com este CPF.');
          }
          throw cpfError;
        }

        if (clientByCpf) {
          console.log('SUCESSO: Cliente retornado pelo banco:', clientByCpf);
          clienteUuid = clientByCpf.id;
          clienteNome = clientByCpf.nome;
          clientePlanoAtivo = clientByCpf.plano_ativo;
        } else {
          console.warn('AVISO: Banco retornou vazio (null) para o CPF:', cleanCpf);
        }
      }

      if (!clienteUuid) {
        console.log('Resultado: Cliente não encontrado no banco de dados.');
        setCustomerStatus({ status: 'inativo', plano: 'Cliente não encontrado' });
        setPlanItems([]);
        setSessionConsumptions([]);
        setNotification({ message: 'Cliente não encontrado na base de dados', type: 'error' });
        setLoading(false);
        return { status_assinatura: 'inativo', plano_id: 'Nenhum', nome: 'Cliente não encontrado' };
      }

      // Validação Adicional de Integridade do ID (8-4-4-4-12)
      const isValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clienteUuid);
      if (!isValidUuid) {
        console.error('ERRO DE INTEGRIDADE: clienteUuid recuperado não é um UUID válido:', clienteUuid);
        setNotification({ message: 'Erro de integridade do cadastro. Contate o administrador.', type: 'error' });
        setLoading(false);
        return { status_assinatura: 'inativo', plano_id: 'Erro', nome: 'Erro de Integridade' };
      }

      // 2. Check active subscription in 'assinaturas' table using the UUID
      // Esta é a "Verdade Absoluta" solicitada pelo usuário: ignoramos o status da tabela clientes
      console.log('Buscando assinatura ativa para UUID:', clienteUuid);
      const { data: sub, error: subError } = await supabase
        .from('assinaturas')
        .select('*')
        .eq('cliente_id', clienteUuid)
        .eq('status', 'ativo')
        .gt('data_expiracao', new Date().toISOString())
        .maybeSingle();

      if (subError) {
        console.error('Erro ao consultar tabela de assinaturas:', subError);
        throw subError;
      }

      if (sub) {
        setCustomerStatus({
          status: 'ativo',
          plano: sub.plano_id || 'platinum'
        });

        // Registrar presença na loja (Check-in)
        // Buscamos o UUID real e o nome para garantir integridade.
        console.log('ID que será enviado:', clienteUuid);
        const today = new Date().toISOString().split('T')[0];
        
        // Alterado para .insert() para permitir reentradas no mesmo dia
        const { error: presenceError } = await supabase.from('presenca_loja').insert({
          cliente_id: clienteUuid,
          nome_cliente: clienteNome,
          dia_presenca: today,
          data_saida: null // Garante que entra como nulo
        });

        if (presenceError) {
          console.error('Erro ao registrar presença:', presenceError);
          if (presenceError.code === '23503') {
            setNotification({ message: 'Erro de integridade: Cliente não existe no registro de presenças.', type: 'error' });
          } else {
            setNotification({ message: 'Erro ao registrar entrada na loja.', type: 'error' });
          }
          setLoading(false);
          return { status_assinatura: 'erro', plano_id: 'Erro', nome: clienteNome };
        }

        await carregarPresenca(); // Atualiza a lista imediatamente
        await buscarItensDoPlano(sub.plano_id || 'platinum');
        await fetchConsumos(clienteUuid);
        
        setNotification({ message: `Bem-vindo, ${clienteNome}! Check-in realizado.`, type: 'success' });
        
        // Limpar o scanner para o próximo cliente após um breve delay
        setTimeout(() => {
          setScannedId(null);
          setCustomer(null);
        }, 2000);

        return { status_assinatura: 'ativo', plano_id: sub.plano_id, nome: clienteNome, id: clienteUuid };
      } else {
        console.log('Nenhuma assinatura ativa encontrada na tabela "assinaturas" para este cliente.');
        setCustomerStatus({ status: 'inativo', plano: 'Sem plano ativo' });
        setPlanItems([]);
        setSessionConsumptions([]);
        setNotification({ message: 'Cliente cadastrado, mas sem plano ativo no momento', type: 'error' });
        return { status_assinatura: 'inativo', plano_id: 'Nenhum', nome: clienteNome, id: clienteUuid };
      }
    } catch (err) {
      console.error('Erro ao verificar assinatura:', err);
      setCustomerStatus({ status: 'pendente', plano: 'Erro na verificação' });
      setNotification({ message: 'Erro ao verificar assinatura', type: 'error' });
      setPlanItems([]);
      setSessionConsumptions([]);
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // Fetch customer data when ID is scanned
  useEffect(() => {
    if (scannedId) {
      const fetchCustomer = async () => {
        const data = await verificarAssinatura(scannedId);
        if (data) {
          setCustomer({
            id: (data as any).id || scannedId,
            name: (data as any).nome || 'Cliente Identificado',
            subscription_status: data.status_assinatura,
            plano_id: data.plano_id
          });
        } else {
          setCustomer({
            id: scannedId,
            name: 'Cliente não encontrado',
            subscription_status: 'pendente',
            plano_id: 'Nenhum'
          });
        }
      };
      fetchCustomer();
    }
  }, [scannedId]);

  // Lógica para quando um cliente da lista é selecionado
  const selecionarCliente = async (presenca: any) => {
    if (selectedPresence?.id === presenca.id) {
      setSelectedPresence(null);
      setCustomerStatus(null);
      setSessionConsumptions([]);
      return;
    }
    setSelectedPresence(presenca);
    setCustomer(null); // Limpa o scan se houver
    setScannedId(null);
    await verificarAssinatura(presenca.cliente_id);
  };

  const registerConsumption = async (productName: string) => {
    const cid = (scannedId ? customer?.id : null) || selectedPresence?.cliente_id;
    if (!cid || customerStatus?.status !== 'ativo' || isRegistering) return;

    // Optimistic UI: Adiciona um item temporário imediatamente
    const tempId = Math.random(); // ID temporário para o filter/map
    const tempItem = {
      id: tempId,
      cliente_id: cid,
      produto_nome: productName,
      created_at: new Date().toISOString(),
      isOptimistic: true
    };
    
    setSessionConsumptions(prev => [tempItem, ...prev]);
    setIsRegistering(productName);

    try {
      const { error, data: insertedData } = await supabase
        .from('historico_consumo')
        .insert([
          { cliente_id: cid, produto_nome: productName }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      setNotification({ message: 'Consumo registrado com sucesso!', type: 'success' });
      setTimeout(() => setNotification(null), 3000);

      // Substitui o item otimista pelo real retornado pelo banco
      if (insertedData) {
        setSessionConsumptions(prev => prev.map(item => item.id === tempId ? insertedData : item));
      }
      
      // Se foi selecionado da lista, removemos da presença
      if (selectedPresence) {
        await supabase.from('presenca_loja').delete().eq('id', selectedPresence.id);
      }
    } catch (error: any) {
      // Reverte Optimistic UI em caso de erro
      setSessionConsumptions(prev => prev.filter(item => item.id !== tempId));
      console.error('Erro ao registrar consumo:', error.message);
      setNotification({ message: 'Erro ao registrar: ' + error.message, type: 'error' });
      setTimeout(() => setNotification(null), 4000);
    } finally {
      setIsRegistering(null);
    }
  };

  const handleDelete = async (consumoId: any) => {
    const numericId = Number(consumoId);
    const originalItem = sessionConsumptions.find(item => Number(item.id) === numericId);
    
    // Optimistic UI: Remove da lista visual imediatamente
    setSessionConsumptions(prev => prev.filter(item => Number(item.id) !== numericId));

    try {
      const { error } = await supabase
        .from('historico_consumo')
        .delete()
        .eq('id', numericId);
      
      if (error) throw error;

      setNotification({ message: 'Café removido com sucesso', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error: any) {
      // Reverte Optimistic UI em caso de erro
      if (originalItem) {
        setSessionConsumptions(prev => [originalItem, ...prev].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ));
      }
      console.error('Erro ao excluir:', error.message);
      setNotification({ message: 'Erro ao excluir: ' + error.message, type: 'error' });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const generateShippingLabel = (order: any) => {
    const labelData = {
      customer: {
        name: order.cliente_nome,
        email: order.cliente_email,
        address: order.endereco_entrega
      },
      items: order.itens,
      total_value: order.valor,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(labelData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `etiqueta_${order.cliente_nome?.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const estornarConsumo = handleDelete; // Alias para compatibilidade se necessário

  const removePresence = async (id: string) => {
    try {
      // Em vez de deletar, marcamos o horário de saída
      const { error } = await supabase
        .from('presenca_loja')
        .update({ data_saida: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      if (selectedPresence?.id === id) {
        setSelectedPresence(null);
        setCustomerStatus(null);
        setSessionConsumptions([]);
      }
      
      // Atualiza a lista local para feedback imediato
      setClientes(prev => prev.filter(c => c.id !== id));
      
      setNotification({ message: 'Visita finalizada com sucesso', type: 'success' });
    } catch (err) {
      console.error('Erro ao finalizar visita:', err);
      setNotification({ message: 'Erro ao finalizar visita', type: 'error' });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen bg-black text-white flex flex-col font-sans"
    >
      <div className="max-w-[1200px] mx-auto w-full flex-1 flex flex-col">
        <header className="p-6 border-b border-white/5 flex justify-between items-center bg-black/50 backdrop-blur-xl sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E53E3E] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
              <Coffee size={24} />
            </div>
            <div>
              <h1 className="font-bold tracking-tight text-lg">Painel Barista</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Supernova Coffee</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={syncData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all disabled:opacity-50 text-gray-400 hover:text-white"
              title="Sincronizar Status de Assinaturas"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Sincronizar</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-400 hover:text-white"
              title="Dashboard de Inteligência"
            >
              <BarChart3 size={20} />
            </button>
            <button 
              onClick={() => navigate('/')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-8">
        {/* TAB NAVIGATION */}
        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('presenca')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'presenca' ? 'bg-[#E53E3E] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <UserCheck size={16} />
            Presença
          </button>
          <button 
            onClick={() => setActiveTab('pedidos')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeTab === 'pedidos' ? 'bg-[#E53E3E] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            <Package size={16} />
            Pedidos
          </button>
        </div>

        {activeTab === 'presenca' ? (
          <>
            {/* SCANNER SECTION */}
            <section className="space-y-4">
          {isScannerOpen ? (
            <div className="space-y-4">
              <div id="reader" className="overflow-hidden rounded-[32px] border-4 border-white/5 bg-black"></div>
              {loading && (
                <div className="flex items-center justify-center gap-2 py-4 text-red-500">
                  <RefreshCw size={16} className="animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-widest">Consultando base de dados...</span>
                </div>
              )}
              <button 
                onClick={() => setIsScannerOpen(false)}
                className="w-full py-4 bg-white/5 text-white font-bold rounded-2xl"
              >
                Cancelar Scanner
              </button>
            </div>
          ) : !customer && !selectedPresence ? (
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="w-full py-10 bg-[#E53E3E] text-white rounded-[32px] flex flex-col items-center justify-center gap-4 shadow-2xl shadow-red-500/20 active:scale-[0.98] transition-all border-4 border-red-400/20"
            >
              <div className="p-5 bg-white/20 rounded-full">
                <Scan size={40} />
              </div>
              <span className="text-xl font-bold tracking-tight">Escanear QR Code</span>
            </button>
          ) : null}
        </section>

        {/* ACTIVE PRESENCES */}
        <section className="space-y-6 w-full min-h-[500px]">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <UserCheck size={14} />
              Clientes na Loja ({clientes.length})
            </h2>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {clientes.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  exit={{ opacity: 0 }}
                  key="empty"
                  className="py-12 text-center border-2 border-dashed border-white/5 rounded-[32px]"
                >
                  <p className="text-xs font-bold uppercase tracking-widest">Nenhum cliente na loja no momento</p>
                </motion.div>
              ) : (
                // Garantir que não mostramos nomes repetidos na UI usando um Map por cliente_id
                Array.from(new Map(clientes.map(item => [item.cliente_id, item])).values()).map((p: any) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    key={p.id} 
                    className="space-y-2"
                  >
                    <div 
                      onClick={() => selecionarCliente(p)}
                      className={`p-5 border rounded-2xl flex justify-between items-center cursor-pointer transition-all ${selectedPresence?.id === p.id ? 'bg-[#E53E3E]/10 border-[#E53E3E]/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <UserIcon size={18} />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{p.nome_cliente || p.clientes?.nome || 'Cliente'}</div>
                          <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
                            {p.status_assinatura || (p.clientes?.plano_ativo ? 'ativo' : 'inativo')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); removePresence(p.id); }}
                          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                        >
                          Finalizar Visita
                        </button>
                        <motion.div
                          animate={{ rotate: selectedPresence?.id === p.id ? 180 : 0 }}
                          className="text-gray-500"
                        >
                          <ChevronDown size={20} />
                        </motion.div>
                      </div>
                    </div>

                    {/* ACORDEÃO EXPANSÍVEL */}
                    <AnimatePresence>
                      {selectedPresence?.id === p.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className={`border rounded-[32px] p-6 space-y-6 transition-colors duration-500 mt-2 ${
                            customerStatus?.status === 'ativo' 
                              ? 'bg-white/5 border-white/10' 
                              : 'bg-gray-900/50 border-gray-700 grayscale'
                          }`}>
                            <div className="space-y-4">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                {customerStatus?.status === 'ativo' ? 'Bebidas do Plano' : 'Acesso Bloqueado'}
                              </h4>
                              
                              {loading ? (
                                <div className="flex justify-center py-8">
                                  <RefreshCw className="animate-spin text-[#D2691E]" size={32} />
                                </div>
                              ) : customerStatus?.status === 'ativo' ? (
                                planItems.length > 0 ? (
                                  <div className="grid grid-cols-1 gap-3">
                                    {planItems.map(product => (
                                      <button 
                                        key={product.id}
                                        disabled={!!isRegistering}
                                        onClick={() => registerConsumption(product.nome)}
                                        className={`py-6 font-bold rounded-[20px] active:scale-95 transition-all text-base shadow-xl flex items-center justify-center gap-4 border-b-4 border-black/20 ${
                                          isRegistering === product.nome 
                                            ? 'bg-green-600 border-green-800' 
                                            : 'bg-[#D2691E] hover:bg-[#B2591E] text-white'
                                        }`}
                                      >
                                        <div className="p-2 bg-white/20 rounded-full">
                                          {isRegistering === product.nome ? (
                                            <RefreshCw size={20} className="animate-spin" />
                                          ) : (
                                            <Coffee size={20} />
                                          )}
                                        </div>
                                        <span className="tracking-tight">
                                          {isRegistering === product.nome ? 'Registrando...' : product.nome}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="py-6 text-center border-2 border-dashed border-white/10 rounded-[20px] bg-white/5">
                                    <p className="text-xs font-bold text-gray-400">Nenhum item disponível para este plano.</p>
                                  </div>
                                )
                              ) : (
                                <div className="py-8 text-center bg-black/40 rounded-[20px] border border-white/5">
                                  <p className="text-xs font-bold text-yellow-500 mb-1 uppercase tracking-widest">Atenção</p>
                                  <p className="text-[10px] text-gray-400 px-4">{customerStatus?.plano || 'O cliente não possui uma assinatura ativa.'}</p>
                                </div>
                              )}
                            </div>

                            {/* CONSUMOS RECENTES DENTRO DO ACORDEÃO */}
                            {customerStatus?.status === 'ativo' && (
                              <div className="pt-6 border-t border-white/5 space-y-4">
                                <div className="flex justify-between items-end">
                                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Consumos Recentes</h4>
                                  <div className="text-right">
                                    <span className="text-[10px] font-bold text-[#D2691E]">{sessionConsumptions.length} hoje</span>
                                  </div>
                                </div>

                                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                  {sessionConsumptions.length === 0 ? (
                                    <p className="text-[10px] text-gray-600 italic py-2">Nenhum consumo hoje.</p>
                                  ) : (
                                    sessionConsumptions.map((item) => (
                                      <div 
                                        key={item.id}
                                        className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-6 h-6 bg-[#D2691E]/20 rounded-md flex items-center justify-center">
                                            <Coffee size={12} className="text-[#D2691E]" />
                                          </div>
                                          <div>
                                            <p className="text-xs font-bold">{item.produto_nome}</p>
                                            <p className="text-[9px] text-gray-500">
                                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                          </div>
                                        </div>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id);
                                          }}
                                          className="relative z-10 p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
              <Clock size={14} />
              Atividade Recente
            </h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 uppercase tracking-widest">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Realtime
            </div>
          </div>

          <div className="space-y-3">
            {recentConsumptions.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-20">
                <RefreshCw size={32} className="mx-auto mb-2 animate-spin-slow" />
                <p className="text-xs font-bold uppercase tracking-widest">Aguardando registros...</p>
              </div>
            ) : (
              recentConsumptions.map((item, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={item.id || `recent-${idx}`}
                  className="p-5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#E53E3E]/20 group-hover:text-[#E53E3E] transition-all">
                      <Coffee size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{item.produto_nome}</div>
                      <div className="text-[10px] text-gray-500 font-mono">ID: {item.cliente_id?.slice(0, 8)}...</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                    {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </>
    ) : (
      /* GESTÃO DE PEDIDOS TAB */
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
            <Truck size={14} />
            Pedidos para Envio ({orders.length})
          </h2>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-[32px] opacity-20">
              <p className="text-xs font-bold uppercase tracking-widest">Nenhum pedido pendente de envio</p>
            </div>
          ) : (
            orders.map((order, oIdx) => (
              <div key={order.id || `order-${oIdx}`} className="bg-white/5 border border-white/5 rounded-[32px] p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{order.cliente_nome || 'Cliente'}</h3>
                    <p className="text-[10px] text-gray-500">{order.cliente_email}</p>
                    <div className="mt-1 flex gap-2">
                      <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold uppercase tracking-widest text-gray-400">
                        {order.tipo_entrega}
                      </span>
                      <span className="px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold uppercase tracking-widest text-gray-400">
                        {order.preferencia_moagem}
                      </span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    Pago
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Itens do Pedido</p>
                  <div className="space-y-1">
                    {Array.isArray(order.itens) && order.itens.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="text-xs flex justify-between">
                        <span className="text-gray-300">{item.quantidade}x {item.nome}</span>
                        <span className="font-mono text-gray-500">{item.preferencia_moagem || item.config?.grind || 'Grãos'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold">R$ {Number(order.valor).toFixed(2)}</div>
                    <div className="flex gap-2">
                      <select 
                        value={order.status || 'Aguardando Envio'}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          try {
                            await supabase
                              .from('vendas_webapp')
                              .update({ status: newStatus })
                              .eq('id', order.id);
                            carregarPedidos(); // Refresh list using the correct function name
                          } catch (err) {
                            console.error('Erro ao atualizar status:', err);
                          }
                        }}
                        className="bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl px-3 py-2 border-none focus:ring-2 focus:ring-[#E53E3E]"
                      >
                        <option value="Pagamento Pendente">Pendente</option>
                        <option value="Em Preparação">Preparação</option>
                        <option value="Aguardando Envio">Aguardando</option>
                        <option value="Em Trânsito">Trânsito</option>
                        <option value="Entregue">Entregue</option>
                      </select>
                      <button 
                        onClick={() => generateShippingLabel(order)}
                        className="px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all flex items-center gap-2"
                      >
                        <Download size={14} />
                        Etiqueta
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    )}
  </main>

      {/* NOTIFICAÇÃO DE RODAPÉ */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-6 right-6 z-[100]"
          >
            <div className={`${notification.type === 'error' ? 'bg-red-600 border-red-500/50' : 'bg-green-600 border-green-500/50'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl`}>
              {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
              <span className="font-bold text-sm tracking-tight">{notification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </motion.div>
  );
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'daily' | 'monthly'>('daily');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      const startOfMonth = new Date(selectedYear, selectedMonth, 1).toISOString();
      const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59).toISOString();

      // 1. Relatório Diário
      const { data: dailyConsumptions } = await supabase
        .from('historico_consumo')
        .select('*')
        .gte('created_at', todayISO);

      const { data: dailyPresences } = await supabase
        .from('presenca_loja')
        .select('*')
        .gte('created_at', todayISO);

      // Volume de Assinatura Diário
      const dailyVolume = (dailyConsumptions || []).reduce((acc: any, item: any) => {
        acc[item.produto_nome] = (acc[item.produto_nome] || 0) + 1;
        return acc;
      }, {});

      const dailyVolumeData = Object.entries(dailyVolume).map(([name, value]) => ({ name, value }));

      // 2. Relatório Mensal
      const { data: monthlyConsumptions } = await supabase
        .from('historico_consumo')
        .select('*')
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);

      // Recorrência Mensal
      const customerVisits: any = {};
      (monthlyConsumptions || []).forEach((c: any) => {
        const date = c.created_at.split('T')[0];
        if (!customerVisits[c.cliente_id]) customerVisits[c.cliente_id] = new Set();
        customerVisits[c.cliente_id].add(date);
      });

      const recurringCustomers = Object.values(customerVisits).filter((v: any) => v.size > 3).length;

      // Consumo Acumulado Mensal
      const monthlyVolume = (monthlyConsumptions || []).reduce((acc: any, item: any) => {
        acc[item.produto_nome] = (acc[item.produto_nome] || 0) + 1;
        return acc;
      }, {});

      const monthlyVolumeData = Object.entries(monthlyVolume).map(([name, value]) => ({ name, value }));

      // Mock Financeiro (Simulado pois não temos tabela de vendas real ainda)
      const financeData = [
        { name: 'Pix', value: 4500, color: '#00C49F' },
        { name: 'Crédito', value: 3200, color: '#FF8042' }
      ];

      setStats({
        daily: {
          activations: dailyPresences?.length || 0,
          volume: dailyVolumeData,
          totalConsumptions: dailyConsumptions?.length || 0
        },
        monthly: {
          recurrence: recurringCustomers,
          volume: monthlyVolumeData,
          finance: financeData,
          totalConsumptions: monthlyConsumptions?.length || 0
        }
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  const generateWhatsAppSummary = () => {
    if (!stats) return;
    const date = new Date().toLocaleDateString('pt-BR');
    let text = `*RESUMO DIÁRIO SUPERNOVA - ${date}*\n\n`;
    text += `🚀 *Ativações:* ${stats.daily.activations}\n`;
    text += `☕ *Total Consumido:* ${stats.daily.totalConsumptions}\n\n`;
    text += `*DETALHAMENTO:*\n`;
    stats.daily.volume.forEach((item: any) => {
      text += `- ${item.name}: ${item.value}\n`;
    });
    
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto min-h-screen bg-black text-white flex flex-col font-sans"
    >
      <header className="p-6 bg-black border-b border-white/5 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-white">
            <BarChart3 size={24} />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-lg text-white">Inteligência</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Supernova Dashboard</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/balcao')}
          className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-all text-white"
        >
          <ChevronLeft size={20} />
        </button>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* VIEW SELECTOR */}
        <div className="flex p-1 bg-zinc-800 rounded-2xl">
          <button 
            onClick={() => setView('daily')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${view === 'daily' ? 'bg-zinc-700 shadow-sm text-white' : 'text-gray-500'}`}
          >
            Diário
          </button>
          <button 
            onClick={() => setView('monthly')}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${view === 'monthly' ? 'bg-zinc-700 shadow-sm text-white' : 'text-gray-500'}`}
          >
            Mensal
          </button>
        </div>

        {view === 'monthly' && (
          <div className="flex gap-2">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="flex-1 bg-zinc-800 border border-white/5 rounded-xl p-3 text-sm font-bold text-white"
            >
              {['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'].map((m, i) => (
                <option key={i} value={i}>{m}</option>
              ))}
            </select>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-24 bg-zinc-800 border border-white/5 rounded-xl p-3 text-sm font-bold text-white"
            >
              {[2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <RefreshCw size={40} className="animate-spin text-gray-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Processando dados...</p>
          </div>
        ) : stats && (
          <div className="space-y-6">
            {/* KPI CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 p-5 rounded-[24px] border border-white/5 shadow-sm">
                <div className="w-8 h-8 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center mb-3">
                  {view === 'daily' ? <TrendingUp size={18} /> : <Users size={18} />}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
                  {view === 'daily' ? 'Ativações' : 'Recorrência'}
                </p>
                <p className="text-2xl font-black tracking-tighter text-white">
                  {view === 'daily' ? stats.daily.activations : stats.monthly.recurrence}
                </p>
              </div>
              <div className="bg-zinc-900 p-5 rounded-[24px] border border-white/5 shadow-sm">
                <div className="w-8 h-8 bg-orange-500/10 text-orange-400 rounded-lg flex items-center justify-center mb-3">
                  <Coffee size={18} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Consumo</p>
                <p className="text-2xl font-black tracking-tighter text-white">
                  {view === 'daily' ? stats.daily.totalConsumptions : stats.monthly.totalConsumptions}
                </p>
              </div>
            </div>

            {/* CHARTS */}
            <div className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 shadow-sm space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                <Calendar size={14} />
                Volume por Item
              </h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%" aspect={2}>
                  <BarChart data={view === 'daily' ? stats.daily.volume : stats.monthly.volume} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80} 
                      tick={{ fontSize: 10, fontWeight: 'bold', fill: '#999' }} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{ fill: '#222' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#111', color: '#fff' }}
                    />
                    <Bar dataKey="value" fill="#E53E3E" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {view === 'monthly' && (
              <div className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 shadow-sm space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <DollarSign size={14} />
                  Mix de Pagamento
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%" aspect={2}>
                    <PieChart>
                      <Pie
                        data={stats.monthly.finance}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {stats.monthly.finance.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6">
                  {stats.monthly.finance.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EXPORT BUTTON */}
            <button 
              onClick={generateWhatsAppSummary}
              className="w-full py-5 bg-[#25D366] text-white font-bold rounded-2xl shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Share2 size={20} />
              Gerar Resumo WhatsApp
            </button>
          </div>
        )}
      </main>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Efeito para limpar notificações automaticamente
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchClientData = async (userId: string, authUser: any) => {
      console.log('Buscando dados do cliente para:', userId);
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data && !error) {
        console.log('Dados do cliente encontrados:', data);
        setUser({
          id: data.id,
          name: data.nome,
          email: data.email,
          phone: data.telefone || '',
          cpf: data.cpf || '',
          subscriptionActive: false // Will be updated by ClientAreaPage
        });
      } else if (error || !data) {
        console.log('Cliente não encontrado na tabela ou erro. Verificando/Criando perfil inicial...');
        
        const newClient = {
          id: userId,
          nome: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Cliente Supernova',
          email: authUser.email || '',
          telefone: '',
          cpf: '',
        };

        const { data: existingClient } = await supabase
          .from('clientes')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (!existingClient) {
          const { error: insertError } = await supabase
            .from('clientes')
            .insert([newClient]);

          if (!insertError) {
            console.log('Perfil inicial criado com sucesso.');
            setUser({
              id: userId,
              name: newClient.nome,
              email: newClient.email,
              phone: '',
              cpf: '',
              subscriptionActive: false
            });
          } else {
            console.error('Erro ao criar perfil inicial:', insertError);
          }
        } else {
          // If it exists but fetch failed earlier, try one more time
          const { data: retryData } = await supabase
            .from('clientes')
            .select('*')
            .eq('id', userId)
            .single();
          
          if (retryData) {
            setUser({
              id: retryData.id,
              name: retryData.nome,
              email: retryData.email,
              phone: retryData.telefone || '',
              cpf: retryData.cpf || '',
              subscriptionActive: false
            });
          }
        }
      }
    };

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(prev => {
          if (prev?.id === session.user.id && prev.cpf) return prev;
          return {
            id: session.user.id,
            name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Cliente',
            email: session.user.email || '',
            phone: '',
            cpf: '',
            subscriptionActive: false
          };
        });
        fetchClientData(session.user.id, session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Redirecionamento baseado em e-mail
          if (event === 'SIGNED_IN') {
            if (session.user.email === 'barbara.supernova@gmail.com') {
              window.location.href = '/balcao'; // Redireciona para o Painel Barista (Balcão)
              return;
            }
          }

          setUser(prev => {
            if (prev?.id === session.user.id && prev.cpf) return prev;
            return {
              id: session.user.id,
              name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'Cliente',
              email: session.user.email || '',
              phone: '',
              cpf: '',
              subscriptionActive: false
            };
          });
          fetchClientData(session.user.id, session.user);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans selection:bg-red-100 bg-black text-white">
        <Routes>
          <Route path="/" element={
            <HomeRouteWrapper 
              user={user} 
              setCart={setCart}
            />
          } />
          
          <Route path="/cadastro" element={
            <SignUpRouteWrapper setUser={setUser} />
          } />

          <Route path="/checkout" element={
            <CheckoutRouteWrapper 
              cart={cart} 
              cartTotal={cartTotal} 
              user={user}
              setUser={setUser}
              setCart={setCart}
              setNotification={setNotification}
            />
          } />

          <Route path="/sucesso" element={<SuccessPage />} />
          <Route path="/planos" element={<PlanosRouteWrapper user={user} setCart={setCart} />} />
          <Route path="/barista" element={<BaristaRouteWrapper notification={notification} setNotification={setNotification} />} />
          <Route path="/balcao" element={<BaristaPanelPage notification={notification} setNotification={setNotification} />} />

          <Route path="/cliente" element={
            <ClientAreaRouteWrapper 
              user={user} 
              setUser={setUser}
            />
          } />

          <Route path="/balcao" element={<BaristaPanelPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>

        {/* NOTIFICAÇÃO GLOBAL */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 left-6 right-6 z-[100] max-w-md mx-auto"
            >
              <div className={`${notification.type === 'error' ? 'bg-red-600 border-red-500/50' : 'bg-green-600 border-green-500/50'} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-xl`}>
                {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                <span className="font-bold text-sm tracking-tight">{notification.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

// --- Route Wrappers to use hooks ---

const HomeRouteWrapper = ({ user, setCart }: any) => {
  const navigate = useNavigate();
  return (
    <HomePage 
      user={user} 
      addToCart={(product: Product, config?: CoffeeConfig) => {
        setCart((prev: CartItem[]) => {
          const existing = prev.find(item => item.product.id === product.id && JSON.stringify(item.config) === JSON.stringify(config));
          if (existing) {
            return prev.map(item => 
              (item.product.id === product.id && JSON.stringify(item.config) === JSON.stringify(config)) ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...prev, { product, quantity: 1, config }];
        });
        navigate('/checkout');
      }}
      subscribeNow={() => {
        navigate('/planos');
      }}
    />
  );
};

const SignUpRouteWrapper = ({ setUser }: any) => {
  const navigate = useNavigate();
  return (
    <SignUpPage onSignUp={async (e: FormEvent, formData: any) => {
      e.preventDefault();
      // 1. Sign up in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name
          }
        }
      });

      if (authError) {
        console.log('Erro detalhado Auth Supabase:', authError);
        throw authError;
      }

      if (authData.user) {
        // 2. Insert into clientes table (STRICT mapping: id, nome, email, telefone, cpf)
        const { error: dbError } = await supabase
          .from('clientes')
          .insert([
            {
              id: authData.user.id,
              nome: formData.name,
              email: formData.email,
              telefone: formData.phone,
              cpf: formData.cpf,
            }
          ]);

        if (dbError) {
          console.log('Erro detalhado DB Supabase:', dbError);
          // Throw a special error to be caught by SignUpPage
          const error = new Error('DATABASE_INSERT_FAILED');
          (error as any).details = dbError;
          throw error;
        }

        // 3. Update local user state
        setUser({
          id: authData.user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          subscriptionActive: false
        });
        
        // 4. Redirect immediately to Minha Conta
        navigate('/cliente');
      }
    }} />
  );
};

const CheckoutRouteWrapper = ({ cart, cartTotal, user, setUser, setCart, setNotification }: any) => {
  const navigate = useNavigate();
  
  const decrementarEstoque = async (produtoId: string, quantidade: number) => {
    try {
      const { data: prod, error: fetchError } = await supabase
        .from('produtos')
        .select('estoque')
        .eq('id', produtoId)
        .single();
      
      if (fetchError || !prod) throw fetchError || new Error('Produto não encontrado');

      const currentStock = prod.estoque || 0;
      const newStock = Math.max(0, currentStock - quantidade);

      const { error: updateError } = await supabase
        .from('produtos')
        .update({ estoque: newStock })
        .eq('id', produtoId);

      if (updateError) throw updateError;
      console.log(`Estoque atualizado para o produto ${produtoId}: ${newStock}`);
    } catch (err) {
      console.error('Erro ao decrementar estoque:', err);
    }
  };

  const handlePayment = async (orderDetails: any) => {
    try {
      console.log('--- Iniciando Processo de Pagamento ---');
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        throw new Error('Usuário não autenticado. Por favor, faça login.');
      }

      // 1. Verificação de Perfil
      console.log('Verificando Cliente no banco de dados...');
      const { data: existingClient, error: clientFetchError } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', authUser.id)
        .single();

      let clienteId = authUser.id;

      // 2. Cadastro Automático se não existir
      if (clientFetchError || !existingClient) {
        console.log('Cliente não encontrado. Cadastrando Cliente...');
        const { error: insertError } = await supabase
          .from('clientes')
          .insert([
            {
              id: authUser.id,
              nome: user?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Cliente Supernova',
              email: authUser.email || '',
              metodo_pagamento: orderDetails.paymentMethod || 'pix',
              plano: user?.subscriptionActive ? 'Platinum' : 'Free'
            }
          ]);

        if (insertError) {
          console.error('Erro ao cadastrar cliente:', insertError);
          throw new Error('Não foi possível cadastrar o perfil do cliente.');
        }
        console.log('Cliente cadastrado com sucesso!');
      } else {
        console.log('Cliente já existe no sistema.');
      }

      // 3. Salvando Venda
      console.log('Salvando Venda na tabela vendas_webapp...');
      const salesData = cart.map((item: CartItem, index: number) => {
        const itemValue = (item.product.price * item.quantity) + (index === 0 ? orderDetails.shippingFee : 0);
        
        return {
          cliente_id: clienteId,
          produto_id: item.product.id,
          valor: itemValue,
          preferencia_moagem: item.config ? (item.config.type === 'grain' ? 'Grãos' : item.config.grind) : 'Não informado',
          tipo_entrega: 'Consumo Local',
          status: 'Em Preparação',
          cliente_nome: user?.name || authUser.user_metadata?.full_name || 'Cliente',
          cliente_email: authUser.email || '',
          itens: JSON.stringify([{
            nome: item.product.name,
            quantidade: item.quantity,
            config: item.config
          }])
        };
      });

      const { error: saleError } = await supabase
        .from('vendas_webapp')
        .insert(salesData);

      if (saleError) {
        console.error('Erro ao salvar venda:', saleError);
        throw saleError;
      }
      console.log('Venda salva com sucesso!');

      // 4. Verificação de Assinatura
      const hasSubscription = cart.some((item: CartItem) => 
        item.product.id === SUBSCRIPTION_PLAN.id || 
        item.product.name.toLowerCase().includes('assinatura') ||
        item.product.name.toLowerCase().includes('platinum')
      );

      if (hasSubscription) {
        console.log('Assinatura detectada no carrinho. Criando registro...');
        const subscriptionItem = cart.find((item: CartItem) => 
          item.product.id === SUBSCRIPTION_PLAN.id || 
          item.product.name.toLowerCase().includes('assinatura') ||
          item.product.name.toLowerCase().includes('platinum')
        );

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        console.log('Iniciando sincronização de assinatura e perfil...');
        try {
          // Ação 1: Criar registro na tabela assinaturas com status: 'ativo'
          const { error: subError } = await supabase
            .from('assinaturas')
            .insert([
              {
                cliente_id: authUser.id,
                plano_id: subscriptionItem?.product.name || 'Platinum',
                status: 'ativo',
                data_expiracao: expirationDate.toISOString()
              }
            ]);

          if (subError) throw new Error(`Erro ao criar assinatura: ${subError.message}`);
          console.log('Ação 1: Assinatura criada com sucesso!');

          // Ação 2: Realizar update na tabela clientes definindo plano_ativo como true
          const { error: clientUpdateError } = await supabase
            .from('clientes')
            .update({ plano_ativo: true })
            .eq('id', authUser.id);

          if (clientUpdateError) throw new Error(`Erro ao atualizar perfil do cliente: ${clientUpdateError.message}`);
          console.log('Ação 2: Perfil do cliente atualizado com sucesso!');

          // 3. Atualizar estado local
          if (user) {
            setUser({ ...user, subscriptionActive: true });
          }
          
          setNotification({ message: 'Assinatura ativada com sucesso!', type: 'success' });
        } catch (subErr: any) {
          console.error('Falha crítica na ativação da assinatura:', subErr.message);
          setNotification({ 
            message: 'Erro ao ativar assinatura. Por favor, contate o suporte.', 
            type: 'error' 
          });
          // Re-throw para o catch externo lidar se necessário
          throw subErr;
        }
      }

      // 5. Pós-venda
      for (const item of cart) {
        await decrementarEstoque(item.product.id, item.quantity);
      }
      
      setCart([]);
      console.log('--- Processo de Pagamento Finalizado com Sucesso ---');
      
      if (hasSubscription) {
        navigate('/cliente');
      } else {
        navigate('/sucesso');
      }
    } catch (err: any) {
      console.error('Erro no fluxo de pagamento:', err);
      alert('Erro ao processar o pedido: ' + (err.message || 'Tente novamente.'));
    }
  };

  return (
    <CheckoutPage 
      cart={cart} 
      cartTotal={cartTotal} 
      user={user}
      onPayment={handlePayment} 
    />
  );
};

const ClientAreaRouteWrapper = ({ user, setUser }: any) => {
  const navigate = useNavigate();
  return (
    <ClientAreaPage 
      user={user} 
      setUser={setUser}
      onLogout={async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/');
      }} 
    />
  );
};

const PlanosRouteWrapper = ({ user, setCart }: any) => {
  return <PlanosPage user={user} setCart={setCart} />;
};

const BaristaRouteWrapper = ({ notification, setNotification }: any) => {
  return <BaristaPanelPage notification={notification} setNotification={setNotification} />;
};
