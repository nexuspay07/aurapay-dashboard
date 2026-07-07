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
    success: theme.colors.success,
    danger: theme.colors.danger,
    warning: theme.colors.warning,
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
              fontSize: 14,
              marginBottom: 10,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
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
              background:
                "#EFF6FF",
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