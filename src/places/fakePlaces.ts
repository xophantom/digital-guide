import type { NearbyPlaces } from "@/src/places/types";

// Fixture determinística (sem rede) — coords/distâncias plausíveis para
// a região de Florianópolis usada em src/test/fixtures.ts.
export const FAKE_NEARBY: NearbyPlaces = {
  restaurants: [
    { name: "Ostradamus", category: "restaurant", lat: -27.601, lon: -48.501, distanceMeters: 350 },
    { name: "Ataliba Restaurante", category: "restaurant", lat: -27.602, lon: -48.5, distanceMeters: 520 },
    { name: "Box 32", category: "restaurant", lat: -27.598, lon: -48.503, distanceMeters: 780 },
    { name: "Cancún Restaurante", category: "restaurant", lat: -27.604, lon: -48.498, distanceMeters: 910 },
    { name: "Ponto Chic", category: "restaurant", lat: -27.596, lon: -48.505, distanceMeters: 1200 },
  ],
  attractions: [
    { name: "Praia da Joaquina", category: "attraction", lat: -27.63, lon: -48.45, distanceMeters: 4200 },
    { name: "Mirante da Lagoa", category: "attraction", lat: -27.59, lon: -48.46, distanceMeters: 3100 },
    { name: "Museu Histórico de Santa Catarina", category: "attraction", lat: -27.596, lon: -48.549, distanceMeters: 5300 },
  ],
  pharmacies: [
    { name: "Farmácia Catarinense", category: "pharmacy", lat: -27.603, lon: -48.502, distanceMeters: 420 },
  ],
  markets: [
    { name: "Supermercado Angeloni", category: "market", lat: -27.605, lon: -48.5, distanceMeters: 650 },
  ],
  hospitals: [
    { name: "Hospital Universitário Polydoro Ernani de São Thiago", category: "hospital", lat: -27.591, lon: -48.522, distanceMeters: 2800 },
  ],
};
