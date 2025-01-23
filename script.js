const DateH2El = document.querySelector('h2#date')
const DateInput = document.querySelector("#date-input")
const HDate = {
    date: new Hebcal.HDate(),
    location: [],

    changeDate(date) {
        this.date = date
        this.date.setLocation(this.location)
        DateH2El.innerText = this.date.toString('h')
        populateZmanim(this.getZmanim())

    },
    setLocation(location) {
        this.location = location
        this.date.setLocation(location)

    },
    goToNextDay() {
        const NewDate = this.date.next()
        this.changeDate(NewDate)

    },
    goToPrevDay() {
        const NewDate = this.date.prev()
        this.changeDate(NewDate)
    },
    changeLocation(newLocation) {
        this.setLocation(newLocation)
        populateZmanim(this.getZmanim())
    },

    getZmanim() {
        let zmanim = this.date.getZemanim()
        let arrOfZmanimNames = Object.keys(zmanim)
        let arrOfZmanim = arrOfZmanimNames.map(zman => { return { name: yiddishZmanimNames[zman], time: zmanim[zman] } })
        let sortedZmanim = arrOfZmanim.sort((a, b) => a.time - b.time)
        return sortedZmanim
    }
}
const yiddishZmanimNames =
{
    "chatzot": "חצות",
    "chatzot_night": "חצות לילה",
    "alot_hashacher": "עלות השחר",
    "misheyakir": "משיכיר",
    "misheyakir_machmir": "משיכיר מחמיר",
    "sof_zman_shma_mugein": `סוף זמן קרי"ש מג"א`,
    "sof_zman_shma": `סוף זמן קרי"ש גר"א`,
    "sof_zman_tfilla_mugein": `סוף זמן תפלה מג"א`,
    "sof_zman_tfilla": `סוף זמן תפילה גר"א`,
    "mincha_gedola": "מנחה גדולה",
    "mincha_ketana": "מנחה קטנה",
    "plag_hamincha": "פלג המנחה",
    "rabeiny_tam": `צאת הכוכבים ר"ת`,
    "neitz_hachama": "נץ החמה",
    "shkiah": "שקיעה"
}

// Constants for key codes
const RIGHT_ARROW_KEY = 39;
const LEFT_ARROW_KEY = 37;
const MILLISECONDS_IN_SECOND = 1000;

const nextDayBtn = document.querySelector('#btn-next')
const prevDayBtn = document.querySelector('#btn-prev')

// Event listener functions
function handleNextDay() {
    HDate.goToNextDay();
}

function handlePrevDay() {
    HDate.goToPrevDay();
}

function handleButtonClick(event) {
    const buttonId = event.target.id;
    if (buttonId === 'btn-next') {
        handleNextDay();
    } else if (buttonId === 'btn-prev') {
        handlePrevDay();
    }
}

function handleDateChange({ target }) {
    if (target.value) {
        const newDate = target.value.replace('-', '/');
        HDate.changeDate(new Hebcal.HDate(new Date(newDate)));
    }
}

function handleKeyDown(e) {
    if (e.keyCode === RIGHT_ARROW_KEY && e.ctrlKey === true) {
        HDate.goToNextDay();
    } else if (e.keyCode === LEFT_ARROW_KEY && e.ctrlKey === true) {
        HDate.goToPrevDay();
    }
}

nextDayBtn.addEventListener('click', handleButtonClick);
prevDayBtn.addEventListener('click', handleButtonClick);
DateInput.addEventListener('change', handleDateChange);
window.onkeydown = handleKeyDown;

DateH2El.innerText = HDate.date.toString('h')

function populateZmanim(zmanim) {
    try {
        let tbodyEl = document.createElement('tbody')

        zmanim.forEach(zman => {
            let trEl = document.createElement('tr')
            let nameTdEl = document.createElement('td')
            let timeTdEl = document.createElement('td')
            tbodyEl.appendChild(trEl)
            timeTdEl.countDown = false
            const zmanTime = zman.time.toLocaleTimeString()
            nameTdEl.innerText = zman.name
            timeTdEl.innerText = zmanTime
            trEl.append(timeTdEl, nameTdEl)
            timeTdEl.addEventListener('dblclick', ({ target }) => {
                if (target.countDown === true) {
                    target.innerHTML = zmanTime
                    target.countDown = false
                } else {
                    target.countDown = true
                    changeTimeToCountdown(target, zman)
                }
            })
        })
        document.getElementById('zmanim-table').replaceChildren(tbodyEl)
    } catch (error) {
        console.error('Error populating Zmanim:', error);
    }
}

function populateCitiesDD() {
    const selectEl = document.createElement('select')
    selectEl.name = 'cities-dd'
    selectEl.addEventListener('change', () => {
        let selectedLocation = document.querySelector('select')[selectEl.selectedIndex].location
        HDate.changeLocation(selectedLocation)
    })
    const cities = Hebcal.cities.listCities()

    for (const city of cities) {
        let optionEl = document.createElement('option')
        optionEl.innerText = city
        optionEl.location = Hebcal.cities.getCity(city)
        if (city.toLowerCase() == 'new york') {
            optionEl.selected = true
        }
        selectEl.appendChild(optionEl)
    }
    document.body.querySelector('#dd-div').appendChild(selectEl)
    HDate.setLocation(document.querySelector('select')[selectEl.selectedIndex].location)
}

function changeTimeToCountdown(element, zman) {
    console.log(element)
    const timeTillZman = calculateDifferenceBetweenDates(new Date(), zman.time);
    const readableTime = millisecondsToReadableTime(timeTillZman);
    if (timeTillZman < 0) {
        element.innerHTML = `${zman.name} איז שוין געווען`;
        return;
    } else {
        element.innerHTML = readableTime;
        const delay = MILLISECONDS_IN_SECOND - (new Date().getMilliseconds());
        setTimeout(() => {
            countdownFunction(element, zman);
        }, delay);
    }
}

function countdownFunction(element, zman) {
   const interval = setInterval(updateCountdown, MILLISECONDS_IN_SECOND);
   updateCountdown()
   function updateCountdown() {
        if (element.countDown === false) {
            clearInterval(interval);
            return;
        }
        element.innerHTML = millisecondsToReadableTime(calculateDifferenceBetweenDates(new Date(), zman.time));
    }
}

// Function to calculate the difference between two dates
function calculateDifferenceBetweenDates(dateFrom, dateTo) {
    if (!(dateFrom instanceof Date) || !(dateTo instanceof Date)) {
        throw new Error('Both arguments must be Date objects');
    }
    return dateTo - dateFrom;
}

function millisecondsToReadableTime(milliseconds) {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / 60000);
    const seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);

    const formattedHours = hours.toString().padStart(2, '0') + ':';
    const formattedMinutes = minutes.toString().padStart(2, '0') + ':';
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return formattedHours + formattedMinutes + formattedSeconds;
}

populateCitiesDD()
populateZmanim(HDate.getZmanim())