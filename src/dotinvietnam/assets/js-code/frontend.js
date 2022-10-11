(
	function( $ ) {
		'use strict';

		var $window           = $( window ),
		    $body             = $( 'body' ),
		    queueResetDelay,
		    animateQueueDelay = 200;

		$( document ).ready( function() {
			scrollTo();
			initVideoPopups();
			initSliders();

			var cursor = $( "#custom-cursor" );

			$( window ).mousemove( function( e ) {
				cursor.css( {
					top: e.clientY - cursor.height() / 2,
					left: e.clientX - cursor.width() / 2
				} );
			} );

			$( window ).mouseleave( function() {
				cursor.css( {
					opacity: "0"
				} );
			} ).mouseenter( function() {
				cursor.css( {
					opacity: "1"
				} );
			} );

			$( "a" ).mouseenter( function() {
				cursor.css( {
					transform: "scale(2)"
				} );
			} ).mouseleave( function() {
				cursor.css( {
					transform: "scale(1)"
				} );
			} );

			$( window ).mousedown( function() {
				cursor.css( {
					transform: "scale(.2)"
				} );
			} ).mouseup( function() {
				cursor.css( {
					transform: "scale(1)"
				} );
			} );
		} );

		$window.on( 'load', function() {
			handlerEntranceAnimation();
			handlerEntranceQueueAnimation();
		} );

		function handlerEntranceAnimation() {
			var $animations = $body.find( '.tm-animation' );

			$animations.elementorWaypoint( function() {
				// Fix for different ver of waypoints plugin.
				var _self = this.element ? this.element : $( this );
				$( _self ).addClass( 'animate' );
			}, {
				offset: '100%' // triggerOnce: true
			} );
		}

		function handlerEntranceQueueAnimation() {
			$( '.entrance-animation-queue' ).each( function() {
				var itemQueue  = [],
				    queueTimer,
				    queueDelay = $( this ).data( 'animation-delay' ) ? $( this ).data( 'animation-delay' ) : animateQueueDelay;

				$( this ).children( '.item' ).elementorWaypoint( function() {
					// Fix for different ver of waypoints plugin.
					var _self = this.element ? this.element : $( this );

					queueResetDelay = setTimeout( function() {
						queueDelay = animateQueueDelay;
					}, animateQueueDelay );

					itemQueue.push( _self );
					processItemQueue( itemQueue, queueDelay, queueTimer );
					queueDelay += animateQueueDelay;

					this.destroy(); // trigger once.
				}, {
					offset: '100%'
				} );
			} );
		}

		function processItemQueue( itemQueue, queueDelay, queueTimer, queueResetDelay ) {
			clearTimeout( queueResetDelay );
			queueTimer = window.setInterval( function() {
				if ( itemQueue !== undefined && itemQueue.length ) {
					$( itemQueue.shift() ).addClass( 'animate' );
					processItemQueue();
				} else {
					window.clearInterval( queueTimer );
				}
			}, queueDelay );
		}

		function scrollTo() {
			$( document.body ).on( 'click', '.scroll-to', function( evt ) {
				evt.preventDefault();
				const target = $( this ).attr( 'href' );
				const offsetTop = $( target ).offset().top;

				window.scroll( {
					top: offsetTop - 30,
					left: 0,
					behavior: 'smooth'
				} )
			} )
		}

		function initVideoPopups() {
			if ( $.fn.lightGallery ) {
				var options = {
					selector: '.video-link',
					fullScreen: false,
					zoom: false,
					getCaptionFromTitleOrAlt: false,
					counter: false
				};

				$( '.video-popup' ).each( function() {
					$( this ).lightGallery( options );
				} );
			}
		}

		function initSliders() {
			$( '.tm-swiper' ).each( function() {
				$( this ).DreambitcitySwiper();
			} );
		}
	}( jQuery )
);
