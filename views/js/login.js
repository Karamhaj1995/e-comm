$(document).on('submit', '#login_form', function(e) {
    var user_data = { 
        'username': $(this).find('input[name="username"]').val(), 
        'password': $(this).find('input[name="password"]').val()
    };
    $.ajax({
        url: '/login',
        method: 'post',
        dataType: 'json',
        data: user_data,
        success: (data) => {
            setCookie('authorization', 'Bearer ' + data.token, 7);
            window.location.replace('/');
        }
    });
    return false;
});

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}