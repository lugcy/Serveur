var url = 'http://192.168.1.31:1001/';

function request(url){
	return fetch(url)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
}

function generateTable(){
	request(url + 'getIds')
		.then(data => {
			const tablecontainer = document.getElementById('tablecontainer');
			const table = document.createElement('table');
			const tbody = document.createElement('tbody');
			for(let i=0; i<data.listId.length+1; i++){
				j = data.listId[i];
				if(i%3 == 0){
					raw = document.createElement('tr');
				}
				const cell = document.createElement('td');
				const div = document.createElement('div');
				
				if(i==data.listId.length){
					div.className = 'ajouter';
					const p = document.createElement('div');

					const large = document.createElement('div');
					const long = document.createElement('div');
					large.className = 'large';
					long.className = 'long';
					p.appendChild(large);
					p.appendChild(long);

					p.className = 'circle';
					div.addEventListener('click', showForm);
					div.appendChild(p);
				}
				else{
					div.className = 'cell';
					request(url + 'src_img/' + j)
						.then(src => {
							div.id = j;
							div.style.backgroundImage = 'url(' + url + 'Ressources/img/' + src + ')';
							div.style.backgroundSize = 'cover';
							div.style.backgroundPosition = 'center';
							div.addEventListener('click', () => {showImage(i);});
						})
						.catch(error => {
						    console.error(error);
						});
				}
				
				cell.appendChild(div);
				raw.appendChild(cell);

				if((i+1)%3==0 || j==data.listId[-1]){
					tbody.appendChild(raw);
				}
			}
			table.appendChild(tbody);
			tablecontainer.appendChild(table);
		})
		.catch(error => {
			console.error(error);
		});

	if (/Mobi|Android/i.test(navigator.userAgent))
	{
		const form = document.getElementById('form');
		form.style.paddingLeft = '80%';
		form.style.paddingTop = '140%';
		form.style.transform = 'translate(11%, 0%)';

		const add = document.getElementById('importPhoto');
		add.style.width = '90%';
		add.style.height = '50%';
		add.style.top = '2%';

		const btnSave = document.getElementById('btnSave');
		btnSave.style.width = '40%';
		const btnQuit = document.getElementById('btnQuit');
		btnQuit.style.width = '40%';
		btnQuit.style.left = '5%';


		const formImg = document.getElementById('formImg');
		formImg.style.paddingLeft = '80%';
		formImg.style.paddingTop = '140%';
		formImg.style.transform = 'translate(11%, 0%)';

		const show = document.getElementById('showPhoto');
		show.style.width = '90%';
		show.style.height = '50%';
		show.style.top = '2%';

		const focale = document.querySelectorAll('.focale');
		focale.forEach(f => {
			f.style.top = '55%';
			f.style.left = '12%';
		})

		const vitesse = document.querySelectorAll('.vitesse');
		vitesse.forEach(v => {
			v.style.top = '60%';
			v.style.left = '12%';
		})

		const iso = document.querySelectorAll('.iso');
		iso.forEach(i => {
			i.style.top = '65%';
			i.style.left = '12%';
		})
		const distance = document.querySelectorAll('.distance');
		distance.forEach(d => {
			d.style.top = '69%';
			d.style.left = '12%';
		})

	}
}

function hidForm(){
	const form = document.getElementById('form');
	document.getElementById('inputImg').style.visibility = "hidden";
	document.getElementById('importPhoto').style.backgroundImage = "";
	form.style.visibility = 'hidden';
}
function showForm(){
	const input = document.getElementById('uploadImg');
	const parent = input.parentNode;
	const newInput = input.cloneNode(true);
	parent.replaceChild(newInput, input);

	const form = document.getElementById('form');
	form.style.visibility = 'visible';
	document.getElementById('inputImg').style.visibility = 'visible';

	const inputImg = document.getElementById('importPhoto')
	if(!hasEventListener(inputImg, 'click', inputClick)){
		inputImg.addEventListener('click', inputClick);
	}

	newInput.addEventListener('change', () => {
		if (newInput.files.length > 0) {
    		const file = newInput.files[0];
    		const reader = new FileReader();

    		reader.onload = () => {
    			const path = reader.result;
    			document.getElementById('inputImg').style.visibility = 'hidden';
	    		document.getElementById('importPhoto').style.backgroundImage = 'url("' + path + '")';
	    		document.getElementById('importPhoto').style.backgroundPosition = 'center';
	    		document.getElementById('importPhoto').style.backgroundSize = 'cover';
    		}
    		reader.readAsDataURL(file);
    		uploadFile(file);
    		newInput.value = "";	
    		return;
  		}
	})
}
function inputClick(){
	document.getElementById('uploadImg').click();
}

function showImage(id){
	const formImg = document.getElementById('formImg');
	formImg.style.visibility = 'visible';
	const showPhoto = document.getElementById('showPhoto');
	request(url + 'src_img/' + id)
		.then(src => {
			showPhoto.style.backgroundImage = 'url(' + url + 'Ressources/img/' + src + ')';
			showPhoto.style.backgroundSize = 'cover';
			showPhoto.style.backgroundPosition = 'center';
		})
		.catch(error => {
		    console.error(error);
		});
}
function hidFormImg(){
	const formImg = document.getElementById('formImg');
	formImg.style.visibility = 'hidden';
}

function hasEventListener(element, eventName, callback) {
  var eventListeners = element.__eventListeners || {};
  var callbacks = eventListeners[eventName] || [];
  
  if (callback) {
    return callbacks.some(function(listener) {
      return listener === callback;
    });
  } else {
    return callbacks.length > 0;
  }
}

function uploadFile(file){
	const formData = new FormData();
	formData.append('file', file);

	fetch('/upload', {
		method: 'POST',
		body: formData,
	})
	.then(response => response.json())
	.then(data => {console.log(data.message);})
	.catch(error => console.error(error));
}
function cancelUpload(){
	const doc = document.getElementById('importPhoto');
	var isBgIm = getComputedStyle(doc).backgroundImage;
	if(isBgIm !== 'none'){
		fetch('/cancelUpload', {
			method: 'DELETE',
		})
		.then(response => response.json())
		.then(data => {console.log(data.message);})
		.catch(error => console.error(error));
	}
	hidForm();
}
function savePhoto(){
	location.reload();
}