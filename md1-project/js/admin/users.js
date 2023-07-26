// get information from localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// render user information to the list
let usersTable = document.querySelector('.projects');
console.log(usersTable);

// add user into users table
let tableBody = document.getElementsByTagName('tbody')[0];
console.log(tableBody);

function renderUsers(users) {
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
        userAction.setAttribute('class','project-actions text-right');
        userAction.setAttribute('id', user.id);
        userAction.innerHTML = `
            <a class="btn btn-info btn-sm" href="#">
                <i class="fa-regular fa-pen-to-square">
                </i>
                Edit
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

