import { describe, it, expect, vi, afterEach } from "vitest";
import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";
import { streamGuide, streamPersistedGuide } from "@/src/ai/generateGuide";
import { getAIProvider } from "@/src/ai/provider";
import { makeProperty } from "@/src/test/fixtures";
import { FAKE_NEARBY } from "@/src/places/fakePlaces";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";
import { objectChunks } from "@/src/ai/mockStream";

const original = process.env.AI_PROVIDER;
afterEach(() => {
  process.env.AI_PROVIDER = original;
});

const spyRepo = () => ({
  save: vi.fn().mockResolvedValue(undefined),
  fail: vi.fn().mockResolvedValue(undefined),
});

// Drena o partialObjectStream — é isso que dispara o onFinish/resolve o `object` (Task 1).
async function drain(stream: AsyncIterable<unknown>) {
  for await (const chunk of stream) {
    void chunk;
  }
}

describe("streamGuide", () => {
  it("persiste (save) o guia ao finalizar, drenando o stream", async () => {
    process.env.AI_PROVIDER = "fake";
    const repo = spyRepo();
    const result = streamGuide({
      property: makeProperty(),
      places: FAKE_NEARBY,
      provider: getAIProvider(),
      repo,
      persist: true,
    });
    // drenar (confirmar o iterável correto na v7: partialObjectStream/textStream)
    await drain(result.partialObjectStream);
    await result.object.catch(() => undefined);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save.mock.calls[0][1].restaurants.length).toBe(FAKE_GUIDE.restaurants.length);
    expect(repo.fail).not.toHaveBeenCalled();
  });

  it("não persiste quando persist=false", async () => {
    process.env.AI_PROVIDER = "fake";
    const repo = spyRepo();
    const result = streamGuide({
      property: makeProperty(),
      places: FAKE_NEARBY,
      provider: getAIProvider(),
      repo,
      persist: false,
    });
    await drain(result.partialObjectStream);
    await result.object.catch(() => undefined);
    expect(repo.save).not.toHaveBeenCalled();
    expect(repo.fail).not.toHaveBeenCalled();
  });

  it("persiste (fail) quando a resposta não valida contra o schema (onFinish)", async () => {
    const repo = spyRepo();
    // Texto sintaticamente válido ({}), mas sem os campos exigidos pelo schema.
    const model = new MockLanguageModelV4({
      doStream: async () => ({
        stream: simulateReadableStream({ chunks: objectChunks({}) }),
      }),
    });
    const result = streamGuide({
      property: makeProperty(),
      places: FAKE_NEARBY,
      provider: { guideModel: model },
      repo,
      persist: true,
    });
    await drain(result.partialObjectStream);
    await result.object.catch(() => undefined);
    expect(repo.fail).toHaveBeenCalledTimes(1);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it("persiste (fail) quando doStream rejeita — falha de chamada, não de validação (onError)", async () => {
    const repo = spyRepo();
    const model = new MockLanguageModelV4({
      doStream: async () => {
        throw new Error("falha de rede simulada");
      },
    });
    const result = streamGuide({
      property: makeProperty(),
      places: FAKE_NEARBY,
      provider: { guideModel: model },
      repo,
      persist: true,
    });
    // Nesta classe de falha o onFinish nunca dispara e result.object nunca
    // resolve (trava) — quem sinaliza é o onError, que só roda ao drenarmos
    // um stream que carregue o chunk "error" (fullStream).
    await drain(result.fullStream);
    expect(repo.fail).toHaveBeenCalledTimes(1);
    expect(repo.save).not.toHaveBeenCalled();
  });
});

describe("streamPersistedGuide", () => {
  it("re-emite um guia já pronto pelo mesmo formato de stream", async () => {
    const result = streamPersistedGuide(FAKE_GUIDE);
    await drain(result.partialObjectStream);
    const object = await result.object;
    expect(object).toEqual(FAKE_GUIDE);
  });
});
