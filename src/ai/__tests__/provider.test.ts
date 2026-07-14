import { describe, it, expect, afterEach } from "vitest";
import { getAIProvider } from "@/src/ai/provider";

const original = process.env.AI_PROVIDER;
afterEach(() => {
  process.env.AI_PROVIDER = original;
});

describe("getAIProvider", () => {
  it("retorna um provider com guideModel definido no modo fake", () => {
    process.env.AI_PROVIDER = "fake";
    const provider = getAIProvider();
    expect(provider.guideModel).toBeDefined();
  });

  it("retorna um provider com guideModel definido no modo anthropic", () => {
    process.env.AI_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    process.env.AI_MODEL_GUIDE = "claude-opus-4-8";
    const provider = getAIProvider();
    expect(provider.guideModel).toBeDefined();
  });

  it("expõe chatModel no modo fake e no modo anthropic", () => {
    process.env.AI_PROVIDER = "fake";
    expect(getAIProvider().chatModel).toBeDefined();
    process.env.AI_PROVIDER = "anthropic";
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    expect(getAIProvider().chatModel).toBeDefined();
  });
});
