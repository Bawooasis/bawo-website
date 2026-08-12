import { MeshGradient } from "@paper-design/shaders-react";
import { palette } from "../../assets/colors.js";

const MESH_COLORS = [
  palette.obsidian.canvas,
  "#0E0A14",
  "#1A0A28",
  "#2A1438",
] as const;

/** Eggplant mesh wash for mid-page sections — no copper/brown haze */
export default function SectionShaderAmbient() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-[0.7]"
        colors={[...MESH_COLORS]}
        speed={0.32}
        backgroundColor={palette.obsidian.canvas}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 95% 55% at 50% 15%, rgba(255, 107, 0, 0.1) 0%, transparent 58%),
            radial-gradient(ellipse 75% 50% at 85% 55%, rgba(58, 29, 72, 0.35) 0%, transparent 52%),
            radial-gradient(ellipse 70% 45% at 12% 65%, rgba(42, 20, 56, 0.4) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
