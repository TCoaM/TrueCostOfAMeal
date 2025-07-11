
let data = {}; // Initialize data object

// Fetch the JSON data from the external URL
fetch("https://raw.githubusercontent.com/TCoaM/TrueCostOfAMeal/refs/heads/main/final_data/game_data.json")
  .then(res => res.json())
  .then(json => {
    data = json; // Assign fetched JSON to the data object
    displayMenuCategories(); // Call function to generate menu categories and items
  })
  .catch(error => console.error('Error loading JSON data:', error)); // Log any errors

function openModalBtn(btn) {
  const key = btn.getAttribute("data-value");
  const entry = data[key];

  if (entry) {
    // Capitalize first letter of key for display
    const displayName = key.charAt(0).toUpperCase() + key.slice(1);
    document.getElementById("modalTitle").textContent = displayName;
    // Use a placeholder image if entry.image is empty or null
    const imageUrlplate = entry.imageButton;
    document.getElementById("modalImg").src = imageUrlplate;
    document.getElementById("modalImg").alt = key;
    document.getElementById("modalDescription").innerHTML = `
        <span style="background-color: rgba(236, 238, 206, 1)!important; font-weight: bold;">Agrovoc URI:</span> ${entry.AGROVOC_uri || 'Data not available'}<br>
        <span style="background-color: rgba(236, 238, 206, 1)!important; font-weight: bold;">Type:</span> ${entry.type || 'Data not available'}<br>
        <span style="background-color: rgba(236, 238, 206, 1)!important; font-weight: bold;">Consumption (g/day):</span> ${entry.consumption || 'Data not available'}<br>
        <span style="background-color: rgba(236, 238, 206, 1)!important; font-weight: bold;">Carbon (g CO₂eq/g):</span> ${entry.carbon || 'Data not available'}<br>
        <span style="background-color: rgba(236, 238, 206, 1)!important; font-weight: bold;">Water (L/kg):</span> ${entry.water || 'Data not available'}<br>
        <span style="background-color: rgba(236, 238, 206, 1)!important; font-weight: bold;">Cost (€/kg):</span> ${entry.cost || 'Data not available'}
      `;
    document.getElementById("modal").style.display = "block";
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
  const menuContentDiv = document.getElementById('menuContent');
  menuContentDiv.innerHTML = ''; // Clear previous content

  // Group items by their exact type from the JSON
  const groupedData = Object.keys(data).reduce((acc, key) => {
    const entry = data[key];
    // Use 'Unknown' or a similar string for items where type is 'NaN' or missing
    const meal_type = entry.meal_type && entry.meal_type !== "NaN" ? entry.meal_type : 'Unknown'; 
    
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
      const categoryHeading = document.createElement('h2');
      categoryHeading.className = 'category-heading';
      // Capitalize the first letter of the category name for display
      categoryHeading.textContent = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(); 
      menuContentDiv.appendChild(categoryHeading);

      // Create a grid container for items in this category
      const foodGrid = document.createElement('div');
      foodGrid.className = 'food-grid';

      // Sort items within the category alphabetically by key for consistent display
      groupedData[category].sort((a, b) => a.key.localeCompare(b.key));

      // Append food buttons for this category
      groupedData[category].forEach(item => {
        const foodBtn = document.createElement('div');
        foodBtn.className = 'foodBtn';
        foodBtn.setAttribute('data-value', item.key);
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
          const separator = document.createElement('hr');
          separator.className = 'category-separator';
          menuContentDiv.appendChild(separator);
      }
    }
  });
}

let radarChartInstance = null;

function drawRadarChart(carbon, water, cost) {
  const ctx = document.getElementById('impactRadarChart').getContext('2d');

  // Destroy previous chart instance to avoid duplicate overlays
  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Carbon (g CO₂eq/g)', 'Water (L/kg)', 'Cost (€/kg)'],
      datasets: [{
        label: 'Environmental Impact',
        data: [carbon, water, cost],
        backgroundColor:"rgba(236, 238, 206, 1)",
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: Math.max(carbon, water, cost) * 1.2 || 10,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
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
