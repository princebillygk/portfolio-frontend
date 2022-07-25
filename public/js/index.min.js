//constants
const mainNav = document.getElementById("mainNav")
const moveToTopBtn = document.getElementById("moveToTopBtn")

window.onload = () => {
    loadProblemSolvingData()
}



// events
window.onscroll = () => {
    y = window.scrollY
    fixNavOnScroll(y)
    fixFloatingButton(y)
}

moveToTopBtn.onclick = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}


//functions
const fixNavOnScroll = (sy) => {
    if(sy > mainNav.offsetTop)  {
        mainNav.classList.add("sticky-nav")
    } else {
        mainNav.classList.remove("sticky-nav")
    }
}

//functions
const fixFloatingButton= (sy) => {
    if(sy > mainNav.offsetTop)  {
        moveToTopBtn.classList.add("active-floating-btn")
    } else {
        moveToTopBtn.classList.remove("active-floating-btn")
    }
}
const loadProblemSolvingData = async () => {
    loadOtherJudges();
    loadCodeWars();
    loadUVA();
    loadLightOJ();
    loadCodeForces();
    loadHackerRank();
}

const loadOtherJudges = async () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://api.buildable.dev/flow/v1/call/live/get-judge-profiles-7c127ff6fd", requestOptions)
        .then(response => response.text())
        .then(result => {
            const data = JSON.parse(result)

            //timus
            document.querySelector('#ps-timus > div.body > table > tbody > tr:nth-child(1) > td')
                .innerHTML = data.data.timus.solved
            document.querySelector('#ps-timus > div.body > table > tbody > tr:nth-child(2) > td')
                .innerHTML = data.data.timus.rankBySolved

            //poj
            document.querySelector('#ps-poj > div.body > table > tbody > tr:nth-child(1) > td')
                .innerHTML = data.data.poj.solved
            document.querySelector('#ps-poj > div.body > table > tbody > tr:nth-child(2) > td')
                .innerHTML = data.data.poj.rank

            //leetcode
            document.querySelector('#ps-leetcode > div.body > table > tbody > tr:nth-child(1) > td')
                .innerHTML = data.data.leetcode.solved
            document.querySelector('#ps-leetcode > div.body > table > tbody > tr:nth-child(2) > td')
                .innerHTML = data.data.leetcode.submitted

        })
        .catch(error => console.log('error', error));
}


const loadCodeWars = async () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://www.codewars.com/api/v1/users/princebillyGK", requestOptions)
        .then(response => response.text())
        .then(result => {
            const data = JSON.parse(result)
            document.querySelector('#ps-codewars > div.body > table > tbody > tr:nth-child(1) > td')
                .innerHTML = data.honor
            document.querySelector('#ps-codewars > div.body > table > tbody > tr:nth-child(2) > td')
                .innerHTML = data.codeChallenges.totalCompleted
        })
        .catch(error => console.log('error', error));
}

const loadUVA = async () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
    fetch("https://uhunt.onlinejudge.org/api/ranklist/898744/0/0", requestOptions)
    .then(response => response.text())
    .then(result => {
        let data = JSON.parse(result)

        document.querySelector('#ps-uva > div.body > table > tbody > tr:nth-child(1) > td')
        .innerHTML = data[0].ac
        document.querySelector('#ps-uva > div.body > table > tbody > tr:nth-child(2) > td')
        .innerHTML = data[0].nos

    })
    .catch(error => console.log('error', error));
}

const loadLightOJ = async () => {
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    fetch("https://lightoj.com/api/v1/users/princebillygk", requestOptions)
    .then(response => response.text())
    .then(result => {
        let data = JSON.parse(result)

        document.querySelector('#ps-lightoj > div.body > table > tbody > tr:nth-child(1) > td')
        .innerHTML = data.data.userStat.isSolved
        document.querySelector('#ps-lightoj > div.body > table > tbody > tr:nth-child(2) > td')
        .innerHTML = data.data.userStat.numSubmissions
    })
    .catch(error => console.log('error', error));

}

const loadCodeForces = async () => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
    fetch("https://codeforces.com/api/user.info?handles=princebilly", requestOptions)
    .then(response => response.text())
    .then(result => {
        let data = JSON.parse(result)

        document.querySelector('#ps-codeforces > div.body > table > tbody > tr:nth-child(1) > td')
        .innerHTML = data.result[0].maxRating
        document.querySelector('#ps-codeforces > div.body > table > tbody > tr:nth-child(2) > td')
        .innerHTML = data.result[0].maxRank
    })
    .catch(error => console.log('error', error));
}

const loadHackerRank = async() => {
    var requestOptions = {
    method: 'GET',
    redirect: 'follow'
    };

    fetch("https://www.hackerrank.com/rest/hackers/princebillyGK/badges", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}

