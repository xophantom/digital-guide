import { test, expect } from "@playwright/test";

test("chat: abre o painel, envia a pergunta sugerida e recebe a resposta do assistente", async ({
  page,
}) => {
  await page.goto("/FLN001");

  await page.getByRole("button", { name: "Falar com o assistente" }).click();
  await expect(page.getByRole("log")).toBeVisible();

  await page.getByRole("button", { name: "Qual a senha do WiFi?" }).click();

  // Prova o FLUXO (envio -> resposta em streaming), não a correção do
  // conteúdo: o chatModel fake sempre responde este texto fixo
  // (src/ai/provider.ts) independente da pergunta enviada.
  await expect(page.getByText("Resposta de teste.")).toBeVisible({
    timeout: 15_000,
  });
});
