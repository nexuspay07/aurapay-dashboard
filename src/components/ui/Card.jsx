import theme from "../../theme/theme";

export default function Card({
  children,
  title,
  subtitle,
  footer,
  padding = "lg",
  shadow = "md",
  hover = false,
  bordered = true,
  onClick,
  style = {},
}) {
  const paddings = {
    sm: theme.spacing.md,
    md: theme.spacing.xl,
    lg: theme.spacing.xxl,
  };

  const cardStyle = {
    background: theme.colors.surface,

    border: bordered
      ? `1px solid ${theme.colors.border}`
      : "none",

    borderRadius: theme.radius.lg,

    padding: paddings[padding],

    boxShadow: theme.shadows[shadow],

    transition:
      "all .25s ease",

    cursor: onClick
      ? "pointer"
      : "default",

    ...style,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.transform =
            "translateY(-4px)";

          e.currentTarget.style.boxShadow =
            theme.shadows.lg;
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.transform =
            "translateY(0px)";

          e.currentTarget.style.boxShadow =
            theme.shadows[shadow];
        }
      }}
    >
      {title && (
        <div
          style={{
            marginBottom:
              theme.spacing.lg,
          }}
        >
          <h3
            style={{
              margin: 0,
              color:
                theme.colors.text,
              fontSize:
                theme.typography.h4,
            }}
          >
            {title}
          </h3>

          {subtitle && (
            <p
              style={{
                marginTop: 6,
                color:
                  theme.colors
                    .textSecondary,
                marginBottom: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}

      {footer && (
        <div
          style={{
            marginTop:
              theme.spacing.xl,

            borderTop: `1px solid ${theme.colors.border}`,

            paddingTop:
              theme.spacing.lg,
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}