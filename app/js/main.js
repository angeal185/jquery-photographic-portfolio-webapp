/*app*/
$.ajaxSetup({ cache: true });

$.fn.multiply = function(numCopies) {
    var newElements = this.clone();
    for(var i = 1; i < numCopies; i++)
    {
        newElements = newElements.add(this.clone());
    }
    return newElements;
};

$(function(){

    var dv = $('<div></div>');
    var icn = $('<i></i>');
    var nv = $('<nav></nav>');
    var anc = $('<a></a>');
    var sceneMaxSize = $(window).width()*3;
    var selectedTranslateX, selectedTranslateY, selectedRotation, selectedTranslateZ, selectedImage, nextImage, prevImage;
    var animationFinished = true;
    var firstClickPositionX;
    var firstClickPositionY;
    var pageWrapperLastPositionX;
    var pageWrapperLastPositionY;
    var moveX = 0;
    var moveY = 0;
    var $slide = $(".slide");
    var $body  = $("body");
    var $outerWrapper = $(".outer-wrapper");

    $body.prepend(dv.clone().addClass('page-wrapper').append(nv.clone().addClass('navigation').prepend(anc.clone().addClass('nav-btn')))),
    $('.nav-btn').append(icn.multiply(3)),
    dv.clone().addClass('slider-navigation').appendTo('.page-wrapper'),
    $('.slider-navigation').append(dv.clone().addClass('slider-pager owl-carousel')),
    dv.clone().addClass('outer-wrapper').appendTo('.page-wrapper'),
    dv.clone().addClass('inner-wrapper').appendTo('.outer-wrapper');

//templates
$.getJSON("app/data/info.json", function( data ) {

  $('nav').append('<div class="brand"><img src="' + data.logo + '"></div>');

  $('.inner-wrapper').prepend('<div class="slide first" id="0" data-position-x="0" data-position-y="0" data-position-z="1" data-rotation="0"><div class="main-title"><div class="main-title-wrapper"><h1>' + data.landingSlide.title + '</h1><h2>' + data.landingSlide.sub + '</h2></div></div><div class="image" data-background="' + data.landingSlide.img + '"></div></div>');


  $('.page-wrapper').append('<div class="off-screen-content"><div id="inner" class="scrollbar-inner"><div class="image-header"><div class="bg-transfer"><img src="' + data.headerImg + '"></div></div></div></div>');

  $.each( data.section, function(i,value) {
    $('#inner').append('<section id="' + value + '"><div class="section-wrapper"><h2>' + value + '</h2></div></section>');
  });

  $('#about-me > .section-wrapper').append('<h3>' + data.aboutMeData.title + '</h3><p>' + data.aboutMeData.info + '</p><img src="' + data.aboutMeData.img + '">');

  $('#services > .section-wrapper').append('<h3>' + data.servicesData.title + '</h3><p>' + data.servicesData.info + '</p>');

  $.each( data.services, function(i,value) {
    $('#services > .section-wrapper').append('<div class="service"><div class="image"><div class="bg-transfer"><img src="app/img/' + value.img + '"></div></div><div class="description"><h3>' + value.title + '</h3><p>' + value.description + '</p></div></div>');
  });

  $.each( data.pricing, function(i,value) {
  $('#pricing > .section-wrapper').append('<div class="price-package"><div class="price">$ ' + value.price + '</div><div class="description"><h3>' + value.title + '</h3><p>' + value.description + '</p><ul><li>' + value.info1 + '</li><li>' + value.info2 + '</li><li>' + value.info3 + '</li></ul></div></div>');
  });

  $('#contact > .section-wrapper').append('<h3>Address</h3><address>' + data.socialData.address + '<br>' + data.socialData.phone + '<br><a href="' + data.socialData.emailLnk + '">' + data.socialData.email + '</a></address><br><h3>Social</h3><div id="socialLnk" class="social"></div>');

  $.each( data.socialLnk, function(i,value) {
  $('#socialLnk').prepend('<li><a href="' + value.url + '" class="icon"><i class="icon-' + value.ico + '"></i>' + value.ico + '</a></li>');
  });



$.getJSON("app/data/data.json", function( data ) {

	$.each( data, function(i,value) {
		$('.inner-wrapper').append('<div class="slide" id="' + value.id + '"><div class="description"><h2 class="animate">' + value.title + '</h2><dl class="animate"><dt>Client:</dt><dd>' + value.client + '</dd><dt>Photographer:</dt><dd>' + value.name + '</dd><dt>Category:</dt><dd>' + value.category + '</dd></dl><div class="additional-info animate"><dl><dt>ISO:</dt><dd>' + value.iso + '</dd><dt>Shutter Speed:</dt><dd>' + value.sSpeed + '</dd><dt>Focal Length:</dt><dd>' + value.fLength + '</dd></dl></div></div><div class="image" data-background="' + value.img + '"></div></div>');
	});

  $( document ).ready(function() {

  	$("[data-background]").each(function() {
          $(this).css("background-image", "url(" + $(this).attr("data-background") + ")");
      });

      $(".inner-wrapper .slide").each(function(e) {
          var htmlCode;
          if( e === 0 ){
              htmlCode = '<div class="item"><a class="active" href="#' + $(this).attr("id") + '">' + (e+1) + '<span style="background-image: url(' + $(this).find(".image").attr("data-background") + ')"></span></a></div>';
          }
          else {
              htmlCode = '<div class="item"><a href="#' + $(this).attr("id") + '">' + (e+1) + '<span style="background-image: url(' + $(this).find(".image").attr("data-background") + ')"></span></a></div>';
          }
          $(".slider-pager").append(htmlCode);
      });

  	$(".slide:not(.first)").each(function() {
          $(this).attr("data-position-x", randomNumber("position", sceneMaxSize) );
          $(this).css("left", $(this).attr("data-position-x") + "px");
          $(this).attr("data-position-y", randomNumber("position", sceneMaxSize) );
          $(this).css("top", $(this).attr("data-position-y") + "px");
          $(this).attr("data-position-z", randomNumber("position", 2000) );
          $(this).attr("data-rotation", 0 );
          $(this).css("transform", "rotateZ(" + $(this).attr("data-rotation") + "deg) translateZ(" + $(this).attr("data-position-z") + "px)");
      });


      $(".slider-pager a").on("click", function(e){
          e.preventDefault();
          $(".animate").removeClass("idle");
          play( $(this).attr("href") );
      });

      selectedImage = $(".slide.first")[0];
      selectedTranslateX = 0;
      selectedTranslateY = 0;

      function play(_this){
          animationFinished = false;
          $body.removeClass("zoomed-out");
          $slide.removeClass("active");
          $(".slider-pager a").removeClass("active");
          $(".slider-pager a[href='" + _this + "']").addClass("active");

          $(".slide.first .main-title").css("opacity",.5);
          $(".slide .image").each(function(e) {
              var $this = $(this);
              setTimeout(function(){
                  $this.css("opacity",.5);
              }, e * 40);
          });

          selectedTranslateX = $(_this).attr("data-position-x") * -1;
          selectedTranslateY = $(_this).attr("data-position-y") * -1;
          selectedTranslateZ = $(_this).attr("data-position-z") * -1;
          selectedRotation = $(_this).attr("data-rotation") * -1;
          selectedImage = $(_this);

          $(".inner-wrapper").css({'transform': 'translateZ(-' + sceneMaxSize/1.5 + 'px) translateX(' + selectedTranslateX + 'px) translateY(' + selectedTranslateY + 'px)'});

          selectedImage.addClass("active");
          $(".slide:not(.active)").css("pointer-events", "none");
          $(".slide.active").css("pointer-events", "auto");

          setTimeout(function(){
              $(".slide .image").css("opacity", 0);
              selectedImage.find(".image").css("opacity", 1);
              selectedImage.find(".main-title").css("opacity", 1);
              $(".inner-wrapper").css({'transform': 'translateZ(' + selectedTranslateZ + 'px) translateX(' + selectedTranslateX + 'px) translateY(' + selectedTranslateY + 'px)'});
              $outerWrapper.css({'transform': 'rotateZ(' + selectedRotation + 'deg)'});
          }, 1000);

          setTimeout(function(){
              $(selectedImage).find(".animate").each(function(e) {
                  var $this = $(this);
                  setTimeout(function(){
                      $this.addClass("idle");
                  }, e * 100);
              });
              animationFinished = true;
              $(".slide:not(.active) .image").css("opacity", "0");
              $(".slide:not(.active) .main-title").css("opacity", "0");
              $(".slide:not(.active)").addClass("hide-description");
          }, 1500);
      }

      function randomNumber(method, sceneMaxSize){
          if( method === "position" ){
              return Math.floor(Math.random() * sceneMaxSize) - (sceneMaxSize/2);
          }
          else if( method === "rotation" ){
              return Math.floor(Math.random() * 90) + 10;
          }
          else {
              return false;
          }
      }

      $slide.on("click", function(){
          var _this = "#" + $(this).attr("id");
          if( $body.hasClass("zoomed-out") ){
              play(_this);
          }
      });

  });
});

    $(".scrollbar-inner").scrollbar();

    if( $body.hasClass("zoomed-out") ){
        $(".inner-wrapper").css("transform", "translateZ(-4000px) translateX(0px) translateY(0px)");
        $outerWrapper.css("transform", "rotateZ(0deg)");
        $(".slide .image").css("opacity", .5);
    }

    $(".nav-btn").on("click", function(e){
        e.preventDefault();
        $body.toggleClass("show-off-screen-content");
        $(".scrollbar-inner").stop().animate({
            scrollTop: 0
        }, 800);
        $(".off-screen-navigation a").removeClass("active");
    });

    $(".off-screen-content [id]").each(function() {
        $(this).attr("data-scroll-offset", $(this).offset().top);
    });

    $(".off-screen-navigation a:not(.new-window)").on("click", function(e){
        e.preventDefault();
        $(".off-screen-navigation a").removeClass("active");
        $(this).addClass("active");
        $body.addClass("show-off-screen-content");
        var href = $(this).attr("href");
        $(".scrollbar-inner").stop().animate({
            scrollTop: $(href).attr("data-scroll-offset")
        }, 800);
    });

    $outerWrapper.on("click", function(){
        if( $body.hasClass("show-off-screen-content") ){
            $body.removeClass("show-off-screen-content");
        }
    });

    $(".bg-transfer").each(function() {
        $(this).css("background-image", "url("+ $(this).find("img").attr("src") +")" );
    });


    $(".slider-pager").owlCarousel({
        autoWidth: true,
        margin: 2
    });


});


});
$(window).on("load", function(){
    $(".animate").addClass("in");

});
