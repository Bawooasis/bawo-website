import { MeshGradient } from "@paper-design/shaders-react";
import { palette } from "../../assets/colors.js";

const MESH_COLORS = ["#12080F", "#14090E", "#18100F", "#3D2214"] as const;

/** Warm mesh wash for mid-page sections — visible energy, not a black gap */
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
            radial-gradient(ellipse 95% 55% at 50% 15%, rgba(255, 107, 0, 0.14) 0%, transparent 58%),
            radial-gradient(ellipse 75% 50% at 85% 55%, rgba(212, 175, 55, 0.08) 0%, transparent 52%),
            radial-gradient(ellipse 70% 45% at 12% 65%, rgba(255, 107, 0, 0.07) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
