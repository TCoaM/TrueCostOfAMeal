function drawGroupedBarChart() {
  const container = document.querySelector("#emission-bar-chart").parentElement;
  const containerWidth = container.clientWidth;

  const margin = { top: 10, right: 85, bottom: 100, left: 80 },
        width = containerWidth - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

  const svg = d3.select("#emission-bar-chart")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  d3.csv("final_data/emissions_sectors_agrovoc.csv").then(data => {
    data = data.filter(d => d.Item && d.Value);
    data.forEach(d => d.Value = +d.Value);

    const otherBars = [];
    const foodEmissions = {};

    data.forEach(d => {
      const cat = d.Category || "Other";
      if (cat === "Other") {
        otherBars.push({ label: d.Item, key: d.Item, value: d.Value, isOther: true });
      } else {
        if (!foodEmissions[d.Item]) foodEmissions[d.Item] = 0;
        foodEmissions[d.Item] += d.Value;
      }
    });

    const foodBar = { label: "Food Emissions" };
    Object.entries(foodEmissions).forEach(([key, val]) => foodBar[key] = val);

    const allData = [foodBar, ...otherBars];
    const keys = Object.keys(foodEmissions);

    const x = d3.scaleBand()
      .domain(allData.map(d => d.label))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(allData, d => keys.reduce((sum, k) => sum + (d[k] || 0), 0) || d.value)])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

    const stack = d3.stack().keys(keys);
    const stackedSeries = stack([foodBar]);

    svg.selectAll("*").remove();

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "14px");

    svg.append("g").call(d3.axisLeft(y));

    svg.selectAll(".stack")
      .data(stackedSeries)
      .enter()
      .append("rect")
      .attr("class", "stack")
      .attr("x", d => x("Food Emissions"))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d[0][1]))
      .attr("height", d => y(d[0][0]) - y(d[0][1]))
      .attr("fill", d => color(d.key))
      .attr("stroke", "#333")
      .attr("stroke-width", 1.2)
      .attr("rx", 4)
      .attr("ry", 4);

    svg.selectAll(".other-bar")
      .data(otherBars)
      .enter()
      .append("rect")
      .attr("class", "other-bar")
      .attr("x", d => x(d.label))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value))
      .attr("fill", "transparent")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.2)
      .attr("rx", 4)
      .attr("ry", 4);

    drawZoomedFoodChart(foodEmissions, color, containerWidth);
    drawArrowToZoomedChart(x("Food Emissions"), width, margin);
  });
}

function drawArrowToZoomedChart(barX, chartWidth, margin) {
  const arrowSvg = d3.select("#arrow-svg");
  arrowSvg.selectAll("*").remove();

  const arrowX = barX + margin.left + 20; 
  const startY = 0;
  const endY = 140;
  const controlY = 120;

  const pathData = `M${arrowX},${startY} Q${arrowX},${controlY} ${arrowX},${endY}`;

  arrowSvg
    .attr("viewBox", `0 0 ${chartWidth} 160`)
    .style("overflow", "visible");

  arrowSvg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 10)
    .attr("refY", 5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    .attr("fill", "#333");

  arrowSvg.append("path")
    .attr("d", pathData)
    .attr("fill", "none")
    .attr("stroke", "#333")
    .attr("stroke-width", 1.5)
    .attr("marker-end", "url(#arrowhead)");
}

function drawZoomedFoodChart(foodData, colorScale, containerWidth) {
  const svgZoom = d3.select("#food-zoom-chart");
  svgZoom.selectAll("*").remove();

  const margin = { top: 40, right: 280, bottom: 40, left: 100 };
  const width = containerWidth - margin.left - margin.right;

  const data = Object.entries(foodData).map(([key, val]) => ({
    key,
    value: val
  }));

  const barHeight = 40;
  const barPadding = 20;
  const chartHeight = data.length * (barHeight + barPadding);

  svgZoom.attr("viewBox", `0 0 ${containerWidth} ${chartHeight + margin.top + margin.bottom + 80}`);

  const g = svgZoom.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
    .domain(data.map(d => d.key))
    .range([0, chartHeight])
    .padding(0.2);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([0, width]);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", d => y(d.key))
    .attr("width", d => x(d.value))
    .attr("height", barHeight)
    .attr("fill", d => colorScale(d.key))
    .attr("stroke", "#333")
    .attr("stroke-width", 1.2)
    .attr("rx", 8)
    .attr("ry", 8);

  g.selectAll("text.label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", d => x(d.value) + 10)
    .attr("y", d => y(d.key) + barHeight / 2)
    .attr("alignment-baseline", "middle")
    .style("font-size", "16px")
    .text(d => `${d.key}: ${Math.round(d.value).toLocaleString()}`);

  const total = d3.sum(data, d => d.value);
  svgZoom.append("text")
    .attr("x", width / 2 + margin.left)
    .attr("y", chartHeight + margin.top + 60)
    .attr("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(`${Math.round(total).toLocaleString()} total food emissions`);
}

let chartDrawn = false;
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !chartDrawn) {
      drawGroupedBarChart();
      chartDrawn = true;
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector("#emission-bar-chart"));
