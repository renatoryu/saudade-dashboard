import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, MapPin, Clock } from 'lucide-react';

export default function SaudadeDashboard() {
  const params = new URLSearchParams(window.location.search);
  const userParam = (params.get("user") || "").toLowerCase();

  // 👇 TIPO DAS CHAVES
  type UserKey = "renato" | "gih";

  const userConfigs: Record<UserKey, { senderName: string; targetTopic: string }> = {
    renato: {
      senderName: 'Renato',
      targetTopic: 'gih_recebe_msg'
    },
    gih: {
      senderName: 'Gih',
      targetTopic: 'renato_recebe_msg'
    }
  };

  // 👇 AQUI É A CORREÇÃO
  const currentUser =
    userConfigs[userParam as UserKey] || {
      senderName: 'Alguém',
      targetTopic: 'canal_padrao_de_vcs'
    };

  const [timePassed, setTimePassed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [buttonText, setButtonText] = useState("Enviar um Abraço Virtual");
  const [isSending, setIsSending] = useState(false);

  // A data do beijo na estação
  const lastKissDate = new Date('2026-03-16T22:08:00').getTime();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = now - lastKissDate;

      setTimePassed({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVirtualHug = async () => {
    setIsSending(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffb6c1', '#ff69b4', '#ff1493']
    });

    try {
      // Usa a configuração dinâmica baseada em quem está acessando
      await fetch(`https://ntfy.sh/${currentUser.targetTopic}`, {
        method: 'POST',
        body: `${currentUser.senderName} acabou de te mandar um abraço virtual! ❤️`,
        headers: { 'Title': 'Pane no Sistema' }
      });
      
      setButtonText("Abraço enviado! ❤️");
      setTimeout(() => setButtonText("Enviar um Abraço Virtual"), 5000);
    } catch (error) {
      console.error("Erro ao enviar o abraço", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex flex-col items-center justify-center p-6 text-gray-800 font-sans">
      
      {/* Header Bonitinho */}
      <div className="text-center space-y-2 mb-10">
        <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse" />
        {/* Você pode até personalizar o título baseado no usuário, se quiser! */}
        <h1 className="text-2xl font-semibold text-gray-700 tracking-wide">
          Dashboard da Saudade
        </h1>
      </div>

      {/* Card Principal */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center space-y-8 border border-pink-100">
        
        {/* Distância */}
        <div className="flex items-center justify-center space-x-4 text-gray-600">
          <div className="flex flex-col items-center">
            <MapPin className="w-6 h-6 text-indigo-400 mb-1" />
            <span className="text-xs font-medium uppercase tracking-wider">São Paulo</span>
          </div>
          <div className="flex-1 border-t-2 border-dashed border-gray-200 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-xs text-gray-400">
              47.8km
            </span>
          </div>
          <div className="flex flex-col items-center">
            <MapPin className="w-6 h-6 text-pink-400 mb-1" />
            <span className="text-xs font-medium uppercase tracking-wider">Cajamar</span>
          </div>
        </div>

        {/* Contador */}
        <div className="bg-pink-50 rounded-xl p-4">
          <div className="flex justify-center items-center space-x-2 text-pink-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Tempo desde nosso último reencontro:</span>
          </div>
          <div className="flex justify-center space-x-3 text-xl font-bold text-gray-700">
            <div className="flex flex-col"><span className="text-2xl text-pink-600">{timePassed.days}</span><span className="text-xs font-normal text-gray-500">dias</span></div>
            <span>:</span>
            <div className="flex flex-col"><span className="text-2xl text-pink-600">{timePassed.hours.toString().padStart(2, '0')}</span><span className="text-xs font-normal text-gray-500">hrs</span></div>
            <span>:</span>
            <div className="flex flex-col"><span className="text-2xl text-pink-600">{timePassed.minutes.toString().padStart(2, '0')}</span><span className="text-xs font-normal text-gray-500">min</span></div>
            <span>:</span>
            <div className="flex flex-col"><span className="text-2xl text-pink-600">{timePassed.seconds.toString().padStart(2, '0')}</span><span className="text-xs font-normal text-gray-500">seg</span></div>
          </div>
        </div>

        {/* Botão de Ação */}
        <button 
          onClick={handleVirtualHug}
          disabled={isSending}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 active:scale-95 flex justify-center items-center space-x-2"
        >
          <Heart className={`w-5 h-5 ${isSending ? 'animate-ping' : ''}`} />
          <span>{buttonText}</span>
        </button>
      </div>

      {/* O Easter Egg do Dev */}
      <div className="mt-12 text-center text-xs text-gray-400 font-mono">
        <p>PS: Aguardando o próximo encontro para zerar o contador. </p>
      </div>

    </div>
  );
}