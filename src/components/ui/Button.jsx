import theme from "../../theme/theme";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = "button",
  onClick,
  style: customStyle = {},
  className = "",
  ...props
}) {
  const variants = {
    primary: {
      background: theme.colors.primary,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.primary}`,
    },

    secondary: {
      background: theme.colors.secondary,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.secondary}`,
    },

    success: {
      background: theme.colors.successStrong,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.successStrong}`,
    },

    danger: {
      background: theme.colors.dangerStrong,
      color: theme.colors.white,
      border: `1px solid ${theme.colors.dangerStrong}`,
    },

    outline: {
      background: "transparent",
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.borderStrong}`,
    },

    ghost: {
      background: "transparent",
      color: theme.colors.text,
      border: "none",
    },
  };

  const sizes = {
    sm: {
      padding: "10px 18px",
      fontSize: 14,
    },

    md: {
      padding: "14px 22px",
      fontSize: 16,
    },

    lg: {
      padding: "18px 28px",
      fontSize: 18,
    },
  };

  const style = {
    ...variants[variant],
    ...sizes[size],

    width: fullWidth ? "100%" : "auto",

    borderRadius: theme.radius.md,

    cursor:
      disabled || loading
        ? "not-allowed"
        : "pointer",

    display: "inline-flex",

    alignItems: "center",

    justifyContent: "center",

    gap: 10,

    fontWeight: 700,

    minHeight: 44,

    transition: "background-color .18s ease, border-color .18s ease, box-shadow .18s ease, transform .18s ease",

    opacity:
      disabled || loading
        ? 0.65
        : 1,

    boxShadow:
      variant === "primary"
        ? "0 9px 24px rgba(37,99,235,.2)"
        : "none",

    ...customStyle,
  };

  return (
    <button
      type={type}
      className={`ui-button ui-button--${variant} ${className}`.trim()}
      style={style}
      disabled={
        disabled || loading
      }
      onClick={onClick}
      {...props}
      onMouseEnter={(e) => {
        if (
          variant === "primary"
        ) {
          e.currentTarget.style.background =
            theme.colors.primaryHover;

          e.currentTarget.style.transform =
            "translateY(-1px)";

          e.currentTarget.style.boxShadow =
            "0 12px 28px rgba(37,99,235,.26)";
        }
      }}
      onMouseLeave={(e) => {
        if (
          variant === "primary"
        ) {
          e.currentTarget.style.background =
            theme.colors.primary;

          e.currentTarget.style.transform =
            "translateY(0px)";

          e.currentTarget.style.boxShadow =
            "0 9px 24px rgba(37,99,235,.2)";
        }
      }}
    >
      {leftIcon}

      {loading
        ? "Loading..."
        : children}

      {rightIcon}
    </button>
  );
}
