/**
 * Hand-drawn vector hills scene, copied from LatSaung (the signature
 * backdrop of the Creatie scrapbook pattern). Drawn, never photographed.
 * Colours match heinminthant.com exactly: sky #8CC9EB, sun #FBEB9A with a
 * pale mint halo, hills #82B26B / #578B3D / #3F6D30 back to front.
 * preserveAspectRatio "xMidYMid slice" so it crops instead of squeezing.
 */
export default function Hills({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 420"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      <rect x="0" y="0" width="1440" height="420" fill="#8cc9eb" />
      <circle cx="1210" cy="86" r="70" fill="#c5e3d6" opacity="0.65" />
      <circle cx="1210" cy="86" r="52" fill="#fbeb9a" />
      <g fill="#ffffff">
        <ellipse cx="240" cy="80" rx="90" ry="30" />
        <ellipse cx="300" cy="64" rx="62" ry="26" />
        <ellipse cx="700" cy="120" rx="76" ry="24" />
        <ellipse cx="752" cy="106" rx="50" ry="20" />
        <ellipse cx="1020" cy="52" rx="58" ry="20" />
      </g>
      <path
        d="M0,300 C240,220 420,260 640,300 C860,340 1080,250 1440,290 L1440,420 L0,420 Z"
        fill="#82b26b"
      />
      <path
        d="M0,340 C200,290 460,320 720,350 C980,380 1200,320 1440,350 L1440,420 L0,420 Z"
        fill="#578b3d"
      />
      <path
        d="M0,385 C260,350 520,375 820,392 C1080,406 1280,382 1440,392 L1440,420 L0,420 Z"
        fill="#3f6d30"
      />
      <g>
        <circle cx="180" cy="392" r="5" fill="#f5b8d0" />
        <circle cx="430" cy="382" r="5" fill="#fff3b0" />
        <circle cx="760" cy="398" r="5" fill="#f5b8d0" />
        <circle cx="1090" cy="394" r="5" fill="#ffffff" />
        <circle cx="1300" cy="400" r="5" fill="#fff3b0" />
      </g>
    </svg>
  );
}
