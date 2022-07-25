const loadProblemSolvingData = async () => {
    loadTimusData();
}

const loadTimusData = async () => {
    try {
        const r = await fetch("https://acm.timus.ru/author.aspx?id=248748", {method: 'GET', mode: 'no-cors'})
        console.log(r.status)
        console.log(r.body)
    } catch(e) {
        console.log('Error - Fetching Timus Profile: ' + e)
    }
}