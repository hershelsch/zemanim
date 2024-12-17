const HDate = {
    date: new Hebcal.HDate(),
    location:[],
    changeDate(date) {
        this.date = date
        this.date.setLocation(this.location)
        document.querySelector('h2#date').innerText=this.date.toString('h')

    },
    setLocation(location) {
this.location = location
this.date.setLocation(location)

    },
    goToNextDay(){
        let newDate = this.date.next()
        this.changeDate(newDate)
        populateZmanim(this.getZmanim())

    },
    goToPrevDay(){
        let newDate = this.date.prev()
        this.changeDate(newDate)
        populateZmanim(this.getZmanim())
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
        "chatzot":"חצות",
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
        "rabeiny_tam":`צאת הכוכבים ר"ת`,
        "neitz_hachama": "נץ החמה",
        "shkiah": "שקיעה"
    }

function populateZmanim(zmanim) {
    let tbodyEl = document.createElement('tbody')


    zmanim.forEach(zman => {
        let trEl = document.createElement('tr')
        let nameTdEl = document.createElement('td')
        let timeTdEl = document.createElement('td')
        tbodyEl.appendChild(trEl)

        nameTdEl.innerText = zman.name
        timeTdEl.innerText = zman.time.toLocaleTimeString()
        trEl.append(timeTdEl, nameTdEl)

    })
    document.getElementById('zmanim-table').replaceChildren(tbodyEl)
}
function populateCitiesDD() {
    selectEl = document.createElement('select')
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
const nextDayBtn = document.querySelector('button.next')
const prevDayBtn = document.querySelector('button.prev')
nextDayBtn.addEventListener('click',()=>{HDate.goToNextDay()})
prevDayBtn.addEventListener('click',()=>{HDate.goToPrevDay()})
document.querySelector('h2#date').innerText=HDate.date.toString('h')

populateCitiesDD()
populateZmanim(HDate.getZmanim())
