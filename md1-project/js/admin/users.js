// get information from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// render user information to the list
let usersTable = document.querySelector('.projects');

// add user into users table
let tableBody = document.getElementsByTagName('tbody')[0];

function renderUsers(users) {
    tableBody.innerHTML = '';
    users.forEach((user) => {
        let userRow = document.createElement('tr');
        let userId = document.createElement('td');
        userId.innerText = user.id;
        let userName = document.createElement('td');
        userName.innerText = user.firstName + ' ' + user.lastName;
        let userEmail = document.createElement('td');
        userEmail.innerText = user.email;
        let userPassword = document.createElement('td');
        userPassword.innerText = user.password;
        let userDate = document.createElement('td');
        if (user.joinedAt != undefined) {
            let joinedAt = new Date(user.joinedAt);
            userDate.innerText = joinedAt.toDateString();
        }
        // handle user status
        let userStatus = document.createElement('td');
        userStatus.classList.add('project-state');
        let statusSpan = document.createElement('span');
        statusSpan.classList.add('badge');
        if (user.status != 1) {
            statusSpan.classList.add('badge-danger');
            statusSpan.innerText = `Status: ${user.status}`;
        } else {
            statusSpan.classList.add('badge-success');
            statusSpan.innerText = "Active";
        }
        // add span to userStatus
        userStatus.appendChild(statusSpan);
        // add edit link
        let userAction = document.createElement('td');
        userAction.setAttribute('class', 'project-actions text-right');
        userAction.setAttribute('id', `${user.id}`);
        let userStatusText = user.status == 1 ? "Block" : "Activate"
        userAction.innerHTML = `
            <a class="btn btn-info btn-sm" href="#">
                ${userStatusText}
            </a>
        `;
        // add element to user row
        userRow.appendChild(userId);
        userRow.appendChild(userName);
        userRow.appendChild(userEmail);
        userRow.appendChild(userPassword);
        userRow.appendChild(userDate);
        userRow.appendChild(userStatus);
        userRow.appendChild(userAction);
        // add user row to table
        tableBody.appendChild(userRow);
    })
}

if (users.length > 0) {
    renderUsers(users);
}

// add event listener to handle update user
tableBody.addEventListener('click', (e) => {
    // check if update btn selected
    e.preventDefault();
    let target = e.target;
    if (target.parentNode.classList.contains('project-actions')) {
        console.log('selected');
        let userId = Number(target.parentNode.id);
        let userIndex = users.findIndex((user) => user.id == userId);
        console.log(userIndex);
        console.log(target.innerText.trim() == 'Block');
        if (userIndex !== -1) {
            let user = users[userIndex];
            // update status of user
            if (target.innerText.trim() == 'Block') {
                user.status = 9;
            } else if (target.innerText.trim() == 'Activate') {
                user.status = 1;
            }
            // update localStorage
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers(users);
        }
    }
})
