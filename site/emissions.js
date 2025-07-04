const margin = { top: 10, right: 5, bottom: 100, left: 80 },
      width = 1450 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

const svg = d3.select("#emission-bar-chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

function drawGroupedBarChart() {
  d3.csv("final_data/emissions_sectors_agrovoc.csv").then(data => {
    data = data.filter(d => d.Item && d.Value);
    data.forEach(d => d.Value = +d.Value);

    const otherBars = [];
    const foodEmissions = {};

    // Separate food vs other
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
      .domain([
        0,
        d3.max(allData, d => keys.reduce((sum, k) => sum + (d[k] || 0), 0) || d.value)
      ])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

    svg.selectAll("*").remove();

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "15px");

    svg.append("g").call(d3.axisLeft(y));

    const stack = d3.stack().keys(keys);
    const stackedSeries = stack([foodBar]);

    // Draw stacked food bar
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
      .attr("rx", 3)
      .attr("ry", 3);

    // Draw "Other" bars
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
      .attr("rx", 3)
      .attr("ry", 3);
  });
}

// Trigger on scroll
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

observer.observe(document.querySelector("#emission-chart-container"));

