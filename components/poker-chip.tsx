export default function PokerChip({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
  <!-- Outer black poker chip circle -->
  <circle cx="256" cy="256" r="180" fill="#0A1A18"/>

  <!-- Inner cream circle -->
  <circle cx="256" cy="256" r="130" fill="#F4E7C7"/>

  <!-- 8 cream-colored stripes with a clear gap from the beige -->
  <g fill="#F4E7C7" transform="translate(256,256)">
    <rect x="-20" y="-180" width="40" height="35" rx="4"/>
    <rect x="-20" y="-180" width="40" height="35" rx="4" transform="rotate(45)"/>
    <rect x="-20" y="-180" width="40" height="35" rx="4" transform="rotate(90)"/>
    <rect x="-20" y="-180" width="40" height="35" rx="4" transform="rotate(135)"/>
    <rect x="-20" y="-180" width="40" height="35" rx="4" transform="rotate(180)"/>
    <rect x="-20" y="-180" width="40" height="35" rx="4" transform="rotate(225)"/>
    <rect x="-20" y="-180" width="40" height="35" rx="4" transform="rotate(270)"/>
    <rect x="-20" y="-180" width="40" height="35" rx="4" transform="rotate(315)"/>
  </g>

  <!-- Centered large dollar sign -->
  <text x="256" y="256" text-anchor="middle" font-size="120" font-family="Arial, sans-serif" fill="#C8991D" dominant-baseline="central">$</text>
</svg>
  )
}
