import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if (e.target.id === 'reply-btn' && e.target.dataset.comment){
        handleCommentReplyClick(e.target.dataset.comment)
    } 
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

//handle any replies to the tweets
function handleCommentReplyClick(commentId){
    
    const replyInput = document.getElementById(`reply-${commentId}`)
    
    const targetCommentObj = tweetsData.filter(function(tweet){
        return tweet.uuid === commentId 
    })[0]
     
     let replyObj = {

                handle: `@Duke💡`,
                profilePic: `/scrimbalogo.png`,
                tweetText: `${replyInput.value}`,    
    }
   
    
    if (replyInput.value){
        targetCommentObj.replies.push(replyObj) 
    } 
    replyInput.value = ''
    render()
 
}



//runs when the tweet button is clicked
function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Duke💡`,
            profilePic: `/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

//Get html feed which will be rendered later
function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        //html for the comments/replies that pop up when button is clicked
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                
                repliesHtml+=`  
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>   
                            </div>
                        </div>
                </div>
                `
            }) //ends the forEach function
            repliesHtml+=`<div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="/scrimbalogo.png" class="profile-pic">
                            <div>
                                <p class="handle">@scrimba</p>
                                <input data-input =${tweet.uuid} type="text" placeholder="comment" id="reply-${tweet.uuid}">  
                            </div>
                        </div>
                        <button data-comment = ${tweet.uuid} id="reply-btn"> reply </button>
                </div>`
        } else if (tweet.replies.length === 0){
            
            repliesHtml +=`
            <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="/scrimbalogo.png" class="profile-pic">
                            <div>
                                <p class="handle">@scrimba</p> 
                                <input data-input =${tweet.uuid} type="text" placeholder="comment" id="reply-${tweet.uuid}"> 
                            </div>
                        </div>
                        <button data-comment =${tweet.uuid} id="reply-btn"> reply </button>
                </div>
            `
        }
        
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
        
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

