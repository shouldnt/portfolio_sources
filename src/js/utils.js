export default {
	CoverSize(imgWidth, imgHeight, containerWidth, containerHeight) {
		var originalRatios = {
		  	width: containerWidth / imgWidth,
		  	height: containerHeight / imgHeight
		};

		// formula for cover:
		var coverRatio = Math.max(originalRatios.width, originalRatios.height); 

		// result:
		var newImageWidth = imgWidth * coverRatio;
		var newImageHeight = imgHeight * coverRatio;

		return [newImageWidth, newImageHeight];
	},
	IsInViewport(selector) {
		var el = document.querySelector(selector);
		const scroll = window.scrollY || window.pageYOffset
		const boundsTop = el.getBoundingClientRect().top + scroll
		
		const viewport = {
			top: scroll,
			bottom: scroll + window.innerHeight,
		}
		
	    const bounds = {
			top: boundsTop,
			bottom: boundsTop + el.clientHeight,
		}
		
		return ( bounds.bottom >= viewport.top && bounds.bottom <= viewport.bottom ) 
			|| ( bounds.top <= viewport.bottom && bounds.top >= viewport.top );
	},
	IsCollide(selector1, selector2) {
		var a = document.querySelector(selector1);
		var b = document.querySelector(selector2);
		
	    var aRect = a.getBoundingClientRect();
	    var bRect = b.getBoundingClientRect();

	    return !(
	        ((aRect.top + aRect.height) < (bRect.top)) ||
	        (aRect.top > (bRect.top + bRect.height)) ||
	        ((aRect.left + aRect.width) < bRect.left) ||
	        (aRect.left > (bRect.left + bRect.width))
	    );
	},
	youtubeParser(url) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	    var match = url.match(regExp);
	    return (match&&match[7].length==11)? match[7] : false;
	},
	embedGenerate (url) {
	    // - Supported YouTube URL formats:
	    //   - http://www.youtube.com/watch?v=My2FRPA3Gf8
	    //   - http://youtu.be/My2FRPA3Gf8
	    //   - https://youtube.googleapis.com/v/My2FRPA3Gf8
	    // - Supported Vimeo URL formats:
	    //   - http://vimeo.com/25451551
	    //   - http://player.vimeo.com/video/25451551
	    // - Also supports relative URLs:
	    //   - //player.vimeo.com/video/25451551

	    url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);

	    if (RegExp.$3.indexOf('youtu') > -1) {
	        var type = 'youtube';
	    } else if (RegExp.$3.indexOf('vimeo') > -1) {
	        var type = 'vimeo';
	    }

	    var videoObj = {
	    	type: type,
	        id: RegExp.$6
	    }
	    var embed_url = '';
	    if (videoObj.type == 'youtube') {
	        embed_url = 'https://www.youtube.com/embed/' + videoObj.id;
	    } else if (videoObj.type == 'vimeo') {
	        embed_url = 'https://player.vimeo.com/video/' + videoObj.id;
	    }

	    return embed_url;
	}
}