const API_KEY = "0803e84af8a165d8f0ae7c2b63f7baec";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherDiv = document.getElementById("weather");
const errorDiv = document.getElementById("error");


const wishListFormContainer = document.getElementById('wishlist-form-container');
const noteInput = document.getElementById('note');
const addToListBtn = document.getElementById('addToWishlistBtn');
const wishListContainer = document.getElementById('wishlist-container');

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
renderWishList();

async function getWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    errorDiv.textContent = "";
    weatherDiv.innerHTML = "";

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=uk`
        );

        if (!response.ok) {
            errorDiv.textContent = "Місто не знайдено";
            return;
        }

        const data = await response.json();


        weatherDiv.innerHTML = `
          <h2>${data.name}</h2>
          <p>${data.weather[0].description}</p>
          <p>🌡 Температура: ${data.main.temp}°C</p>
          <p>Відчувається як: ${data.main.feels_like}°C</p>
          <p>💧 Вологість: ${data.main.humidity}%</p>
          <p>🔽 Тиск: ${data.main.pressure} гПа</p>
          <p>💨 Вітер: ${data.wind.speed} м/с</p>
        `;
        showWishlistForm(data);

    } catch (err) {
        errorDiv.textContent = "Помилка при завантаженні погоди: " + err.message;
    }
}


searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});

function showWishlistForm(data) {
    wishListFormContainer.style.display = 'block';
    addToListBtn.onclick = () => addToWishList(data);
}


function addToWishList(data) {
    const note = noteInput.value.trim();
    wishlist.push({
        city: data.name,
        note: note,
        temperature: data.main.temp,
        description: data.weather[0].description
    });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    noteInput.value = '';
    wishListFormContainer.style.display = 'none';

    renderWishList();

}


function renderWishList() {
    wishListContainer.innerHTML = '';

    if (!wishlist.length) {

        const placeholder = document.createElement('p');
        placeholder.classList.add('placeholder');
        placeholder.textContent = "Список порожній. Додайте перше місто!";

        wishListContainer.appendChild(placeholder);
        return;
    }

    wishlist.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        const cityName = document.createElement('h3');
        cityName.textContent = item.city;
        card.appendChild(cityName);

        const temp = document.createElement('p');
        temp.textContent = `🌡 Температура: ${item.temperature}°C`;
        card.appendChild(temp);

        const desc = document.createElement('p');
        desc.textContent = `📄 Опис: ${item.description}`;
        card.appendChild(desc);

        if (item.note) {
            const note = document.createElement('p');
            note.textContent = `📝 Нотатка: ${item.note}`;
            card.appendChild(note);
        }

        const btnDelete = document.createElement("button");
        btnDelete.classList.add("btn-delete")
        btnDelete.textContent = "Delete"
        btnDelete.addEventListener("click", () => {
            wishlist.splice(index, 1);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            renderWishList();
        });

        card.appendChild(btnDelete);
        wishListContainer.appendChild(card);

    });
}