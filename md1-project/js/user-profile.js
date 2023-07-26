import { UserFeed, FeedComment } from "../js/contructor.js";

//get login user
let loginUser = JSON.parse(localStorage.getItem('loginUser')) || null;
// if no login user, redirect to login page
if (loginUser === null) {
    window.location.href = "../html/login.html";
}

let users = JSON.parse(localStorage.getItem('users')) || [];
let activeUsers = users.filter((user) => {
    return user.status == 1;
})

// get user id from query params
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let userProfileId = Number(urlParams.get('userId'));
console.log(userProfileId);

// prepare value to use for rendering
let fbLeftUserLink = document.getElementById('fb-left-user-link');
let createPostInputArea = document.getElementById('create-post-input');
let displayName = loginUser.firstName + ' ' + loginUser.lastName;
let navProfileAvatar = document.getElementById('nav-profile-avatar');

// get posts and comments to display
let allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];
let comments = JSON.parse(localStorage.getItem('comments')) || [];

let userPosts = allPosts.filter((post) => {
    return post.userId == userProfileId;
})
console.log(allPosts);

// render profile picture on navbar
function renderNavBarAvatar() {
    navProfileAvatar.innerHTML = `
        <img src="https://picsum.photos/100" alt="profile-avatar">
        <div class="icon-wrap"><i class="fa-solid fa-chevron-down"></i></div>
    `
};

// render user info on left navigation
function renderUserLeftNav() {
    fbLeftUserLink.innerHTML = `
    <div class="fb-left-nav-icon"><img src="https://picsum.photos/100" alt="fb-left-nav-avatar"></div>
    `
}

// render user info on create post section
function renderUserCreatePost() {
    createPostInputArea.innerHTML = `
        <div class="create-post-avatar">
            <img src="https://picsum.photos/100" alt="avatar">
        </div>
        <div class="add-post-content">
            <form id="new-post-form">
                <textarea type="text" name="create-post" id="create-new-post" placeholder="${displayName}さん、その気持ち、シェアしよう"></textarea>
                <button type="submit" class="create-post-btn disabled" id="create-post-btn" disabled>投稿</button>
            </form>
        </div>
     `
}

let homeFeedsList = document.getElementById('home-feeds-list');
function renderHomeFeedsList() {
    if (userPosts.length > 0) {
        allPosts.sort((a, b) => {
            let prevDate = new Date(a.createdAt);
            let nextDate = new Date(b.createdAt);
            return nextDate - prevDate;
        });
    }
    homeFeedsList.innerHTML = '';
    userPosts.forEach((post) => {
        let feedId = post.id;
        let userId = post.userId;
        // get user name from userId
        let user = users.find((user) => user.id === userId);
        if (user.status == 1) {
            let userName = user.firstName + " " + user.lastName;
            let content = post.content;
            let updatedAt = new Date(post.updatedAt);
            let date = updatedAt.toDateString();
            // create div and add the element
            let homeFeedItem = document.createElement('div');
            //set class and id for the home feed item div
            homeFeedItem.classList.add('home-feeds-item');
            homeFeedItem.setAttribute('id', `feed-${feedId}`);
            // create children div inside home feed item - item header
            let feedItemHeader = document.createElement('div');
            feedItemHeader.classList.add('feed-item-header');
            feedItemHeader.innerHTML = `
            <div class="feed-item-avatar">
                <img class="home-feed-img" src="https://picsum.photos/100" alt="feed-avatar">
            </div>
            <div class="feed-item-username">
                <div>${userName}</div>
                <span>${date}</span>
            </div>
        `;
            // create children div - item content
            let feedItemContent = document.createElement('div');
            feedItemContent.classList.add('feed-item-caption');
            feedItemContent.innerText = content;
            // create children div - image
            let feedItemImage = document.createElement('div');
            feedItemImage.classList.add('feed-item-image');
            feedItemImage.innerHTML = `
            <img class="img-first" src="https://picsum.photos/800" alt="image">
        `;
            // create children div - likes and comments count
            let feedItemReactions = document.createElement('div');
            feedItemReactions.classList.add('feed-item-reactions');
            feedItemReactions.innerHTML = `
            <div class="feed-item-likes">
                <i class="fa-solid fa-thumbs-up"></i>
                <span>5 (TO DO)</span>
            </div>
            <div class="feed-item-comments">
                コメント10件 (TO DO)
            </div>
        `;
            // create children div - actions
            let feedItemActions = document.createElement('div');
            feedItemActions.classList.add('feed-item-actions');
            feedItemActions.innerHTML = `
            <div class="feed-item-action-like" id="like-${feedId}">
                <i class="fa-regular fa-thumbs-up"></i>
                <span>いいね！</span>
            </div>
            <div class="feed-item-action-comment">
                <a href="#feedId-${feedId}"><i class="fa-regular fa-message"></i>
                <span>コメント</span></a>
            </div>
        `;
            // create children div - comments list
            let feedItemCommentsList = document.createElement('div');
            feedItemCommentsList.classList.add('feed-item-comments-list');
            // create div for showing comments
            let commentsListArea = document.createElement('div');
            commentsListArea.classList.add('comments-list-area');
            commentsListArea.setAttribute('id', `list-${feedId}`);
            // create comment input area inside comments list
            let addPostComment = document.createElement('div');
            addPostComment.classList.add('add-post-comment');
            addPostComment.innerHTML = `
            <div class="add-post-avatar">
                <img class="home-feed-img" src="https://picsum.photos/100" alt="user-avatar">
             </div>
            <div class="add-post-content">
                <form id="add-comment-${feedId}"><textarea name="add-post-content" id="feedId-${feedId}" placeholder="コメントを入力"></textarea></form>
            </div>
        `;
            // add comment input section into comments list
            feedItemCommentsList.appendChild(commentsListArea);
            feedItemCommentsList.appendChild(addPostComment);
            // add children divs to home feed item
            homeFeedItem.appendChild(feedItemHeader);
            homeFeedItem.appendChild(feedItemContent);
            homeFeedItem.appendChild(feedItemImage);
            homeFeedItem.appendChild(feedItemReactions);
            homeFeedItem.appendChild(feedItemActions);
            homeFeedItem.appendChild(feedItemCommentsList);
            // add home feed item to list
            homeFeedsList.appendChild(homeFeedItem);
        }
    })
}

renderNavBarAvatar();
renderUserLeftNav();
renderUserCreatePost();
renderHomeFeedsList();