var unsubs = [];

var actions = {
  video: {
    setup: function () {

      var container = document.querySelector('#example-video-content');
      container.innerHTML = '<video class="stretch"></video>';

        navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          {
            video: true
          },
          function (stream) {
            var video = container.querySelector('video');
            video.src = window.URL.createObjectURL(stream);
            video.onloadedmetadata = function (e) {
              video.play();
            };
          },
          function (err) {
            alert("The following error occured: " + err.name);
          }
        );
      } else {
        alert("getUserMedia not supported");
      }

      unsubs.push(actions.video.teardown);

    },
    teardown: function() {
      var container = document.querySelector('#example-video-content');
      container.innerHTML = '';
    }
  },
  light: {
    listener: function(event) {

      var lux = event.value;

      document.querySelector('.lux').innerHTML = lux;

      var cls;
      if (lux < 500) {
        cls = 'dark';
      }

      document.querySelector('#light-demo').className = cls;

    },
    setup: function() {

      window.addEventListener('devicelight', actions.light.listener, true);

      unsubs.push(actions.light.teardown);

    },
    teardown: function() {
      window.removeEventListener('devicelight', actions.light.listener, true);
    }
  }
};

Reveal.addEventListener('slidechanged', function(event) {

  while (unsubs.length > 0) {
    var unsub = unsubs.pop();
    unsub();
  }

  var slide = event.currentSlide;

  if (slide.id === 'light-demo') {
    actions.light.setup();
  }

});

Reveal.addEventListener('fragmentshown', function (event) {

  var fragment = event.fragment;

  if (fragment.id === 'example-video') {
    actions.video.setup();
  }

});