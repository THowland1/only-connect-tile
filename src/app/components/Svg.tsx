import { SVGProps, useId } from "react";

export const Svg = (props: SVGProps<SVGSVGElement>) => {
  const width = Number(props.width || 380);
  const height = Number(props.height || 210);
  const id = useId();
  const padding = (10 * height) / 210;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      style={{
        borderRadius: `${(100 * 9) / width}%/${(100 * 9) / height}%`,
        ...props.style,
      }}
    >
      <g filter={`url(#filter0_dii_849_538_${id})`}>
        <rect x="0" y="0" width={width} height={height} rx="9" fill="#BFE0F9" />

        <svg
          x={padding}
          y={padding}
          width={width - padding}
          height={height - padding}
          viewBox={`0 0 370 210`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M86.2864 66.6521C51.3177 76.7064 0 96 0 96V0H370L370 50.9862C370 50.9862 195.828 35.1563 86.2864 66.6521Z"
            fill="#CCE7FA"
          />
        </svg>

        {/* <svg
          x={padding}
          y={padding}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          <path
            d="M86.286 66.6521C51.3177 76.7064 0 96 0 96V0H370L370 50.9862C370 50.9862 195.828 35.1563 86.286 66.6521Z"
            fill="#CCE7FA"
          />
        </svg> */}
      </g>
      <defs>
        <filter
          id={`filter0_dii_849_538_${id}`}
          x="0"
          y="0"
          width={width}
          height={height}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="7.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result={`effect1_dropShadow_849_538_${id}`}
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2={`effect1_dropShadow_849_538_${id}`}
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="10" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0784314 0 0 0 0 0.192157 0 0 0 0 0.34902 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="shape"
            result={`effect2_innerShadow_849_538_${id}`}
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-5" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0784314 0 0 0 0 0.192157 0 0 0 0 0.34902 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2={`effect2_innerShadow_849_538_${id}`}
            result={`effect3_innerShadow_849_538_${id}`}
          />
        </filter>
      </defs>
    </svg>
  );
};
