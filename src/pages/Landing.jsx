import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Instagram, Linkedin, ArrowRight, CheckCircle, Wrench, Droplets, Sun, Flame, ShieldCheck, MapPin, Timer, PanelsTopLeft, Factory, Building2 } from 'lucide-react';

const TopBar = () => (
  <div className="w-full bg-orange-600 text-white text-xs">
    <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
      <div className="hidden sm:flex items-center gap-4">
        <a href="https://wa.me/5531983172758" target="_blank" rel="noreferrer" className="flex items-center gap-1 opacity-90 hover:opacity-100">
          <Phone className="w-3 h-3" /> (31) 98317-2758
        </a>
        <a href="mailto:ssx@ssxsolarservice.com.br" className="flex items-center gap-1 opacity-90 hover:opacity-100">
          <Mail className="w-3 h-3" /> ssx@ssxsolarservice.com.br
        </a>
      </div>
      <Link to="/login" className="bg-black/20 hover:bg-black/30 px-3 py-1 rounded-md">Área de manutenção</Link>
    </div>
  </div>
);

const NavBar = () => (
  <header className="w-full bg-gray-900/95 text-white sticky top-0 z-40 backdrop-blur">
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-orange-500 to-yellow-400 flex items-center justify-center">
          <Sun className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-wide">SSX Solar Service</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm">
        <a href="#empresa" className="hover:text-orange-400">A Empresa</a>
        <a href="#projetos" className="hover:text-orange-400">Projetos</a>
        <a href="#consultoria" className="hover:text-orange-400">Consultoria</a>
        <a href="#contato" className="hover:text-orange-400">Contato</a>
      </nav>
    </div>
  </header>
);

const Hero = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 animate-gradient" />
    <div className="max-w-7xl mx-auto px-4 pt-14 pb-16 md:pt-20 md:pb-24 relative">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white animate-fade-up">
            Uma empresa especializada em aquecimento de água
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-base md:text-lg animate-fade-up" style={{animationDelay:'80ms'}}>
            Projetos, instalação e manutenção de sistemas de aquecimento <span className="font-semibold">solar</span>, <span className="font-semibold">a gás</span> e <span className="font-semibold">elétrico</span> para residências, hotéis, indústrias e clubes. Performance com segurança, economia e sustentabilidade.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 animate-fade-up" style={{animationDelay:'140ms'}}>
            <a href="https://wa.me/5531983172758" target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center">
              Falar no WhatsApp <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a href="#projetos" className="btn-secondary">Ver Projetos</a>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300 animate-fade-up" style={{animationDelay:'200ms'}}>
            <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-orange-500" /> Hotéis &amp; Resorts</div>
            <div className="flex items-center gap-2"><Factory className="w-4 h-4 text-orange-500" /> Indústrias</div>
            <div className="flex items-center gap-2"><PanelsTopLeft className="w-4 h-4 text-orange-500" /> Residências &amp; Clubes</div>
          </div>
        </div>
        <div className="md:pl-10">
          <div className="aspect-video rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center animate-tilt">
            <div className="grid grid-cols-3 gap-4 p-6 w-full">
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center animate-fade-up">
                <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Coletor Solar</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center animate-fade-up" style={{animationDelay:'60ms'}}>
                <Droplets className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Alta Vazão</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center animate-fade-up" style={{animationDelay:'120ms'}}>
                <ShieldCheck className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Normas NBR</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center animate-fade-up" style={{animationDelay:'180ms'}}>
                <Timer className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Resposta Rápida</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center animate-fade-up" style={{animationDelay:'240ms'}}>
                <Wrench className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Manutenção</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center animate-fade-up" style={{animationDelay:'300ms'}}>
                <Flame className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600 dark:text-gray-300">Aquec. a Gás</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SectionTitle = ({ id, eyebrow, title, subtitle }) => (
  <div id={id} className="max-w-7xl mx-auto px-4">
    <p className="text-xs tracking-widest text-orange-600 font-semibold">{eyebrow}</p>
    <h2 className="mt-1 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && <p className="mt-2 text-gray-600 dark:text-gray-300">{subtitle}</p>}
  </div>
);

const Projetos = () => (
  <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/40" id="projetos">
    <SectionTitle
      eyebrow="Portfólio de serviços"
      title="Projetos de Instalação e Manutenção"
      subtitle="Soluções completas e normatizadas para água quente com alta eficiência e segurança."
    />
    <div className="max-w-7xl mx-auto px-4 mt-6 grid md:grid-cols-3 gap-6">
      <div className="card p-6 animate-fade-up">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Solar / Gás / Elétrico</h3>
        <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Dimensionamento e implantação conforme NBR 15569 / 13103.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Sistemas pressurizados, recirculação e controle de temperatura.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Retrofits e upgrade de eficiência energética.</li>
        </ul>
      </div>
      <div className="card p-6 animate-fade-up" style={{animationDelay:'80ms'}}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pressurização</h3>
        <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Conforto de banho com pressão e vazão ideais.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Proteções, válvulas, automação e redundância.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Manutenção preventiva e corretiva.</li>
        </ul>
      </div>
      <div className="card p-6 animate-fade-up" style={{animationDelay:'160ms'}}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chiller e Sistemas Especiais</h3>
        <ul className="mt-3 text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Integração com aquecimento central e demandas industriais.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Telemetria e monitoramento de desempenho.</li>
          <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5"/> Contratos de performance e SLA.</li>
        </ul>
      </div>
    </div>
  </section>
);

const Consultoria = () => (
  <section className="py-12 md:py-16" id="consultoria">
    <SectionTitle
      eyebrow="Engenharia aplicada"
      title="Consultoria em Projetos"
      subtitle="Análise de viabilidade, diagnóstico técnico e projetos executivos para novas implantações e otimização de sistemas existentes."
    />
    <div className="max-w-7xl mx-auto px-4 mt-6 grid md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
      <div className="card p-6 animate-fade-up">
        <h4 className="font-semibold">Estudo e dimensionamento</h4>
        <p className="mt-2">Levantamento de demanda, simulações térmicas, perdas e retorno de investimento.</p>
      </div>
      <div className="card p-6 animate-fade-up" style={{animationDelay:'80ms'}}>
        <h4 className="font-semibold">Projeto executivo</h4>
        <p className="mt-2">Memorial descritivo, detalhamento, especificações, normas e ART.</p>
      </div>
      <div className="card p-6 animate-fade-up" style={{animationDelay:'160ms'}}>
        <h4 className="font-semibold">Comissionamento e manutenção</h4>
        <p className="mt-2">Partida assistida, planos de manutenção, telemetria e indicadores.</p>
      </div>
    </div>
  </section>
);

const Diferenciais = () => (
  <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900/40" id="empresa">
    <SectionTitle
      eyebrow="Por que a SSX"
      title="Diferenciais competitivos"
      subtitle="Equipe com experiência de campo, foco em segurança e conformidade, e compromisso com resultado."
    />
    <div className="max-w-7xl mx-auto px-4 mt-6 grid md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
      <div className="card p-6 flex items-start gap-3 animate-fade-up"><ShieldCheck className="w-5 h-5 text-emerald-600"/>Conformidade com NBR 15569 (Solar) e NBR 13103 (Gás).</div>
      <div className="card p-6 flex items-start gap-3 animate-fade-up" style={{animationDelay:'60ms'}}><Timer className="w-5 h-5 text-orange-600"/>Atendimento ágil e contratos de SLA.</div>
      <div className="card p-6 flex items-start gap-3 animate-fade-up" style={{animationDelay:'120ms'}}><Wrench className="w-5 h-5 text-purple-600"/>Manutenção preventiva e corretiva completa.</div>
      <div className="card p-6 flex items-start gap-3 animate-fade-up" style={{animationDelay:'180ms'}}><Sun className="w-5 h-5 text-yellow-500"/>Eficiência energética e redução de consumo.</div>
      <div className="card p-6 flex items-start gap-3 animate-fade-up" style={{animationDelay:'240ms'}}><Droplets className="w-5 h-5 text-cyan-600"/>Conforto de banho com vazão e temperatura estáveis.</div>
      <div className="card p-6 flex items-start gap-3 animate-fade-up" style={{animationDelay:'300ms'}}><MapPin className="w-5 h-5 text-rose-600"/>Atuação em BH e região metropolitana.
      </div>
    </div>
  </section>
);

const Contato = () => (
  <section className="py-12 md:py-16" id="contato">
    <SectionTitle
      eyebrow="Fale conosco"
      title="Contato"
      subtitle="Vamos entender seu cenário e sugerir a melhor solução de aquecimento de água para sua necessidade."
    />
    <div className="max-w-7xl mx-auto px-4 mt-6 grid md:grid-cols-2 gap-6">
      <div className="card p-6 text-sm text-gray-700 dark:text-gray-300">
        <p className="font-medium">Telefone/WhatsApp</p>
        <a href="https://wa.me/5531983172758" target="_blank" rel="noreferrer" className="text-orange-600 dark:text-orange-400 hover:underline">(31) 98317-2758</a>
        <p className="mt-4 font-medium">Endereço</p>
        <p>Rua Treze de Maio, 183 - 2º andar<br />Jardim das Oliveiras, Contagem/MG<br />CEP 32371-085</p>
        <p className="mt-4 font-medium">Email</p>
        <a href="mailto:ssx@ssxsolarservice.com.br" className="text-orange-600 dark:text-orange-400 hover:underline">ssx@ssxsolarservice.com.br</a>
      </div>
      <div className="card p-6">
        <form onSubmit={(e)=>e.preventDefault()} className="grid grid-cols-1 gap-3">
          <input className="input-field" placeholder="Nome" />
          <input className="input-field" placeholder="Email" />
          <input className="input-field" placeholder="Assunto" />
          <textarea className="input-field" rows={4} placeholder="Mensagem"></textarea>
          <a href="mailto:ssx@ssxsolarservice.com.br?subject=Contato%20via%20site%20SSX&body=Olá,%20gostaria%20de%20um%20orçamento." className="btn-primary inline-flex items-center justify-center">Enviar por Email</a>
        </form>
      </div>
    </div>
  </section>
);

const FloatingSocial = () => (
  <div className="fixed right-4 bottom-6 z-40 flex flex-col gap-2">
    <a href="https://wa.me/5531983172758" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"><Phone className="w-5 h-5"/></a>
    <a href="mailto:ssx@ssxsolarservice.com.br" className="w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"><Mail className="w-5 h-5"/></a>
    <a href="https://www.instagram.com/ssxsolarservice/" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"><Instagram className="w-5 h-5"/></a>
    <a href="https://www.instagram.com/ssxsolarservice/" target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"><Linkedin className="w-5 h-5"/></a>
  </div>
);

export default function Landing() {
  // Scroll reveal + parallax
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.2 });

    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    revealEls.forEach((el) => io.observe(el));

    const onScroll = () => {
      const scrolled = window.scrollY;
      document.querySelectorAll('[data-parallax]')?.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <TopBar />
      <NavBar />
      <main>
        <div className="parallax" data-parallax="-0.15"><Hero /></div>
        <div className="reveal-scale"><Projetos /></div>
        <div className="reveal-left"><Consultoria /></div>
        <div className="reveal-right"><Diferenciais /></div>
        <div className="reveal"><Contato /></div>
      </main>
      <footer className="mt-10 py-8 border-t border-gray-200 dark:border-gray-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} SSX Solar Service</p>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/5531983172758" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"><Phone className="w-4 h-4"/>(31) 98317-2758</a>
            <a href="mailto:ssx@ssxsolarservice.com.br" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"><Mail className="w-4 h-4"/>Email</a>
            <a href="https://www.instagram.com/ssxsolarservice/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"><Instagram className="w-4 h-4"/>Instagram</a>
            <a href="https://www.instagram.com/ssxsolarservice/" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"><Linkedin className="w-4 h-4"/>LinkedIn</a>
          </div>
        </div>
      </footer>
      <FloatingSocial />
    </div>
  );
}


