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
}) {
  const variants = {
    primary: {
      background: theme.colors.primary,
      color: theme.colors.white,
      border: "none",
    },

    secondary: {
      background: theme.colors.secondary,
      color: theme.colors.white,
      border: "none",
    },

    success: {
      background: theme.colors.success,
      color: theme.colors.white,
      border: "none",
    },

    danger: {
      background: theme.colors.danger,
      color: theme.colors.white,
      border: "none",
    },

    outline: {
      background: "transparent",
      color: theme.colors.primary,
      border: `1px solid ${theme.colors.border}`,
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

    transition: "all .25s ease",

    opacity:
      disabled || loading
        ? 0.65
        : 1,

    boxShadow:
      variant === "primary"
        ? theme.shadows.md
        : "none",
  };

  return (
    <button
      type={type}
      style={style}
      disabled={
        disabled || loading
      }
      onClick={onClick}
      onMouseEnter={(e) => {
        if (
          variant === "primary"
        ) {
          e.currentTarget.style.background =
            theme.colors.primaryHover;

          e.currentTarget.style.transform =
            "translateY(-2px)";
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