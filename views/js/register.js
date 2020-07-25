$(document).on('submit', '#login-box', function(e) {
    var user_data = { 
        'username': $(this).find('input[name="username"]').val(), 
        'email': $(this).find('input[name="email"]').val(), 
        'password': $(this).find('input[name="password"]').val()
    };
    $.ajax({
        url: '/api/user/',
        method: 'post',
        dataType: 'json',
        data: user_data,
        success: (data) => {
            window.location.replace('/login')
        }
    });
    
});