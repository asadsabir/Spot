/*
Make playlist part more efficient/faster
Complete choose your own playlists
add coooooooooookies
add liked songs
Change Login Page
Switch to refresh token
*/



var access_token = window.location.pathname.substring(1) 
$('#audio-features').hide();
$('#loggedin').hide();
$('#feature-submit').hide();
var playlist_songs = [];
var final_ids = [];
var unclassified_s = [];
var spotifyuser = undefined

document.getElementById('pickallplaylists').onchange = (par) => {
    if(document.getElementById('pickallplaylists').checked){
        for(i = 0; i < userplaylists.length;i++){
            document.getElementById(userplaylists[i].id).checked = true
        }
        document.getElementById('likedsongs').checked = true
        document.getElementById('pickuserplaylists').checked = true
    }else{
        for(i = 0; i < userplaylists.length;i++){
            document.getElementById(userplaylists[i].id).checked = false
        }
        document.getElementById('likedsongs').checked = false
        document.getElementById('pickuserplaylists').checked = false
    }
}

document.getElementById('pickuserplaylists').onchange = (_par) => {
    if(document.getElementById('pickuserplaylists').checked){
        var b = true
    }else{var b = false}
    userplaylists.forEach((p) => {
        if(p.owner.id == spotifyuser.id){ document.getElementById(p.id).checked = b; console.log('fi')}
    })
}

function sset(next,playno){
    setTimeout(() => {
        if(next == null){initplay(playno+1)
        }else{
            $.ajax({
                url: next,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(repond){
                    repond.items.forEach(function(pt){
                        if(pt.track){
                            try {
                                document.getElementById('songimg').src = pt.track.album.images[1].url
                            } catch (error) {
                                console.log(pt)
                            }
                            if(playlist_songs.find(j => j.id == pt.track.id) == undefined && pt.track.type == 'track'){playlist_songs.push(pt.track)}
                        }
                    })
                    sset(repond.next,playno)
                },
                error: (x) => {
                    console.log(x)
                    if(x.status == 401){window.location.replace('http://localhost:8888/')}
                }
            })
        }
    },65)
}
function initplay(playno){
    setTimeout(() => {
        if(playno == userplaylists.length){
            console.log(playlist_songs);
            $('#loading').hide();
            $('#audio-features').show();
            $('#feature-submit').show();
        }else if(document.getElementById(userplaylists[playno].id).checked){
            console.log(playno);
            $.ajax({
                url:'https://api.spotify.com/v1/playlists/'+userplaylists[playno].id+'/tracks',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(pl){
                    sset(pl.next,playno)
                    pl.items.forEach(function(pt){
                        document.getElementById('songimg').src = pt.track.album.images[1].url
                        if(playlist_songs.find(j => j.id == pt.track.id) == undefined && pt.track.type == 'track'){playlist_songs.push(pt.track)}
                    })
                },
                error: (x) => {
                    if(x.status == 401){window.location.replace('http://localhost:8888/')}
                }
            })
        }else if(document.getElementById('')){
        }else{initplay(playno+1); console.log(playno)}
    },0)
}
document.getElementById('playlist-submit').addEventListener('click',async function(){
    initplay(0)
    $('#playlists').hide();
    $('#playlist-submit').hide();
    $('#loading').show();
    for(i = 0;i < 7; i++){
        var slider = document.createElement('div');
        var slider_min = document.createElement('div');
        var slider_max = document.createElement('div');
        slider.id = 'shlider'+  (i+1).toString()
        document.getElementById('slider' + (i+1).toString()).appendChild(slider);
        document.getElementById('slider'+ (i+1).toString()).appendChild(slider_min);
        slider_min.id = 'slider_min'+ (i+1).toString()
        document.getElementById('slider'+ (i+1).toString()).appendChild(slider_max);
        slider_max.id = 'slider_max'+ (i+1).toString()
        $('#shlider'+(i+1).toString()).slider({
            range: true,
            min: 0,
            max: 100,
            values: [0,100],
            change: (event, ui) => {
                document.getElementById('slider_max'+ ui.handle.parentNode.id.substring(7)).innerHTML = 'max:'+ ui.values[1];
                document.getElementById('slider_min'+ ui.handle.parentNode.id.substring(7)).innerHTML = 'min:'+ ui.values[0];
            }
        })
        if(i == 5){$('#shlider'+(i+1).toString()).slider({max: 200, values: [0,200]})}
        slider_max.innerHTML = 'max:'+ $('#shlider'+(i+1).toString()).slider('values',1)
        slider_min.innerHTML = 'min:'+ $('#shlider'+(i+1).toString()).slider('values',0)
    }
})

document.getElementById('feature-submit').addEventListener('click',async function() {
    console.log(playlist_songs);
    var energy_min = parseFloat(document.getElementById('slider_min1').innerHTML.slice(4))
    var energy_max = parseFloat(document.getElementById('slider_max1').innerHTML.slice(4))
    var danceability_min = parseFloat(document.getElementById('slider_min2').innerHTML.slice(4))
    var danceability_max = parseFloat(document.getElementById('slider_max2').innerHTML.slice(4))
    var popularity_min = parseFloat(document.getElementById('slider_min3').innerHTML.slice(4))
    var popularity_max = parseFloat(document.getElementById('slider_max3').innerHTML.slice(4))
    var valence_min = parseFloat(document.getElementById('slider_min4').innerHTML.slice(4))
    var valence_max = parseFloat(document.getElementById('slider_max4').innerHTML.slice(4))
    var speechiness_min = parseFloat(document.getElementById('slider_min5').innerHTML.slice(4))
    var speechiness_max = parseFloat(document.getElementById('slider_max5').innerHTML.slice(4))
    var tempo_min = parseFloat(document.getElementById('slider_min6').innerHTML.slice(4))
    var tempo_max = parseFloat(document.getElementById('slider_max6').innerHTML.slice(4));
    var acousticness_max = parseFloat(document.getElementById('slider_max7').innerHTML.slice(4));
    var acousticness_min = parseFloat(document.getElementById('slider_min7').innerHTML.slice(4)); 
    var psongs = []
    playlist_songs.forEach((t) => {psongs.push(t)})
    songidchk()
    function songidchk(){
        setTimeout(() => {
            var songids = ''
            for(i = 0;i < 100;i++){
                if(i == 99 || psongs.length == 1){
                    songids = songids + psongs.shift().id
                    if(psongs.length == 0){featget(songids,true)}else{featget(songids,false)}
                    break
                }else{songids = `${songids + psongs.shift().id},`}
            }
        }, 0);
    }
    function featget(ids,flag){
        setTimeout(() => {
            $.ajax({
                url:`https://api.spotify.com/v1/audio-features/?ids=${ids}`,
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: function(songdeets){
                    console.log(songdeets)
                    songdeets.audio_features.forEach((s) => {
                        try{if(s.tempo <= tempo_max && s.tempo*100 >= tempo_min && s.danceability*100 >= danceability_min && s.danceability*100 <= danceability_max && s.energy*100 >= energy_min && s.energy*100 <= energy_max && s.valence*100 >= valence_min && s.valence*100 <= valence_max && s.speechiness*100 >= speechiness_min && s.speechiness*100 <= speechiness_max && playlist_songs.find((c) => c.id == s.id).popularity >= popularity_min && playlist_songs.find((c) => c.id == s.id).popularity <= popularity_max && s.acousticness*100 >= acousticness_min && s.acousticness*100 <= acousticness_max){
                            final_ids.push(s.uri)}
                        }catch(err){
                            console.log(err)
                        }
                    })
                    if(flag){console.log(final_ids);agb()}else{songidchk()}
                },
                error: (x) => {
                    if(x.status == 401){window.location.replace('http://localhost:8888/')}
                }
            })
        }, 65);
    }
})

var agb = () => {
    console.log('agb')
    var n = ''
    if (document.getElementById('finalplaylistname').value.length > 0){
        n = document.getElementById('finalplaylistname').value
    }else{n = 'untitled'}
    $.ajax({
        type: "POST",
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        url: `https://api.spotify.com/v1/users/${spotifyuser.id}/playlists`,
        data: JSON.stringify({
            name:n
        }),
        success: (h) => {
            console.log(h)
            block(h.id)
        }
      })
}
var block = (playlist_id) => {
    var son = []
    for(i = 0;i < 100;i++){
        if(i == 99 || final_ids.length == 1){
            son.push(final_ids.shift())
            break
        }else{son.push(final_ids.shift())}
    }
    console.log(son)
    $.ajax({
        type: "POST",
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        url: `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
        data: JSON.stringify({
            uris: son
        }),
        success: (h) => {
            if(final_ids.length > 0){block(playlist_id)}
        }
      })
}
 

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
var hashParams = {};
var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
while ( e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
}
console.log(hashParams);
return hashParams;
}


if(access_token){
    $.ajax({
        url: 'https://api.spotify.com/v1/me/top/artists?limit=21',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        success: function(response,status) {
            console.log(status)
            console.log(response.items[Math.floor(Math.random()*20)].images)
            response.items.forEach((a) => {
                let pict = document.createElement('img')
                pict.src = a.images[2].url
                document.getElementById('image-column').appendChild(pict)
            })
            $.ajax({
                url:'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + access_token
                },
                success: (u) => {
                    spotifyuser = u
                },
                error: (x) => {
                    if(x.status == 401){window.location.replace('http://localhost:8888/')}
                }
            })
            console.log(response);
            $('#login').hide();
            $.ajax({
                url: 'https://api.spotify.com/v1/me/playlists?limit=50',
                headers: {
                'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    $('#loading').hide();
                    userplaylists = response.items;
                    function GetAll(r){
                        if (r == null){
                            console.log(userplaylists);
                            for(i = 0; i < userplaylists.length; i++){
                                var playlist_option = document.createElement('input');
                                document.getElementById('playlist-form').appendChild(playlist_option);
                                var playlist_label = document.createElement('label');
                                document.getElementById('playlist-form').appendChild(playlist_label);
                                var lin = document.createElement('br');
                                document.getElementById('playlist-form').appendChild(lin);
                                playlist_option.type = 'checkbox'
                                playlist_label.for = userplaylists[i].id;
                                playlist_label.innerHTML = userplaylists[i].name
                                playlist_option.id = userplaylists[i].id;
                                document.getElementById(userplaylists[i].id).onchange = (par) => {
                                    console.log(par)
                                    if(document.getElementById('pickallplaylists').checked == true){document.getElementById('pickallplaylists').checked = false}
                                }
                            }
                        }else{
                            $.ajax({
                                url: r,
                                headers: {
                                    'Authorization': 'Bearer ' + access_token
                                },
                                success: function(repond){
                                    userplaylists = userplaylists.concat(repond.items);
                                    GetAll(repond.next);
                                },
                                error: (x) => {
                                    if(x.status == 401){window.location.replace('http://localhost:8888/')}
                                }
                            })
                        }
                    }
                    GetAll(response.next);
                },
                error: (x) => {
                    if(x.status == 401){window.location.replace('http://localhost:8888/')}
                }
            });
            $('#playlists').show();
        },
        error: (x) => {
            if(x.status == 401){window.location.replace('http://localhost:8888/')}
        }
    });
} else {
    // render initial screen
    $('#login').show();
    $('#playlists').hide();
}

/*document.getElementById('obtain-new-token').addEventListener('click', function() {
$.ajax({
    url: '/refresh_token',
    data: {
    'refresh_token': refresh_token
    }
}).done(function(data) {
    access_token = data.access_token;
    console.log(data);
});
}, false);*/

   