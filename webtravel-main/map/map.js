let markers = [];
const searchInput = document.getElementById('searchInput');
const mapContainer = document.getElementById('mapContainer');

function addMarker() {
    if (markers.length >= 2) {
        showNotification('Можно выбрать только 2 точки маршрута');
        return;
    }
    const searchValue = searchInput.value;
    if (!searchValue || !countries[searchValue]) {
        showNotification('Пожалуйста, выберите страну из списка');
        return;
    }
    const country = countries[searchValue];
    const mapWidth = mapContainer.offsetWidth;
    const mapHeight = mapContainer.offsetHeight;

    // Convert coordinates to pixels (simple linear mapping)
    const left = (country.lng + 180) * (mapWidth / 360);
    const top = (90 - country.lat) * (mapHeight / 180);
    const marker = document.createElement('div');
    marker.className = 'absolute w-6 h-6 flex items-center justify-center cursor-move';
    marker.innerHTML = '<i class="ri-flag-2-fill text-primary text-xl"></i>';
    marker.style.top = `${top}px`;
    marker.style.left = `${left}px`;
    marker.setAttribute('data-country', searchValue);
    marker.draggable = true;
    marker.addEventListener('dragstart', handleDragStart);
    marker.addEventListener('drag', handleDrag);
    mapContainer.appendChild(marker);
    markers.push(marker);
    updateSelectedCountries();
    if (markers.length === 2) {
        drawRoute();
    }
    searchInput.value = '';
}

function clearMarkers() {
    markers.forEach(marker => marker.remove());
    markers = [];
    const route = mapContainer.querySelector('.route-line');
    if (route) route.remove();
    updateSelectedCountries();
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', '');
}

function handleDrag(e) {
    const marker = e.target;
    const rect = mapContainer.getBoundingClientRect();
    let x = e.clientX - rect.left - marker.offsetWidth / 2;
    let y = e.clientY - rect.top - marker.offsetHeight / 2;
    x = Math.max(0, Math.min(x, mapContainer.offsetWidth - marker.offsetWidth));
    y = Math.max(0, Math.min(y, mapContainer.offsetHeight - marker.offsetHeight));
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    if (markers.length === 2) {
        drawRoute();
    }
}

function drawRoute() {
    const existingRoute = mapContainer.querySelector('.route-line');
    if (existingRoute) existingRoute.remove();
    const route = document.createElement('div');
    route.className = 'route-line absolute border-t-2 border-primary';
    const marker1Rect = markers[0].getBoundingClientRect();
    const marker2Rect = markers[1].getBoundingClientRect();
    const mapRect = mapContainer.getBoundingClientRect();
    const x1 = markers[0].offsetLeft + markers[0].offsetWidth / 2;
    const y1 = markers[0].offsetTop + markers[0].offsetHeight / 2;
    const x2 = markers[1].offsetLeft + markers[1].offsetWidth / 2;
    const y2 = markers[1].offsetTop + markers[1].offsetHeight / 2;
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    route.style.width = `${length}px`;
    route.style.left = `${x1}px`;
    route.style.top = `${y1}px`;
    route.style.transform = `rotate(${angle}deg)`;
    route.style.transformOrigin = 'left';
    mapContainer.appendChild(route);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

const countries = {
    'Россия': {lat: 55.7558, lng: 37.6173},
    'Франция': {lat: 48.8566, lng: 2.3522},
    'Германия': {lat: 52.5200, lng: 13.4050},
    'Италия': {lat: 41.9028, lng: 12.4964},
    'Испания': {lat: 40.4168, lng: -3.7038},
    'Великобритания': {lat: 51.5074, lng: -0.1278},
    'Китай': {lat: 39.9042, lng: 116.4074},
    'Япония': {lat: 35.6762, lng: 139.6503},
    'США': {lat: 38.8977, lng: -77.0365},
    'Канада': {lat: 45.4215, lng: -75.6972}
};

function updateSelectedCountries() {
    const selectedCountriesDiv = document.getElementById('selectedCountries');
    selectedCountriesDiv.innerHTML = '';
    markers.forEach((marker) => {
        const country = marker.getAttribute('data-country');
        if (country) {
            const countryDiv = document.createElement('div');
            countryDiv.className = 'flex items-center gap-2 text-sm';
            countryDiv.innerHTML = `
                <i class="ri-flag-2-fill text-primary"></i>
                <span>${country}</span>
            `;
            selectedCountriesDiv.appendChild(countryDiv);
        }
    });
}

searchInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const existingDropdown = document.querySelector('.search-dropdown');
    if (existingDropdown) existingDropdown.remove();
    if (value) {
        const filtered = Object.keys(countries).filter(country =>
            country.toLowerCase().includes(value)
        );
        if (filtered.length) {
            const dropdown = document.createElement('div');
            dropdown.className = 'search-dropdown absolute top-full left-0 right-0 bg-white shadow-lg rounded-lg mt-1 z-10';
            filtered.forEach(country => {
                const item = document.createElement('div');
                item.className = 'px-4 py-2 hover:bg-gray-50 cursor-pointer';
                item.textContent = country;
                item.onclick = () => {
                    searchInput.value = country;
                    dropdown.remove();
                };
                dropdown.appendChild(item);
            });
            searchInput.parentElement.appendChild(dropdown);
        }
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-dropdown') && !e.target.closest('#searchInput')) {
        const dropdown = document.querySelector('.search-dropdown');
        if (dropdown) dropdown.remove();
    }
});