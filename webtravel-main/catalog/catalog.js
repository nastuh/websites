const destinations = {
    Summer: [
        {
            image: "https://avatars.mds.yandex.net/i?id=230b3da539b5d6a6189779e2c8f5f6e827e60b53-10933531-images-thumbs&n=13",
            name: "Maldives",
            duration: "7 days / 6 nights",
            price: 1200
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=bc4f1b4d4a80e2ac09ccd3849f05a75b35174c58-4055809-images-thumbs&n=13",
            name: "Santorini",
            duration: "6 days / 5 nights",
            price: 1500
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=acb7d949e2de15a3b56d330dac8dadab4cf54ac8-8313048-images-thumbs&n=13",
            name: "Bora Bora",
            duration: "8 days / 7 nights",
            price: 2800
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=2f116042f651451b7cbb268dd8234c77d6a21ac2-5311889-images-thumbs&n=13",
            name: "Italy",
            duration: "8 days / 7 nights",
            price: 2800
        },
    ],
    Winter: [
        {
            image: "https://avatars.mds.yandex.net/i?id=f58656bd49d28b56737c258b7c3bd6c98748cfc2-12616328-images-thumbs&n=13",
            name: "Alps",
            duration: "10 days / 9 nights",
            price: 950
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=f692cd79ee9fa33f53bd4e30a01d6f20f1b83f21-8185493-images-thumbs&n=13",
            name: "Iceland",
            duration: "5 days / 4 nights",
            price: 1800
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=6764f41b4c629843a6fd445c624beb9187a6e000-7662004-images-thumbs&n=13",
            name: "Japan",
            duration: "12 days / 11 nights",
            price: 2200
        }
    ],
    Spring: [
        {
            image: "https://avatars.mds.yandex.net/i?id=407abfd2000bd018db7e7fc548c24445a859ae3f-5234557-images-thumbs&n=13",
            name: "Kyoto",
            duration: "8 days / 7 nights",
            price: 1600
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=99454b39cb37b724203766d358571c5a2f2b28dc-4012690-images-thumbs&n=13",
            name: "Netherlands",
            duration: "5 days / 4 nights",
            price: 900
        },
        {
            image: "hhttps://avatars.mds.yandex.net/i?id=478431aa554ab99f4c8897184e6fd78762145d19-11491093-images-thumbs&n=13",
            name: "Provence",
            duration: "6 days / 5 nights",
            price: 1100
        }
    ],
    Autumn: [
        {
            image: "https://avatars.mds.yandex.net/i?id=75dfcdded5899a0ca7391be074e2d3209fa3f62e72dfa6a9-5282425-images-thumbs&n=13",
            name: "New England",
            duration: "7 days / 6 nights",
            price: 1400
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=4e3e5ed7db05b7985f23a29c5d0b94c1faacf8e6-12803022-images-thumbs&n=13",
            name: "Prague",
            duration: "5 days / 4 nights",
            price: 750
        },
        {
            image: "https://avatars.mds.yandex.net/i?id=594ad195fab3c82568d80c3bf94781d0422c23f1-12373036-images-thumbs&n=13",
            name: "Scotland",
            duration: "9 days / 8 nights",
            price: 1700
        }
    ]
};

function updateDestinations() {
    const selectedSeasons = Array.from(document.querySelectorAll('.season-filter:checked')).map(cb => cb.value);
    const destinationsGrid = document.getElementById('destinations-grid');
    destinationsGrid.innerHTML = '';

    let displayDestinations = [];
    if (selectedSeasons.length === 0) {
        Object.values(destinations).forEach(seasonDestinations => {
            displayDestinations.push(seasonDestinations[0]);
        });
    } else {
        selectedSeasons.forEach(season => {
            displayDestinations = displayDestinations.concat(destinations[season]);
        });
    }

    displayDestinations.slice(0, 3).forEach(destination => {
        const destinationCard = document.createElement('div');
        destinationCard.className = 'bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition';
        destinationCard.innerHTML = `
            <img src="${destination.image}" alt="${destination.name}" class="w-full h-[250px] object-cover">
            <div class="p-4">
                <h3 class="font-medium mb-2">${destination.name}</h3>
                <p class="text-gray-600 text-sm mb-3">${destination.duration}</p>
                <p class="text-primary font-medium">From $${destination.price}</p>
            </div>
        `;
        destinationsGrid.appendChild(destinationCard);
    });
}

document.querySelectorAll('.season-filter').forEach(checkbox => {
    checkbox.addEventListener('change', updateDestinations);
});

// Initial load
updateDestinations();

const chatToggle = document.getElementById('chat-toggle');
const chatWindow = document.getElementById('chat-window');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
});
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        const message = document.createElement('div');
        message.className = 'mb-4 text-right';
        message.innerHTML = `
            <div class="inline-block bg-primary text-white px-4 py-2 rounded-lg">
                ${chatInput.value}
            </div>
        `;
        chatMessages.appendChild(message);
        setTimeout(() => {
            const response = document.createElement('div');
            response.className = 'mb-4';
            response.innerHTML = `
                <div class="inline-block bg-gray-100 px-4 py-2 rounded-lg">
                    Thank you for your message! Our consultant will contact you soon.
                </div>
            `;
            chatMessages.appendChild(response);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

const priceRange = document.querySelector('.price-range');
const priceMin = document.querySelector('.price-min');
const priceMax = document.querySelector('.price-max');
priceRange.addEventListener('input', (e) => {
    const currentValue = parseInt(e.target.value);
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(currentValue);
    priceMin.textContent = formattedValue;
    priceMax.textContent = '$100,000';
});