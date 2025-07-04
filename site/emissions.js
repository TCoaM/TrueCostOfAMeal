const margin = { top: 40, right: 30, bottom: 100, left: 80 },
      width = 900 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

const svg = d3.select("#emission-bar-chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

function drawGroupedBarChart() {
  d3.csv("final_data/emissions_sectors_agrovoc.csv").then(data => {
    data = data.filter(d => d.Item && d.Value);
    data.forEach(d => d.Value = +d.Value);


    const grouped = [];
    const stackGroups = new Map();

    data.forEach(d => {
      const category = d.Category || "Other";
      if (category === "Other") {
        grouped.push({
          label: d.Item,
          [d.Item]: d.Value
        });
      } else {
        if (!stackGroups.has("Food Emissions")) {
          stackGroups.set("Food Emissions", {});
        }
        stackGroups.get("Food Emissions")[d.Item] = d.Value;
      }
    });

    // Add Food Emissions stack
    const foodGroup = stackGroups.get("Food Emissions");
    grouped.unshift({ label: "Food Emissions", ...foodGroup });

    const stackKeys = new Set();
    grouped.forEach(g => {
      Object.keys(g).forEach(k => {
        if (k !== "label") stackKeys.add(k);
      });
    });

    const keys = Array.from(stackKeys);
    const x = d3.scaleBand()
      .domain(grouped.map(d => d.label))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(grouped, d => keys.reduce((sum, k) => sum + (d[k] || 0), 0))])
      .nice()
      .range([height, 0]);

    const color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    svg.append("g").call(d3.axisLeft(y));

    const stack = d3.stack().keys(keys);
    const series = stack(grouped);

    svg.selectAll("g.layer")
      .data(series)
      .join("g")
      .attr("fill", d => color(d.key))
      .selectAll("rect")
      .data(d => d)
      .join("rect")
      .attr("x", d => x(d.data.label))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .transition()
      .duration(1000)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]));

    // Add legend
    
  });
}

// Scroll detection
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
