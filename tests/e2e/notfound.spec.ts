import { test, expect } from "@playwright/test";

test("código de imóvel inexistente mostra a tela 404 amigável", async ({
  page,
}) => {
  await page.goto("/XXX999");

  await expect(
    page.getByRole("heading", { name: "Esse código não existe" }),
  ).toBeVisible();
  await expect(page.getByText("Imóvel não encontrado")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voltar ao início" }),
  ).toBeVisible();
});
