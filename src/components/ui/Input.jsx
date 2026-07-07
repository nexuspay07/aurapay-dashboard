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

    transition: "all .25s ease",

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
          style={inputStyle}
        />

        {rightIcon}
      </div>

      {helperText && !error && (
        <small
          style={{
            color:
              theme.colors.textSecondary,
          }}
        >
          {helperText}
        </small>
      )}

      {error && (
        <small
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