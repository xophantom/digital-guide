import { test, expect } from "@playwright/test";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";

test.describe("guia do hóspede — /FLN001", () => {
  test("mostra os dados do imóvel: nome, WiFi, regras e anfitrião", async ({
    page,
  }) => {
    await page.goto("/FLN001");

    await expect(
      page.getByRole("heading", { level: 1, name: /Apartamento Beira-Mar/ }),
    ).toBeVisible();

    // Acesso & WiFi
    await expect(page.getByText("SeaHome_FLN001")).toBeVisible();
    await expect(page.getByText("floripa2024")).toBeVisible();

    // Regras da estadia
    await expect(page.getByText("Animais de estimação")).toBeVisible();
    await expect(page.getByText("Fumar")).toBeVisible();
    await expect(page.getByText("Festas e eventos")).toBeVisible();

    // Contato
    await expect(page.getByText("Ana Paula")).toBeVisible();
  });

  test("o Guia de Experiências gera e substitui o skeleton pelo conteúdo do FAKE_GUIDE", async ({
    page,
  }) => {
    await page.goto("/FLN001");

    // Em modo fake, a rota /api/properties/FLN001/guide faz streamObject do
    // FAKE_GUIDE (src/ai/fakeGuide.ts); assim que o objeto completo chega,
    // ExperienceGuideGenerator troca o skeleton (role="status") pelo organismo real.
    await expect(page.getByText(FAKE_GUIDE.welcomeMessage)).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.getByText(FAKE_GUIDE.restaurants[0].name),
    ).toBeVisible();
    await expect(
      page.getByRole("status", { name: "Gerando guia de experiências" }),
    ).toHaveCount(0);
  });
});
