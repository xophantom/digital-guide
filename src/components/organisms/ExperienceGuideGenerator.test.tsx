import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCallback, useRef, useState } from "react";
import { ExperienceGuideGenerator } from "@/src/components/organisms/ExperienceGuideGenerator";
import { FAKE_GUIDE } from "@/src/ai/fakeGuide";

type OnFinish = (event: { object: unknown; error: unknown }) => void;
type UseObjectArgs = { onFinish?: OnFinish };

// A rota (streamGuide().toTextStreamResponse()) sempre devolve HTTP 200; quando
// a geração falha, o chunk de erro é descartado silenciosamente pelo protocolo
// de text stream do AI SDK. Por isso o único sinal confiável de falha é
// onFinish sem um objeto válido — é isso que estes testes simulam, mockando
// @ai-sdk/react inteiro (sem rede) para controlar object/error/onFinish.
const useObjectMock = vi.fn();

vi.mock("@ai-sdk/react", () => ({
  useObject: (args: UseObjectArgs) => useObjectMock(args),
}));

beforeEach(() => {
  useObjectMock.mockReset();
});

describe("ExperienceGuideGenerator", () => {
  it("mostra o bloco de erro/retry (não um skeleton perpétuo) quando o stream termina sem objeto válido", () => {
    useObjectMock.mockImplementation(({ onFinish }: UseObjectArgs) => {
      const [object, setObject] = useState<unknown>(undefined);
      const submit = useCallback(() => {
        setObject(undefined);
        onFinish?.({ object: undefined, error: undefined });
      }, [onFinish]);
      return { object, submit, error: undefined };
    });

    render(<ExperienceGuideGenerator code="FLN001" />);

    expect(
      screen.getByRole("button", { name: /tentar de novo/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renderiza o ExperienceGuide quando o stream termina com um objeto válido", () => {
    useObjectMock.mockImplementation(({ onFinish }: UseObjectArgs) => {
      const [object, setObject] = useState<unknown>(undefined);
      const submit = useCallback(() => {
        setObject(FAKE_GUIDE);
        onFinish?.({ object: FAKE_GUIDE, error: undefined });
      }, [onFinish]);
      return { object, submit, error: undefined };
    });

    render(<ExperienceGuideGenerator code="FLN001" />);

    expect(screen.getByText(FAKE_GUIDE.welcomeMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /tentar de novo/i }),
    ).not.toBeInTheDocument();
  });

  it("permite tentar de novo após uma falha e mostra o guia quando a nova tentativa é bem-sucedida", async () => {
    const user = userEvent.setup();
    useObjectMock.mockImplementation(({ onFinish }: UseObjectArgs) => {
      const [object, setObject] = useState<unknown>(undefined);
      const attempts = useRef(0);
      const submit = useCallback(() => {
        attempts.current += 1;
        if (attempts.current === 1) {
          setObject(undefined);
          onFinish?.({ object: undefined, error: undefined });
        } else {
          setObject(FAKE_GUIDE);
          onFinish?.({ object: FAKE_GUIDE, error: undefined });
        }
      }, [onFinish]);
      return { object, submit, error: undefined };
    });

    render(<ExperienceGuideGenerator code="FLN001" />);

    const retryButton = await screen.findByRole("button", { name: /tentar de novo/i });
    await user.click(retryButton);

    expect(screen.getByText(FAKE_GUIDE.welcomeMessage)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /tentar de novo/i }),
    ).not.toBeInTheDocument();
  });
});
