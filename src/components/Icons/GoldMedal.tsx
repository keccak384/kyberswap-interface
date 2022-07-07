import React from 'react'

export default function GoldMedal({ size }: { size?: number }) {
  return (
    <svg
      width={size ? `${(size * 18) / 24}` : '18'}
      height={size || '24'}
      viewBox="0 0 18 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.4165 8H5.58345C5.26123 8 5 8.30517 5 8.68159V23.3184C5 23.5565 5.10638 23.7774 5.28068 23.901C5.45486 24.0246 5.67175 24.0331 5.85262 23.9231L9 22.0112L12.1474 23.9231C12.2319 23.9744 12.3243 23.9999 12.4165 23.9999C12.5216 23.9999 12.6265 23.9668 12.7193 23.901C12.8936 23.7773 13 23.5565 13 23.3183V8.68159C13 8.30517 12.7388 8 12.4165 8Z"
        fill="#E50058"
      />
      <circle cx="9" cy="9" r="9" fill="#FFCC66" />
      <circle cx="9" cy="9" r="6" fill="#FFEA80" />
    </svg>
  )
}