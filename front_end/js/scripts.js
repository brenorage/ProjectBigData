/*!
* Start Bootstrap - Bare v5.0.9 (https://startbootstrap.com/template/bare)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-bare/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

const URL = "http://localhost:5003/"

var countries = []

function createCountryOptions(selector) {
    if (!selector.hasChildNodes()) {
        buildCountryOptions(selector)
    }
}

async function buildCountryOptions(selector) {
    if (countries.length <= 0) {
        showLoader()
        try {
            const response = await fetch(URL + "get_countries");
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
        
            const json = await response.json();
            countries = json.countries; 
        } catch (error) {
            console.error(error.message);
        }
    }

    countries = countries.sort()
    for (var country in countries) {
        // var selector = document.getElementsByClassName("form-select")
        var option = document.createElement("option")
        option.innerHTML = countries[country]
        selector.appendChild(option)
    }
    hideLoader()
}

async function getTemperatureByDate() {
    try {
        showLoader()
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
        hideLoader()

        document.getElementById("result").innerText = json.average_temperature

        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}

async function generateGraph() {
    showLoader()
    var firstSelector = document.getElementById("first-country-selector")
    var firstSelectedCountryIndex = firstSelector.selectedIndex
    var firstSelectedCountry = firstSelector.options[firstSelectedCountryIndex].value

    var secondSelector = document.getElementById("second-country-selector")
    var secondSelectedCountryIndex = secondSelector.selectedIndex
    var secondSelectedCountry = secondSelector.options[secondSelectedCountryIndex].value

    var selectedYear = document.getElementById("year-picker").value

    const firstCountryTemperatures = await getTemperatures(selectedYear, firstSelectedCountry)
    const secondCountryTemperatures = await getTemperatures(selectedYear, secondSelectedCountry)

    ctx = document.getElementById('myChart')

    new Chart(ctx, {
        type: "line",
        data: {
            labels: firstCountryTemperatures.temperature_data.map(data=> new Date(data.date).toLocaleString('br', { month: 'long', timeZone: 'UTC' })),
            datasets: [{
            data: firstCountryTemperatures.temperature_data.map(data=>data.temperature),
            borderColor: "red",
            fill: false,
            label: firstSelectedCountry
            },{
            data: secondCountryTemperatures.temperature_data.map(data=>data.temperature),
            borderColor: "green",
            fill: false,
            label: secondSelectedCountry
            }]
        },
        options: {
            legend: {
                display: true,
                position: "bottom"
            }
        }
        }
    ) 

    hideLoader()
}

async function getTemperatures(year, country) {
    try {

        const response = await fetch(URL + "get_temperature_by_country_date_range?" + new URLSearchParams({
            country: country,
            start_date: `${year}-01`,
            end_date: `${year}-12`
        }));

        if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
        }
    
        const json = await response.json();

        return json
    } catch (error) {
        console.error(error.message);
    }
}

$('#month-date-picker').datepicker({
    format: "MM yyyy",
    minViewMode: 1,
    changeYear: true,
    autoclose: true
});

function showLoader() {
    var loader = document.getElementById("loader")
    var button = document.getElementById("generate-graph-button")
    
    loader.hidden = false
    button.disabled = true
}

function hideLoader() {
    var loader = document.getElementById("loader")
    var button = document.getElementById("generate-graph-button")
    
    loader.hidden = true
    button.disabled = false
}