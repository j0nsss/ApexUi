interface LoadingSpinnerProps {
  size?: number;
}

const LoadingSpinner = ({ size = 24 }: LoadingSpinnerProps) => {
  return (
    <span
      className="inline-block border border-solid border-default animate-spin"
      style={{
        width: size,
        height: size,
        borderColor: "var(--color-border)",
        borderTopColor: "var(--color-accent)",
      }}
      aria-hidden="true"
    />
  );
};

export { LoadingSpinner };
export type { LoadingSpinnerProps };
