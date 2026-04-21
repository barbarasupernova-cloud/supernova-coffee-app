import { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// 1. Inicializa o Mercado Pago (Certifique-se de que a chave está na Vercel)
initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY);

export default function CheckoutPage() {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // 2. Função que "acorda" o seu Supabase para gerar o pagamento
  const handlePayment = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('https://owpeosbyhcugwikjbahn.supabase.co/functions/v1/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [
            {
              title: "Assinatura Mensal Supernova",
              unit_price: 50, // Você pode mudar o valor aqui depois
              quantity: 1,
            }
          ]
        })
      });

      const { id } = await response.json();
      setPreferenceId(id); // Guarda o código que o Mercado Pago gerou
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      alert("Erro ao conectar com o pagamento. Tente novamente.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Finalizar sua Assinatura</h2>
      
      {/* 3. O botão inicial que chama a função */}
      {!preferenceId && (
        <button
          onClick={handlePayment}
          disabled={isCreating}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {isCreating ? 'Gerando link seguro...' : 'Pagar com Mercado Pago'}
        </button>
      )}

      {/* 4. O botão real do Mercado Pago que aparece depois do clique */}
      {preferenceId && (
        <div className="w-full max-w-xs">
          <Wallet 
            initialization={{ preferenceId }} 
            customization={{ texts: { valueProp: 'smart_option' } }} 
          />
        </div>
      )}
    </div>
  );
}
