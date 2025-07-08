const waterChartWidth = 400;
const waterChartHeight = 500;
const waterChartRadius = Math.min(waterChartWidth, waterChartHeight) / 2;
let waterChartDrawn = false;

function drawWaterChart() {
  const svg = d3.select("#svg3")
    .attr("width", waterChartWidth)
    .attr("height", waterChartHeight)
    .append("g")

    .attr("transform", `translate(${waterChartWidth / 2}, ${waterChartHeight / 2})`);


  // Custom color 
  const color = d3.scaleOrdinal()
    .domain(["Agricultural water withdrawal", "Industrial water withdrawal", "Municipal water withdrawal"])
    .range(["#5465ff", "#9bb1ff", "#bfd7ff"])
    
    ;

 
  d3.csv("site/final_data/filtered_water_agrovoc.csv").then(data => {
    data.forEach(d => d.Value = +d.Value);  
    const pie = d3.pie()
      .value(d => d.Value)
      .padAngle(0.03);

    const arc = d3.arc()
      .innerRadius(20)
      .outerRadius(waterChartRadius)
      .cornerRadius(8)
      ;

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

      svg.append("path")
        .attr("d", "M15,-60 C40,-80 200,-100 290, 50")  
        .attr("fill", "none")
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5)
        .attr("marker-end", "url(#arrow)")           
        .attr("transform", `translate(${waterChartRadius}, 0)`);

      d3.select("#svg3")
        .append("defs")
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

        svg.append("text")
        .attr("x", waterChartRadius + 250)
        .attr("y", 115)
        .attr("text-anchor", "start")
        .style("font-size", "20px")
        .style("font-family", "sans-serif")
        .text("23.60B L");

        svg.append("text")
          .attr("x", waterChartRadius + 250)
          .attr("y", 150)
          .attr("text-anchor", "start")
          .style("font-size", "16px")
          .style("fill", "#333")
          .text("total agricultural water withdrawal");


    //  labels after animation
    setTimeout(() => {
      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "black")
        .html(function(d) {
  const fullLabel = d.data.Variable;
  const firstWord = fullLabel.split(" ")[0];  // 👈 Grab first word
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
const width4 = 500;
const height4 = 700;
const radius4 = Math.min(width4, height4) / 2;
let landChartDrawn = false;

function drawLandChart() {
  const svg = d3.select("#svg4")
    .attr("width", width4)
    .attr("height", height4)
    .append("g")
    .attr("transform", `translate(${width4 / 2}, ${height4 / 2})`);

  const color = d3.scaleOrdinal()
    .domain(["land area", "agriculture", "forest land"])
    .range(["#8dd3c7", "#ffffb3", "#bebada"]);

  d3.csv("site/final_data/filtered_landuse_agrovoc.csv").then(data => {
    data.forEach(d => d.Value = +d.Value);

    const pie = d3.pie().value(d => d.Value).padAngle(0.03);
    const arc = d3.arc().innerRadius(20).outerRadius(radius4).cornerRadius(8);

    const arcs = svg.selectAll("g")
      .data(pie(data))
      .enter()
      .append("g");

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


    d3.select("#svg4")
      .append("defs")
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
      .attr("d", "M10,-50 C30,-80 150,-100 240,30")
      .attr("fill", "none")
      .attr("stroke", "#333")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow2)")
      .attr("transform", `translate(${radius4}, 0)`);

    svg.append("text")
      .attr("x", radius4 + 200)
      .attr("y", 95)
      .attr("text-anchor", "start")
      .style("font-size", "32px")
      .style("font-family", "sans-serif")
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

  const margin = { top: 10, right: 85, bottom: 100, left: 80 },
        width = containerWidth - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

  const svg = d3.select("#emission_bar_chart")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  d3.csv("site/final_data/emissions_sectors_agrovoc.csv").then(data => {
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

    drawZoomedFoodChart(foodEmissions, color, containerWidth);
    drawArrowToZoomedChart(x("Food Emissions"), width, margin);
  });
}

function drawArrowToZoomedChart(barX, chartWidth, margin) {
  const arrowSvg = d3.select("#arrow_svg");
  arrowSvg.selectAll("*").remove();

  const arrowX = barX + margin.left + 60; 
  const startY = -60;
  const endY = 250;
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

  const margin = { top: 5, right: 0, bottom: 0, left: 0 };
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
const margipopularity = { top: 40, right: 20, bottom: 100, left: 80 };
const fullWidthPOP = 1580;
const fullHeightPOP = 650;
const widthPOP = fullWidthPOP - margipopularity.left - margipopularity.right;
const heightPOP = fullHeightPOP - margipopularity.top - margipopularity.bottom;

d3.csv("site/final_data/italy_food_data.csv", d3.autoType).then(data => {

  const cleanData = data.filter(d => d["Exposure hierarchy (L7)"] && d.Mean);

  drawBarChart(cleanData);
});

function drawBarChartPOP(data) {
  d3.select("#chartPopularity").selectAll("*").remove();

  const svg = d3.select("#chartPopularity")
    .append("svg")
    .attr("width", fullWidthPOP)
    .attr("height", fullHeightPOP)
    .append("g")
    .attr("transform", `translate(${margipopularity.left},${margipopularity.top})`);

  const x = d3.scaleBand()
    .domain(data.map(d => d["Exposure hierarchy (L7)"]))
    .range([0, widthPOP])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Mean)])
    .nice()
    .range([heightPOP, 0]);

  // X Axis
  svg.append("g")
    .attr("transform", `translate(0, ${heightPOP})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-40)")
    .style("text-anchor", "end")
    .style("font-size", "14px");

  // Y Axis
  svg.append("g").call(d3.axisLeft(y));

  // Bars
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", d => x(d["Exposure hierarchy (L7)"]))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.Mean))
    .attr("height", d => heightPOP - y(d.Mean))
    .attr("fill", "#5f9ea0")
    .attr("stroke", "#333")
    .attr("stroke-width", 1.2)
    .attr("rx", 8)
    .attr("ry", 8);

  // Y-axis label
  svg.append("text")
    .attr("x", -heightPOP / 2)
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Mean Value");

  // Value Labels
  svg.selectAll("text.value-label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "value-label")
    .attr("x", d => x(d["Exposure hierarchy (L7)"]) + x.bandwidth() / 2)
    .attr("y", d => y(d.Mean) - 5)
    .attr("text-anchor", "middle")
    .style("font-size", "13px")
    .style("fill", "#333")
    .text(d => d.Mean.toFixed(1));
}


//food items emissions+water
const margin = { top: 40, right: 20, bottom: 100, left: 80 };
const fullWidth = 1580;
const fullHeight = 650;
const width = fullWidth - margin.left - margin.right;
const height = fullHeight - margin.top - margin.bottom;

let rawData;

d3.csv("site/final_data/italy_food_data.csv", d3.autoType).then(data => {
  rawData = data.filter(d => d["AGROVOC_label"]);
  drawChart("co2");

  d3.select("#theme").on("change", function () {
    const selected = this.value;
    drawChart(selected);
  });
});

function drawChart(theme) {
  d3.select("#chartSix").selectAll("*").remove();

  const svg = d3.select("#chartSix")
    .append("svg")
    .attr("width", fullWidth)
    .attr("height", fullHeight)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const valueKey = theme === "water"
    ? "Carbon Footprint (g CO2eq/g o cc)"
    : "(Water Footprint liters) water/kg o liter";

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
    .attr("fill", theme === "co2" ? "#db4c3f" : "#1f77b4")
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
    .text(theme === "co2" ? "g CO₂ eq / g" : "Liters / kg");
  
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
  .text(d => d[valueKey]);
}




//meal game
fetch('site/final_data/game_data.json')
  .then(res => res.json())
  .then(data => {
    const optionsDiv = document.getElementById('ingredient-options');
    const grouped = {};

    // ingredients grouped by type
    Object.entries(data).forEach(([key, val]) => {
      if (!grouped[val.type]) grouped[val.type] = {};
      grouped[val.type][key] = val;
    });

    // become checkboxes
    Object.entries(grouped).forEach(([type, items]) => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'food-group';
      groupDiv.innerHTML = `<h3>${type.charAt(0).toUpperCase() + type.slice(1)}</h3>`;
      Object.keys(items).forEach(ingredient => {
        const label = document.createElement('label');
        label.className = 'ingredient';
        label.innerHTML = `
          <input type="radio" value="${ingredient}"> 
          ${ingredient.charAt(0).toUpperCase() + ingredient.slice(1)}
        `;
        groupDiv.appendChild(label);
      });
      optionsDiv.appendChild(groupDiv);
    });

    optionsDiv.addEventListener('change', () => updatePlate(data));

    document.getElementById('confirm-btn').addEventListener('click', () => {
      showResults(data);
    });
  });

function updatePlate(data) {
  const selected = Array.from(document.querySelectorAll('input[type="radio"]:checked'))
    .map(cb => cb.value);

  const imageDiv = document.getElementById('ingredient-images');
  imageDiv.innerHTML = '';

  selected.forEach((item, index) => {
    const info = data[item];
    const img = document.createElement('img');
    img.src = info.image;
    img.alt = item;

    const angle = (index / selected.length) * 360;
    const radius = 80;
    const rad = angle * (Math.PI / 180);
    const x = 50 + radius * Math.cos(rad);
    const y = 50 + radius * Math.sin(rad);
    img.style.left = `${x}%`;
    img.style.top = `${y}%`;

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
      Cost: ${info.cost.toFixed(2)} m²
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
