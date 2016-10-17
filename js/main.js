/*********************************************
Application Name:	Music App
API key:	1b4079554bd4f2194c22ecedcaa0ecd2
Shared secret:	b503e23e20bae2681db211dcefcc5ad8
Registered to	chloecollier
*********************************************/
(function musicApp() {
  var key = '1b4079554bd4f2194c22ecedcaa0ecd2';

  function globalSongs(songData) {
    console.log(songData);
    this.info = {
      artist: songData.artist[0].name,
      listeners: songData.artist[0].listeners,
      country: songData['@attr'].country,
      image: songData.artist[0].image[2]['#text']
    };

    function globalSongsHTML() {
      var source = $('#global-songs').html();
      var template = Handlebars.compile(source);
      var context = this.info;
      var html = template(context);
      $(html).prependTo('.global-songs-container').fadeIn();
    }
    globalSongsHTML();
  }

  function topSongs(songData) {

    for (var i = 0; i < songData.length; i++) {
      this.info = {
        artist: songData[i].artist.name,
        song: songData[i].name,
        listeners: songData[i].listeners,
        image: songData[i].image[2]['#text']
      };
      topSongsHTML();
    }

    function topSongsHTML() {
      var source = $('#top-songs').html();
      var template = Handlebars.compile(source);
      var context = this.info;
      var html = template(context);
      $(html).prependTo('.music-container').fadeIn();
    }
  }

  function topSongsGenerator() {
    $.ajax({
        type : 'GET',
        url : 'http://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=' + key + '&format=json',
        dataType : 'jsonp',
        data: {
          'limit': 10
        },
        success : function(data) {
            topSongs(data.tracks.track);
        }
    });
  }

  function globalArtistsGenerator() {
    countries = ['france', 'spain', 'switzerland', 'japan', 'china', 'poland', 'iceland', 'ireland', 'united states', 'germany'];

    for (var i = 0; i < countries.length; i++) {
      $.ajax({
          type : 'GET',
          url : 'http://ws.audioscrobbler.com/2.0/?method=geo.gettopartists&country=' + countries[i] + '&api_key=' + key + '&format=json',
          dataType : 'jsonp',
          data: {
            'limit': 1
          },
          success : function(data) {
              globalSongs(data.topartists);
          }
      });
    }
  }

  function init() {
    topSongsGenerator();
    globalArtistsGenerator();
  }
  init();
})();
