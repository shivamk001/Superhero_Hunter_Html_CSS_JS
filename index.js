let orderBy='name'
let allSuperHeros=[]


let displaySearchButton=document.getElementById('displaySearchButton')
let displayFavourites=document.getElementById('displayFavourites')
let searchBarDiv=document.getElementById('searchBarDiv')

// let searchBarInput=document.getElementById('searchBar-input')
// let searchBarClear=document.getElementById('searchBar-clear')
// let searchBarButton=document.getElementById('searchBar-submit')
let resultPerPageSelect=document.getElementById("result-per-page-select")
let orderBySelect=document.getElementById("order-by-select")
let superHeroContainer=document.getElementById('superhero-cards-container')


function toggleSearchBar(){
    let isVisible=searchBarDiv.style.visibility.length===0?false: true
    console.log('searchBarDiv.style.display:', searchBarDiv.style.visibility)
    if(!isVisible){
        searchBarDiv.style.visibility='visible'
        searchBarDiv.style.display='flex'
    }
    else{
        searchBarDiv.style.visibility=''
        searchBarDiv.style.display=''
    }
}
displaySearchButton.addEventListener('click', toggleSearchBar)

function displayFavouriteSuperHeros(){
    console.log('DisplayFavs');
}   
displayFavourites.addEventListener('click', displayFavouriteSuperHeros)

orderBySelect.addEventListener('click', ()=>{orderBy=orderBySelect.value})
// searchBarClear.addEventListener('click', ()=>{searchBarInput.value=''})

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

function addToFavourites(superhero){

    let dataId=superhero.getAttribute('data-id')
    let dataName=superhero.getAttribute('data-name')
    console.log(dataId+" "+dataName+" "+allSuperHeros.length);
    let data={}

    allSuperHeros.forEach(hero=>{
        if(hero.id==dataId){
            data['id']=hero.id
            data['name']=hero.name
            data['description']=hero.description
            data['thumbnail']=hero.thumbnail
        }
    })

    let favouriteSuperheros=JSON.parse(localStorage.getItem('favouriteSuperheros'));

    if(favouriteSuperheros!=null && favouriteSuperheros[dataId]==undefined){
        //add
        favouriteSuperheros[dataId]=data
        localStorage.setItem('favouriteSuperheros', JSON.stringify(favouriteSuperheros))
        //change color of star
        superhero.style.color='goldenrod';

        Toast.fire({
            icon: 'success',
            title: `${dataName} successfully added in Favourites!`
        })
    }
    else if(favouriteSuperheros==null){

        //create new obj
        let newObj=new Object()
        newObj[dataId]=data
        localStorage.setItem('favouriteSuperheros', JSON.stringify(newObj))

        Toast.fire({
            icon: 'success',
            title: `${dataName} successfully added in Favourites!`
        })
    }
    else if(favouriteSuperheros[dataId]!=undefined){
        //dont add
        console.log('Already in favourites');

        
        if(superhero.style.color.length==0){
            superhero.style.color='goldenrod';
        }
        else{
            //remove
            superhero.style.color='';
            delete favouriteSuperheros[dataId]
            localStorage.setItem('favouriteSuperheros', JSON.stringify(favouriteSuperheros))

            Toast.fire({
                icon: 'success',
                title: `${dataName} successfully removed from Favourites!`
            })
        }
    }
}

function displayData(result){

    result.forEach(element => {
        const superheroCard=document.createElement('div')
        superheroCard.classList.add('superhero-card')
        superheroCard.id=element.id

        let imagePath=element.thumbnail.path+'/portrait_xlarge.'+element.thumbnail.extension
        let name=element.name.toUpperCase()
        let description=element.description.length>0?
                            element.description.length<250  ? element.description   : element.description.slice(0,250)+'...':
                            'Description not available'

        superheroCard.innerHTML=
        `
        <img src=${imagePath} alt=${element.name} />
        <div class="superhero-details">
            <h1>${name}</h1>
            <p class="descriptionText">${description}</p>
            <i data-id=${element.id} data-name=${name} class="fa-solid fa-star fa-xl" onclick="addToFavourites(this)"></i>
        </div>`

        superHeroContainer.appendChild(superheroCard)
    });
}

async function searchSuperHero(){
    console.log('Clicked', searchBarInput.value, orderBy)
    let result=[]
    const input=searchBarInput.value
    let publicKey=getPublicKey()
    let timestampHash=getHash()
    let url=`https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${input}&orderBy=${orderBy}&limit=${limit}&ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
    
    let data=await fetchData(url)
    console.log(data.data.result)
    result=[...data.data.results]

    //remove all children
    while(superHeroContainer.firstChild){
        superHeroContainer.removeChild(superHeroContainer.firstChild)
    }

    resultContainerHeading.innerText=`Showing results for: ${input}`

    displayData(result)

}
//searchBarButton.addEventListener('click', searchSuperHero)

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



async function getAllSuperheros(){
    let publicKey=getPublicKey()
    let timestampHash=getHash()
    let result=[]
    let limit=100
    let totalHeros=0
    let offset=0
    let index=0
    while(totalHeros<100){
        
        let url=`https://gateway.marvel.com:443/v1/public/characters?offset=${offset}&orderBy=name&limit=${limit}&ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
        let data=await fetchData(url)
        result=[...result, ...data.data.results]; 
        allSuperHeros=[...allSuperHeros, ...data.data.results];
        console.log("TotalHeros:", totalHeros," Offset:", offset," Index:", index, "Result:", result)
        displayData(result.slice(index))
        totalHeros+=limit
        offset+=limit
        index+=limit
    }
    console.log("Outside loop ",totalHeros, result.length)

}

async function fetchData(url){
    try{
        console.log(url)
        let response=await fetch(url, {method: "GET"})
        console.log(response);
        if(response.ok){
            console.log('Inside')
            return response.json()
        }
    }
    catch(err){
        console.log(err)
    }
}
getAllSuperheros()


// [ API example :https://gateway.marvel.com:443/v1/public/characters?ts=<time-stamp>&apikey=<public-key>&hash=<md5(ts+privateKey+publicKey)>]