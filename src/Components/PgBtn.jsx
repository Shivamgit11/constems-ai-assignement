import layoutJson from "../data/data.json";

const  PgBtn = ({ children, onClick, disabled, active }) =>  {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: `1px solid ${active ? layoutJson.cyan : layoutJson.borderAct}`,
        background: active ? "rgba(0,198,255,0.18)" : "transparent",
        color: active ? layoutJson.cyan : layoutJson.textLabel,
        fontSize: 13,
        fontWeight: active ? 700 : 400,
        fontFamily: layoutJson.fontMain,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.28 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.12s",
      }}
    >
      {children}
    </button>
  );
}

export default PgBtn;