let orderBy='name'
let limit=100
let allSuperHeros=[]

let displaySearchButton=document.getElementById('displaySearchButton')
let searchBarDiv=document.getElementById('searchBarDiv')

let mainContainer=document.getElementById('mainContainer')
let mainContainerHeading=document.getElementById('result-container-heading')
let searchBarInput=document.getElementById('searchBar-input')
let searchBarClear=document.getElementById('searchBar-clear')
let searchBarButton=document.getElementById('searchBar-submit')

let orderBySelect=document.getElementById("order-by-select")
let superHeroContainer=document.getElementById('superhero-cards-container')

let navbarButtonDiv=document.getElementById('navbarButtonDiv')

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

//open/close search bar on clicking search icon in navbar
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

//TO ADD REMOVE SUPERHERO FROM FAVOURITES
function addToFavourites(event){
    event.stopPropagation()//prevent propagation of event to parent elements
    console.log('Clicked');
    let superhero=event.target
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
            console.log(superhero.style.color);
        }
        else{
            //remove
            console.log('Remove');
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

//TO DISPLAY SUPERHEROS IN HOMEPAGE/ IN SEARCH RESULT
function displaySuperHeros(result){
    let favouriteSuperheros=JSON.parse(localStorage.getItem('favouriteSuperheros'));
    result.forEach(element => {
        
        let {id, thumbnail, name, description}=element

        let color=''
        if(favouriteSuperheros && favouriteSuperheros[id]){
            color='goldenrod'
        }
        else{
            color=''
        }
        //console.log(color);

        // if(name.length>20){
        //     console.log('Name:', name)
        // }

        // if(description.length>300){
        //     console.log('Description:', description)
        // }


        let imagePath=thumbnail.path+'/portrait_xlarge.'+thumbnail.extension
        const card=document.createElement('div')
        card.classList.add('card')
        card.id=id
        card.addEventListener('click',openSuperHeroPage.bind({id, name, imagePath, description}))

        name=name.toUpperCase()
        description=description.length>0?
                            description.length<250  ? description   : description.slice(0,250)+'...':
                            'Description not available'


        card.innerHTML=
        `
        <img src=${imagePath} alt=${name} />
        <div class="card-details">
            <h1 style="display: flex; height: 25%; text-align: center; align-items: center; justify-content: center">${name}</h1>
            <p class="card-description-text">${description}</p>
            <div class="iDiv">
                <i data-id=${id} data-name=${name} id=${id+"Star"}  class="fa-solid fa-star fa-xl tooltip-icon" style="color:${color};opacity: 1" onclick="addToFavourites(event)"></i>
                <span class="tooltip">Click to Fav/Unfav!</span>
            </div>


        </div>
        <span class="cloud">Click to open ${name}'s page!</span>
        `


        superHeroContainer.appendChild(card)
    });
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
        console.log(title, title.length)
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
    console.log(this);
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
    console.log('Comic Url:', url)
    let {data : comics}=await fetchData(url)
    console.log('ComicsData:', comics);
    console.log('Comics:', comics.results);
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
    console.log('Events Url:', url)
    let {data : events}=await fetchData(url)
    console.log('EventsData:', events);
    console.log('Events:', events.results);
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
    console.log('SERIES Url:', url)
    let {data : series}=await fetchData(url)
    console.log('SeriesData:', series);
    console.log('Series:', series.results);
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
    console.log('STORIES Url:', url)
    let {data : stories}=await fetchData(url)
    console.log('StoriesData:', stories);
    console.log('Stories:', stories.results);
    let storiesSection=document.createElement('section')
    storiesSection.classList.add('section')
    storiesSection.id='storiesSection'

    let h3Stories=document.createElement('h3')
    h3Stories.textContent='Stories'
    storiesSection.appendChild(h3Stories)
    

    let storiesContainer=document.createElement('div')
    storiesContainer.classList.add('stories-container')
    displayStoriesData(stories.results, storiesContainer)
    storiesSection.appendChild(storiesContainer)
    mainContainer.appendChild(storiesSection)
}

//TO SEARCH A SUPERHERO
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

    mainContainerHeading.innerText=`Showing search results for: ${input}`

    displaySuperHeros(result)

}

//TO GET TIMESTAMP TO FETCH DATA FROM MARVEL API
function getTimeStamp(){
    let timeStamp=Date.now().toString()
    return timeStamp
}

//TO GET PUBLIC KEY TO FETCH DATA FROM MARVEL API
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

//TO FETCH ALL SUPERHEROS DATA
async function getAllSuperheros(){
    let publicKey=getPublicKey()
    let timestampHash=getHash()
    let result=[]
    let limit=100
    let totalHeros=0
    let offset=0
    let index=0
    while(totalHeros<1563){
        
        let url=`https://gateway.marvel.com:443/v1/public/characters?offset=${offset}&orderBy=name&limit=${limit}&ts=${timestampHash[0]}&apikey=${publicKey}&hash=${timestampHash[1]}`
        //console.log(url)
        let data=await fetchData(url)
        result=[...result, ...data.data.results]; 
        allSuperHeros=[...allSuperHeros, ...data.data.results];
        //console.log("TotalHeros:", totalHeros," Offset:", offset," Index:", index, "Result:", result)
        displaySuperHeros(result.slice(index))
        totalHeros+=limit
        offset+=limit
        index+=limit
    }
    //console.log("Outside loop ",totalHeros, result.length)

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




//EVENT LISTENERS
displaySearchButton.addEventListener('click', toggleSearchBar)
orderBySelect.addEventListener('click', ()=>{orderBy=orderBySelect.value})
searchBarClear.addEventListener('click', ()=>{searchBarInput.value=''})
searchBarButton.addEventListener('click', searchSuperHero)




getAllSuperheros()

