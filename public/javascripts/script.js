const API_KEY = '43e58e1228d47fbbb15cb09ea569eede'; 

function fetchNutritionData() {
    const query = document.getElementById('query').value;
    fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': '34a63d0d', 
            'x-app-key': 
            '43e58e1228d47fbbb15cb09ea569eede',
        },
        body: JSON.stringify({ query: query }),
    })
    .then(response => response.json())
    .then(data => renderNutritionData(data.foods))
    .catch(error => console.error('Error fetching data:', error));
}

function renderNutritionData(foods) {
    const nutritionInfoContainer = document.getElementById('nutrition-info');
    nutritionInfoContainer.innerHTML = '';

    foods.forEach(food => {
        const foodElement = document.createElement('div');
        foodElement.className = 'p-4 lg:w-1/3';
        foodElement.innerHTML = `
            <div class="h-full bg-white bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative shadow-lg">
                <h2 class="text-xl font-medium text-gray-900 title-font mb-4">${food.food_name}</h2>
                <p class="leading-relaxed mb-6">${food.nf_calories} calories</p>
                <p class="leading-relaxed mb-6">Protein: ${food.nf_protein}g, Fat: ${food.nf_total_fat}g, Carbs: ${food.nf_total_carbohydrate}g</p>
                <a href="#" class="text-green-500 inline-flex items-center">Learn More
                    <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
            </div>
        `;
        nutritionInfoContainer.appendChild(foodElement);
    });
}
