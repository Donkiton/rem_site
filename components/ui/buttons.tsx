import type { MouseEventHandler, ReactNode } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { cx } from "@/lib/utils";

export type ActionButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  external?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  "aria-label"?: string;
};

function ActionButton({
  children,
  href,
  className,
  disabled = false,
  loading = false,
  external,
  type = "button",
  onClick,
  "aria-label": ariaLabel,
  variant,
}: ActionButtonProps & {
  variant: "primary" | "secondary" | "ghost" | "danger";
}) {
  const content = (
    <>
      {loading ? <LoaderCircle className="button-spinner" aria-hidden="true" /> : null}
      <span>{children}</span>
      {external && !loading ? <ArrowUpRight size={16} aria-hidden="true" /> : null}
    </>
  );
  const classes = cx("button", `button-${variant}`, className);

  if (href && !disabled) {
    return (
      <a
        className={classes}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled || loading}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}

export function PrimaryButton(props: ActionButtonProps) {
  return <ActionButton {...props} variant="primary" />;
}

export function SecondaryButton(props: ActionButtonProps) {
  return <ActionButton {...props} variant="secondary" />;
}

export function GhostButton(props: ActionButtonProps) {
  return <ActionButton {...props} variant="ghost" />;
}

export function DangerButton(props: ActionButtonProps) {
  return <ActionButton {...props} variant="danger" />;
}

export function IconButton({
  children,
  className,
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: Pick<ActionButtonProps, "children" | "className" | "disabled" | "onClick" | "aria-label">) {
  return (
    <button
      className={cx("icon-button", className)}
      type="button"
      disabled={disabled}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
