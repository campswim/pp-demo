const PhoneWithText = ({ size = 100, color = 'currentColor', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 20 256 236" // shift viewBox origin down by 20px
    fill="none"
    stroke={color}
    strokeWidth="16"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Receiver */}
    <g transform="translate(0, -15)">
      <path d="M225.94,95.83c17.29,17.29,18.63,42.29,4,61.12a8,8,0,0,1-9.26,2.47L171.58,142a8,8,0,0,1-4.86-5.8l-6.21-29.74a7.94,7.94,0,0,0-5.14-5.9,84.39,84.39,0,0,0-55.1.13,7.93,7.93,0,0,0-5.12,6l-5.9,29.51A8,8,0,0,1,84.38,142L35.29,159.42A8,8,0,0,1,26,157c-14.6-18.83-13.26-43.83,4-61.12C83.17,42.72,172.83,42.72,225.94,95.83Z" />
    </g>

    {/* Base line */}
    <line x1="40" y1="235" x2="216" y2="235" />

    {/* Text */}
    <text
      x="50%"
      y="190"
      textAnchor="middle"
      dominantBaseline="middle"
      fontFamily="'Roboto', sans-serif"
      fontSize="50"
      fontWeight="bold"
      fill={color}
      stroke="black"
      strokeWidth="1"
      paintOrder="stroke"
      letterSpacing="4px"
    >
      PHONE
    </text>
  </svg>
)

export default PhoneWithText;