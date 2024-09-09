/*!
* Start Bootstrap - Bare v5.0.9 (https://startbootstrap.com/template/bare)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

const URL = "http://localhost:5003/"

function createCountryOptions(selector) {
    if (!selector.hasChildNodes()) {
        buildCountryOptions(selector)
    }
}

async function buildCountryOptions(selector) {
    try {
        const response = await fetch(URL + "get_countries");
        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();

        for (var country in json.countries) {
            // var selector = document.getElementsByClassName("form-select")
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

function generateGraph() {
    var firstSelector = document.getElementById("first-country-selector")
    var firstSelectedCountryIndex = firstSelector.selectedIndex
    var firstSelectedCountry = firstSelector.options[firstSelectedCountryIndex].value

    var secondSelector = document.getElementById("second-country-selector")
    var secondSelectedCountryIndex = secondSelector.selectedIndex
    var secondSelectedCountry = secondSelector.options[secondSelectedCountryIndex].value

    firstCountryTemperatures = getTemperatures(firstSelectedCountry)
    secondCountryTemperatures = getTemperatures(secondSelectedCountry)

    console.log(firstCountryTemperatures)
    console.log(secondCountryTemperatures)

    // xValues = []

    // for

    // new Chart("myChart", {
    //     type: "line",
    //     data: {
    //       labels: xValues,
    //       datasets: [{
    //         data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
    //         borderColor: "red",
    //         fill: false
    //       },{
    //         data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
    //         borderColor: "green",
    //         fill: false
    //       },{
    //         data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
    //         borderColor: "blue",
    //         fill: false
    //       }]
    //     },
    //     options: {
    //       legend: {display: false}
    //     }
    //   });
}

async function getTemperatures(country) {
    try {

        const response = await fetch(URL + "get_temperature_by_country_date_range?" + new URLSearchParams({
            country: country,
            start_date: "1780-01",
            end_date: "2013-06"
        }));

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();

        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}