(function ($$1, window$1) {
  'use strict';

  var undefined;

  $$1 = $$1 && $$1.hasOwnProperty('default') ? $$1['default'] : $$1;
  window$1 = window$1 && window$1.hasOwnProperty('default') ? window$1['default'] : window$1;

  var helpers = (function () {
    function dBg() {
      $('.bg-img').each(function (ind, elem) {
        var mobClass = $(elem).hasClass('show-for-small-only') || $(elem).hasClass('_mob');
        var desktopClass = $(elem).hasClass('hide-for-small-only') || $(elem).hasClass('_desktop');

        if ($(elem).data('image-src')) {
          if ($(window).width() < 768 && desktopClass) {
            return;
          }

          if ($(window).width() >= 768 && mobClass) {
            return;
          }

          $(elem).css("backgroundImage", "url('" + $(elem).data('image-src') + "')");
        }
      });
    }

    dBg();
    window.addEventListener('resize', function () {
      dBg();
    }); // We listen to the load event

    window.addEventListener('load', function () {
      // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
      var vh = window.innerHeight * 0.01; // Then we set the value in the --vh custom property to the root of the document

      document.documentElement.style.setProperty('--vh', vh + "px");
      var vhModal = window.innerHeight * 0.01; // Then we set the value in the --vh custom property to the root of the document

      document.documentElement.style.setProperty('--vh-modal', vhModal + "px"); // alert(window.innerHeight);
      // setTimeout(function (){
      //     alert(window.innerHeight);
      // },1500)
    }); // We listen to the resize event

    window.addEventListener('resize', function () {
      var vhModal = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh-modal', vhModal + "px");

      if ($(window).width() > 640) {
        // We execute the same script as before
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + "px");
      }
    }); // Listen for orientation changes
    //     window.addEventListener("orientationchange", function() {
    //         // Announce the new orientation number
    //         // alert(window.orientation);
    //         let vh = window.innerHeight * 0.01;
    //         document.documentElement.style.setProperty('--vh', `${vh}px`);
    //     }, false);

    window.addEventListener("resize", function (event) {
      getScreenOrientation();
    });
    var scrOr = window.outerWidth > window.outerHeight ? 90 : 0;

    function getScreenOrientation() {
      var screenOrientation = window.outerWidth > window.outerHeight ? 90 : 0;
      console.log("screenOrientation = " + screenOrientation);

      if (screenOrientation != scrOr) {
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', vh + "px");
        scrOr = screenOrientation;
      }
    } // getScreenOrientation();


    var iOS = !window.MSStream && /iPad|iPhone|iPod/.test(navigator.userAgent); // fails on iPad iOS 13

    if (iOS) {
      $('html').addClass('iOS');
    } else {
      $('html').removeClass('iOS');
    }

    function getOS() {
      var userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'MacOS';
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
      } else if (/Android/.test(userAgent)) {
        os = 'Android';
      } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
      }

      return os;
    }

    $('html').addClass(getOS());
  });

  function userAgent() {
    var attribute = '';
    var devices = {
      android: /android/i,
      iphone: /iphone/i,
      ipad: /ipad/i,
      ipod: /ipod/i,
      ios: /iphone|ipad|ipod/i
    };

    for (var device in devices) {
      if (devices[device].test(window.navigator.userAgent)) attribute += ' ' + device;
    }

    document.querySelector('html').setAttribute('device', attribute);
  }

  userAgent();

  if (isIE()) {
    $('html').addClass('ie');
  } else {
    $('html').removeClass('ie');
  }

  function isIE() {
    return navigator.userAgent.toUpperCase().indexOf("TRIDENT/") != -1 || navigator.userAgent.toUpperCase().indexOf("MSIE") != -1;
  }

  // import header from './header';
  // import alert from './alert';
  // import sliderNavSecondary from "./secondary-nav";
  // import inputMask from './input-mask';
  // import profileTop from './profile-top';
  // import pageUp from './page-up';

  var common = {
    init: function init() {
      helpers(); // burger();
    },
    defer: function defer() {// burger();
    }
  };

  // import partial_tabs from './tabs';
  // import partial_filter from './filter';
  // import loadMore from './load-more';

  var page_home = {
    init: function init() {
      common.init(); // partial_hero.init(settings);
    }
  };

  $$1(document).ready(function () {
    // $(document).foundation();
    page_home.init(); // page_text.init();
  }); // function docReady(fn) {
  //     // see if DOM is already available
  //     if (document.readyState === "complete" || document.readyState === "interactive") {
  //         // call on next available tick
  //         setTimeout(fn, 1);
  //     } else {
  //         document.addEventListener("DOMContentLoaded", fn);
  //     }
  // }
  //
  // docReady(function() {
  //     // DOM is loaded and ready for manipulation here
  // });


  window.onload = function () {
    document.body.classList.add('is-animating');
  }; // function checkIfImageExists(url, callback) {
  //     const img = new Image();
  //
  //     img.src = url;
  //
  //     if (img.complete) {
  //         callback(true);
  //     } else {
  //         img.onload = () => {
  //             callback(true);
  //         };
  //         img.onerror = () => {
  //             callback(false);
  //         };
  //     }
  // }
  //
  // checkIfImageExists('./img/bg/bg.jpg', (exists) => {
  //     if (exists) {
  //         // Success code
  //         console.log('img true');
  //     }
  // });

  class App{
    setState(currState){
      var storageState = localStorage.getItem('state');
      if (storageState) currState = storageState;
      if (!document.querySelector('[data-state="'+currState+'"]')) return;
      var body = document.querySelector('body');
      for (var i = body.classList.length - 1; i >= 0; i--) {
        var className = body.classList[i];
        if (className.startsWith('state--')) {
          body.classList.remove(className);
        }
      }
      body.classList.add('state--'+currState);
      document.querySelectorAll('[data-state]').forEach(function (el){
        if (el.dataset.state.split(' ').indexOf(currState) > -1){
          (el.dataset.toggle) ? el.classList.remove(el.dataset.toggle) : el.classList.remove('hide');
        } else {
          (el.dataset.toggle) ? el.classList.add(el.dataset.toggle) : el.classList.add('hide');
        }
      });
      localStorage.removeItem('state');

      if (currState == 'info'){
        initMobileSlider();
        var video = document.getElementById('video');
        video.muted = true;
        video.pause();
      }

      if (currState == 'auth' || currState == 'start-pre' || currState == 'reg'){
        document.querySelectorAll('.js-state-link').forEach(function (el){
          if (!el) return;
          // console.log('___',el,'___');
          // console.log('before state link =>', el.dataset.show);
          // console.log('state current =>', currState);
          el.dataset.show = currState;
          // console.log('after state link =>', el.dataset.show);
          // console.log('______');
        });
      }


      //change theme-color
      if (isMobile.any()){
        var bgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color');
        document.querySelector('meta[name="theme-color"]').content = RGBToHex(bgColor);
      }
    }
  }
  window.app = new App();
  console.debug('localStorage state =>', localStorage.getItem('state'));
  window.location.hash = '';
  app.setState('start');

}(jQuery, window));