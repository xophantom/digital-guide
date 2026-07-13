import type { Property } from "@/src/domain/property";
import type { NearbyPlaces, Place } from "@/src/places/types";

const MESES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
function estacaoBrasil(mes: number): string {
  if (mes === 11 || mes <= 1) return "verão";
  if (mes >= 2 && mes <= 4) return "outono";
  if (mes >= 5 && mes <= 7) return "inverno";
  return "primavera";
}
function km(m: number): string {
  return m >= 1000 ? `aprox. ${(m / 1000).toFixed(1).replace(".", ",")} km` : `aprox. ${Math.round(m)} m`;
}
function lista(places: Place[]): string {
  return places.map((p) => `- ${p.name} (${km(p.distanceMeters)})`).join("\n");
}

// Bloco por categoria: se há lugares reais → descrever ESSES; senão → fallback (sugerir notórios).
function bloco(titulo: string, min: number, places: Place[], instrucaoVazia: string): string {
  if (places.length > 0) {
    return `${titulo} — descreva EXATAMENTE estes lugares reais (não substitua nem invente outros), escrevendo uma breve descrição e refinando a distância:\n${lista(places)}`;
  }
  return `${titulo} — ${instrucaoVazia}`;
}

export function buildGuidePrompt(
  property: Property,
  places: NearbyPlaces,
  now: Date,
): { system: string; prompt: string } {
  const a = property.address;
  const mes = now.getMonth();

  const system = [
    "Você é um concierge local que escreve guias de experiências para hóspedes de aluguel por temporada no Brasil.",
    "Regras invioláveis:",
    "- Quando uma lista de lugares reais for fornecida, DESCREVA apenas esses lugares — não invente, não substitua, não adicione outros.",
    "- Quando a lista vier vazia, aí sim sugira lugares REAIS e notórios que existam de fato próximos ao endereço; NÃO invente nomes.",
    "- Distâncias são aproximadas e coerentes. Escreva em português do Brasil, tom acolhedor e prático.",
  ].join("\n");

  const essenciais = [...places.pharmacies, ...places.markets, ...places.hospitals];

  const prompt = [
    `Hóspede hospedado em: ${property.name} — ${a.street}, ${a.number}, bairro ${a.neighborhood}, ${a.city} — ${a.state}, CEP ${a.postalCode}.`,
    ``,
    `Escreva uma mensagem de boas-vindas personalizada para essa localização (2-3 frases).`,
    ``,
    bloco("RESTAURANTES (4 a 5)", 4, places.restaurants, "sugira 4-5 restaurantes reais e notórios próximos ao endereço."),
    ``,
    bloco("ATRAÇÕES (3 a 4)", 3, places.attractions, "sugira 3-4 atrações reais próximas ao endereço."),
    ``,
    bloco("ESSENCIAIS (farmácia, supermercado e hospital)", 1, essenciais, "sugira uma farmácia, um supermercado e um hospital reais próximos, com o tipo de cada."),
    ``,
    `Dica sazonal: escreva uma dica relevante para ${MESES[mes]} (${estacaoBrasil(mes)} no Brasil), considerando o clima típico da região.`,
  ].join("\n");

  return { system, prompt };
}
