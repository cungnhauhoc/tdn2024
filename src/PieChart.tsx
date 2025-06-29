// Biểu đồ tròn phổ điểm - tách ra file riêng, dùng TypeScript


type PieChartProps = {
  bins: number[];
  binLabels: string[];
};

export function PieChart({ bins, binLabels }: PieChartProps) {
  const total = Array.isArray(bins) ? bins.reduce((a, b) => a + b, 0) : 0;
  let acc = 0;
  const colors = [
    '#1976d2', '#00bcd4', '#43a047', '#fbc02d', '#fb8c00', '#e53935', '#8e24aa', '#d81b60', '#00897b', '#c62828',
    '#7b1fa2', '#3949ab', '#0288d1', '#388e3c', '#fbc02d', '#f57c00', '#d32f2f', '#5e35b1', '#00838f', '#2e7d32'
  ];
  const slices = [] as {
    value: number;
    startAngle: number;
    endAngle: number;
    color: string;
    label: string;
    percent: string;
  }[];
  if (Array.isArray(bins)) {
    for (let i = 0; i < bins.length; i++) {
      const count = bins[i];
      const start = acc;
      const angle = total > 0 ? (count / total) * 360 : 0;
      acc += angle;
      slices.push({
        value: count,
        startAngle: start,
        endAngle: start + angle,
        color: colors[i % colors.length],
        label: binLabels[i],
        percent: total > 0 ? ((count / total) * 100).toFixed(1) : '0.0',
      });
    }
  }
  function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const rad = Math.PI / 180;
    const x1 = cx + r * Math.cos((startAngle - 90) * rad);
    const y1 = cy + r * Math.sin((startAngle - 90) * rad);
    const x2 = cx + r * Math.cos((endAngle - 90) * rad);
    const y2 = cy + r * Math.sin((endAngle - 90) * rad);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
  }
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
      <svg width={260} height={260} viewBox="0 0 260 260">
        {slices.map((s, i) => s.value > 0 ? (
          <path
            key={i}
            d={describeArc(130, 130, 110, s.startAngle, s.endAngle)}
            fill={s.color}
            stroke="#fff"
            strokeWidth={2}
          />
        ) : null)}
        {slices.map((s, i) => {
          if (s.value === 0) return null;
          const midAngle = (s.startAngle + s.endAngle) / 2;
          const rad = Math.PI / 180;
          const x = 130 + 80 * Math.cos((midAngle - 90) * rad);
          const y = 130 + 80 * Math.sin((midAngle - 90) * rad);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="13"
              fill="#fff"
              fontWeight="bold"
              style={{textShadow:'0 1px 4px #000a'}}
            >
              {s.percent}%
            </text>
          );
        })}
      </svg>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center',gap:8,marginTop:8}}>
        {slices.map((s, i) => s.value > 0 ? (
          <div key={i} style={{display:'flex',alignItems:'center',margin:'2px 8px'}}>
            <span style={{display:'inline-block',width:16,height:16,background:s.color,borderRadius:3,marginRight:4}}></span>
            <span style={{fontSize:13}}>{s.label} ({s.value})</span>
          </div>
        ) : null)}
      </div>
    </div>
  );
}
