$('.btn-send').on('click', () => {
	let file = $('input[type=file]')[0].files[0];

	if (file) {
		$('.downloading').show();
		$('input[type=file]').val('');
		$('.file-path').val('');

		info.once('value').then(snap => {
			let targetNum = snap.val().sort((a, b) => {
				return b - a
			})[0] + 1;
			console.log(targetNum);
			let storageRefTarget = storageRef.child(targetNum + '.png');

			storageRefTarget.put(file).then(snap2 => {
				let targetSet = snap.val();
				targetSet.push(targetNum);
				info.set(targetSet);

				let targetWidthPriority;
				if ($('input[type=radio]').eq(0).prop('checked')) {
					targetWidthPriority = (Math.floor(Math.random() * 11 ) + 10) / 10;
				} else {
					targetWidthPriority = $('input[type=range]').val();
				}

				console.log(targetWidthPriority);

				infoWidth.once('value', snap3 => {
					let targetSetInfoWidth = snap3.val();
					targetSetInfoWidth.push([targetNum, targetWidthPriority]);
					infoWidth.set(targetSetInfoWidth);
				});

				storageRefTarget.getDownloadURL().then(url => {
					photos.unshift([targetNum, url, targetWidthPriority]);
					renderPhotos(photos);
					M.toast({html: 'Added'});
				});
			});
		});
	}
});

function arrWithoutElem(arr, elem, multiply) {
	return arr.filter(val => {
		val = multiply ? val[0] : val;
		return val != elem;
	});
}

function deleteImg(num) {
	$('.downloading').show();

	storageRef.child(num + '.png').delete().then(() => {
		info.once('value').then(snap => {
			info.set(arrWithoutElem(snap.val(), num));

			infoWidth.once('value', snap => {
				let targetSetInfoWidth = snap.val().filter(val => {
					return val[0] != num;
				});

				infoWidth.set(targetSetInfoWidth);

				photos = arrWithoutElem(photos, num, true);
				renderPhotos(photos);
				M.toast({html: 'Deleted'});
			});
		});
	});
}

$('input[type=radio]').change(() => {
	if ($('input[type=radio]').eq(0).prop('checked')) {
		$('input[type=range]').prop('disabled', true);
		$('.range-field').css('opacity', '');
	} else {
		$('input[type=range]').prop('disabled', false);
		$('.range-field').css('opacity', '.6');
	}
});

$('.btn-sign-out').click(() => {
	firebase.auth().signOut().then(() => {
		M.toast({html: 'You signed out'});
	}).catch(error => {
		console.log(error.code, error.message);
	});
});