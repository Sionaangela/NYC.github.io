function updateTime() {
	const timeEl = document.getElementById('time');
	const date = new Date();
	const time = date.toLocaleTimeString(undefined, {
		timeZone: 'America/New_York',
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	});
	timeEl.textContent = `${time}`;
}
updateTime();
setInterval(updateTime, 30000);


const navLinks = document.querySelectorAll('.nav-link');
const navTitle = document.querySelector('.header-nav__title');

navLinks.forEach(el =>
	el.addEventListener('mouseenter', function () {
		navTitle.style.color = '#fff';
		navTitle.style.borderBottom = '1.5px solid #fff';
		navTitle.style.fontWeight = '500';
	})
);

navLinks.forEach(el =>
	el.addEventListener('mouseleave', function () {
		navTitle.style.color = '#bfbfbf';
		navTitle.style.borderBottom = '1px solid #bfbfbf';
		navTitle.style.fontWeight = '400';
	})
);


const defaultWeatherLocation = 'New York City';
const apiWeatherKey = 'ADD OPENWEATHER KEY HERE';
const apiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${defaultWeatherLocation}&appid=${apiWeatherKey}&units=imperial`;

fetch(`${apiWeather}`)
	.then(response => {
		return response.json();
	})
	.then(data => {
		const weatherEl = document.getElementById('weather');
		weatherEl.textContent = `${Math.round(data.main.temp)}°F`;

		const weatherIcon = document.getElementById('weather-icon');
		fetch('/content/weather.json')
			.then(response => {
				return response.json();
			})
			.then(myIcons => {
				for (let i = 0; i < myIcons.length; i++) {
					if (data.weather[0].icon === myIcons[i].icon) {
						weatherIcon.setAttribute('src', `${myIcons[i].src}`);
						weatherIcon.setAttribute('alt', `${myIcons[i].alt}`);
					}
				}
			});
	});


const searchAirportBtn = document.getElementById('search-airport-btn');
const searchAirportInput = document.getElementById('search-airport-input');
const userGeolocationBtn = document.getElementById('search-location-btn');

searchAirportBtn.addEventListener('click', function (event) {
	event.preventDefault();

	localStorage.setItem('location', `${searchAirportInput.value}`);
	getFlightData(searchAirportInput.value);
});

userGeolocationBtn.addEventListener('click', function (event) {
	event.preventDefault();

	navigator.geolocation.getCurrentPosition(function (position) {
		const lat = position.coords.latitude;
		const lon = position.coords.longitude;

		getFlightData(`${lat}, ${lon}`);
	});
});


function getFlightData(userLocation) {
	const apiFlight = `https://distanceto.p.rapidapi.com/get?route=[{"t":"${userLocation}"},{"t":"JFK"}]&car=false`;
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': 'ADD DISTANCETO KEY HERE',
			'X-RapidAPI-Host': 'distanceto.p.rapidapi.com',
		},
	};

	fetch(apiFlight, options)
		.then(response => response.json())
		.then(data => {
			const flightTimeEl = document.getElementById('flight-time');
			const flightDistanceEl = document.getElementById('flight-distance');
			const flightStartEl = document.getElementById('airport-start-code');

			flightTimeEl.textContent = `${data.steps[0].distance.flight[0].time}`;
			flightDistanceEl.textContent = `${Math.round(
				data.steps[0].distance.flight[0].distance
			)}km`;
			flightStartEl.textContent = `${data.steps[0].distance.flight[0].start}`;
		})
		.catch(error => {
			console.log(error);
		});
}