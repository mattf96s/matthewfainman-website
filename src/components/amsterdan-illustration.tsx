import type { SVGProps } from "react"
interface SVGRProps {
  title?: string;
  titleId?: string;
}
const SvgComponent = ({
  title,
  titleId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 690 530"
    aria-labelledby={titleId}
    {...props}
  >
    {title === undefined ? (
      <title
        style={{
          fill: "#000",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
        id={titleId}
      >
        {"Amsterdam canal houses"}
      </title>
    ) : title ? (
      <title
        style={{
          fill: "#000",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
        id={titleId}
      >
        {title}
      </title>
    ) : null}
    <defs>
      <linearGradient id="a" x1={0} x2={0} y1={0} y2={1}>
        <stop offset="0%" stopColor="#5AA3D8" />
        <stop offset="100%" stopColor="#B8DAEC" />
      </linearGradient>
      <linearGradient id="b" x1={0} x2={0} y1={0} y2={1}>
        <stop offset="0%" stopColor="#3A5E78" />
        <stop offset="100%" stopColor="#1E3A50" />
      </linearGradient>
    </defs>
    <path
      fill="url(#a)"
      d="M0 0h680v350H0z"
      style={{
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <ellipse
      cx={120}
      cy={60}
      fill="#FAFAFA"
      opacity={0.9}
      rx={70}
      ry={14}
      style={{
        fill: "#fafafa",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.9,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <ellipse
      cx={160}
      cy={50}
      fill="#FAFAFA"
      opacity={0.8}
      rx={50}
      ry={11}
      style={{
        fill: "#fafafa",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.8,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <ellipse
      cx={480}
      cy={55}
      fill="#FAFAFA"
      opacity={0.9}
      rx={80}
      ry={16}
      style={{
        fill: "#fafafa",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.9,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <ellipse
      cx={540}
      cy={45}
      fill="#FAFAFA"
      opacity={0.8}
      rx={55}
      ry={12}
      style={{
        fill: "#fafafa",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.8,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <ellipse
      cx={380}
      cy={80}
      fill="#FAFAFA"
      opacity={0.6}
      rx={45}
      ry={10}
      style={{
        fill: "#fafafa",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.6,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#E0D8C8"
        d="M0 120h80v220H0z"
        style={{
          fill: "#e0d8c8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#C8C0B0"
        d="M0 120h14v18H0zM14 106h14v32H14zM28 92h14v46H28zM42 106h14v32H42zM56 120h14v18H56zM70 120h10v18H70z"
        style={{
          fill: "#c8c0b0",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#A89888"
        d="M32 100h6v6h-6z"
        style={{
          fill: "#a89888",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#3A4858"
        d="M12 150h20v44H12zM46 150h20v44H46zM12 208h20v44H12zM46 208h20v44H46zM12 266h20v44H12zM46 266h20v44H46z"
        style={{
          fill: "#3a4858",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#D62820"
        d="M80 125h92v215H80zM80 125q0-25 20-29 8-8 10-20h52q2 12 10 20v29Z"
        style={{
          fill: "#d62820",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#B01810"
        d="M100 96q-8 4-12 14-2-8 8-14M172 96q-8 0-12 14 4-8 8-14"
        style={{
          fill: "#b01810",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M118 80h36v6h-36z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#B01810"
        d="M120 86h32v3h-32z"
        style={{
          fill: "#b01810",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M124 94h24v22h-24z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M128 98h16v14h-16z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M96 140h28v48H96z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M100 144h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M110 144v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M100 164h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M132 140h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M136 144h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M146 144v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M136 164h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M96 200h28v48H96z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M100 204h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M110 204v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M100 224h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M132 200h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M136 204h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M146 204v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M136 224h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M96 260h28v48H96z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M100 264h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M110 264v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M100 284h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M132 260h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M136 264h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M146 264v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M136 284h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M96 316h28v24H96z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#2A3848"
        d="M132 316h28v24h-28z"
        style={{
          fill: "#2a3848",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#6A3838"
        d="M172 110h86v230h-86z"
        style={{
          fill: "#6a3838",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A2828"
        d="m172 110 12-20 16-14 15-8 15 8 16 14 12 20z"
        style={{
          fill: "#5a2828",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#3A1818"
        d="M210 62h10v14h-10z"
        style={{
          fill: "#3a1818",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M194 90h20v22h-20z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M197 93h14v16h-14z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M216 90h20v22h-20z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M219 93h14v16h-14z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M186 124h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M190 128h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M200 128v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M190 147h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M218 124h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M222 128h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M232 128v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M222 147h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M186 180h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M190 184h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M200 184v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M190 203h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M218 180h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M222 184h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M232 184v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M222 203h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M186 236h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M190 240h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M200 240v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M190 259h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M218 236h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M222 240h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M232 240v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M222 259h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M186 292h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M190 296h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M200 296v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#3A2818"
        d="M218 296h28v44h-28z"
        style={{
          fill: "#3a2818",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#8A4A2A"
        d="M258 120h80v220h-80z"
        style={{
          fill: "#8a4a2a",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#7A3A20"
        d="M258 120q0-32 22-40 18-16 18 6v10h2V86q0-22 18-6 20 8 20 40Z"
        style={{
          fill: "#7a3a20",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <circle
        cx={298}
        cy={100}
        r={7}
        fill="#FAF6E8"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <circle
        cx={298}
        cy={100}
        r={4}
        fill="#5A6878"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M272 134h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M276 138h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M285 138v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M276 156h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M304 134h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M308 138h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M317 138v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M308 156h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M272 188h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M276 192h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M285 192v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M276 210h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M304 188h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M308 192h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M317 192v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M308 210h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M272 242h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M276 246h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M285 246v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M276 264h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M304 242h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M308 246h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M317 246v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M308 264h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#1E4A38"
        d="M278 296h20v44h-20z"
        style={{
          fill: "#1e4a38",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#3A6850"
        d="M280 298h16v14h-16z"
        style={{
          fill: "#3a6850",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M308 296h22v44h-22z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M312 300h14v36h-14z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#6A2828"
        d="M338 100h84v240h-84z"
        style={{
          fill: "#6a2828",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A1818"
        d="M338 100q7-25 22-30 10-10 20 10v20ZM422 100q-7-25-22-30-10-10-20 10v20Z"
        style={{
          fill: "#5a1818",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M370 60h20v14h-20zM370 60l10-8 10 8z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A1818"
        d="M376 65h8v9h-8z"
        style={{
          fill: "#5a1818",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#0E3A28"
        stroke="#FAF6E8"
        strokeWidth={3}
        d="M360 102q0-14 20-14t20 14v28h-40Z"
        style={{
          fill: "#0e3a28",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 3,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M380 88v42"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#0E3A28"
        stroke="#FAF6E8"
        strokeWidth={3}
        d="M360 140q0-14 20-14t20 14v38h-40Z"
        style={{
          fill: "#0e3a28",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 3,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M380 126v52"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#0E3A28"
        stroke="#FAF6E8"
        strokeWidth={3}
        d="M360 188q0-14 20-14t20 14v38h-40Z"
        style={{
          fill: "#0e3a28",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 3,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M380 174v52"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#0E3A28"
        stroke="#FAF6E8"
        strokeWidth={3}
        d="M360 236q0-14 20-14t20 14v38h-40Z"
        style={{
          fill: "#0e3a28",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 3,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M380 222v52"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#0E3A28"
        stroke="#FAF6E8"
        strokeWidth={3}
        d="M360 284q0-14 20-14t20 14v56h-40Z"
        style={{
          fill: "#0e3a28",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 3,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M380 270v70"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#E8C878"
        d="M422 110h80v230h-80z"
        style={{
          fill: "#e8c878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#D8B468"
        d="M422 110q0-32 22-40 18-16 18 6v10h2V76q0-22 18-6 20 8 20 40Z"
        style={{
          fill: "#d8b468",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <circle
        cx={462}
        cy={92}
        r={6}
        fill="#FAF6E8"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <circle
        cx={462}
        cy={92}
        r={3}
        fill="#5A6878"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M436 120h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M440 124h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M449 124v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M440 142h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M468 120h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M472 124h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M481 124v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M472 142h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M436 174h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M440 178h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M449 178v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M440 196h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M468 174h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M472 178h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M481 178v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M472 196h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M436 228h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M440 232h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M449 232v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M440 250h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M468 228h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M472 232h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M481 232v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M472 250h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M436 282h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M440 286h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M449 286v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M440 304h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M468 282h26v44h-26z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M472 286h18v36h-18z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M481 286v36"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M472 304h18"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#A88848"
        d="M446 332h40v8h-40z"
        style={{
          fill: "#a88848",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#B8482A"
        d="M502 116h86v224h-86z"
        style={{
          fill: "#b8482a",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#9A3818"
        d="M502 116h14v20h-14zM516 100h14v36h-14zM530 84h14v52h-14zM544 100h14v36h-14zM558 116h14v20h-14zM572 116h16v20h-16z"
        style={{
          fill: "#9a3818",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#7A2818"
        d="M534 88h6v8h-6z"
        style={{
          fill: "#7a2818",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M514 146h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M518 150h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M528 150v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M518 170h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M548 146h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M552 150h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M562 150v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M552 170h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M514 206h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M518 210h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M528 210v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M518 230h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M548 206h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M552 210h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M562 210v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M552 230h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M514 266h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M518 270h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M528 270v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M518 290h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M548 266h28v48h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M552 270h20v40h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M562 270v40"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M552 290h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M514 320h28v20h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#1E4A38"
        d="M548 320h28v20h-28z"
        style={{
          fill: "#1e4a38",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <path
        fill="#7A1818"
        d="M588 130h92v210h-92z"
        style={{
          fill: "#7a1818",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#6A0808"
        d="M588 130q0-25 24-30 10-10 14-22h28q4 12 14 22 12 5 12 30Z"
        style={{
          fill: "#6a0808",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M628 80h22v6h-22z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#6A0808"
        d="M632 86h14v3h-14z"
        style={{
          fill: "#6a0808",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M630 94h20v22h-20z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M633 97h14v16h-14z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M604 146h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M608 150h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M618 150v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M608 169h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M640 146h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M644 150h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M654 150v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M644 169h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M604 200h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M608 204h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M618 204v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M608 223h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M640 200h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M644 204h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M654 204v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M644 223h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M604 254h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M608 258h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M618 258v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M608 277h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M640 254h28v46h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M644 258h20v38h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1.5}
        d="M654 258v38"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: "1.5px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#FAF6E8"
        strokeWidth={1}
        d="M644 277h20"
        style={{
          fill: "#000",
          stroke: "#faf6e8",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAF6E8"
        d="M604 308h28v32h-28z"
        style={{
          fill: "#faf6e8",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#5A6878"
        d="M608 312h20v28h-20z"
        style={{
          fill: "#5a6878",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#1E4A38"
        d="M640 308h28v32h-28z"
        style={{
          fill: "#1e4a38",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
    <path
      fill="#988878"
      d="M0 338h680v12H0z"
      style={{
        fill: "#988878",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#787060"
      d="M0 338h680v2H0z"
      style={{
        fill: "#787060",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="url(#b)"
      d="M0 350h680v170H0z"
      style={{
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#A89888"
      d="M0 350h80v70H0z"
      opacity={0.35}
      style={{
        fill: "#a89888",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.35,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#D62820"
      d="M80 350h92v80H80z"
      opacity={0.4}
      style={{
        fill: "#d62820",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.4,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#5A2828"
      d="M172 350h86v75h-86z"
      opacity={0.4}
      style={{
        fill: "#5a2828",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.4,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#7A3A20"
      d="M258 350h80v80h-80z"
      opacity={0.4}
      style={{
        fill: "#7a3a20",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.4,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#5A1818"
      d="M338 350h84v85h-84z"
      opacity={0.45}
      style={{
        fill: "#5a1818",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.45,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#D8B468"
      d="M422 350h80v80h-80z"
      opacity={0.4}
      style={{
        fill: "#d8b468",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.4,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#9A3818"
      d="M502 350h86v78h-86z"
      opacity={0.4}
      style={{
        fill: "#9a3818",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.4,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#6A0808"
      d="M588 350h92v80h-92z"
      opacity={0.4}
      style={{
        fill: "#6a0808",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.4,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 362h680v3H0z"
      opacity={0.5}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.5,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 374h680v2H0z"
      opacity={0.45}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.45,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 384h680v3H0z"
      opacity={0.5}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.5,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 396h680v2H0z"
      opacity={0.45}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.45,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 408h680v3H0z"
      opacity={0.55}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.55,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 422h680v3H0z"
      opacity={0.6}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.6,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 438h680v2H0z"
      opacity={0.5}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.5,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 452h680v3H0z"
      opacity={0.55}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.55,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 470h680v3H0z"
      opacity={0.6}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.6,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#1E3A50"
      d="M0 490h680v4H0z"
      opacity={0.65}
      style={{
        fill: "#1e3a50",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.65,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#C8E0EC"
      d="M180 368h60v1.5h-60z"
      opacity={0.6}
      style={{
        fill: "#c8e0ec",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.6,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#C8E0EC"
      d="M320 380h80v1.5h-80z"
      opacity={0.55}
      style={{
        fill: "#c8e0ec",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.55,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#C8E0EC"
      d="M520 372h70v1.5h-70zM60 396h70v1.5H60z"
      opacity={0.6}
      style={{
        fill: "#c8e0ec",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.6,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#D8E8F0"
      d="M420 412h90v1.8h-90zM200 430h80v1.8h-80z"
      opacity={0.65}
      style={{
        fill: "#d8e8f0",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.65,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#D8E8F0"
      d="M540 448h100v2H540zM30 462h90v2H30z"
      opacity={0.7}
      style={{
        fill: "#d8e8f0",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.7,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <path
      fill="#E8F0F4"
      d="M280 478h100v2H280z"
      opacity={0.75}
      style={{
        fill: "#e8f0f4",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 0.75,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    />
    <g
      style={{
        fill: "#000",
        stroke: "none",
        color: "#fff",
        strokeWidth: 1,
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        opacity: 1,
        fontFamily: "&quot",
        fontSize: 16,
        fontWeight: 400,
        textAnchor: "start",
        dominantBaseline: "auto",
      }}
    >
      <ellipse
        cx={120}
        cy={465}
        fill="#1A3040"
        opacity={0.45}
        rx={100}
        ry={6}
        style={{
          fill: "#1a3040",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 0.45,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#FAFAFA"
        d="M50 445q-10 17 30 17h120q30-2 24-17l-4-3q-70-4-140 0-20 0-30 3Z"
        style={{
          fill: "#fafafa",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#2A4080"
        d="M50 446h174v4H50z"
        style={{
          fill: "#2a4080",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#E8B838"
        d="M50 450h174v2H50z"
        style={{
          fill: "#e8b838",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#A8C8DC"
        d="M60 442q0-20 30-22h110q20 2 20 22Z"
        style={{
          fill: "#a8c8dc",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="none"
        stroke="#2A4080"
        strokeWidth={2}
        d="M60 442q0-20 30-22h110q20 2 20 22"
        style={{
          fill: "none",
          stroke: "#2a4080",
          color: "#fff",
          strokeWidth: 2,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        stroke="#2A4080"
        strokeWidth={0.8}
        d="M80 422v20M100 420v22M120 420v22M140 420v22M160 420v22M180 420v22M200 420v22"
        style={{
          fill: "#000",
          stroke: "#2a4080",
          color: "#fff",
          strokeWidth: ".8px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
      <path
        fill="#E8B838"
        d="M60 442h160v2H60z"
        style={{
          fill: "#e8b838",
          stroke: "none",
          color: "#fff",
          strokeWidth: 1,
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          opacity: 1,
          fontFamily: "&quot",
          fontSize: 16,
          fontWeight: 400,
          textAnchor: "start",
          dominantBaseline: "auto",
        }}
      />
    </g>
  </svg>
)
export default SvgComponent
