import layoutJson from "../data/data.json";
const StatCard = ({ label, value, accent }) => {
  return (
    <div
      style={{
        background: layoutJson.LayoutColors.cardBg,
        border: `1px solid ${layoutJson.LayoutColors.border}`,
        borderRadius: 16,
        padding: "20px 24px",
        borderTop: accent ? `2px solid ${layoutJson.LayoutColors.cyan}` : `1px solid ${layoutJson.LayoutColors.border}`,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: layoutJson.LayoutColors.textLabel,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: layoutJson.LayoutColors.textH,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default StatCard;
