import { User } from './contructor.js';
// check if user already logged in, then redirect to home page
let currentUser = JSON.parse(localStorage.getItem('loginUser')) || null;
if (currentUser && currentUser.status == 1) {
    window.location.href = '../html/home.html';
}

// get element for register form
let registerOpenBtn = document.getElementById('register-form-open');
let registerFormSection = document.getElementById('register-form-section');
let registerForm = document.getElementById('register-form');
let registerCloseBtn = document.getElementById('register-form-close');
let registerSubmitBtn = document.getElementById('register-submit');

// get info and validate when register new user
let regFirst = document.getElementById('register-first');
let regLast = document.getElementById('register-last');
let regEmail = document.getElementById('register-email');
let regPassword = document.getElementById('register-password');
let regDobYear = document.getElementById('dob-year');
let regDobMonth = document.getElementById('dob-month');
let regDobDay = document.getElementById('dob-day');
let regGender = document.getElementsByName('gender');

// initiate error message element
let regFirstError = document.getElementById('error-first');
let regLastError = document.getElementById('error-last');
let regEmailError = document.getElementById('error-email');
let regPwError = document.getElementById('error-password');

// initiate users list
let users = JSON.parse(localStorage.getItem('users')) || [];

// open register form when clicking button create new account
registerOpenBtn.addEventListener('click', function (e) {
    e.preventDefault();
    console.log('clicked');
    registerFormSection.style.display = 'block';
});

// close the reg form and clear all values
registerCloseBtn.addEventListener('click', function () {
    // reset form
    registerForm.reset();
    // clear error
    clearRegFormError();
    registerFormSection.style.display = 'none';
})

// get value of gender
function getGenderValue(e) {
    for (let i = 0; i < e.length; i++) {
        if (e[i].checked) {
            return e[i].value;
        }
    }
}

// function reset register form to default value
function clearRegFormError() {
    regFirst.classList.remove('error');
    regFirstError.innerText = '';
    regLast.classList.remove('error');
    regLastError.innerText = '';
    regEmail.classList.remove('error');
    regEmailError.innerText = '';
    regPassword.classList.remove('error');
    regPwError.innerText = '';
}

// check empty for required fields
let regInputGrp = document.getElementById('register-input-group');
regInputGrp.addEventListener('focusout', event => {
    console.log('focus out');
    if (event.target.value == '') {
        event.target.classList.add('error');
        switch (event.target.id) {
            case 'register-first':
                regFirstError.innerText = '姓は必須項目です';
                break;
            case 'register-last':
                regLastError.innerText = '名は必須項目です';
                break;
            case 'register-email':
                regEmailError.innerText = 'メールアドレスは必須項目です';
                break;
            case 'register-password':
                regPwError.innerText = 'パスワードは必須項目です';
                break;
        }
    }
});

// remove error when focusing on the target field
regInputGrp.addEventListener('focusin', event => {
    console.log('focus in');
    event.target.classList.remove('error');
    switch (event.target.id) {
        case 'register-first':
            regFirstError.innerText = '';
            break;
        case 'register-last':
            regLastError.innerText = '';
            break;
        case 'register-email':
            regEmailError.innerText = '';
            break;
        case 'register-password':
            regPwError.innerText = '';
            break;
    }
})

// check email existence
function checkEmailExist(email) {
    let result = users.findIndex(e => e.email === email);
    // return true if existence, else return false
    return result !== -1;
}

// validate email address
let emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
function validateRegEmail(email) {
    let isValid = false;
    let error = '';
    if (email == '') {
        error = 'Email address cannot be empty';
    } else {
        let patternCheck = emailPattern.test(email);
        if (patternCheck) {
            let isEmailExist = checkEmailExist(email);
            if (isEmailExist) {
                error = 'メールアドレスは既に存在しました';
            } else {
                console.log('valid email');
                isValid = true;
            }
        } else {
            error = 'メールアドレスの形式は正しくありません';
        }
    }
    if (!isValid) {
        regEmail.classList.add('error');
        regEmailError.innerText = error;
    } else {
        return true;
    }
}

// validate password
// initiate pw pattern
let pwPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

//validate register password
function validateRegPassword(password) {
    let isValid = false;
    let error = '';
    if (password == '') {
        error = 'Password cannot be empty';
    } else {
        let patternCheck = pwPattern.test(password);
        if (patternCheck) {
            isValid = true;
        } else {
            error = `
                <ul>
                    <li>メールアドレスは8文字以上であること</li>
                    <li>大文字、小文字、数値はそれぞれ1文字以上であること</li>
                    <li>よく使われる、かつ推測しやすいフレーズは使わないこと</li>
                </ul>
            `;
        }
    }
    if (!isValid) {
        regPassword.classList.add('error');
        regPwError.innerHTML = error;
    } else {
        return true;
    }
}


// validate form 
function validateRegForm() {
    if (validateRegEmail(regEmail.value) && validateRegPassword(regPassword.value)) {
        return true;
    } else {
        return false;
    }
}

// validate fields when click submit button
registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = validateRegForm();
    if (isValid) {
        let id = Math.floor(Math.random() * 10000000);
        let firstName = regFirst.value;
        let lastName = regLast.value;
        let email = regEmail.value;
        let password = regPassword.value;
        let birthday = regDobYear.value.concat("-", regDobMonth.value, "-", regDobDay.value);
        let gender = getGenderValue(regGender);
        let joinedAt = new Date();
        let user = new User(id, firstName, lastName, email, password, birthday, gender, joinedAt);
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        Swal.fire({
            title: 'アカウント登録は完了です',
            confirmButtonColor: '#1877f2',
            confirmButtonText: 'ログインへ'
        }).then((result) => {
            if (result.isConfirmed) {
                document.location.href = '../html/login.html';
            }
        });
    }
});

// handle login form
// initiate form element
let loginForm = document.getElementById('login-form');
let loginEmail = document.getElementById('login-email');
let loginPassword = document.getElementById('login-password');

// initiate field error
let loginEmailError = document.getElementById('login-email-error');
let loginPwError = document.getElementById('login-password-error');

// clear error message
function clearLoginError() {
    // remove red border of input fields
    loginEmail.classList.remove('error');
    loginPassword.classList.remove('error');
    // clear error message
    loginEmailError.innerText = '';
    loginPwError.innerText = '';

}

// handle form when submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let emailVal = loginEmail.value;
    let pwVal = loginPassword.value;

    if (emailVal == '') {
        loginEmail.classList.add('error');
        loginEmailError.innerText = 'メールアドレスは必須項目です';
    } else {
        clearLoginError();
        // check if user with inputed email exists or not
        let user = users.find((user) => user.email === emailVal);
        console.log(user);
        if (user === undefined) {
            loginEmail.classList.add('error');
            loginEmailError.innerText = '該当するユーザーは存在しません';
        } else {
            clearLoginError();
            if (user.password !== pwVal) {
                loginPassword.classList.add('error');
                loginPwError.innerText = 'パスワードは間違いました';
            } else {
                clearLoginError();
                if (user.status !== 1) {
                    loginEmail.classList.add('error');
                    loginEmailError.innerText = 'ユーザーは無効です。Adminに連絡してください';
                } else {
                    clearLoginError();
                    user.isLogin = true;
                    localStorage.setItem('loginUser', JSON.stringify(user));
                    Swal.fire({
                        title: 'ログイン',
                        text: 'ログインは成功しました。',
                        confirmButtonColor: '#1877f2',
                        confirmButtonText: 'ホームフィードへ'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            document.location.href = '../html/home.html';
                        }
                    });
                }
            }
        }
    }
})





