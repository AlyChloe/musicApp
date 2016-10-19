/*********************************************
Application Name:	Music App
API key:	1b4079554bd4f2194c22ecedcaa0ecd2
Shared secret:	b503e23e20bae2681db211dcefcc5ad8
Registered to	chloecollier
*********************************************/

$(document).ready(function() {
    (function musicApp() {
        var key = '1b4079554bd4f2194c22ecedcaa0ecd2';
        /*********************************************
        Loading saved playlist
        *********************************************/
        function loadCurrentPlaylist() {
            if(localStorage.length !== 0) {
                var retrievedObject = JSON.parse(localStorage.getItem("musicArray"));
                for (var i = 0; i < retrievedObject.length; i++) {
                    generateTemplate('your-playlist', retrievedObject[i]);
                }
            }
        }
        /*********************************************
        Top Artists Page
        *********************************************/
        function topArtistsPage() {
            console.log('top artist page!');
        }
        /*********************************************
        Playlist Page
        *********************************************/
        function playlistPage(section) {
            hidePages('playlist');
            generateTemplate('playlist');
            $('.playlist').css({
                'width': '225px',
                'padding': '20px 25px'
            });

            $('form').submit(function(event) {
                event.preventDefault();
                var searchValue = $('#search').val();
                $('#search').empty();
                $('.playlist-search-container').prev().remove();
                playlistHover();
                if (section === 'playlist') {
                    playlistSearch(searchValue);
                } else {
                    similarSearch(searchValue);
                }
            });
        }
        /*********************************************
        When user clicks on song, it will add song/artist to playlist.
        As well as storing song/artist to localStorage
        *********************************************/
        function playlistHover() {
            var musicArray = [];

            $('.playlist-section').on('click', '.search-songs', function() {
                var artist = $(this).find('h2').text();
                var song = $(this).find('.song').text();
                if (song !== '') {
                  var music = {
                      "artist": artist,
                      "song": song
                  };

                  musicArray.push(music);
                  localStorage.setItem("musicArray", JSON.stringify(musicArray));
                  var retrievedObject = JSON.parse(localStorage.getItem("musicArray"));

                  generateTemplate('your-playlist', music);
                }
            });
        }
        /*********************************************
        When user clicks on nav page, it will hide the other pages
        *********************************************/
        function hidePages(page) {
            $('section:not(.' + page + '-section)').hide();
        }
        /*********************************************
        Homepage hero section (number 1 played song for the day)
        *********************************************/
        function todaysFavoite(songData) {
            var info = {
                artist: songData.artist.name,
                song: songData.name,
                listeners: songData.listeners,
                image: songData.image[3]['#text']
            };
            generateTemplate('favorite', info);
        }
        /*********************************************
        Homepage top songs (displays the top 9 songs for the day)
        *********************************************/
        function topSongs(songData) {
            var info = {};
            for (var i = 1; i < songData.length; i++) {
                info = {
                    artist: songData[i].artist.name,
                    song: songData[i].name,
                    listeners: songData[i].listeners,
                    image: songData[i].image[2]['#text']
                };
                generateTemplate('top-songs', info);
            }
        }

        function playlistSongs(songData) {
            var info = {};
            for (var i = 1; i < songData.length; i++) {
                info = {
                    artist: songData[i].artist,
                    song: songData[i].name,
                    listeners: songData[i].listeners,
                };
                generateTemplate('playlist', info);
            }
        }
        /*********************************************
        Similar artists: When user searchs artist, other similar artists
        will be displayed. User can then click on similar artist and page will
        then search/bring-up songs of that artist.
        *********************************************/
        function similarSongs(songData) {
          console.log(songData);
            var info = {};
            for (var i = 1; i < songData.length; i++) {
                info = {
                    artist: songData[i].name,
                    image: songData[i].image[2]['#text']
                };
                generateTemplate('similar', info);
            }

            $('.playlist-section').on('click', '.similar-songs-container', function() {
                var artist = $(this).find('h2').text();
                $('.playlist-search-container').prev().remove();
                $('.similar-songs-container').prev().remove();
                playlistSearch(artist);
            });
        }
        /*********************************************
        API Generators
        *********************************************/
        function topSongsGenerator() {
            $.ajax({
                type: 'GET',
                crossDomain: true,
                url: 'http://www.last.fm/api/auth/?api_key=' + key + '&cb=https://github.com/AlyChloe',
                dataType: 'jsonp',
                data: {
                    'limit': 10
                },
                success: function(data) {
                    todaysFavoite(data.tracks.track[0]);
                    topSongs(data.tracks.track);
                }
            });
        }


        function playlistSearch(searchValue) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://www.last.fm/api/auth/?api_key=" + encodeURIComponent(searchValue) + "&api_key=" + key + '&cb=https://github.com/AlyChloe',
                "method": "GET",
                "processData": false,
                "data": "{}"
            };

            $.ajax(settings).done(function(response) {
                playlistSongs(response.results.trackmatches.track);
            });
        }

        function similarSearch(searchValue) {
            var settings = {
                "async": true,
                "crossDomain": true,
                "url": "http://www.last.fm/api/auth/?api_key=" + encodeURIComponent(searchValue) + "&api_key=" + key + '&cb=https://github.com/AlyChloe',
                "method": "GET",
                "processData": false,
                "data": {
                    'limit': 10
                }
            };

            $.ajax(settings).done(function(response) {
                similarSongs(response.similarartists.artist);
            });
        }
        /*********************************************
        Page generator
        *********************************************/
        function generateTemplate(page, info) {
            var container = '';

            if (page === 'favorite') {
                container = 'loved';
            } else if (page === 'top-songs') {
                container = 'music';
            } else if (page === 'similar') {
                container = 'playlist';
            } else {
                container = page;
            }

            var source = $('#' + page + '-template').html();
            var template = Handlebars.compile(source);
            var context = info;
            var html = template(context);
            $(html).prependTo('.' + container + '-container').fadeIn();
        }

        function init() {
            var self = this;
            topSongsGenerator();
            loadCurrentPlaylist();

            $('aside').on('click', 'header', function(e) {
                $('.playlist-search-container').prev().remove();
                $('.playlist-section').hide();
                $('.favorite-section').show();
                $('.music-section').show();

                href = this.href;
                window.location.hash = '';
                e.preventDefault();
            });

            $('nav li').on('click', 'a', function(e) {
                var href = this.href;

                if ($(this).parent('li').hasClass('nav-top-artists')) {
                    topArtistsPage();
                } else if ($(this).parent('li').hasClass('nav-playlist')) {
                    $('.arrow-right').hide();
                    $('.playlist-search-container').prev().remove();
                    $('.playlist-section').show();
                    $('.search-container label').html('What do you want to listen to?');
                    $('#search').removeClass('inputColor');
                    playlistPage('playlist');

                    href = this.href;
                    $("#playlist").load(href);
                    window.location.hash = href;
                    e.preventDefault();
                } else if ($(this).parent('li').hasClass('nav-similar')) {
                    $('.arrow-right').hide();
                    $('.playlist-search-container').prev().remove();
                    $('.search-container label').html('Discover New Music');
                    $('#search').addClass('inputColor');
                    $('.playlist-section').show();
                    playlistPage('similar');

                    href = this.href;
                    $("#similar-artists").load(href);
                    window.location.hash = href;
                    e.preventDefault();
                }

            });

            // if (window.location.hash) {
            //     var page = window.location.hash;
            //     page.replace('#', '');
            //     self.generateTemplate(page);
            // }
        }
        init();
    })();
});
