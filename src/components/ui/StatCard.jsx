import Card from "./Card";
import theme from "../../theme/theme";

export default function StatCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  trendColor = "success",
  onClick,
}) {
  const trendColors = {
    success: theme.colors.successStrong,
    danger: theme.colors.dangerStrong,
    warning: theme.colors.warningStrong,
    info: theme.colors.primary,
  };

  return (
    <Card
      hover
      onClick={onClick}
      padding="md"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div
            style={{
              color:
                theme.colors.textSecondary,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".02em",
              marginBottom: 10,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 32,
              lineHeight: 1.15,
              letterSpacing: "-.025em",
              fontWeight: 800,
              color:
                theme.colors.text,
            }}
          >
            {value}
          </div>

          {subtitle && (
            <div
              style={{
                marginTop: 10,
                color:
                  theme.colors.textSecondary,
                fontSize: 14,
              }}
            >
              {subtitle}
            </div>
          )}

          {trend && (
            <div
              style={{
                marginTop: 14,
                fontWeight: 600,
                color:
                  trendColors[
                    trendColor
                  ],
              }}
            >
              {trend}
            </div>
          )}
        </div>

        {icon && (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: theme.colors.primarySoft,
              color: theme.colors.primary,
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
              fontSize: 28,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
