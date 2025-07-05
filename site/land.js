const width4 = 500;
const height4 = 500;
const radius4 = Math.min(width4, height4) / 2;
let landChartDrawn = false;

function drawLandChart() {
  const svg = d3.select("#svg4")
    .attr("width", width4)
    .attr("height", height4)
    .append("g")
    .attr("transform", `translate(${width4 / 2}, ${height4 / 2})`);

  // Title
  d3.select("#svg4")
    .append("text")
    .attr("x", width4 / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Land Use Distribution (2018)");

  const color = d3.scaleOrdinal()
    .domain(["land area", "agriculture", "forest land"])
    .range(["#8dd3c7", "#ffffb3", "#bebada"]);

  d3.csv("final_data/filtered_landuse_agrovoc.csv").then(data => {
    data.forEach(d => d.Value = +d.Value);

    const pie = d3.pie().value(d => d.Value).padAngle(0.03);
    const arc = d3.arc().innerRadius(20).outerRadius(radius4).cornerRadius(8);

    const arcs = svg.selectAll("g")
      .data(pie(data))
      .enter()
      .append("g");

    arcs.append("path")
      .attr("fill", d => color(d.data.AGROVOC_label))
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });

    setTimeout(() => {
      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#333")
        .html(d => {
          const percent = Math.round(d.data.Value / d3.sum(data, d => d.Value) * 100);
          return `
            <tspan x="0" dy="-0.5em">${d.data.AGROVOC_label}</tspan>
            <tspan x="0" dy="1.2em">${percent}%</tspan>
          `;
        });
    }, 1000);
  });
}

// Scroll observer (unique)
const observer4 = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !landChartDrawn) {
      drawLandChart();
      landChartDrawn = true;
      obs.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.5
});

observer4.observe(document.querySelector("#pie_4"));
