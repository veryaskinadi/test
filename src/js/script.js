$(document).ready(function(){
    // Подключение формы плагина materialize
    $('select').formSelect();
    // Замена стрелочки в раскрывающемся списке формы
    $('svg.caret').replaceWith(`<svg class="main__select-arrow" width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.91815 0.977289C7.80788 0.874229 7.62871 0.874229 7.51845 0.977289L4.00387 4.26875L0.482394 0.977289C0.372132 0.874229 0.192957 0.874229 0.082696 0.977289C-0.0275653 1.08035 -0.0275653 1.24782 0.082696 1.35088L3.79713 4.8227C3.85226 4.87423 3.92117 4.89999 3.99698 4.89999C4.06589 4.89999 4.14169 4.87423 4.19682 4.8227L7.91125 1.35088C8.02841 1.24782 8.02841 1.08035 7.91815 0.977289Z" fill="black"/></svg>`);

    // Объект с сообщениями об ошибках
    window.errors = {}

    // Валидация email
    $(document).on('change', '#email', function(){
        const email = $(this).val()
        const template = /^((([0-9A-Za-z]{1}[-0-9A-z\.]{1,}[0-9A-Za-z]{1})|([0-9А-Яа-я]{1}[-0-9А-я\.]{1,}[0-9А-Яа-я]{1}))@([-A-Za-z]{1,}\.){1,2}[-A-Za-z]{2,})$/
        if (email.match(template)) {
            $(this).addClass('main__input_correct')
            $(this).removeClass('main__input_error')
            removeErrorMessage('email')
            $(this).after(`<svg class="main__input-checksvg" width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.8389 0.159541C10.6241 -0.0531803 10.2759 -0.0531803 10.0611 0.159541L3.47175 6.68516L0.93892 4.17684C0.724141 3.96412 0.375922 3.96414 0.1611 4.17684C-0.0537001 4.38954 -0.0537001 4.73439 0.1611 4.94711L3.08284 7.84053C3.29756 8.05323 3.64603 8.05308 3.86066 7.84053L10.8389 0.929831C11.0537 0.717131 11.0537 0.372262 10.8389 0.159541Z" fill="#5A61ED"/></svg>`)
        } else {
            $(this).addClass('main__input_error')
            $(this).removeClass('main__input_correct')
            addErrorMessage('email', 'Пожалуйста, введите корректный email')
            $(`svg.main__input-checksvg`).remove()
        }
    }); 

    // Валидация пароля
    $(document).on('change', '#password', function() {
        const password = $(this).val()
        const template = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}/g
        if (password.match(template)) {
            $(this).addClass('main__input_correct')
            $(this).removeClass('main__input_error')
            removeErrorMessage('password')
        } else {
            $(this).addClass('main__input_error')  
            $(this).removeClass('main__input_correct') 
            addErrorMessage('password', 'Пароль должен содержать минимум 8 символов, заглавные и строчные латинские буквы, а также цифры')
        }
    })

    $(document).on('change', '#ConfirmPassword', comparePasswords)
    $(document).on('change', '#password', comparePasswords)
     
    // Отправка формы
    $(document).on('submit', '.main__form', function(event) {
        event.preventDefault()
        $('.footer__button').removeClass('footer__button_animated')
        if (Object.keys(window.errors).length == 0) {
            let url = "server-ok.json"
            const email = $(event.target).find('#email').val()
            if (!email) {
                url = "server-error.json"
            }
            console.log(url)
            $.ajax({
                method: "GET",
                url: url,
                })
                .done(function(response) {
                    if (response.result==='success') {
                        $('.main').css('display', 'none')
                        $('.registered').css('display', 'flex')
                    } else {
                        $('.footer__button').addClass('footer__button_animated')
                    }
                });
        } else {
            $('.footer__button').addClass('footer__button_animated')
        }
    })
});

// Добавление сообщений об ошибках
function addErrorMessage(type, text) {
    window.errors[type] = text
    showErrors()
}

// Удаление сообщений об ошибках
function removeErrorMessage(type) {
    delete window.errors[type]
    showErrors()
}

// Вывод сообщений об ошибках
function showErrors() {
    $('.footer__button').removeClass('footer__button_animated')
    $('.main__subtitle').html('&#128943;')
    $('.main__subtitle').removeClass('main__subtitle_text')
    $('.main__subtitle').addClass('main__subtitle_star')
    $('.main__error-container').html('')
    if (Object.keys(window.errors).length > 0) {
        $('.footer__button').removeClass('footer__button_animated')
        $('.main__subtitle').html('Use the form below to create your account.')
        $('.main__subtitle').removeClass('main__subtitle_star')
        $('.main__subtitle').addClass('main__subtitle_text')
        for (const type in window.errors) {
            $('.main__error-container').append(`<div class="main__error-${type}">${window.errors[type]}</div>`)
        }
    } 
} 

// Проверка совпадений паролей в поле password и confirmpassword
function comparePasswords() {
    const password = $('#password').val()
    const confirmPassword = $('#ConfirmPassword').val()
    if (confirmPassword.length > 0) {
        if (password == confirmPassword) {
            removeErrorMessage('ConfirmPassword')
        } else {
            addErrorMessage('ConfirmPassword', 'Пароли не совпадают')
        }
    } 
}