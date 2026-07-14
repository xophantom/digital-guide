import type { ExperienceGuide } from "@/src/domain/guide";

export const FAKE_GUIDE: ExperienceGuide = {
  welcomeMessage:
    "Bem-vindo! Seu imóvel fica numa localização privilegiada, pertinho das melhores experiências da região.",
  restaurants: [
    { name: "Restaurante Exemplo", distance: "Aprox. 1,2 km", description: "Cozinha regional premiada." },
    { name: "Bistrô da Praça", distance: "Aprox. 800 m", description: "Ótimo para um jantar tranquilo." },
    { name: "Cantina do Porto", distance: "Aprox. 2,0 km", description: "Frutos do mar frescos." },
    { name: "Café Central", distance: "Aprox. 500 m", description: "Café da manhã e brunch." },
  ],
  attractions: [
    { name: "Mirante Panorâmico", distance: "Aprox. 3,0 km", description: "Vista deslumbrante da cidade." },
    { name: "Parque Municipal", distance: "Aprox. 1,5 km", description: "Trilhas e áreas verdes." },
    { name: "Centro Histórico", distance: "Aprox. 2,5 km", description: "Arquitetura e cultura local." },
  ],
  essentials: [
    { name: "Farmácia 24h", type: "pharmacy", distance: "Aprox. 400 m", description: "Aberta 24 horas." },
    { name: "Supermercado do Bairro", type: "market", distance: "Aprox. 600 m", description: "Itens essenciais." },
    { name: "Hospital Regional", type: "hospital", distance: "Aprox. 3,2 km", description: "Pronto-socorro 24h." },
  ],
  seasonalTips:
    "Nesta época do ano, leve roupas leves durante o dia e um agasalho para as noites.",
};
