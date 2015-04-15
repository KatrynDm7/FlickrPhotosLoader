function FlickrPhotos(){
	this.myresult;
	this.apiurl_size;
	this.selected_size = 100;
	this.key = 'cf1427c7d1286ef56e1ca24e3921d6a6';
	this.apiurl = "https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key="+this.key+"&per_page=10&format=json&nojsoncallback=1";

	this.loadPhotos = function loadPhotos(container) {
		var obj = this;
		container.empty();
		
		$.getJSON(this.apiurl,function(json){ 
			if (json.stat != 'fail') {
				//var b = 0;
				$.each(json.photos.photo, function(i, myresult) { 
					apiurl_size = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+obj.key+"&photo_id="+myresult.id+"&format=json&nojsoncallback=1";  
					$.getJSON(apiurl_size, function(size) {
						if (json.stat != 'fail') {
							$.each(size.sizes.size, function(j, myresult_size) { 
								if (myresult_size.width == obj.selected_size) {  
									//b++;
									container.append('<td><img src="'+myresult_size.source+'" title="'+myresult.title+'"/>'+
									'<div>'+myresult.title.substr(0, 10)+'<a href="https://www.flickr.com/photos/'+myresult.owner+'/'+myresult.id+'" title="'+myresult.title+'" target="_blank">&raquo;</a>'+
									'</div></td>');
								}
							}) 
						}
						else {
							console.log(json.message);
						}
					})
				});
			}  
			else {
				console.log(json.message);
			}
		});		
	}
	
	this.showModalWindow = function showModalWindow(img, modal, modal_title, modal_body) {
		var href = img.attr('src');
		href = href.replace('_t', '_m');
		var title = img.attr('title');
		//title = title.substr(0, 30);
		modal_body.empty();
		modal_body.append('<img src="'+href+'" />');
		modal_title.empty();
		modal_title.append(''+title);
		modal.modal('show');
	}
	
	this.hideModalWindow = function hideModalWindow(modal) {
		modal.modal('hide');
	}
}

$(function() {

	var photos = new FlickrPhotos();

	$(document).on('click', '#button', function(){ 
		photos.loadPhotos($("#results table tr"));
	});
	
	$(document).on('click', '#back', function(){ 
		photos.hideModalWindow($('#myModal'));
	});
	
	$(document).on('click', '#myModal img', function(){ 
		photos.hideModalWindow($('#myModal'));
	});
	
	$(document).on('click', '#results img', function(){ 
		photos.showModalWindow($(this), $('#myModal'), $('#myModal .modal-title'), $('#myModal .modal-body'));
	});
});