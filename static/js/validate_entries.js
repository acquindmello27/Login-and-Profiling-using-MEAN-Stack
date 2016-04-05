(function($){
	var login_form = $("#loginform");
	var username = $("#login-username");
	var password = $("#login-password");
	var login_btn = $("#btn-login");
	var login_alert = $("#login-alert");



	login_form.submit(function (event){
		try{
			validate();

		}
		catch(e)
		{
			login_alert.text(e);
            login_alert.removeClass('hidden');
            event.preventDefault();
		}
	});

	username.on("change", function() {
        login_alert.addClass('hidden');
    });

    password.on("change", function() {
        login_alert.addClass('hidden');
    });

	function validate(){
		var username_text = username.val();
		if(username_text === undefined || username_text === "" || username_text === null)
		{
			throw "Username cannot be empty";
		}
		var password_text = password.val();
		if(password_text === undefined || password_text === "" || password_text === null)
		{
			throw "Password cannot be empty";
		}
	}

	//validation for Sign up form
	var sign_form = $("#signupform");
	var sign_username = $("#signup-username");
	var sign_password = $("#signup-password");
	var sign_btn = $("#btn-signup");
	var sign_alert = $("#signupalert");



	sign_form.submit(function (event){
		try{
			validate_signup();

		}
		catch(e)
		{
			sign_alert.text(e);
            sign_alert.removeClass('hidden');
            event.preventDefault();
		}
	});

	sign_username.on("change", function() {
        sign_alert.addClass('hidden');
    });

    sign_password.on("change", function() {
        sign_alert.addClass('hidden');
    });

	function validate_signup(){
		var username_text_sign = sign_username.val();
		if(username_text_sign === undefined || username_text_sign === "" || username_text_sign === null)
		{
			throw "Username cannot be empty";
		}
		var password_text_sign = sign_password.val();
		if(password_text_sign === undefined || password_text_sign === "" || password_text_sign === null)
		{
			throw "Password cannot be empty";
		}
	}



}(jQuery))