const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const notFound = document.querySelector(".notfound");
const notText =document.querySelector(".notText");

// initially needed variables 

let currentTab = userTab;
const API_KEY = "50ffdccf32159e67e7d4858a314cb858";
currentTab.classList.add("current-tab")
getfromSessionStorage();

function switchTab(clickedTab) {
    if (clickedTab != currentTab) {
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

       
        if (!searchForm.classList.contains("active")) {
            //kya search form wala container invisible hai, if yes then make it visible
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
            notFound.classList.remove("active");
        notText.classList.remove("active");
            
        }
        else {
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("avtive");
            notFound.classList.remove("active");
        notText.classList.remove("active");
            getfromSessionStorage();
        }


    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})

//check if coordinates(lat, lon) are present in session storage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        /// agr local coordinate nhi mile to mtlb aapne location ka grant nhi diya
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates); // covert in json format
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const { lat, lon } = coordinates;
    ///make grant container invisible
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    // API cALL 
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add("active");
        notFound.classList.remove("active");
        notText.classList.remove("active");
        renderWeatherInfo(data); // put data value in ui dynamically basically visible on ui
    }
    catch (err) {
        loadingScreen.classList.remove("active");
    
    }
}

function renderWeatherInfo(weatherInfo) {
    // fetch the element 
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");
    


    //fetch values from weatherINfo object and put it UI elements
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;


}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);  // showposition is a callback function
    }
    else {
        alert("ERROR");
    }
}
function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));

    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let cityName = searchInput.value;
    if (cityName === "")
        return;

    else
        fetchSearchWeatherInfo(cityName);


})

async function fetchSearchWeatherInfo(city) {
    {
        loadingScreen.classList.add("active");
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        notFound.classList.remove("active");
        notText.classList.remove("active");

        try {

            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            const data = await response.json();
            const cod = data.cod;
            console.log(cod);
            console.log(typeof cod);

            if (cod == "200") {
                loadingScreen.classList.remove("active");
                userInfoContainer.classList.add("active");
                notFound.classList.remove("active");
                notText.classList.remove("active");
                renderWeatherInfo(data);
            }
            else {
                userInfoContainer.classList.remove("active");
                loadingScreen.classList.remove("active");
                notFound.classList.add("active");
                notText.classList.add("active");

            }

        }
        catch (e) {
           //console.log(e);

        }

    }
}

