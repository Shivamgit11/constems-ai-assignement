import layoutJson from "../data/data.json";

const Checkbox = ({ checked }) =>  {
  return (
    <span
      style={{
        width: 15,
        height: 15,
        borderRadius: 4,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: checked ? layoutJson.cyan : "transparent",
        border: `1.5px solid ${checked ? layoutJson.cyan : layoutJson.textMuted}`,
        transition: "all 0.12s",
      }}
    >
      {checked && (
        <span
          style={{
            color: "#0A0F1E",
            fontSize: 9,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ✓
        </span>
      )}
    </span>
  );
}

export default Checkbox;