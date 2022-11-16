const loader = document.querySelector('#loader')
async function theStories(choosenStories){
    let response = await fetch(`https://hacker-news.firebaseio.com/v0/${choosenStories}stories.json?print=pretty`)
    let data = await response.json()
    // Max to set is 200 because thats all ask show and job can provide
    data.length = 100
    data.forEach(async function(ele){
        let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ele}.json?print=pretty`)
        let data = await response.json()
        let card = document.createElement("div")
        card.classList.add("card", "news-card")

        // Card Header Section
        let cardHeader = document.createElement("div")
        cardHeader.classList.add("card-header")
        let titleH = document.createElement("h5")
        titleH.innerHTML = data.title
        cardHeader.appendChild(titleH)
        let authorP = document.createElement("p")
        authorP.innerHTML = `By: ${data.by}`
        cardHeader.appendChild(authorP)
        card.appendChild(cardHeader)
        
        // Card Body Section
        let cardBody = document.createElement("div")
        cardBody.classList.add("card-body")
        if(choosenStories !== "job"){
            let score = document.createElement("p")
            score.innerHTML = `Story score: ${data.score}`
            cardBody.appendChild(score)
            let numComments = document.createElement("p")
            let commentA = document.createElement("a")
            commentA.innerHTML = data.descendants
            commentA.classList.add("link-primary")
            numComments.innerHTML = "Comments: "
            numComments.appendChild(commentA)
            cardBody.appendChild(numComments)
        
            // comments list
            let commentUl = document.createElement("ul")
            commentUl.style.display = "none"
            if(data.kids){
                data.kids.forEach(async function(ele){
                    let response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${ele}.json?print=pretty`)
                    let comment = await response.json()
                    let commentLi = document.createElement("li")
                    commentLi.innerHTML = comment.text
                    commentUl.appendChild(commentLi)
                })
            }
            commentA.addEventListener("click", function(){
                if(commentUl.style.display === "block"){
                    commentUl.style.display = "none"
                }else{
                    commentUl.style.display = "block"
                }
            })
            cardBody.appendChild(commentUl)
        }

        // view story button
        let linkBtn = document.createElement("a")
        linkBtn.classList.add("btn", "btn-primary")
        linkBtn.href = data.url
        linkBtn.innerHTML = "View Page"
        cardBody.appendChild(linkBtn)

        card.appendChild(cardBody)

        // append whole card to the container
        document.querySelector(".container").append(card)
    })
    loader.style.display = 'none'
}

// removes old stories when something else is choosen
function removeAllStories() {
    let parent = document.querySelector(".container")
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}


// choosing what stories to see
let choosenStories = "top"
let storiesSpan = document.querySelector("#set-stories")
theStories(choosenStories)
let topStoriesTab = document.querySelector("#top")
topStoriesTab.addEventListener("click", function(){changeStories("top")})
let newStoriesTab = document.querySelector("#new")
newStoriesTab.addEventListener("click", function(){changeStories("new")})
let bestStoriesTab = document.querySelector("#best")
bestStoriesTab.addEventListener("click", function(){changeStories("best")})
let askStoriesTab = document.querySelector("#ask")
askStoriesTab.addEventListener("click", function(){changeStories("ask")})
let showStoriesTab = document.querySelector("#show")
showStoriesTab.addEventListener("click", function(){changeStories("show")})
let jobStoriesTab = document.querySelector("#job")
jobStoriesTab.addEventListener("click", function(){changeStories("job")})

function changeStories(story){
    choosenStories = story
    removeAllStories()
    loader.style.display = 'block'
    storiesSpan.innerHTML = story
    theStories(choosenStories)
}

