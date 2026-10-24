import { useId } from "react";
import theme from "../../theme/theme";

export default function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style = {},
  ...props
}) {
  const generatedId = useId();
  const inputId = props.id || (props.name ? `input-${props.name}` : `input-${generatedId}`);
  const helperId = helperText || error ? `${inputId}-description` : undefined;

  const wrapperStyle = {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    width: fullWidth ? "100%" : "auto",
  };

  const inputContainer = {
    display: "flex",
    alignItems: "center",
    gap: 10,

    background: theme.colors.surface,

    border: `1px solid ${
      error
        ? theme.colors.danger
        : theme.colors.border
    }`,

    borderRadius: theme.radius.md,

    padding: "0 14px",

    transition: "border-color .18s ease, box-shadow .18s ease",

    boxShadow: theme.shadows.sm,
  };

  const inputStyle = {
    flex: 1,

    height: 52,

    border: "none",

    outline: "none",

    background: "transparent",

    fontSize: theme.typography.body,

    color: theme.colors.text,

    ...style,
  };

  return (
    <div style={wrapperStyle}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontWeight: 600,
            color: theme.colors.text,
          }}
        >
          {label}
        </label>
      )}

      <div
        style={inputContainer}
        onFocus={(e) => {
          e.currentTarget.style.border =
            `1px solid ${theme.colors.primary}`;

          e.currentTarget.style.boxShadow =
            `0 0 0 4px rgba(37,99,235,.15)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.border =
            `1px solid ${
              error
                ? theme.colors.danger
                : theme.colors.border
            }`;

          e.currentTarget.style.boxShadow =
            theme.shadows.sm;
        }}
      >
        {leftIcon}

        <input
          {...props}
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={helperId}
          style={inputStyle}
        />

        {rightIcon}
      </div>

      {helperText && !error && (
        <small id={helperId}
          style={{
            color:
              theme.colors.textSecondary,
          }}
        >
          {helperText}
        </small>
      )}

      {error && (
        <small id={helperId} role="alert"
          style={{
            color:
              theme.colors.danger,
          }}
        >
          {error}
        </small>
      )}
    </div>
  );
}
