firebase.auth().onAuthStateChanged(user => {
	if (user) {
		$('.downloading, .container').show();
		$('.auth').hide();
		getPhotos();
	} else {
		$('.downloading, .container').hide();
		$('.auth').show();

		$('.btn-sign-in').click(() => {
			$('.downloading').show();
			let email = $('.auth input[type=email]').val();
			let password = $('.auth input[type=password]').val();

			firebase.auth().signInWithEmailAndPassword(email, password).then(() => {
				$('.auth input[type=email]').val('');
				$('.auth input[type=password]').val('');

				M.toast({html: 'You signed in'});
			}).catch(error => {
				$('.downloading').hide();
				M.toast({html: 'You didn\'t sign in'});
				console.log(error.code, error.message);
			});
		});
	}
});