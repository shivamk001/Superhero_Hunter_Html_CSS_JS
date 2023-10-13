let superHeroContainer=document.getElementById('superhero-cards-container')
let favouriteSuperheros=JSON.parse(localStorage.getItem('favouriteSuperheros'))

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

function unFavouriteSuperhero(superhero){
    let id=superhero.getAttribute('data-id')
    let name=superhero.getAttribute('data-name')
    console.log(id+" "+name+" "+favouriteSuperheros[id])
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
function displayFavouriteSuperHeros(){
    
    console.log(favouriteSuperheros);
    let keys=Object.keys(favouriteSuperheros);
    console.log(keys)
    let result=keys.map(key=>favouriteSuperheros[key])
    console.log(result)
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
        <i data-id=${element.id} data-name=${name} class="fa-solid fa-star fa-xl" style={z-index: 1000} onclick="unFavouriteSuperhero(this)"></i>
        <div class="superhero-details-favourite">
            <h1>${name}</h1>
            <p class="descriptionText">${description}</p>
            </div>`

        superHeroContainer.appendChild(superheroCard)
    });
}
displayFavouriteSuperHeros()