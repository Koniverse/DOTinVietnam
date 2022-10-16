(
	function( window, $ ) {
		'use strict';
		window.dotinvietnam = window.dotinvietnam || {};

		const isEmptyObject = ( obj ) => {
			for ( const name in obj ) {
				return false;
			}

			return true;
		};

		/**
		 * Add a URL parameter (or changing it if it already exists)
		 * @param {string} url - This is typically document.location.search
		 * @param {string} key - The key to set
		 * @param {string} val - Value
		 */
		var addUrlParam = function( url, key, val ) {
			key = encodeURI( key );
			val = encodeURI( val );

			var re = new RegExp( "([?&])" + key + "=.*?(&|$)", "i" );
			var separator = url.indexOf( '?' ) !== - 1 ? "&" : "?";

			// Update value if key exist.
			if ( url.match( re ) ) {
				url = url.replace( re, '$1' + key + "=" + val + '$2' );
			} else {
				url += separator + key + '=' + val;
			}

			return url;
		};

		const getUrlParamsAsObject = function( query ) {
			var params = {};

			if ( - 1 === query.indexOf( '?' ) ) {
				return params;
			}

			query = query.substring( query.indexOf( '?' ) + 1 );

			var re = /([^&=]+)=?([^&]*)/g;
			var decodeRE = /\+/g;

			var decode = function( str ) {
				return decodeURIComponent( str.replace( decodeRE, " " ) );
			};

			var e;
			while ( e = re.exec( query ) ) {
				var k = decode( e[ 1 ] ), v = decode( e[ 2 ] );
				if ( k.substring( k.length - 2 ) === '[]' ) {
					k = k.substring( 0, k.length - 2 );
					(
						params[ k ] || (
							params[ k ] = []
						)
					).push( v );
				}
				else {
					params[ k ] = v;
				}
			}

			var assign = function( obj, keyPath, value ) {
				var lastKeyIndex = keyPath.length - 1;
				for ( var i = 0; i < lastKeyIndex; ++ i ) {
					var key = keyPath[ i ];
					if ( ! (
						key in obj
					) ) {
						obj[ key ] = {}
					}
					obj = obj[ key ];
				}
				obj[ keyPath[ lastKeyIndex ] ] = value;
			}

			for ( var prop in params ) {
				var structure = prop.split( '[' );
				if ( structure.length > 1 ) {
					var levels = [];
					structure.forEach( function( item, i ) {
						var key = item.replace( /[?[\]\\ ]/g, '' );
						levels.push( key );
					} );
					assign( params, levels, params[ prop ] );
					delete(
						params[ prop ]
					);
				}
			}
			return params;
		};

		const getScrollbarWidth = function() {
			// Creating invisible container.
			const outer = document.createElement( 'div' );
			outer.style.visibility = 'hidden';
			outer.style.overflow = 'scroll'; // forcing scrollbar to appear.
			outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps.
			document.body.appendChild( outer );

			// Creating inner element and placing it in the container.
			const inner = document.createElement( 'div' );
			outer.appendChild( inner );

			// Calculating difference between container's full width and the child width.
			const scrollbarWidth = (
				outer.offsetWidth - inner.offsetWidth
			);

			// Removing temporary elements from the DOM.
			outer.parentNode.removeChild( outer );

			return scrollbarWidth;

		};

		const setBodyOverflow = function() {
			$( 'body' ).css( {
				'overflow': 'hidden',
				'paddingRight': this.getScrollbarWidth() + 'px'
			} );
		};

		const unsetBodyOverflow = function() {
			$( 'body' ).css( {
				'overflow': 'visible',
				'paddingRight': 0
			} );
		};

		const setBodyHandling = function() {
			$( 'body' ).removeClass( 'completed' ).addClass( 'handling' );
		};

		const setBodyCompleted = function() {
			$( 'body' ).removeClass( 'handling' ).addClass( 'completed' );
		};

		const setElementHandling = function( $element ) {
			$element.addClass( 'updating-icon' );
		};

		const unsetElementHandling = function( $element ) {
			$element.removeClass( 'updating-icon' );
		};

		const getStyle = ( el, style ) => {
			if ( window.getComputedStyle ) {
				return style ? document.defaultView.getComputedStyle( el, null ).getPropertyValue( style ) : document.defaultView.getComputedStyle( el, null );
			}
			else if ( el.currentStyle ) {
				return style ? el.currentStyle[ style.replace( /-\w/g, ( s ) => {
					return s.toUpperCase().replace( '-', '' );
				} ) ] : el.currentStyle;
			}
		};

		const setCookie = function( cname, cvalue, exdays ) {
			var d = new Date();
			d.setTime( d.getTime() + (
				exdays * 24 * 60 * 60 * 1000
			) );
			var expires = 'expires=' + d.toUTCString();
			document.cookie = cname + '=' + cvalue + '; ' + expires + '; path=/';
		};

		const getCookie = function( cname ) {
			var name = cname + '=';
			var ca = document.cookie.split( ';' );
			for ( var i = 0; i < ca.length; i ++ ) {
				var c = ca[ i ];
				while ( c.charAt( 0 ) == ' ' ) {
					c = c.substring( 1 );
				}
				if ( c.indexOf( name ) == 0 ) {
					return c.substring( name.length, c.length );
				}
			}
			return '';
		};

		const isHandheld = function() {
			let check = false;
			(
				function( a ) {
					if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr( 0, 4 ) ) ) {
						check = true;
					}
				}
			)( navigator.userAgent || navigator.vendor || window.opera );
			return check;
		};

		const isValidSelector = function( selector ) {
			if ( selector.match( /^([.#])(.+)/ ) ) {
				return true;
			}

			return false;
		};

		const copyToClipboard = function( text ) {
			if ( window.clipboardData && window.clipboardData.setData ) {
				// Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
				return window.clipboardData.setData( "Text", text );

			}
			else if ( document.queryCommandSupported && document.queryCommandSupported( "copy" ) ) {
				var textarea = document.createElement( "textarea" );
				textarea.textContent = text;
				textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
				document.body.appendChild( textarea );
				textarea.select();
				try {
					return document.execCommand( "copy" );  // Security exception may be thrown by some browsers.
				}
				catch ( ex ) {
					console.warn( "Copy to clipboard failed.", ex );
					return prompt( "Copy to clipboard: Ctrl+C, Enter", text );
				}
				finally {
					document.body.removeChild( textarea );
				}
			}
		};

		const wooSetContentHTML = ( $element, content ) => {
			if ( undefined === $element.attr( 'data-o_content' ) ) {
				$element.attr( 'data-o_content', $element.html() );
			}
			$element.html( content );
		};

		const wooResetContentHTML = ( $element ) => {
			if ( undefined !== $element.attr( 'data-o_content' ) ) {
				$element.html( $element.attr( 'data-o_content' ) );
			}
		};

		dotinvietnam.Helpers = {
			isEmptyObject,
			isValidSelector,
			isHandheld,
			addUrlParam,
			getUrlParamsAsObject,
			getScrollbarWidth,
			setBodyOverflow,
			unsetBodyOverflow,
			setBodyHandling,
			setBodyCompleted,
			setElementHandling,
			unsetElementHandling,
			getStyle,
			setCookie,
			getCookie,
			copyToClipboard,
			wooSetContentHTML,
			wooResetContentHTML
		}

	}( window, jQuery )
);

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

			var $readmore = $( '.project-excerpt' ),
			    $swiper   = $readmore.closest( '.tm-swiper' );

			new Readmore( $readmore, {
				moreLink: '<a href="#" class="btn btn-flat btn-small">Read more...</a>',
				lessLink: '<a href="#" class="btn btn-flat btn-small">Read less</a>',
				afterToggle: function( trigger, element, expanded ) {
					/*if ( $tabPanel.length > 0 ) {
						$tabPanel.MinimogTabPanel( 'updateLayout' );
					}*/
				}
			} );

			if ( ! isHandheld() ) {
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
			}
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

		function isHandheld() {
			let check = false;
			(
				function( a ) {
					if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test( a ) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( a.substr( 0, 4 ) ) ) {
						check = true;
					}
				}
			)( navigator.userAgent || navigator.vendor || window.opera );
			return check;
		}
	}( jQuery )
);
