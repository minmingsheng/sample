window.addEventListener('load', function(){
	init();	
})

function init(){
	ajax('offer.json', function(data){
		var data = JSON.parse(data.responseText);
		var products = data.products;
		populate(products);
	});
	var selectBtn = document.getElementById("select-btn");
	deacvatite(selectBtn);
}

function populate(products){
	products.map(function(obj){
		var tag_color_class = toClassName(obj.tag);
		var offer_wraper = document.getElementById('offer_wraper');
		var el = document.createElement("div");
		el.classList.add("offer");
		el.classList.add("offer"+obj.id);
		el.setAttribute("data-id", obj.id);
		el.setAttribute("data-des", obj.description);
		el.setAttribute("data-logo", obj.logo);
		el.setAttribute("data-brand", obj.brand);
		el.setAttribute("data-img", obj.image);
		el.setAttribute("data-tag", obj.tag);
		el.setAttribute("data-name", obj.name);
		el.innerHTML+= '<img class = "offer_img" src = "'+obj.image+'">\
			<div class = "tag '+tag_color_class+'" >\
				<h6>'+obj.tag+'</h6>\
			</div>\
			<h5>'+obj.name+'</h5>\
			<div class = "info" >\
				<img src="path/to/img_info.png" />\
			</div>';
		offer_wraper.appendChild(el);
	})
	openInfo();
	select(toggle);
}
function select(fn){
	var offers = document.querySelectorAll(".offer");
	for (var i = 0; i < offers.length; i++) {
		offers[i].onclick = fn;
	};
}

function toggle(e){
	e.stopPropagation();
	var _this = this;
	toggleOrNot(_this);
}

function toggleOrNot(target, d){

	var fromModal = d || false;
	var _num = new RegExp("selected").test(target.getAttribute("class"))
	if(fromModal){
		if(_num){
			target.classList.add("shake");
			animated(target, function(){
				target.classList.remove("shake");
			})
		}else{
			if(document.querySelectorAll(".selected").length<5){
				target.classList.toggle("selected")
				activeBtn();
			}
		}
	}else{
		if(document.querySelectorAll(".selected").length>=5){
				if(_num === true){
					target.classList.toggle("selected");
					activeBtn();	
					console.log("from here!!!!!");
				}else{
					var _btn = document.getElementById("select-btn");
					_btn.classList.add("flash");
					console.log("+btn!!!!!");
					animated(_btn, function(){
						_btn.classList.remove("flash");
					})
					return;
				}
		}else{
				target.classList.toggle("selected")
				activeBtn();	
		}	
	}
	
}

function doubleChosenOrNot(){

}

function countNum(){
	var num = document.getElementById("num");
	var count = document.querySelectorAll(".selected").length;
	num.textContent = count;


	return count;
}

function activeBtn(){
	var selectBtn = document.getElementById("select-btn");
	if(countNum()==5){
		selectBtn.classList.add("actived");
		selectBtn.setAttribute("href", "http://www.sampler.io");
		selectBtn.addEventListener("click", function(){
			console.log(location);
			location.href = "http://www.sampler.io";
		});
	}else{
		selectBtn.setAttribute("class", "btn");
		selectBtn.setAttribute("href", "")
		deacvatite(selectBtn);
	}
}

function deacvatite(btn){
	btn.addEventListener("click", function(e){
		e.preventDefault();
		return
	});
}

function openInfo(){
	var infoBtn = document.querySelectorAll(".info");
	var modal = document.getElementById("modal");
	for (var i = 0; i < infoBtn.length; i++) {
		infoBtn[i].addEventListener('click', function(e){
			e.stopPropagation();
			var offer = this.parentElement;
			var des = offer.dataset.des;
			var id = offer.dataset.id;
			var logo = offer.dataset.logo;
			var brand = offer.dataset.brand;
			var img = offer.dataset.img;
			var tag = offer.dataset.tag;
			var name = offer.dataset.name;

			var overlay = document.querySelector(".overlay");
			modal.setAttribute("data-iid", id);
			modal.innerHTML = '<header>\
								<h5>Offer Details</h5><div class = "close">x</div>\
							</header>\
							<main>\
								<div class="banner">\
									<img src="'+img+'">\
								</div>\
								<div class = "content">\
									<div class = "tag '+toClassName(tag)+'">\
										<h6>'+tag+'</h6>\
									</div>\
									<h3>'+name+'</h3>\
									<div class="logo">\
										<img src="'+logo+'">\
										<p>'+brand+'</p>\
									</div>\
									<p class="des">'+des+'</p>\
								</div>\
							</main>\
							<footer>\
								<div class = "btn" id = "select-btn-modal">\
									Select Offer\
								</div>\
							</footer>';
			modal.classList.add("block");
			overlay.classList.add("block");
			document.body.style.overflow = "hidden";
			close();
			selectFromModal();
		}, false)
	};
}

function selectFromModal(){ 
	var selectFromModal = document.getElementById("select-btn-modal");
	selectFromModal.addEventListener("click", function(){
		var _modal = this.parentElement.parentElement;
		var _id = _modal.dataset.iid;
		var _target = document.querySelector(".offer"+_id);
		var overlay = document.querySelector(".overlay");
		overlay.classList.remove("block");
		toggleOrNot(_target, true);
		killModel(_modal);
	})
}

function close(){
	var close = document.querySelectorAll(".close");
	for (var i = 0; i < close.length; i++) {
		close[i].addEventListener("click", function(){
			var modal = this.parentElement.parentElement;
			killModel(modal);
			var overlay = document.querySelector(".overlay");
			overlay.classList.remove("block");
		})
	};
	var overlay = document.querySelector(".overlay");
	overlay.addEventListener("click", function(){
		var  modal = document.getElementById("modal");
		var overlay = document.querySelector(".overlay");
		overlay.classList.remove("block");
		killModel(modal);

	})
}

function killModel(modal){
	modal.classList.add("fadeOut");
	// animated(modal, function(e){
	// 	e.stopPropagation();
	// 	modal.setAttribute("class", "modal")
	// })
	setTimeout(function(){
		modal.setAttribute("class", "modal")
	}, 1000)
		
	document.body.style.overflow = "auto";
}

function ajax(url, fn){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      	fn(xhttp);
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function animated(el, fn){
	el.addEventListener("webkitAnimationEnd", fn,false);
	el.addEventListener("animationend", fn,false);
	el.addEventListener("oanimationend", fn,false);
}

function toClassName(tag){

	return tag.replace(' ', '-').replace('+', '').toLowerCase();
}