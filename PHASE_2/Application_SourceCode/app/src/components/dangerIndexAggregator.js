import epiwatchApi from "../apis/epiwatchApi";

// Given recorded cases, calculate as a percentage of the maximum
const aggregateDangerIndexes = async (activeCasesByProvince) => {
    const listOfProvinces = Object.keys(activeCasesByProvince);
    const indexesByArticlesOnly = await getIndexesByArticles(listOfProvinces);
    const indexesByCasesOnly = getIndexesByCases(activeCasesByProvince);
    const combinedIndexes = combineIndexes(indexesByArticlesOnly, indexesByCasesOnly);
    console.log(combinedIndexes);
    return combinedIndexes;
}

const getIndexesByArticles = async (listOfProvinces) => {
    const articlesByProvinces = {};
    const resolved = await Promise.all(listOfProvinces.map(Province => {
        return epiwatchApi.articles(`${new Date().getYear() + 1900 - 5}-01-01 00:00:00 to 3000-01-01 00:00:00`, "", Province);
    }))

    const maxArticles = Math.max(...resolved.map(r => r.articles.length), 1);
    listOfProvinces.forEach((Province, index) => {
        articlesByProvinces[Province] = resolved[index].articles.length / maxArticles;
    })

    return articlesByProvinces;
}

const getIndexesByCases = (activeCasesByProvince) => {
    const mostRecentActiveCasesByProvince = {};
    const caseIndexesByProvinces = {};
    for (const Province in activeCasesByProvince) {
        mostRecentActiveCasesByProvince[Province] = activeCasesByProvince[Province][activeCasesByProvince[Province].length - 1];
    }

    for (const Province in mostRecentActiveCasesByProvince) {
        // Any cases above 1_000_000 are indexed at most dangerous (i.e. index = 1)
        const loggedIndex = Math.log10(mostRecentActiveCasesByProvince[Province]) / 6;
        caseIndexesByProvinces[Province] = Math.min(Math.max(loggedIndex, 0), 1);
    }

    return caseIndexesByProvinces;
}

const combineIndexes = (indexesByArticlesOnly, indexesByCasesOnly) => {
    // 10% is articles, 90% is cases
    const summedIndexes = {};
    for (const Province in indexesByArticlesOnly) {
        let outOf100 = indexesByArticlesOnly[Province] * 10 + indexesByCasesOnly[Province] * 90;
        summedIndexes[Province] =  Math.min(Math.max(outOf100, 0), 100);
    }

    return summedIndexes;
}

export default aggregateDangerIndexes;
