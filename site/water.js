const waterChartWidth = 500;
const waterChartHeight = 700;
const waterChartRadius = Math.min(waterChartWidth, waterChartHeight) / 2;
let waterChartDrawn = false;

function drawWaterChart() {
  const svg = d3.select("#svg3")
    .attr("width", waterChartWidth)
    .attr("height", waterChartHeight)
    .append("g")

    .attr("transform", `translate(${waterChartWidth / 2}, ${waterChartHeight / 2})`);

  // Chart Title
  d3.select("#svg3")
    .append("text")
    .attr("x", waterChartWidth / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    
    .style("font-weight", "bold")
    .text("Agriculture leads global water withdrawal");

  // Custom color 
  const color = d3.scaleOrdinal()
    .domain(["Agricultural water withdrawal", "Industrial water withdrawal", "Municipal water withdrawal"])
    .range(["#5465ff", "#9bb1ff", "#bfd7ff"])
    
    ;

 
  d3.csv("final_data/filtered_water_agrovoc.csv").then(data => {
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

    //  labels after animation
    setTimeout(() => {
      arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "black")
        .html(function(d) {
          const label = d.data.Variable;
          const percent = Math.round(d.data.Value / d3.sum(data, d => d.Value) * 100) + "%";
          return `
            <tspan x="0" dy="-0.3em" >${label}</tspan>
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

//meal game
fetch('data.json')
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
          <input type="checkbox" value="${ingredient}"> 
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
  const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  const imageDiv = document.getElementById('ingredient-images');
  imageDiv.innerHTML = '';

  selected.forEach((item, index) => {
    const info = data[item];
    const img = document.createElement('img');
    img.src = info.image;
    img.alt = item;

    // position
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
  const selected = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
    .map(cb => cb.value);

  if (selected.length === 0) return;

  let total = { co2: 0, water: 0, land: 0 };

  const breakdownDiv = document.getElementById('breakdown');
  breakdownDiv.innerHTML = '';

  selected.forEach(item => {
    const info = data[item];
    total.co2 += info.co2;
    total.water += info.water;
    total.land += info.land;

    const div = document.createElement('div');
    div.className = 'breakdown-item';
    div.innerHTML = `
      <a href="${info.link}" target="_blank">${item.charAt(0).toUpperCase() + item.slice(1)}</a><br>
      CO₂: ${info.co2.toFixed(2)} kg<br>
      Water: ${info.water.toLocaleString()} liters<br>
      Land: ${info.land.toFixed(2)} m²
    `;
    breakdownDiv.appendChild(div);
  });

  document.getElementById('co2-value').textContent = total.co2.toFixed(2);
  document.getElementById('water-value').textContent = total.water.toLocaleString();
  document.getElementById('land-value').textContent = total.land.toFixed(2);

  document.getElementById('results-section').classList.remove('hidden');
}
