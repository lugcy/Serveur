function request(url){
	return fetch(url)
		.then(response => {
			return response.json();
		})
		.then(data => {
			return data;
		})
}

function requestImg(url){
	return fetch(url)
		.then(response => {
			return response.blob();
		})
		.then(url => {
			return URL.createObjectURL(url);
		})
}

function generateTable(){
	request('http://127.0.0.1:8080/getNbrPosts')
		.then(data => {
			if(data.nbrPosts!=0){
				const tablecontainer = document.getElementById('tablecontainer');
				const table = document.createElement('table');
				const tbody = document.createElement('tbody');
				for(let i=0; i<1+Math.trunc((data.nbrPosts-1)/3); i++){
					const raw = document.createElement('tr');
					
					for(let j=0; j<3; j++){
						const cell = document.createElement('td');
						const div = document.createElement('div');
						div.className = 'cell';
						
						requestImg('http://127.0.0.1:8080/getImg/img.jpg')
							.then(imgUrl => {
								url = 'url(' + imgUrl + ')';
								console.log(url);
								div.style.backgroundImage = url;
								div.style.backgroundSize = 'cover';
								URL.revokeObjectURL(imgUrl);
							})
							.catch(error => {
								console.error(error);
							})

						
						cell.appendChild(div);
						raw.appendChild(cell);
					}
					tbody.appendChild(raw);
				}
				table.appendChild(tbody);
				tablecontainer.appendChild(table);
			}
		})
		.catch(error => {
			console.error(error);
		});
}