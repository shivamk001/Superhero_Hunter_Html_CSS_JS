let orderBy='name'
let limit=100
let allSuperHeros=[]

let displaySearchButton=document.getElementById('displaySearchButton')
let displayFavourites=document.getElementById('displayFavourites')
let searchBarDiv=document.getElementById('searchBarDiv')

let resultContainer=document.getElementById('resultContainer')
let resultContainerHeading=document.getElementById('result-container-heading')
let searchBarInput=document.getElementById('searchBar-input')
let searchBarClear=document.getElementById('searchBar-clear')
let searchBarButton=document.getElementById('searchBar-submit')
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
searchBarClear.addEventListener('click', ()=>{searchBarInput.value=''})

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

function displaySuperHeros(result){
    let favouriteSuperheros=JSON.parse(localStorage.getItem('favouriteSuperheros'));
    result.forEach(element => {
        
        let {id, thumbnail, name, description}=element

        let color=''
        if(favouriteSuperheros[id]){
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



function displayStoriesData(result, storiesContainer){

    result.forEach(element => {

        let {id, title, description, start}=element
        
        //let imagePath=thumbnail.path+'/portrait_xlarge.'+thumbnail.extension
        const storiesCard=document.createElement('div')
        storiesCard.classList.add('card')
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
        <div class="stories-details">
            <h1>${title}</h1>
            <p class="card-description-text">${description}</p>
            <!--<i data-id=${id} data-title=${title} class="fa-solid fa-star fa-xl" onclick="addToFavourites(this)"></i>-->
        </div>`

        storiesContainer.appendChild(storiesCard)
    });
}


async function openSuperHeroPage(){
    console.log(this);
    let {id, name, imagePath, description}=this
    //let {name, description, thumbnail, comics, events, series, stories}=this
    let publicKey=getPublicKey()
    let timestampHash=getHash()

    resultContainer.replaceChildren();
    let h1=document.createElement('h1')
    h1.textContent=name
    h1.style.color='white'
    h1.style.textAlign='center'
    resultContainer.appendChild(h1)

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
    resultContainer.appendChild(imageDescriptionContainer)


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
    resultContainer.appendChild(comicsSection)


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
    resultContainer.appendChild(eventsSection)


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
    resultContainer.appendChild(seriesSection)


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
    storiesContainer.classList.add('cards-container')
    displayStoriesData(stories.results, storiesContainer)
    storiesSection.appendChild(storiesContainer)
    resultContainer.appendChild(storiesSection)
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

    resultContainerHeading.innerText=`Showing search results for: ${input}`

    displaySuperHeros(result)

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
getAllSuperheros()


// function displayEventsData(result, eventsContainer){

//     result.forEach(element => {

//         let {id, thumbnail, title, description, start}=element
        
//         let imagePath=thumbnail.path+'/portrait_xlarge.'+thumbnail.extension
//         const comicsCard=document.createElement('div')
//         comicsCard.classList.add('superhero-card')
//         comicsCard.id=id
//         //comicsCard.addEventListener('click',openSuperHeroPage.bind({id, imagePath, description}))

        
//         title=title.slice(0,40)
//         console.log(title, title.length)
//         description=description && description.length>0?
//                             description.length<250  ? description : description.slice(0,250)+'...':
//                             'Description not available'

//         comicsCard.innerHTML=
//         `
//         <img src=${imagePath} alt=${title} />
//         <div class="card-details">
//             <h1>${title}</h1>
//             <p class="card-description-text">${description}</p>
//             <!--<i data-id=${id} data-title=${title} class="fa-solid fa-star fa-xl" onclick="addToFavourites(this)"></i>-->
//         </div>`

//         eventsContainer.appendChild(comicsCard)
//     });
// }



// function displaySeriesData(result, seriesContainer){

//     result.forEach(element => {

//         let {id, thumbnail, title, description, start}=element
        
//         let imagePath=thumbnail.path+'/portrait_xlarge.'+thumbnail.extension
//         const seriesCard=document.createElement('div')
//         seriesCard.classList.add('superhero-card')
//         seriesCard.id=id
//         //seriesCard.addEventListener('click',openSuperHeroPage.bind({id, imagePath, description}))

//         if(title){
//             if(description){
//                if(title.length>40){
//                 title=title.slice(0,40)+'...'
//                }
//             }
//             //if description does not exist let title be full length
//         }
//         console.log(title, title.length)
//         description=description && description.length>0?
//                             description.length<250  ? description : description.slice(0,250)+'...':
//                             'Description not available'

//         seriesCard.innerHTML=
//         `
//         <img src=${imagePath} alt=${title} />
//         <div class="card-details">
//             <h1>${title}</h1>
//             <p class="card-description-text">${description}</p>
//             <!--<i data-id=${id} data-title=${title} class="fa-solid fa-star fa-xl" onclick="addToFavourites(this)"></i>-->
//         </div>`

//         seriesContainer.appendChild(seriesCard)
//     });
// }