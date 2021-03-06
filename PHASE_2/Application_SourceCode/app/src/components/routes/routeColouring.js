// Get the cities on route we need to calculate how many cases on each route 
const routeCovidCalculator = (routecitys, casesByCity) => {
    // routeCitys is a list of lists 
    // produce a dictionary of cities to covid cases 
    const setOfCitys = calcSetOfCitys(routecitys);
    // let covidCountSet = {}; 

    const event = new Date();
    console.log('date', event.toISOString(), event.getDate() - 2, event.getFullYear(), event.getMonth() + 1);
    const pastDate = event.getDate() - 2;
    const fullYear = event.getFullYear();
    const month = event.getMonth() + 1;
    console.log('newDAte', fullYear + '-0' + month + '-' + pastDate + 'T00:00:00Z')
    const newDate = fullYear + '-0' + month + '-' + pastDate + 'T00:00:00Z';


    for (const [_, value] of Object.entries(casesByCity)) {
        // console.log('inside covidCountList', casesByCity);
        // if the "City" key
        // console.log('looping', value);
        if (value.City in setOfCitys) {
            console.log('value.City', value.City, value, value.dataByDates[newDate].Active);
            setOfCitys[value.City] = Number(value.dataByDates[newDate].Active);
        } 
        // console.log(key, value);
            
    }
        
    return setOfCitys; 
}

const calcSetOfCitys = (routecitys) => {
    let setOfCitys = {};
    // console.log('calc', JSON.stringify(routecitys));
    routecitys.forEach((route) => {
        // console.log('route', JSON.stringify(route));
        route.forEach((city) => {
            // console.log('city', JSON.stringify(city));
            // console.log(city[0]);
            if (!setOfCitys.hasOwnProperty(city[0])) {
                setOfCitys[city[0]] = 0;
            }
            // city.forEach((item) => {
            // })
        })
        // for (const item in route) {
        //     console.log('item', item);
        // }
    })
    console.log('set', setOfCitys)
    return setOfCitys;
}

const routeCases = (routecitys, setOfCitys) => {
    // takes the set of cities and relative data and then adds it up per route 
    const listOfRouteSums = routecitys.map((route) => {
        let sum = 0;
        route.forEach((city) => {
            console.log('setofcitys', setOfCitys[city[0]])
            sum += setOfCitys[city[0]];
        })
        return sum; 
    })
    
    return listOfRouteSums;
}

const rank = (listOfRouteSums) => {
    const dictOfSums = {}
    let highest = 0;
    let highestId = 0
    let lowest = listOfRouteSums[0];
    let lowestId = 0;
    listOfRouteSums.forEach((sum, id) => {
        dictOfSums[id] = sum;
        if (lowest > sum) {
            lowest = sum;
            lowestId = id;
        } 
        if (highest < sum) {
            highest = sum;
            highestId = id;
        }
    })
    dictOfSums["highestId"] = highestId;
    dictOfSums["lowestId"] = lowestId;
    return dictOfSums
}


export const overallCalculatorOfRouteCases = (routecitys, casesByCity) => {
    // combines all the functions 
    console.log(JSON.stringify(casesByCity, routecitys))
    const covidCountSet = routeCovidCalculator(routecitys, casesByCity);
    console.log('covid', covidCountSet);
    const listOfRouteSums = routeCases(routecitys, covidCountSet);
    const ranks = rank(listOfRouteSums);
    return ranks;
}