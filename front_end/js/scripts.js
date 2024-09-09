/*!
* Start Bootstrap - Bare v5.0.9 (https://startbootstrap.com/template/bare)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

const URL = "http://localhost:5003/"

async function createCountryOptions() {
    try {
        const response = await fetch(URL + "get_countries");
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();

        for (var country in json.countries) {
            var selector = document.getElementById("country-selector")
            var option = document.createElement("option")
            option.innerHTML = json.countries[country]
            selector.appendChild(option)
        }

        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}

async function getTemperatureByDate() {
    try {
        var selector = document.getElementById("country-selector")
        var selectedCountryIndex = selector.selectedIndex
        var selectedCountry = selector.options[selectedCountryIndex].value

        var selectedDate = document.getElementById("date-picker").value

        const response = await fetch(URL + "get_temperature_by_date_country?" + new URLSearchParams({
            country: selectedCountry,
            date: selectedDate
        }));

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();

        document.getElementById("result").innerText = json.average_temperature

        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}