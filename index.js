


let offset=0
let limit=50
let orderBy='name'

let searchBarInput=document.getElementById('searchBar-input')
let searchBarClear=document.getElementById('searchBar-clear')
let searchBarButton=document.getElementById('searchBar-submit')
let resultPerPageSelect=document.getElementById("result-per-page-select")
let orderBySelect=document.getElementById("order-by-select")

resultPerPageSelect.addEventListener('click', ()=>{limit=resultPerPageSelect.value})

orderBySelect.addEventListener('click', ()=>{orderBy=orderBySelect.value})

searchBarClear.addEventListener('click', ()=>{searchBarInput.value=''})

function displayData(result){
    console.log(result)
}

function searchSuperHero(){
    console.log('Clicked', searchBarInput.value, orderBy)
    const input=searchBarInput.value
    let publicKey=getPublicKey()
    let timestampHash=getHash()
    let url=`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${input}&orderBy=${orderBy}&limit=${limit}&ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
    fetchData(url).then((data)=>{displayData(data.data.results)})
}
searchBarButton.addEventListener('click', searchSuperHero)

function getTimeStamp(){
    let timeStamp=Date.now().toString()
    return timeStamp
}

function getPublicKey(){
    const publicKey='84e760e71f426db6089f9b7f40c85919'
    return publicKey
}

function getHash(){
    let publicKey=getPublicKey()
    const privateKey='bfa58e25d86f1fdbd11b0f1610960ade4fc5c36b'
    let timeStamp=getTimeStamp()
    let hash=CryptoJS.MD5(timeStamp+privateKey+publicKey).toString()
    return [timeStamp, hash]
}



function getAllSuperheros(){
    let publicKey=getPublicKey()
    let timestampHash=getHash()
    let url=`https://gateway.marvel.com:443/v1/public/characters?orderBy=name&limit=99&ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
    fetchData(url).then((data)=>console.log(data.data))
}

async function fetchData(url){
    console.log(url)
    let response=await fetch(url, {method: "GET"})
    if(response.ok){
        return response.json()
    }
}

getAllSuperheros()


// [ API example :https://gateway.marvel.com:443/v1/public/characters?ts=<time-stamp>&apikey=<public-key>&hash=<md5(ts+privateKey+publicKey)>]