import { UserFeed, FeedComment, FeedLike } from "../js/contructor.js";

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

// prepare value to use for rendering
let fbLeftUserLink = document.getElementById('fb-left-user-link');
let createPostInputArea = document.getElementById('create-post-input');
let displayName = loginUser.firstName + ' ' + loginUser.lastName;
let navProfileAvatar = document.getElementById('nav-profile-avatar');
let friendsList = document.getElementById('friends-list');

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
    <div class="fb-left-nav-text"><a href="../html/user-profile.html?userId=${loginUser.id}">${displayName}</a></div>
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

function renderFriendsList() {
    activeUsers.forEach((user) => {
        // check if it is login user
        if (user.id !== loginUser.id) {
            let displayName = user.firstName + ' ' + user.lastName;
            let friendItem = document.createElement('div');
            friendItem.classList.add('friend-item');
            friendItem.innerHTML = `
                <div class="friend-avatar">
                    <a href="./user-profile.html?userId=${user.id}" target="_blank"><img class="home-feed-img" src="https://picsum.photos/50" alt="friend-avatar"></a>
                </div>
                <span class="friend-name">${displayName}</span>
            `;
            // add friend item to friends list
            friendsList.appendChild(friendItem);
        }
    })
}

// render feeds list
let allPosts = JSON.parse(localStorage.getItem('allPosts')) || [];
let comments = JSON.parse(localStorage.getItem('comments')) || [];
let likes = JSON.parse(localStorage.getItem('likes')) || [];

let homeFeedsList = document.getElementById('home-feeds-list');
function renderHomeFeedsList() {
    if (allPosts.length > 0) {
        allPosts.sort((a, b) => {
            let prevDate = new Date(a.createdAt);
            let nextDate = new Date(b.createdAt);
            return nextDate - prevDate;
        });
    }
    homeFeedsList.innerHTML = '';
    allPosts.forEach((post) => {
        let feedId = post.id;
        let userId = post.userId;
        let feedStatus = post.status;
        // get user name from userId
        let user = users.find((user) => user.id === userId);
        // check if user and feed are valid
        let check = user.status == 1 && feedStatus == 1;
        // check if the post is from login user
        let isLoginUser = post.userId === loginUser.id;
        // render post only user and feed are valid
        if (check) {
            let userName = user.firstName + " " + user.lastName;
            let content = post.content;
            let updatedAt = new Date(post.updatedAt);
            let date = updatedAt.toLocaleDateString("ja-JP");
            // create div and add the element
            let homeFeedItem = document.createElement('div');
            //set class and id for the home feed item div
            homeFeedItem.classList.add('home-feeds-item');
            homeFeedItem.setAttribute('id', `feed-${feedId}`);
            // create children div inside home feed item - item header
            let feedItemHeader = document.createElement('div');
            feedItemHeader.classList.add('feed-item-header');
            // create div to display user info
            let feedUserInfo = document.createElement('div');
            feedUserInfo.classList.add('feed-user-info');
            feedUserInfo.innerHTML = `
            <div class="feed-item-avatar">
                <img class="home-feed-img" src="https://picsum.photos/100" alt="feed-avatar">
            </div>
            <div class="feed-item-username">
                <div>${userName}</div>
                <span>${date}</span>
            </div>
            `;
            feedUserInfo.addEventListener('click', (e) => {
                window.location.href = `./user-profile.html?userId=${post.userId}`;
            })
            feedItemHeader.appendChild(feedUserInfo);
            // create children div - item content
            let feedItemContent = document.createElement('div');
            feedItemContent.classList.add('feed-item-caption');
            let feedContentText = document.createElement('div');
            feedContentText.innerText = content;
            feedItemContent.appendChild(feedContentText);
            // create a form to edit post content if it is login user post
            if (isLoginUser) {
                let feedUserActions = document.createElement('div');
                feedUserActions.classList.add('feed-user-actions');
                // create button to edit and delete
                let feedEditAction = document.createElement('a');
                feedEditAction.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
                let feedDeleteAction = document.createElement('a');
                feedDeleteAction.classList.add('delete-feed');
                feedDeleteAction.setAttribute('id', `delete-${feedId}`);
                feedDeleteAction.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
                // add actions to the div
                feedUserActions.appendChild(feedEditAction);
                feedUserActions.appendChild(feedDeleteAction);
                // add actions to feed header
                feedItemHeader.appendChild(feedUserActions);
                let feedEditContentArea = document.createElement('div');
                feedEditContentArea.classList.add('add-post-content');
                let feedEditForm = document.createElement('form');
                feedEditForm.classList.add("edit-feed-form");
                feedEditForm.setAttribute('id', `edit-feed-${feedId}`);
                let feedEditTextArea = document.createElement('textarea');
                feedEditTextArea.setAttribute('id', `edit-feedId-${feedId}`);
                feedEditTextArea.value = content;
                feedEditTextArea.addEventListener('focusout', (e) => {
                    e.preventDefault();
                    feedEditContentArea.style.display = 'none';
                    feedContentText.style.display = 'block';
                })
                feedEditForm.appendChild(feedEditTextArea);
                feedEditContentArea.appendChild(feedEditForm);
                // set edit area to hidden
                feedEditContentArea.style.display = 'none';
                feedItemContent.appendChild(feedEditContentArea);
                feedEditAction.addEventListener('click', (e) => {
                    e.preventDefault();
                    feedContentText.style.display = 'none';
                    feedEditContentArea.style.display = 'block';
                })
            }
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
            <div class="feed-item-likes" id="like-count-${feedId}">
                <i class="fa-solid fa-thumbs-up"></i>
                <span>5 (TO DO)</span>
            </div>
            <div class="feed-item-comments" id="comment-count-${feedId}">
                コメント10件 (TO DO)
            </div>
            `;
            // create children div - actions
            let feedItemActions = document.createElement('div');
            feedItemActions.classList.add('feed-item-actions');
            feedItemActions.innerHTML = `
            <div class="feed-item-action-like" id="add-like-${feedId}">
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
renderFriendsList();
renderHomeFeedsList();
// render comments list of each post
allPosts.forEach((post) => {
    let feedId = post.id;
    let userId = post.userId;
    let feedStatus = post.status;
    // get user name from userId
    let user = users.find((user) => user.id === userId);
    // check if post is valid 
    let check = user.status == 1 && feedStatus == 1;
    if (check) {
        renderCommentsList(feedId);
        renderLikeCount(feedId);
    }
})

// handle display logout container
navProfileAvatar.addEventListener('click', () => {
    let logoutContainer = document.querySelector('.user-logout');
    if (logoutContainer.style.display === 'none') {
        logoutContainer.style.display = 'block';
    } else {
        logoutContainer.style.display = 'none';
    }
})

// handle user logout 
let logoutAction = document.getElementById('logout');
logoutAction.addEventListener('click', () => {
    localStorage.removeItem('loginUser');
    window.location.href = '../html/home.html';
})


// create and add new post to the list
let createPostTextarea = document.getElementById('create-new-post');
let createPostBtn = document.getElementById('create-post-btn');
let createPostForm = document.getElementById('new-post-form');

// control behavior of textarea and button 
createPostTextarea.addEventListener('keyup', (e) => {
    e.preventDefault();
    if (createPostTextarea.value !== '') {
        createPostBtn.disabled = false;
        createPostBtn.classList.remove('disabled');
    } else {
        createPostBtn.disabled = true;
        createPostBtn.classList.add('disabled');
    }
})

// create new post and push to allPosts
createPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // initiate value of new post
    let id = Math.floor(Math.random() * 10000000);
    let userId = loginUser.id;
    let createdAt = new Date();
    let updatedAt = new Date();
    let content = createPostTextarea.value;
    // create new post
    let newPost = new UserFeed(id, userId, createdAt, updatedAt, content);
    allPosts.push(newPost);
    console.log(allPosts);
    localStorage.setItem('allPosts', JSON.stringify(allPosts));
    renderHomeFeedsList();
    createPostForm.reset();
})

// add event listener to home feeds
homeFeedsList.addEventListener('click', (e) => {
    console.log(e.target);
    // if target is the form, then add event press enter to submit a comment
    if (e.target.parentNode.tagName == "FORM") {
        console.log('form selected');
        let targetForm = e.target.parentNode;
        console.log(targetForm.id);
        let targetId = Number(targetForm.id.split("-").pop());
        console.log(targetId);
        // do actions based on the form (add-comment or edit-comment)
        // create new comment for target feed id 
        if (targetForm.id === `add-comment-${targetId}`) {
            let feedId = targetId;
            console.log(`target feed id: ${feedId}`);
            targetForm.addEventListener("keyup", (e) => {
                if (e.key === "Enter" && e.shiftKey) {
                    e.stopPropagation();
                    let commentText = e.target.value.trim();
                    if (commentText !== '') {
                        let commentId = Math.floor(Math.random() * 10000000);
                        let userId = loginUser.id;
                        let createdAt = new Date();
                        let updatedAt = new Date();
                        // create new comment object and push to the comments list
                        let newComment = new FeedComment(commentId, feedId, userId, commentText, createdAt, updatedAt);
                        comments.push(newComment);
                        localStorage.setItem('comments', JSON.stringify(comments));
                        targetForm.reset();
                        renderCommentsList(feedId);
                    }
                }
            })
        } // edit target comment 
        else if (targetForm.id === `edit-comment-${targetId}`) {
            let commentId = targetId;
            console.log(`edit comment ${commentId}`);
            targetForm.addEventListener("keyup", (e) => {
                if (e.key === "Enter" && e.shiftKey) {
                    e.stopPropagation();
                    console.log('Entered');
                    let commentText = e.target.value.trim();
                    if (commentText !== '') {
                        // find the index of target comment
                        let commentIndex = comments.findIndex((comment) => comment.commentId === commentId)
                        // update the content of comment if found
                        if (commentIndex !== -1) {
                            let targetComment = comments[commentIndex];
                            console.log(targetComment);
                            // update updatedAt and content
                            targetComment.commentText = commentText;
                            targetComment.updatedAt = new Date();
                            // update comments in local storage
                            localStorage.setItem('comments', JSON.stringify(comments));
                            renderCommentsList(targetComment.feedId);
                        }
                    }
                }
            })
        } // edit target feed id 
        else if (targetForm.id === `edit-feed-${targetId}`) {
            console.log(`edit feed comment ${targetId}`);
            targetForm.addEventListener("keyup", (e) => {
                if (e.key === "Enter" && e.shiftKey) {
                    e.stopPropagation();
                    console.log('Entered');
                    let newFeedContent = e.target.value.trim();
                    if (newFeedContent !== '') {
                        let postIndex = allPosts.findIndex(post => post.id == targetId);
                        if (postIndex !== -1) {
                            // update the content of the post with new content
                            let targetFeed = allPosts[postIndex];
                            targetFeed.content = newFeedContent;
                            targetFeed.updatedAt = new Date();
                            // update feed in local storage
                            localStorage.setItem('allPosts', JSON.stringify(allPosts));
                            // display the feed-item-caption  div
                            let feedContent = targetForm.parentNode.parentNode.childNodes[0];
                            feedContent.innerText = newFeedContent;
                            feedContent.style.display = 'block';
                            targetForm.parentNode.style.display = 'none';
                        }
                    }
                }
            })
        }
    }
    if (e.target.classList.contains('delete-comment')) {
        let target = e.target.id;
        let commentId = target.split("-")[1];
        console.log(commentId);
        Swal.fire({
            text: 'コメントを削除してよろしいでしょうか。',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#dedde1',
            confirmButtonColor: '#dc3545',
            confirmButtonText: '削除',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('confirmed');
                let commentIndex = comments.findIndex(comment => comment.commentId == commentId);
                console.log(commentIndex);
                if (commentIndex != -1) {
                    let feedId = Number(comments[commentIndex].feedId);
                    console.log(feedId);
                    // delete comment in comments list
                    comments.splice(commentIndex, 1);
                    console.log(comments);
                    // update local storage
                    localStorage.setItem('comments', JSON.stringify(comments));
                    // re-render comments list of the feed
                    renderCommentsList(feedId);
                }
            }
        })
    }
    if (e.target.parentNode.classList.contains('delete-feed')) {
        console.log('delete feed action');
        let target = e.target.parentNode.id;
        let feedId = target.split("-")[1];
        console.log(feedId);
        Swal.fire({
            title: 'フィードを削除します',
            text: '削除したフィードは取り戻せませんが、削除してもよろしいでしょうか。',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#dedde1',
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'フィードを削除',
        }).then((result) => {
            if (result.isConfirmed) {
                console.log('delete action confirmed');
                let feedIndex = allPosts.findIndex(post => post.id == feedId);
                if (feedIndex !== -1) {
                    // delete target feed
                    allPosts.splice(feedIndex, 1);
                    // update local storage
                    localStorage.setItem('allPosts', JSON.stringify(allPosts));
                    // render the home feeds list
                    renderHomeFeedsList();
                }
            }
        })
    }
    if (e.target.parentNode.classList.contains('feed-item-action-like')) {
        console.log('Clicked like action');
        let targetId = e.target.parentNode.id;
        console.log(targetId);
        let feedId = Number(targetId.split("-").pop());
        console.log(feedId);
        // check if login user like the feed or not
        let feedLikes = likes.filter((like) => { return like.feedId == feedId });
        console.log(feedLikes);
        let userLikeIndex = feedLikes.findIndex((like) => {
            console.log(like.userId);
            console.log(loginUser.id);
            return like.userId == loginUser.id;
        })
        console.log(userLikeIndex);
        // if -1 then add like to the feed
        if (userLikeIndex != -1) {
            // update state of like button
            console.log(e.target.parentNode);
            e.target.parentNode.classList.remove('clicked');
            // remove like
            likes.splice(userLikeIndex, 1);
            // update local storage
            localStorage.setItem('likes', JSON.stringify(likes));
            renderLikeCount(feedId);
        } else {
            let likeId = Math.floor(Math.random() * 10000000);
            let userLike = new FeedLike(likeId, feedId, loginUser.id);
            // add user like to likes list
            likes.push(userLike);
            // update state of like button
            e.target.parentNode.classList.add('clicked');
            // update local storage
            localStorage.setItem('likes', JSON.stringify(likes));
            renderLikeCount(feedId);
        }
    }
});

function renderCommentsList(feedId) {
    // get the comments list area by feed id
    let commentsListArea = document.getElementById(`list-${feedId}`);
    // clear content of the list
    commentsListArea.innerHTML = '';
    // get comments by feedId
    let feedComments = comments.filter((comment) => {
        return comment.feedId === feedId;
    })
    console.log(feedComments);
    let commentCount = feedComments.length;
    // add count to the feed
    let feedCommentCount = document.getElementById(`comment-count-${feedId}`);
    feedCommentCount.innerHTML = `
        コメント${commentCount}件
    `;
    // create layout for each comment
    feedComments.forEach((comment) => {
        // get the user information
        let user = users.find((user) => user.id === comment.userId);
        let userName = user.firstName + " " + user.lastName;
        if (user.status != 1) {
            userName += " (blocked)";
        }
        let commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        // create children div for comment-item
        let commentItemAvatar = document.createElement('div');
        commentItemAvatar.classList.add('comment-item-avar');
        commentItemAvatar.innerHTML = `
            <img class="home-feed-img" src="https://picsum.photos/100" alt="comment-avatar">
        `;
        let commentItemContent = document.createElement('div');
        commentItemContent.classList.add('comment-item-content');
        commentItemContent.setAttribute('id', comment.commentId);
        // create children div to display comment content
        let commentItemWrap = document.createElement('div');
        commentItemWrap.classList.add('wrap');
        commentItemWrap.innerHTML = `
            <div class="comment-username">${userName}</div>
            <div>${comment.commentText}</div> 
        `;
        //add the chilren divs to comment item content
        commentItemContent.appendChild(commentItemWrap);
        // if comment user is login user, render the form and allow edit, set it as hidden
        if (comment.userId === loginUser.id) {
            // create edit section and set it hidden
            let commentFormArea = document.createElement('div');
            commentFormArea.classList.add('add-post-content');
            let commentForm = document.createElement('form');
            commentForm.setAttribute('id', `edit-comment-${comment.commentId}`);
            let textArea = document.createElement('textarea');
            textArea.setAttribute('id', `commentId-${comment.commentId}`);
            textArea.value = comment.commentText;
            // add elements into commentFormArea
            commentForm.appendChild(textArea);
            commentFormArea.appendChild(commentForm);
            // set the form hidden
            commentFormArea.style.display = 'none';
            // when focus out of the form, hide it
            textArea.addEventListener('focusout', (e) => {
                e.stopPropagation();
                commentItemContent.classList.remove('edit');
                commentItemWrap.style.display = 'block';
                commentItemEdit.style.display = 'inline-block';
                commentItemDelete.style.display = 'inline-block';
                commentFormArea.style.display = 'none';
            })
            let commentItemEdit = document.createElement('a');
            commentItemEdit.innerText = '編集';
            commentItemEdit.addEventListener('click', (e) => {
                e.preventDefault();
                // adjust comment item content div
                commentItemContent.classList.add('edit');
                commentItemWrap.style.display = 'none';
                commentFormArea.style.display = 'block';
                commentItemEdit.style.display = 'none';
                commentItemDelete.style.display = 'none';
            })
            let commentItemDelete = document.createElement('a');
            commentItemDelete.innerText = '削除';
            commentItemDelete.classList.add('delete-comment');
            commentItemDelete.setAttribute('id', `delete-${comment.commentId}`);
            commentItemContent.appendChild(commentFormArea);
            commentItemContent.appendChild(commentItemEdit);
            commentItemContent.appendChild(commentItemDelete);
        }
        // add comment item content to the comment item
        commentItem.appendChild(commentItemAvatar);
        commentItem.appendChild(commentItemContent);
        commentsListArea.appendChild(commentItem);
    })
}

function renderLikeCount(feedId) {
    let feedLikes = likes.filter((like) => {
        return like.feedId == feedId;
    })
    let likesCount = feedLikes.length;
    let feedItemLikes = document.getElementById(`like-count-${feedId}`);
    feedItemLikes.innerHTML = `
        <i class="fa-solid fa-thumbs-up"></i>
        <span>${likesCount}</span>
    `;
    // check if login user liked the post
    let feedActionLike = document.getElementById(`add-like-${feedId}`);
    let userLikeIndex = feedLikes.findIndex(like => like.userId == loginUser.id);
    if (userLikeIndex != -1) {
        feedActionLike.classList.add('clicked');
    }
}