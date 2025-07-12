const waterChartWidth = 390;
const waterChartHeight = 400;
const waterChartRadius = Math.min(waterChartWidth, waterChartHeight) / 2;
let waterChartDrawn = false;

function drawWaterChart() {
  const svgRoot = d3.select("#svg3")
    .attr("width", waterChartWidth)
    .attr("height", waterChartHeight)
    .style("overflow", "visible"); 
  const svg = svgRoot.append("g")
    .attr("transform", `translate(${waterChartWidth / 2}, ${waterChartHeight / 2})`);

  const color = d3.scaleOrdinal()
    .domain(["Agricultural water withdrawal", "Industrial water withdrawal", "Municipal water withdrawal"])
    .range(["#5465ff", "#9bb1ff", "#bfd7ff"]);

  d3.csv("final_data/filtered_water_agrovoc.csv").then(data => {
    data.forEach(d => d.Value = +d.Value);

    const pie = d3.pie()
      .value(d => d.Value)
      .padAngle(0.03);

    const arc = d3.arc()
      .innerRadius(20)
      .outerRadius(waterChartRadius)
      .cornerRadius(8);

    const arcs = svg.selectAll("g.arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("fill", d => color(d.data.Variable))
      .attr("stroke", "#333")
      .attr("stroke-width", 1.2)
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });

    svg.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 10)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#333");

    svg.append("path")
      .attr("class", "arrow-path")
      .attr("d", "M15,-60 C40,-80 200,-100 290, 50")
      .attr("fill", "none")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)")
      .attr("transform", `translate(${waterChartRadius}, 0)`);

    svg.append("text")
      .attr("x", waterChartRadius + 250)
      .attr("y", 115)
      .attr("text-anchor", "start")
      .style("font-size", "32px")
      .style("font-family", "caveat")
      .style("font-weight", "bold")
      .text("2.85 quadrillion liters per year");

    svg.append("text")
      .attr("x", waterChartRadius + 250)
      .attr("y", 150)
      .attr("class", "arrow-path")
      .attr("text-anchor", "start")
      .style("font-size", "16px")
      .style("fill", "#333")
      .text("just for the agricultural sector");
      

    setTimeout(() => {
      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "black")
        .html(function(d) {
          const fullLabel = d.data.Variable;
          const firstWord = fullLabel.split(" ")[0];
          const percent = Math.round(d.data.Value / d3.sum(data, d => d.Value) * 100) + "%";
          return `
            <tspan x="0" dy="-0.3em">${firstWord}</tspan>
            <tspan x="0" dy="1.5em">${percent}</tspan>
          `;
        });
    }, 1000);
  });
}

// animation! :)
window.addEventListener("DOMContentLoaded", () => {
  const pie3 = document.querySelector("#pie_3");
  if (pie3) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !waterChartDrawn) {
          drawWaterChart();
          waterChartDrawn = true;
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(pie3);
  }
});

//land use
const width4 = 390;
const height4 = 400;
const radius4 = Math.min(width4, height4) / 2;
let landChartDrawn = false;

function drawLandChart() {
  const svgRoot = d3.select("#svg4")
    .attr("width", width4)
    .attr("height", height4)
    .style("overflow", "visible"); 

  const svg = svgRoot.append("g")
    .attr("transform", `translate(${width4 / 2}, ${height4 / 2})`);

  const color = d3.scaleOrdinal()
    .domain(["land area", "agriculture", "forest land"])
    .range(["#4caf50", "#ffffb3", "#dda15e"]);

  d3.csv("final_data/filtered_landuse_agrovoc.csv").then(data => {
    data.forEach(d => d.Value = +d.Value);

    const pie = d3.pie()
      .value(d => d.Value)
      .padAngle(0.03);

    const arc = d3.arc()
      .innerRadius(20)
      .outerRadius(radius4)
      .cornerRadius(8);

    const arcs = svg.selectAll("g.arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs.append("path")
      .attr("fill", d => color(d.data.AGROVOC_label))
      .attr("stroke", "#333")
      .attr("stroke-width", 1.2)
      .transition()
      .duration(1000)
      .attrTween("d", function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return t => arc(i(t));
      });

    svg.append("defs")
      .append("marker")
      .attr("id", "arrow2")
      .attr("viewBox", "0 0 10 10")
      .attr("refX", 10)
      .attr("refY", 5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 L 10 5 L 0 10 z")
      .attr("fill", "#333");

    svg.append("path")
      .attr("class", "arrow-path")
      .attr("d", "M10,-50 C30,-80 150,-100 240,30")
      .attr("fill", "none")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow2)")
      .attr("transform", `translate(${radius4}, 0)`);

    svg.append("text")
        .attr("class", "arrow-path")
      .attr("x", radius4 + 200)
      .attr("y", 95)
      .attr("text-anchor", "start")
      .style("font-size", "32px")
      .style("font-size", "32px")
      .style("font-family", "caveat")
      .style("font-weight", "bold")
      .text("49.8M ha");

    svg.append("text")
      .attr("x", radius4 + 200)
      .attr("y", 125)
      .attr("text-anchor", "start")
      .style("font-size", "16px")
      .style("fill", "#333")
      .text("total agricultural land");

    setTimeout(() => {
      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
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


const observer4 = new IntersectionObserver((entries, obs) => { // animation! 
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


//co2
function drawGroupedBarChart() {
  const container = document.querySelector("#emission_bar_chart").parentElement;
  const containerWidth = container.clientWidth;

  const margin = { top: 25, right: 85, bottom: 130, left: 80 },
        width = containerWidth - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  const svg = d3.select("#emission_bar_chart")
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

    const color = d3.scaleOrdinal()
    .domain(keys)
    .range(["#66C2A5", "#FC8D62", "#8DA0CB", "#E78AC3", "#A6D854", "#FFD92F", "#FFAF2F", "#E5C494", "#B3B3B3" ]);
    const stack = d3.stack().keys(keys);
    const stackedSeries = stack([foodBar]);

    svg.selectAll("*").remove();

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0).tickPadding(10))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end")
      .style("font-size", "15px");
      

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


      svg.selectAll(".other-bar-label")
      .data(otherBars)
      .enter()
      .append("text")
      .attr("class", "other-bar-label")
      .attr("x", d => x(d.label) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)  
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#333")
      .text(d => d.value.toFixed(1));


    drawZoomedFoodChart(foodEmissions, color, containerWidth);
    drawArrowToZoomedChart(x("Food Emissions"), width, margin);
  });
}

function drawArrowToZoomedChart(barX, chartWidth, margin) {
  const arrowSvg = d3.select("#arrow_svg");
  arrowSvg.selectAll("*").remove();

  const arrowX = barX + margin.left + 60;   
  const startY = -40;                       
  const endX = arrowX - 10;                
  const endY = 130;                         
  const controlX = arrowX - 100;            
  const controlY = 70;                     
  const pathData = `M${arrowX},${startY} Q${controlX},${controlY} ${endX},${endY}`;

  arrowSvg
    .attr("viewBox", `0 0 ${chartWidth} 160`)
    .style("overflow", "visible");

  arrowSvg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", 10)
    .attr("refY", 5)
    .attr("markerWidth", 4)
    .attr("markerHeight", 4)
    .attr("orient", "auto")
    .style("background-color", "transparent")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 ")
    .attr("fill", "#333");

  arrowSvg.append("path")
    .attr("d", pathData)
    .attr("fill", "none")
    .attr("stroke", "#333")
    .attr("stroke-width", 1.5)
    .attr("marker-end", "url(#arrowhead)");
}


function drawZoomedFoodChart(foodData, colorScale, containerWidth) {
  const svgZoom = d3.select("#food_zoom_chart");
  svgZoom.selectAll("*").remove();

  const margin = { top: -150, right: 40, bottom: 150, left: 100 };
  const width = containerWidth - margin.left - margin.right;

  const data = Object.entries(foodData).map(([key, val]) => ({
    key,
    value: val
  }));

  const barHeight = 40;
  const barPadding = 20;
  const chartHeight = data.length * (barHeight + barPadding);

  svgZoom
    .attr("viewBox", `0 0 ${containerWidth} ${chartHeight + margin.top + margin.bottom}`)
    .style("overflow", "visible");

  const g = svgZoom.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
    .domain(data.map(d => d.key))
    .range([0, chartHeight])
    .padding(0.2);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .nice()
    .range([0, width]);

  g.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", d => y(d.key))
    .attr("width", d => x(d.value))
    .attr("height", y.bandwidth())
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
    .attr("y", d => y(d.key) + y.bandwidth() / 2)
    .attr("alignment-baseline", "middle")
    .style("font-size", "15px")
    .text(d => `${d.key}: ${Math.round(d.value).toLocaleString()}`);


  g.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(d3.axisBottom(x).ticks(5))
    .selectAll("text")
    .style("font-size", "16px");

  svgZoom.append("text")
    .attr("x", margin.left + width / 2)
    .attr("y", chartHeight + margin.top + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Environmental Impact");

  const total = d3.sum(data, d => d.value);
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

observer.observe(document.querySelector("#emission_bar_chart"));


//italy
//top food items
function drawPopularityChart(data) {
  const marginPOP = { top: 40, right: 40, bottom: 90, left: 80 };
  const fullWidthPOP = 1000;
  const fullHeightPOP = 500;
  const widthPOP = fullWidthPOP - marginPOP.left - marginPOP.right;
  const heightPOP = fullHeightPOP - marginPOP.top - marginPOP.bottom;

  d3.select("#chartPopularity").selectAll("*").remove();

  const svg = d3.select("#chartPopularity")
    .append("svg")
    .attr("viewBox", `0 0 ${fullWidthPOP} ${fullHeightPOP}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${marginPOP.left},${marginPOP.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d.AGROVOC_label))
    .range([0, widthPOP])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Mean_consumption_italy)])
    .nice()
    .range([heightPOP, 0]);

  svg.append("g")
    .attr("transform", `translate(0,${heightPOP})`)
    .call(d3.axisBottom(x).tickFormat(label => 
      label.length > 12 ? label.slice(0, 12) + "…" : label
    ))
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .style("text-anchor", "end")
    .style("font-size", "13px");

  svg.append("g")
    .call(d3.axisLeft(y).ticks(6));

  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d.AGROVOC_label))
    .attr("y", d => y(d.Mean_consumption_italy))
    .attr("width", x.bandwidth())
    .attr("height", d => heightPOP - y(d.Mean_consumption_italy))
    .attr("fill", "#FC8D62")
    .attr("stroke", "#333")
    .attr("stroke-width", 1.2)
    .attr("rx", 6)
    .attr("ry", 6);

  svg.selectAll("text.bar-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "bar-label")
    .attr("x", d => x(d.AGROVOC_label) + x.bandwidth() / 2)
    .attr("y", d => y(d.Mean_consumption_italy) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .style("fill", "#000")
    .text(d => d.Mean_consumption_italy.toFixed(1));

  svg.append("text")
    .attr("x", -heightPOP / 2)
    .attr("y", -50)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .text("Mean Daily Consumption (g or mL)");
}

document.addEventListener("DOMContentLoaded", () => {
  d3.csv("final_data/italy_food_data.csv", d3.autoType).then(data => {
    const filtered = data
      .filter(d => d.AGROVOC_label && d["Mean_consumption_italy_(g/day)"] != null)
      .map(d => ({
        AGROVOC_label: d.AGROVOC_label,
        Mean_consumption_italy: d["Mean_consumption_italy_(g/day)"]
      }));
    drawPopularityChart(filtered);
  });
});



//food items emissions+water
const margin = { top: 40, right: 40, bottom: 90, left: 80 };
const fullWidth = 1000;
const fullHeight = 400;
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

let rawData;


function drawChart(theme) {
  d3.select("#chartSix").selectAll("*").remove();

  const svg = d3.select("#chartSix")
    .append("svg")
    .attr("width", fullWidth)
    .attr("height", fullHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const valueKey = theme === "water"
    ? "Water Footprint liters (water/kg o liter)"
    : "Carbon Footprint (g CO2eq/g o cc)";

  const x = d3.scaleBand()
    .domain(rawData.map(d => d["AGROVOC_label"]))
    .range([0, width])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d[valueKey] || 0)])
    .nice()
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .style("text-anchor", "end")
    .style("font-size", "15.5px");

  svg.append("g").call(d3.axisLeft(y));

  svg.selectAll("rect")
    .data(rawData)
    .enter()
    .append("rect")
    .attr("x", d => x(d["AGROVOC_label"]))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d[valueKey] || 0))
    .attr("height", d => height - y(d[valueKey] || 0))
    .attr("fill", theme === "co2" ? "#FFD92F" : "#5465FF")
    .attr("stroke", "#333")
    .attr("stroke-width", 1.2)
    .attr("rx", 8)
    .attr("ry", 8);

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", -70)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(theme === "co2" ? "g CO₂-eq per g or mL of Food" : "Liters per kg or L of Food");
  
  svg.selectAll("text.value-label")
  .data(rawData)
  .enter()
  .append("text")
  .attr("class", "value-label")
  .attr("x", d => x(d["AGROVOC_label"]) + x.bandwidth() / 2)
  .attr("y", d => y(d[valueKey] || 0) - 5)
  .attr("text-anchor", "middle")
  .style("font-size", "15px")
  .style("fill", "#333")
  .text(d => d[valueKey].toFixed(1))
;
}

d3.csv("final_data/italy_food_data.csv", d3.autoType).then(data => {
  rawData = data.filter(d => d["AGROVOC_label"]);
  drawChart("co2");

  d3.select("#theme").on("change", function () {
    const selected = this.value;
    drawChart(selected);
  });
});


//alternatives chart

document.addEventListener("DOMContentLoaded", function () {
  const chartSeven_items = [
    "cow milk", "soy milk", "chocolate", "bananas",
    "coffee", "orange juice", "beef", "salmon"
  ];

  const chartSeven_svg = d3.select("#chartSeven")
    .attr("width", 1000)
    .attr("height", 580); 

  const margin = { top: 40, right: 45, bottom: 90, left: 85 };
  const width = 1000 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const colorEven = "#FC8D62";
  const colorOdd = "#b8e6b0";

  let chartSeven_data = [];

  d3.json("final_data/game_data.json").then(data => {
    chartSeven_data = chartSeven_items.map(item => {
      if (data[item]) {
        return {
          name: item,
          water: data[item].water,
          co2: data[item].carbon
        };
      } else {
        console.warn(`"${item}" not found`);
        return null;
      }
    }).filter(d => d !== null);

    drawChartSeven("co2");

    d3.select("#theme-seven").on("change", function () {
      drawChartSeven(this.value);
    });
  });

  function drawChartSeven(theme) {
    chartSeven_svg.selectAll("*").remove();

    const chart = chartSeven_svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const valueKey = theme === "water" ? "water" : "co2";
    const yLabel = theme === "water" ? "Liters per kg or L of Food" : "g CO₂-eq per g or mL of Food";

    const x = d3.scaleBand()
      .domain(chartSeven_data.map(d => d.name))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(chartSeven_data, d => d[valueKey])])
      .nice()
      .range([height, 0]);

    chart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .attr("text-anchor", "end")
      .attr("dx", "-0.6em")
      .attr("dy", "0.3em")
      .style("font-size", "15px");

    chart.append("g").call(d3.axisLeft(y));

    chart.selectAll("rect")
      .data(chartSeven_data)
      .enter()
      .append("rect")
      .attr("x", d => x(d.name))
      .attr("y", height)
      .attr("width", x.bandwidth())
      .attr("height", 0)
      .attr("fill", (d, i) => i % 2 === 0 ? colorEven : colorOdd)
      .attr("stroke", "#333")
      .attr("stroke-width", 1.2)
      .attr("rx", 6)
      .attr("ry", 6)
      
      .transition()
      .duration(800)
      .attr("y", d => y(d[valueKey]))
      .attr("height", d => height - y(d[valueKey]));

    chart.selectAll("text.value-label")
      .data(chartSeven_data)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d[valueKey]) - 6)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .style("fill", "#333")
      .text(d => d[valueKey].toFixed(1));

    chart.append("text")
      .attr("x", -height / 2)
      .attr("y", -60)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .text(yLabel);

    const legend = chartSeven_svg.append("g")
      .attr("transform", `translate(${width - 80}, 20)`);

    legend.append("rect")
      .attr("x", 47)
      .attr("y", 0)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", colorEven)
      .attr("stroke", "#333")
      .attr("rx", 4)   
      .attr("ry", 4)
      .style("border-radious","8px");

    legend.append("text")
      .attr("x", 70)
      .attr("y", 12)
      .text("Popular food")
      .style("font-size", "14px");

    legend.append("rect")
      .attr("x", 47)
      .attr("y", 25)
      .attr("width", 16)
      .attr("height", 16)
      .attr("fill", colorOdd)
      .attr("stroke", "#333")
      .attr("rx", 4)   
      .attr("ry", 4); 

    legend.append("text")
      .attr("x", 70)
      .attr("y", 38)
      .text("Alternative")
      .style("font-size", "14px");
  }
});

//scatter plot
document.addEventListener("DOMContentLoaded", function () {
    const svg = d3.select("#chartEight");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 40, right: 40, bottom: 50, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const tooltip = d3.select(".tooltip");

    let data = [];

    d3.json("final_data/game_data.json").then(rawData => {
      data = Object.keys(rawData).map(item => {
        return {
          name: item,
          water: rawData[item].water,
          co2: rawData[item].carbon,
          price: rawData[item].cost
        };
      }).filter(d => d.water != null && d.co2 != null && d.price != null);

      drawScatter("co2");

      d3.select("#theme-eight").on("change", function () {
        drawScatter(this.value);
      });
    });

    function drawScatter(theme) {
      svg.selectAll("*").remove();

      const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const xKey = theme === "water" ? "water" : "co2";
      const xLabel = theme === "water" ? "Liters per kg or L of Food" : "g CO₂-eq per g or mL of Food";

      const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d[xKey]) || 0])
        .nice()
        .range([0, innerWidth]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.price) || 0])
        .nice()
        .range([innerHeight, 0]);

      g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x));

      g.append("g")
        .call(d3.axisLeft(y));

      // Axes labels
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text(xLabel);

      g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -innerHeight / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Price (€ per kg or L)");

      // Dots
      g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d[xKey]))
        .attr("cy", d => y(d.price))
        .attr("r", 7)
        .attr("fill", "#66C2A5")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.2)
     
      }
    });

//meal game
fetch('final_data/game_data.json')
  .then(res => res.json())
  .then(data => {
    const mealOrder = [
      "First courses",
      "Extras",
      "Second courses",
      "Side dishes",
      "Drinks",
      "Desserts & Fruits"
    ];

    const mealTypePositions = {
      "First courses":     { x: 48, y: 60, size: 150 },
      "Extras":            { x: 10, y: 10, size: 78 },
      "Second courses":    { x: 77, y: 17, size: 100 },
      "Side dishes":       { x: 85, y: 24, size: 85},
      "Drinks":            { x: 30, y: 10, size: 60 },
      "Desserts & Fruits": { x: 13, y: 33, size: 80 }
    };

    const optionsDiv = document.getElementById('ingredient-options');
    const grouped = {};

    Object.entries(data).forEach(([key, val]) => {
      if (!grouped[val.meal_type]) grouped[val.meal_type] = {};
      grouped[val.meal_type][key] = val;
    });

    const groupWrapper = document.createElement('div');
    groupWrapper.className = 'group-wrapper';
    optionsDiv.appendChild(groupWrapper);

    mealOrder.forEach(meal_type => {
      const items = grouped[meal_type];
      if (!items) return;

      const groupDiv = document.createElement('div');
      groupDiv.className = 'food-group';
      groupDiv.innerHTML = `<h3>${meal_type}</h3>`;

      Object.keys(items).forEach(ingredient => {
        const label = document.createElement('label');
        label.className = 'ingredient';
        label.innerHTML = `
          <input type="radio" name="${meal_type}" value="${ingredient}">
          ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
        `;
        groupDiv.appendChild(label);
      });

      groupWrapper.appendChild(groupDiv);
    });

    optionsDiv.addEventListener('change', () => updatePlate(data, mealTypePositions));
    document.getElementById('confirm-btn').addEventListener('click', () => {
      showResults(data);
    });
  });

function updatePlate(data, mealTypePositions) {
  const selected = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
    .map(cb => ({ name: cb.value, meal_type: cb.name }));

  const imageDiv = document.getElementById('ingredient-images');
  imageDiv.innerHTML = '';

  selected.forEach(({ name, meal_type }) => {
    const info = data[name];
    const config = mealTypePositions[meal_type];
    if (!info || !config) return;

    const { x, y, size } = config;

    const img = document.createElement('img');
    img.src = info.image;
    img.alt = name;
    img.style.left = `${x}%`;
    img.style.top = `${y}%`;
    img.style.width = `${size}px`;

    imageDiv.appendChild(img);
  });
}

function showResults(data) {
  const selected = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
    .map(cb => cb.value);

  if (selected.length === 0) return;

  let total = { co2: 0, water: 0, land: 0 };

  const breakdownDiv = document.getElementById('breakdown');
  breakdownDiv.innerHTML = '';

  selected.forEach(item => {
    const info = data[item];
    if (!info) return;

    total.co2 += info.co2;
    total.water += info.water;
    total.land += info.land;

    const div = document.createElement('div');
    div.className = 'breakdown-item';
    div.innerHTML = `
      <a href="${info.link}" target="_blank">${item.charAt(0).toUpperCase() + item.slice(1)}</a><br>
      CO₂: ${info.carbon.toFixed(2)} kg<br>
      Water: ${info.water.toLocaleString()} liters<br>
    `;
    breakdownDiv.appendChild(div);
  });

  document.getElementById('co2-value').textContent = total.co2.toFixed(2);
  document.getElementById('water-value').textContent = total.water.toLocaleString();
  document.getElementById('cost-value').textContent = total.land.toFixed(2);

  const resultsSection = document.getElementById('results-section');
  if (resultsSection) {
    resultsSection.classList.remove('hidden');
  }
}