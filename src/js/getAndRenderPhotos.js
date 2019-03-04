let storageRef = firebase.storage().ref();
let databaseRef = firebase.database().ref();
let info = databaseRef.child('info');
let infoWidth = databaseRef.child('infoWidth');

let photos;
let [photosCols, photosWidth] = getPhotosProps($(window).width());

let plusForRowShow = countRowForShow = 3;


function getPhotosProps(screenWidth) {
	if (screenWidth <= 800) return [2, '350px'];
	else return [3, '400px'];
}

$(window).resize(() => {
	let targetPhotosProps = getPhotosProps($(window).width());

	if (targetPhotosProps[0] != photosCols) {
		[photosCols, photosWidth] = targetPhotosProps;

		renderPhotos(photos);
	}
});

function allTrueTest(arr) {
	for (let i = 0; i < arr.length; i++) {
		if (!arr[i]) {
			return false;
		} else if (i == arr.length - 1) {
			return true;
		}
	}
}

function getTargetWidth(num, arr) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][0] == num) return arr[i][1];
	}
}

function getPhotos() {
	info.once('value').then(snap => {
		infoWidth.once('value').then(snap2 => {
			let infoDoneData = snap.val();
			photos = Array(infoDoneData.length - 1);

			if (infoDoneData.length > 1) {
				infoDoneData.forEach((val, index) => {
					if (val != 0) {
						let targetWidth = getTargetWidth(val, snap2.val());

						storageRef.child(val + '.png').getDownloadURL().then(url => {
							photos[index - 1] = [val, url, targetWidth];

							if (allTrueTest(photos)) {
								photos.reverse();
								renderPhotos(photos);
							}
						});
					}
				});
			} else $('.downloading').hide();
		});
	});
}



function renderPhotos(photos) {
	$('.hideWhileLoading').show();
	$('.preloader-container').hide();
	$('.photos-container').html('<div class="row"></div>');

	let countPhotosOfTargetRow = 0;
	let rowCount = 1;

	function addRow() {
		rowCount++;
		$('.photos-container').append(
			`<div class="row"
			${!(location.pathname == '/admin/') && rowCount > countRowForShow ? `style="display: none;"` : ''}>
			</div>`
		);
	}

	photos.forEach((val, inde) => {
		countPhotosOfTargetRow++;

		if (countPhotosOfTargetRow >= photosCols + 1) {
			countPhotosOfTargetRow = 1;
			addRow();
		}

		if (val[2] == 2) {
			if (countPhotosOfTargetRow + 1 <= photosCols) {
				countPhotosOfTargetRow++;
			} else {
				addRow();
				countPhotosOfTargetRow = 2;
			}
		}

		$(`.row:last-child`).append(
			`<div class="img" style="background-image: url('${val[1]}'); flex: ${val[2]} 0; height: ${photosWidth};">
				${location.pathname == '/admin/' ?
				`<div class="photo-del" onclick="deleteImg(${val[0]})">Delete</div>` : ''}
			</div>`
		);
	});

	$('.downloading').hide();
}