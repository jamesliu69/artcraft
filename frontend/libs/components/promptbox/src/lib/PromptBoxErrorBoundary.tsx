import { Component, Fragment } from "react";
import type { ReactNode, ErrorInfo } from "react";
import { useTranslation } from "@storyteller/common";

interface Props {
  children: ReactNode;
  t: (source: string) => string;
}

interface State {
  hasError: boolean;
  resetKey: number;
}

class PromptBoxErrorBoundaryView extends Component<Props, State> {
  override state: State = { hasError: false, resetKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("PromptBox crashed:", error, info.componentStack);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center rounded-[3px] border border-red-500/30 bg-red-500/10 px-6 py-4 text-sm text-red-300">
          <span>{this.props.t("Something went wrong with the prompt box.")}&nbsp;</span>
          <button
            className="underline hover:text-red-200"
            onClick={() =>
              this.setState((prev) => ({
                hasError: false,
                resetKey: prev.resetKey + 1,
              }))
            }
          >
            {this.props.t("Try again")}
          </button>
        </div>
      );
    }
    return (
      <Fragment key={this.state.resetKey}>{this.props.children}</Fragment>
    );
  }
}

export function PromptBoxErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return <PromptBoxErrorBoundaryView t={t}>{children}</PromptBoxErrorBoundaryView>;
}
