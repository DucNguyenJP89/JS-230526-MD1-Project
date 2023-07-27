let users = JSON.parse(localStorage.getItem('users')) || [];
let feeds = JSON.parse(localStorage.getItem('allPosts')) || [];

// render user information to the list
let feedsTable = document.querySelector('.projects');

// add user into users table
let tableBody = document.getElementsByTagName('tbody')[0];

function renderFeeds() {
    tableBody.innerHTML = '';
    feeds.forEach((feed) => {
        let feedRow = document.createElement('tr');
        let feedId = document.createElement('td');
        feedId.innerText = feed.id;
        let user = users.find(user => user.id === feed.userId);
        let feedUser = document.createElement('td');
        let userName = user.firstName + ' ' + user.lastName;
        feedUser.innerHTML = `
            ${userName}
            <br>
            <small>${user.id}</small>
        `;
        let feedContent = document.createElement('td');
        feedContent.innerText = feed.content;
        let feedCreatedAt = document.createElement('td');
        if (feed.createdAt != undefined) {
            let createdAt = new Date(feed.createdAt);
            feedCreatedAt.innerText = createdAt.toDateString();
        }
        let feedUpdatedAt = document.createElement('td');
        if (feed.updatedAt != undefined) {
            let updatedAt = new Date(feed.updatedAt);
            feedUpdatedAt.innerText = updatedAt.toDateString();
        }
        // handle feed status
        let feedStatus = document.createElement('td');
        feedStatus.classList.add('project-state');
        let statusSpan = document.createElement('span');
        statusSpan.classList.add('badge');
        if (feed.status != 1) {
            statusSpan.classList.add('badge-danger');
            statusSpan.innerText = "Invalid";
        } else {
            statusSpan.classList.add('badge-success');
            statusSpan.innerText = "Valid";
        }
        // add span to userStatus
        feedStatus.appendChild(statusSpan);
        // add edit link
        let feedAction = document.createElement('td');
        feedAction.setAttribute('class', 'project-actions text-right');
        feedAction.setAttribute('id', `${feed.id}`);
        let feedStatusText = feed.status == 1 ? "Block" : "Activate"
        feedAction.innerHTML = `
            <a class="btn btn-info btn-sm" href="#">
                ${feedStatusText}
            </a>
        `;
        // add element to user row
        feedRow.appendChild(feedId);
        feedRow.appendChild(feedUser);
        feedRow.appendChild(feedContent);
        feedRow.appendChild(feedCreatedAt);
        feedRow.appendChild(feedUpdatedAt);
        feedRow.appendChild(feedStatus);
        feedRow.appendChild(feedAction);
        // add user row to table
        tableBody.appendChild(feedRow);
    })
}

if (feeds.length > 0) {
    renderFeeds();
}

// add event listener to handle update user
tableBody.addEventListener('click', (e) => {
    // check if update btn selected
    e.preventDefault();
    let target = e.target;
    console.log(target);
    if (target.parentNode.classList.contains('project-actions')) {
        console.log('selected');
        let feedId = Number(target.parentNode.id);
        let feedIndex = feeds.findIndex((feed) => feed.id == feedId);
        console.log(feedIndex);
        if (feedIndex !== -1) {
            let feed = feeds[feedIndex];
            // update status of feed
            if (target.innerText.trim() == 'Block') {
                feed.status = 9;
            } else if (target.innerText.trim() == 'Activate') {
                feed.status = 1;
            }
            // update localStorage
            localStorage.setItem('allPosts', JSON.stringify(feeds));
            renderFeeds();
        }
    }
})