//import {getHash, getPublicKey, getTimeStamp, fetchData} from './index.js'

let navbarButtonDiv=document.getElementById('navbarButtonDiv')
let searchBarDiv=document.getElementById('searchBarDiv')
let mainContainer=document.getElementById('mainContainer')
let superHeroContainer=document.getElementById('superhero-cards-container')
let favouriteSuperheros=JSON.parse(localStorage.getItem('favouriteSuperheros'))

//TO DISPLAY TOAST ON ADDING TO FAVOURITES/REMOVING FROM FAVOURITES
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

//TO GET TIMESTAMP TO FETCH DATA FROM MARVEL API
function getTimeStamp(){
    let timeStamp=Date.now().toString()
    return timeStamp
}

//TO GET TIMESTAMP TO FETCH DATA FROM MARVEL API
function getPublicKey(){
    const publicKey='84e760e71f426db6089f9b7f40c85919'
    return publicKey
}

//TO GET HASH TO FETCH DATA FROM MARVEL API
function getHash(){
    let publicKey=getPublicKey()
    const privateKey='bfa58e25d86f1fdbd11b0f1610960ade4fc5c36b'
    let timeStamp=getTimeStamp()
    let hash=CryptoJS.MD5(timeStamp+privateKey+publicKey).toString()
    return [timeStamp, hash]
}

//FETCHES DATA FROM API
async function fetchData(url){
    try{
        //console.log(url)
        let response=await fetch(url, {method: "GET"})
        //console.log(response);
        if(response.ok){
            //console.log('Inside')
            return response.json()
        }
    }
    catch(err){
        console.log(err)
    }
}



//TO UNFAVOURITE A SUPERHERO
function unFavouriteSuperhero(event){
    event.stopPropagation()
    let superhero=event.target
    let id=superhero.getAttribute('data-id')
    let name=superhero.getAttribute('data-name')
    //console.log(id+" "+name+" "+favouriteSuperheros[id])
    if(favouriteSuperheros[id]!=undefined){
        delete favouriteSuperheros[id]
        localStorage.setItem('favouriteSuperheros', JSON.stringify(favouriteSuperheros))
        superhero.style.color=''
        Toast.fire({
            icon: 'success',
            title: `${name} successfully removed from Favourites!`
        })
        setTimeout(()=>{location.reload()}, 1000)
        
    }
}

//TO DISPLAY COMICS DATA, EVENTS DATA, SERIES DATA IN SUPERHERO PAGE
function displayData(result, container){

    result.forEach(element => {

        let {id, thumbnail, title, description, images}=element
        
        let imagePath=thumbnail.path+'/portrait_xlarge.'+thumbnail.extension
        const card=document.createElement('div')
        card.classList.add('card')
        card.id=id
        //card.addEventListener('click',openSuperHeroPage.bind({id, imagePath, description}))

        
        title=title.slice(0,40)
        //console.log(title, title.length)
        description=description && description.length>0?
                            description.length<250  ? description : description.slice(0,250)+'...':
                            'Description not available'

        card.innerHTML=
        `
        <img src=${imagePath} alt=${title} />
        <div class="card-details">
            <h1>${title}</h1>
            <p class="card-description-text">${description}</p>
            <!--<i data-id=${id} data-title=${title} class="fa-solid fa-star fa-xl" onclick="addToFavourites(this)"></i>-->
        </div>`

        container.appendChild(card)
    });
}

//TO DISPLAY STORIES DATA IN SUPERHERO PAGE
function displayStoriesData(result, storiesContainer){

    result.forEach(element => {

        let {id, title, description, start}=element
        
        //let imagePath=thumbnail.path+'/portrait_xlarge.'+thumbnail.extension
        const storiesCard=document.createElement('div')
        storiesCard.classList.add('stories-card')
        storiesCard.id=id
        //storiesCard.addEventListener('click',openSuperHeroPage.bind({id, imagePath, description}))

        if(title){
            if(description){
               if(title.length>30){
                title=title.slice(0,30)+'...'
               }
            }
            //if description does not exist let title be full length
        }
        console.log(title, title.length)
        description=description && description.length>0?
                            description.length<250  ? description : description.slice(0,250)+'...':
                            'Description not available'

        storiesCard.innerHTML=
        `
        <h1>${title}</h1>
        <p class="card-description-text">${description}</p>
        `

        storiesContainer.appendChild(storiesCard)
    });
}

//TO DISPLAY SUPERHERO PAGE
async function openSuperHeroPage(){
    //console.log(this);
    let {id, name, imagePath, description}=this
    //let {name, description, thumbnail, comics, events, series, stories}=this
    let publicKey=getPublicKey()
    let timestampHash=getHash()

    navbarButtonDiv.innerHTML=`
        <a href="index.html" id="displayFavourites" class="navbarButton tooltip-icon"><i class="fa-solid fa-house fa-xl" style="color: aliceblue;"></i></a>
        <div class="tooltip" style="top: 10%; left: 90%; width: 10%;">Go to home page</div>
        <a href="favourites.html" id="displayFavourites" class="navbarButton tooltip-icon" target="_blank"><i class="fa-regular fa-star fa-xl" style="color: aliceblue;"></i></a>
        <div class="tooltip" style="top: 10%; left: 90%; width: 10%;">Go to favourites page</div>
    `

    searchBarDiv.remove()

    mainContainer.replaceChildren();
    let h1=document.createElement('h1')
    h1.textContent=name
    h1.style.color='white'
    h1.style.textAlign='center'
    mainContainer.appendChild(h1)

    let imageDescriptionContainer=document.createElement('section')
    imageDescriptionContainer.classList.add('imageDescriptionContainer')
    let img=document.createElement('img')
    img.setAttribute('src', imagePath)
    img.setAttribute('alt', this.name)
    imageDescriptionContainer.appendChild(img)
    description=description.length>0? this.description :'Description not available'
    let descriptionDiv=document.createElement('div')
    descriptionDiv.classList.add('descriptionSuperHeroPage')
    let p=document.createElement('p')
    p.textContent=description
    p.style.color='white'
    descriptionDiv.appendChild(p)
    imageDescriptionContainer.appendChild(descriptionDiv)
    mainContainer.appendChild(imageDescriptionContainer)


    //COMICS
    let url=`https://gateway.marvel.com:443/v1/public/characters/${id}/comics?ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
    //console.log('Comic Url:', url)
    let {data : comics}=await fetchData(url)
    //console.log('ComicsData:', comics);
    //console.log('Comics:', comics.results);
    let comicsSection=document.createElement('section')
    comicsSection.classList.add('section')
    comicsSection.id='comicsSection'

    let h3Comics=document.createElement('h3')
    h3Comics.textContent='Comics'
    comicsSection.appendChild(h3Comics)

    let comicsContainer=document.createElement('div')
    comicsContainer.classList.add('cards-container')
    displayData(comics.results, comicsContainer)
    comicsSection.appendChild(comicsContainer)
    mainContainer.appendChild(comicsSection)


    //EVENTS
    url=`https://gateway.marvel.com:443/v1/public/characters/${id}/events?ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
    //console.log('Events Url:', url)
    let {data : events}=await fetchData(url)
    //console.log('EventsData:', events);
    //console.log('Events:', events.results);
    let eventsSection=document.createElement('section')
    eventsSection.classList.add('section')
    eventsSection.id='eventsSection'

    let h3Events=document.createElement('h3')
    h3Events.textContent='Events'
    eventsSection.appendChild(h3Events)

    let eventsContainer=document.createElement('div')
    eventsContainer.classList.add('cards-container')
    displayData(events.results, eventsContainer)
    eventsSection.appendChild(eventsContainer)
    mainContainer.appendChild(eventsSection)


    //SERIES    
    url=`https://gateway.marvel.com:443/v1/public/characters/${id}/series?ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
    //console.log('SERIES Url:', url)
    let {data : series}=await fetchData(url)
    //console.log('SeriesData:', series);
    //console.log('Series:', series.results);
    let seriesSection=document.createElement('section')
    seriesSection.classList.add('section')
    seriesSection.id='seriesSection'

    let h3Series=document.createElement('h3')
    h3Series.textContent='Series'
    seriesSection.appendChild(h3Series)

    let seriesContainer=document.createElement('div')
    seriesContainer.classList.add('cards-container')
    displayData(series.results, seriesContainer)
    seriesSection.appendChild(seriesContainer)
    mainContainer.appendChild(seriesSection)


    //STORIES
    url=`https://gateway.marvel.com:443/v1/public/characters/${id}/stories?ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
    //console.log('STORIES Url:', url)
    let {data : stories}=await fetchData(url)
    //console.log('StoriesData:', stories);
    //console.log('Stories:', stories.results);
    let storiesSection=document.createElement('section')
    storiesSection.classList.add('section')
    storiesSection.id='storiesSection'

    let h3Stories=document.createElement('h3')
    h3Stories.textContent='Stories'
    storiesSection.appendChild(h3Stories)
    

    let storiesContainer=document.createElement('div')
    storiesContainer.classList.add('cards-container')
    displayStoriesData(stories.results, storiesContainer)
    storiesSection.appendChild(storiesContainer)
    mainContainer.appendChild(storiesSection)
}


//TO DISPLAY ALL SUPERHEROS IN FAVOURITES PAGE
function displayFavouriteSuperHeros(){
    
    //console.log(favouriteSuperheros);
    let keys=Object.keys(favouriteSuperheros);
    //console.log(keys)
    let result=keys.map(key=>favouriteSuperheros[key])
    //console.log(result)
    result.forEach(element => {

        let {id, thumbnail, name, description}=element
        //console.log(id, thumbnail, name, description)


        let imagePath=thumbnail.path+'/portrait_xlarge.'+thumbnail.extension
        name=element.name.toUpperCase()
        description=element.description.length>0?
                            element.description.length<250  ? element.description   : element.description.slice(0,250)+'...':
                            'Description not available'

        const card=document.createElement('div')
        card.classList.add('superhero-card')
        card.id=element.id
        card.addEventListener('click',openSuperHeroPage.bind({id, name, imagePath, description}))



        card.innerHTML=
        `
        <img src=${imagePath} alt=${name} />
        <i data-id=${id} data-name=${name} class="fa-solid fa-star fa-xl tooltip-icon" style={z-index: 1000} onclick="unFavouriteSuperhero(event)"></i>
        <span class="tooltip" style="top: 110%; left: 60%;">Click to Unfavourite</span>
        <div class="superhero-details-favourite tooltip-icon">
            <h1>${name}</h1>
            <p class="descriptionText">${description}</p>
        </div>
        <span class="tooltip" style="top: -30%; left: 50%;">Click to open ${name}'s page!</span>
        `

        superHeroContainer.appendChild(card)
    });
}
displayFavouriteSuperHeros()