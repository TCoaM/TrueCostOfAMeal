
let data = {}; // Initialize data object

// Fetch the JSON data from the external URL
fetch("https://raw.githubusercontent.com/TCoaM/TrueCostOfAMeal/refs/heads/main/final_data/game_data.json")
  .then(res => res.json())
  .then(json => {
    data = json; // Assign fetched JSON to the data object
    displayMenuCategories(); // Call function to generate menu categories and items
  })
  .catch(error => console.error("Error loading JSON data:", error)); // Log any errors

function openModalBtn(btn) {
  const key = btn.getAttribute("data-value");
  const entry = data[key];

  if (entry) {
    // Capitalize first letter of key for display
    const displayName = key.charAt(0).toUpperCase() + key.slice(1);
    document.getElementById("modalTitle").textContent = displayName;

    // Use a placeholder image if entry.image is empty or null
  
    const waterm3 = (parseFloat(entry.water) / 1000).toFixed(2);
    const carbon = parseFloat(entry.carbon).toFixed(2) || 0;
    const water = parseFloat(entry.water).toFixed(2) || 0;
    const cost = parseFloat(entry.cost).toFixed(2) || 0;


    document.getElementById("modalDescription").innerHTML = `
      <div style="background-color: rgba(236, 238, 206, 1)!important ; padding: 1em; border-radius: 8px;">
        <span style="display: inline-block; margin-bottom: 0.5em; background-color: rgba(236, 238, 206, 1)!important">Agrovoc URI: ${entry.AGROVOC_uri || "Data not available"}</span><br>
        <span style="display: inline-block; margin-bottom: 0.5em; background-color: rgba(236, 238, 206, 1)!important">Type: ${entry.type || "Data not available"}</span><br>
        <span style="display: inline-block; margin-bottom: 0.5em; background-color: rgba(236, 238, 206, 1)!important">
          Consumption: ${entry.consumption || "Data not available"} (g or mL/day)
        </span><br>
        <span style="display: inline-block; margin-bottom: 0.5em; background-color: rgba(236, 238, 206, 1)!important">
          Carbon: ${carbon || "Data not available"} (g CO₂eq/g or mL)
        </span><br>
        <span style="display: inline-block; margin-bottom: 0.5em; background-color: rgba(236, 238, 206, 1)!important">
          Water: ${waterm3 || "Data not available"} (m³/kg or L)
        </span><br>
        <span style="display: inline-block; margin-bottom: 0.5em; background-color: rgba(236, 238, 206, 1)!important">
          Cost: ${cost || "Data not available"} (€/kg or L)
        </span>
      </div>
    `;




    document.getElementById("modal").style.display = "block";

    

   

    drawRadarChart(carbon, waterm3, cost);

  } else {
    document.getElementById("modalTitle").textContent = "Not found";
    document.getElementById("modalDescription").textContent = `No data for ${key}`;
    document.getElementById("modal").style.display = "block";
  }
}


function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function displayMenuCategories() {
  const menuContentDiv = document.getElementById("menuContent");
  menuContentDiv.innerHTML = ""; // Clear previous content

  // Group items by their exact type from the JSON
  const groupedData = Object.keys(data).reduce((acc, key) => {
    const entry = data[key];
    // Use "Unknown" or a similar string for items where type is "NaN" or missing
    const meal_type = entry.meal_type && entry.meal_type !== "NaN" ? entry.meal_type : "Unknown"; 
    
    if (!acc[meal_type]) {
      acc[meal_type] = [];
    }
    acc[meal_type].push({ key: key, ...entry });
    return acc;
  }, {});

  // Get unique categories and sort them alphabetically
  const categories = Object.keys(groupedData).sort();

  // Add categories and their items to the page
  categories.forEach((category, index) => {
    if (groupedData[category] && groupedData[category].length > 0) {
      // Add category heading
      const categoryHeading = document.createElement("h3");
      categoryHeading.className = "category-heading";
      // Capitalize the first letter of the category name for display
      categoryHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(); 
      menuContentDiv.appendChild(categoryHeading);

      // Create a grid container for items in this category
      const foodGrid = document.createElement("div");
      foodGrid.className = "food-grid";

      // Sort items within the category alphabetically by key for consistent display
      groupedData[category].sort((a, b) => a.key.localeCompare(b.key));

      // Append food buttons for this category
      groupedData[category].forEach(item => {
        const foodBtn = document.createElement("div");
        foodBtn.className = "foodBtn";
        foodBtn.setAttribute("data-value", item.key);
        foodBtn.onclick = function() { openModalBtn(this); };

        const imageUrl = item.imageButton;
        const displayName = item.key.charAt(0).toUpperCase() + item.key.slice(1);

        foodBtn.innerHTML = `
          <div class="food-img-cont">
          <img src="${imageUrl}" alt="${item.key}" class="food-img">
          <div>
          <p class="food-name">${displayName}</p>
        `;
        foodGrid.appendChild(foodBtn);
      });
      menuContentDiv.appendChild(foodGrid);

      // Add a separator after each category except the last one
      if (index < categories.length - 1) {
          const separator = document.createElement("hr");
          separator.className = "category-separator";
          menuContentDiv.appendChild(separator);
      }
    }
  });
}



let radarChartInstance = null;

function drawRadarChart(carbon, water, cost) {
  const ctx = document.getElementById("impactRadarChart").getContext("2d");

  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(ctx, {
    type: "radar",
    data: {
      labels: [
        "Carbon (g CO₂eq/g)",
        "Water (m³/kg)",
        "Cost (€/kg)"
      ],
      datasets: [{
        label: "Impact",
        data: [
          parseFloat(carbon).toFixed(2),
          parseFloat(water).toFixed(2),  // convert L to hL
          parseFloat(cost).toFixed(2)
        ],
        backgroundColor: "rgb(255, 211, 33, 0.3)",
        borderColor: "rgb(255, 211, 33, 1)",
        pointBackgroundColor: "rgb(255, 211, 33, 1)",
        pointRadius: 4,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          suggestedMax: Math.max(carbon, water / 100, cost) * 1.2,
          ticks: {
            display: false // Hides circular grid numbers
          },
          pointLabels: {
            font: {
              size: 14,
              
            },
            callback: function(label, index) {
              // Keep only unit at the axis, rounded already
              return label;
            }
          },
          grid: {
            color: "rgba(150, 150, 150, 0.2)"
          },
          angleLines: {
            color: "rgba(150, 150, 150, 0.2)"
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.label}: ${context.formattedValue}`;
            }
          }
        }
      }
    }
  });
}



// Close modal when clicking outside of it
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
    closeModal();
  }
}
