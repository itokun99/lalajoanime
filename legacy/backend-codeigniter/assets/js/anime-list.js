// get Anime Info dari Grabber
function getAnimeInfo(anime_id){
	var url = "api/grab-anime?id=" + anime_id;
	var type = "GET";
	var data = {};
	var beforeSendAction = function(){
		$("#generate_mal").val("Loading").attr('disabled', '');
	};
	var successAction = function(response){
		if(response.status === true){
      (function(){
        $.fn.hasValue = function(){
          if(this.val() != ""){
            this.siblings("label").addClass("has-val");
          }
        }
      })()
      $('[name="anime_title"]').val(response.anime_info.anime_title).hasValue();
      $('[name="anime_alternative"]').val(response.anime_info.japanese).hasValue();
      $('[name="anime_genre"]').val(response.anime_info.genre).hasValue();
      $('[name="anime_type"]').val(response.anime_info.type).hasValue();
      $('[name="anime_status"]').val(response.anime_info.status).hasValue();
      $('[name="anime_score"]').val(response.anime_info.score).hasValue();
      $('[name="anime_episode"]').val(response.anime_info.episode).hasValue();
      $('[name="anime_duration"]').val(response.anime_info.duration).hasValue();
      $('[name="anime_release"]').val(response.anime_info.aired).hasValue();
      $('[name="anime_trailer"]').val(response.anime_info.pv).hasValue();
      $('[name="anime_poster"]').val(response.anime_info.image).hasValue();
      $('.cover-pic img').attr("src", response.anime_info.image);
      $('[name="anime_sinopsis"]').val(response.anime_info.synopsis).hasValue();
      $('[name="anime_studios"]').val(response.anime_info.studio).hasValue();
      $("#generate_mal").val("Generate").removeAttr('disabled');
      
      var dataAlert = {
        alertType : "success",
        alertTitle : "Sukses!!",
        alertMessage : "Info Anime " +response.anime_info.anime_title+ " berhasil didapatkan ",
      }
      openAlert(dataAlert);
    } else {
      console.log(response);
      var message = response.responseJSON.pesan
      var dataAlert = {
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : message,
      }
      openAlert(dataAlert);
      $("#generate_mal").val("Generate").removeAttr('disabled');
    }
  }
  var errorAction = function(response){
    console.log(response)
    var dataAlert = {
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : "Grab tidak Jalan, cek konsol",
    }
    $("#addAnime").text("Add Anime").removeAttr('disabled');
    openAlert(dataAlert);
  }
	// get Grab info
	ajaxSendJSON(url, type, data, beforeSendAction, successAction, errorAction);
}
function grabber(){
	$("#generate_mal").on('click', function(){
		var anime_id = $("[name='anime_mal_id']").val();
		if(anime_id != "" || anime_id != null){
			getAnimeInfo(anime_id);
		}
	})
}

// add anime
function AddAnimeAction(){
	var url = "api/animes";
	var type = "POST";
	var anime_data = {
		anime_mal_id : $('[name="anime_mal_id"]').val(),
		anime_title : $('[name="anime_title"]').val(),
		anime_alternative : $('[name="anime_alternative"]').val(),
		anime_genre : $('[name="anime_genre"]').val(),
		anime_type : $('[name="anime_type"]').val(),
		anime_status : $('[name="anime_status"]').val(),
		anime_score : $('[name="anime_score"]').val(),
		anime_episode : $('[name="anime_episode"]').val(),
		anime_duration : $('[name="anime_duration"]').val(),
		anime_release : $('[name="anime_release"]').val(),
		anime_trailer : $('[name="anime_trailer"]').val(),
		anime_poster : $('[name="anime_poster"]').val(),
		anime_sinopsis : $('[name="anime_sinopsis"]').val(),
		anime_studios : $('[name="anime_studios"]').val(),
  }
  // console.log(anime_data)
	var beforeSendAction = function(){
		$("#addAnime").text("Loading").attr('disabled', '');
	}
	var successAction = function(response){
    if(response.status === true){
      var anime_title = response.anime_title
      var dataAlert = {
        alertType : "success",
        alertTitle : "Sukses!!",
        alertMessage : "Anime " +anime_title+ " berhasil ditambahkan kedalam database",
      }
      $("#addAnime").text("Add Anime").removeAttr('disabled');
      openAlert(dataAlert);
      animeListShow();
      // resetFormAction();
    } else {
      var message = response.responseJSON.pesan
      console.log(response);
      var dataAlert = {
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : message,
      }
      $("#addAnime").text("Add Anime").removeAttr('disabled');
      openAlert(dataAlert);
    }
  }
  var errorAction = function(response){
    var message = response.responseJSON.pesan
    console.log(response)
    var dataAlert = {
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : message,
    }
    $("#addAnime").text("Add Anime").removeAttr('disabled');
    openAlert(dataAlert);
  }

  if($('[name="anime_mal_id"]').val() == "" || $('[name="anime_title"]').val() == ""){
    openAlert({
      alertType : "warning",
      alertTitle : "Warning",
      alertMessage : "Tidak bisa mengirim form kosong",
    });
  } else {
    // send ajax
    ajaxSendJSON(url, type, anime_data, beforeSendAction, successAction, errorAction);
  }
}
function AddAnime(){
	$("#addAnime").on("click", function(){
		AddAnimeAction();
	})
}

// reset form
function resetFormAction(){
  (function(){
    $.fn.hasValue = function(){
      this.siblings("label").removeClass("has-val");
    }
  })()
  $('[name="anime_mal_id"]').val("").hasValue();
  $('[name="anime_title"]').val("").hasValue();
  $('[name="anime_alternative"]').val("").hasValue();
  $('[name="anime_genre"]').val("").hasValue();
  $('[name="anime_type"]').val("").hasValue();
  $('[name="anime_status"]').val("").hasValue();
  $('[name="anime_score"]').val("").hasValue();
  $('[name="anime_episode"]').val("").hasValue();
  $('[name="anime_duration"]').val("").hasValue();
  $('[name="anime_release"]').val("").hasValue();
  $('[name="anime_trailer"]').val("").hasValue();
  $('[name="anime_poster"]').val("").hasValue();
  $('.cover-pic img').attr("src", "https://cdn.myanimelist.net/images/anime/1993/93837.jpg");
  $('[name="anime_sinopsis"]').val("").hasValue();
  $('[name="anime_studios"]').val("").hasValue();
  $('#editAnime').hide();
  $('#addAnime').show();
  $('#generate_mal').val('Generate').removeAttr('disabled');
}
function resetForm(){
  $("#resetAnime").on("click", function(){
    resetFormAction();
  })
}

function posterCheker(){
	$('[name="anime_poster"]').on('change', function(){
		var url = $(this).val();
		$.ajax({
			url : JSON.stringify(url),
			success : function(){
				$('.cover-pic img').attr("src", $(this).val());				
			},
			error : function(error){
				console.log(error);
			}
		})
	})	
}

function animelistDeleteAction(anime_id) {
	var type = "DELETE";
  var url = "api/animes?anime_id="+anime_id;
	var successAction = function(response) {
		if(response.status === true) {
			openAlert({
				alertType : "success",
				alertTitle : "Sukses!!",
				alertMessage : "1 Row di Tabel Berhasil di hapus"
			});
			animeListShowAction($('').val());
		} else {
			console.log(response);
			openAlert({
				alertType : "Danger",
				alertTitle : "Gagal!!",
				alertMessage : "Tidak bisa menghapus, cek console"
			});
		}
	}

	var beforeSendAction = function(){
		console.log("Proses Delete");
	}
	var errorAction = function(){
		openAlert({
			alertType	: "Danger",
			alertTitle	: "Gagal",
			alertMessage : "Tidak bisa menghapus, cek console!"
		});
	}
	ajaxSendJSON(url, type, {}, beforeSendAction, successAction, errorAction);
}
 
 function deleteAnimelist(){
 	$(".dlAnimelist").on('click', function(){
     console.log("clik")
     var anime_id = $(this).attr("data-id");
     var a = confirm("Yakin Dihapus ?");
     if( a === true) {
      animelistDeleteAction(anime_id);
     } else {
       return false;
     }
 		
 	})
 }

function animeListShowAction(){
  var url = "api/animes";
  var data = {};
  var type = "GET";
  var successAction = function(response){
    console.log(response)
    var status = response.status;
    var data = response.data;
    var htmlDOM = "";
    var tableHeadArray = ["No", "MAL ID", "Title", "Type", "Score", "Genre", "Eps", "" ];
    var targetDOM = $("#animeListShow");

    if(status === true){
      htmlDOM += "<table class='play-data-table table-hover'><thead class='bg-tabel'>";
      htmlDOM +="<tr style='color:#fff;text-align:center'>"
        for(var i = 0; i < tableHeadArray.length; i++){
          htmlDOM += "<th>"+tableHeadArray[i]+"</th>";
        }
      htmlDOM += "</tr></thead>";
      htmlDOM += "<tbody>";
        var j = 1;
        for(var i = 0; i < data.length; i++){
          htmlDOM += "<tr class='editable-row' data-id='"+data[i].anime_id+"'>";
          htmlDOM += "<td class='text-center'>"+j+"</td>";
          // htmlDOM += "<td class='p-1'><img width='100' height='130' src='"+data[i].anime_poster+"' /></td>";
          htmlDOM += "<td>"+data[i].anime_mal_id+"</td>";
          htmlDOM += "<td>"+data[i].anime_title+"</td>";
          htmlDOM += "<td>"+data[i].anime_type+"</td>";
          htmlDOM += "<td>"+data[i].anime_score+"</td>";
          htmlDOM += "<td>"+data[i].anime_genre+"</td>";
          htmlDOM += "<td>"+data[i].anime_episode+"</td>";
          htmlDOM += "<td><button type='button' class='dlAnimelist btn btn-bahaya' data-id='"+data[i].anime_id+"'>X</button></td>";
          htmlDOM += "</tr>";
          j++
        }
      htmlDOM += "</tbody></table>";
      targetDOM.html(htmlDOM);
      $('.play-data-table').DataTable({
        "paging":   false,
         "ordering": true,
         "info":     false
     })
     setTimeout(selectAnime(), 500)
     deleteAnimelist();
    } else {
      openAlert({
        alertType : "error",
        alertTitle : "Error",
        alertMessage : response.responseJSON.pesan
      });
    }
  };
  var errorAction = function(response){
    openAlert({
      alertType : "error",
      alertTitle : "Error",
      alertMessage : response.responseJSON.pesan
    });
  };
  var beforeSendAction = function(response){

  };

  ajaxSendJSON(url, type, data, beforeSendAction, successAction, errorAction );
}

function animeListShow(){
  animeListShowAction();
}
function deleteAPLB(){
  $('.delete-play').on('click', function(){
    $(this).parent().parent().remove()
  });
}

function addAnimePlayListFormAction(){
  var aplf_htmlDOM = '<div class="aplf-block"><div class="form-group"><input class="form-control play-anime-title" type="text" name="anime_play_title" /><label>Eps Title</label></div><div class="form-group"><input class="form-control play-anime-quality" type="text" name="anime_play_quality" /><label>Quality</label></div><div class="form-group"><input class="form-control play-anime-link" type="text" name="anime_play_link" /><label>Player Link</label></div><div class="form-group"><input class="form-control anime_thumb" type="text" name="anime_thumb" /><label>Thumbnail</label></div><div class="form-group text-right"><button class="btn btn-bahaya delete-play">Delete</button></div><div style="border-bottom:2px dashed #bbb;" class="mb-4"></div></div>'
  $('#animePlayListForm').append(aplf_htmlDOM);
  setTimeout(googleInputHasValue, 500 );
  deleteAPLB();
}

function addAnimePlayListForm(){
  $("#addAnimePlayList").on("click", function(){
    addAnimePlayListFormAction();
  })
}


function animeAddPlayListAction(){
  var url = "api/animes/playlist";
  var anime_mal_id = $('[name="anime_mal_id"]').val();
  var type = "POST";
  var arr_apl_title = [];
  var arr_apl_link = [];
  var arr_apl_quality = [];
  var arr_apl_thumb = [];
  var emptyVal = 0;
  var successAction = function(response){
    if(response.status === true){
      openAlert({
        alertType : "success",
        alertTitle : "Berhasil",
        alertMessage : "Playlist berhasil ditambahkan"
      });
      showPlayListAction(anime_mal_id);
    } else {
      console.log(response);
      openAlert({
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : "Tidak bisa menambahkan Playlist, Cek konsol!"
      });
    }
  } 
  var beforeSendAction = function(){

  }
  var errorAction = function(response){
    console.log(response);
    openAlert({
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : "Tidak bisa menambahkan Playlist, Cek konsol!"
    });
  }


  $('.play-anime-title').each(function(){
    var value = $(this).val();
    if(value == ""){
      emptyVal = 1;
    } else {
      arr_apl_title.push(value);
    }
  });
  
  $('.play-anime-link').each(function(){
    var value = $(this).val();
    if(value == ""){
      emptyVal = 1;
    } else {
      arr_apl_link.push(value);
    }
  });

  $('.play-anime-quality').each(function(){
    var value = $(this).val();
    if(value == ""){
      emptyVal = 1;
    } else {
    arr_apl_quality.push(value);
    }
  });

  $('.anime_thumb').each(function(){
    var value = $(this).val();
    if(value == ""){
      emptyVal = 1;
    } else {
    arr_apl_thumb.push(value);
    }
  });

 var apl_data = {
   anime_mal_id : $('[name="anime_mal_id"]').val(),
   apl_data : {
     apl_title : arr_apl_title,
     apl_quality : arr_apl_quality,
     apl_link : arr_apl_link,
     apl_thumb : arr_apl_thumb,
   }
 }

 if(emptyVal == 1){
   openAlert({
     alertType : "warning",
     alertTitle : "Warning!!",
     alertMessage : "Lengkapi form Anime Play List"
   });
 } else {
  //  ajaxSendJSON()
  if($('[name="anime_mal_id"]').val() == ""){
    openAlert({
      alertType : "warning",
      alertTitle : "Warning!!",
      alertMessage : "Isi juga MAL IDnya"
    });
  } else {
    console.log(apl_data);
    ajaxSendJSON(url, type, apl_data, beforeSendAction, successAction , errorAction);
  }
 }
}

function animeAddPlayList(){
  $("#saveAnimePlayList").on("click", function(){
    animeAddPlayListAction();
  });
}




function selectAnimeAction(anime_id){
  // console.log(anime_id);
  var url = "api/animes?anime_id="+anime_id;
  var type = "GET";
  var data = {};
  var successAction = function(response){
    console.log(response);
    // console.log('masuk')
    var status = response.status;
    if(status === true){
      var data = response.data[0];
      console.log(data)
      
      $.fn.hasValue = function(){
        if(this.val() != ""){
          this.siblings("label").addClass("has-val");
        }
      }
      $("[name='anime_mal_id']").val(data.anime_mal_id).hasValue();
      $('[name="anime_title"]').val(data.anime_title).hasValue();
      $('[name="anime_alternative"]').val(data.anime_alternative).hasValue();
      $('[name="anime_genre"]').val(data.anime_genre).hasValue();
      $('[name="anime_type"]').val(data.anime_type).hasValue();
      $('[name="anime_status"]').val(data.anime_status).hasValue();
      $('[name="anime_score"]').val(data.anime_score).hasValue();
      $('[name="anime_episode"]').val(data.anime_episode).hasValue();
      $('[name="anime_duration"]').val(data.anime_duration).hasValue();
      $('[name="anime_release"]').val(data.anime_release).hasValue();
      $('[name="anime_trailer"]').val(data.anime_trailer).hasValue();
      $('[name="anime_poster"]').val(data.anime_poster).hasValue();
      $('.cover-pic img').attr("src", data.anime_poster);
      $('[name="anime_sinopsis"]').val(data.anime_sinopsis).hasValue();
      $('[name="anime_studios"]').val(data.anime_studios).hasValue();
      $('#editAnime').attr('data-id', anime_id).show().removeClass('d-none');
      $('#addAnime').hide();
      $("#generate_mal").val("Disable").attr('disabled', '');

      $('html, body').animate({
        scrollTop : 0
      },500)
      var anime_mal_id = $("[name='anime_mal_id']").val();
      setTimeout(showPlayListAction(anime_mal_id), 500);
      $('html, body').animate({
        scrollTop : 0
      },500)
      var anime_mal_id = $("[name='anime_mal_id']").val();
      setTimeout(showDownloadListAction(anime_mal_id), 500)

    } else {
      console.log(response)
    }
  };
  var beforeSendAction = function(){
    console.log("loading");
  }
  var errorAction = function(response){
    console.log('error',response);
  };

  ajaxSendJSON(url, type, data, beforeSendAction, successAction, errorAction);
}

function selectAnime(){
 $(".editable-row").on("dblclick", function(){
   var anime_id = $(this).attr('data-id');
   selectAnimeAction(anime_id);
 })
}

function editAnimeAction(anime_id){
  var url = "api/animes";
  var type = "PUT";
  var anime_data = {
    anime_id : anime_id,
		anime_mal_id : $('[name="anime_mal_id"]').val(),
		anime_title : $('[name="anime_title"]').val(),
		anime_alternative : $('[name="anime_alternative"]').val(),
		anime_genre : $('[name="anime_genre"]').val(),
		anime_type : $('[name="anime_type"]').val(),
		anime_status : $('[name="anime_status"]').val(),
		anime_score : $('[name="anime_score"]').val(),
		anime_episode : $('[name="anime_episode"]').val(),
		anime_duration : $('[name="anime_duration"]').val(),
		anime_release : $('[name="anime_release"]').val(),
		anime_trailer : $('[name="anime_trailer"]').val(),
		anime_poster : $('[name="anime_poster"]').val(),
		anime_sinopsis : $('[name="anime_sinopsis"]').val(),
		anime_studios : $('[name="anime_studios"]').val(),
  }
  var successAction = function(response){
    if(response.status === true){
      var message = response.pesan
      var dataAlert = {
        alertType : "success",
        alertTitle : "Sukses!!",
        alertMessage : message,
      }
      
      openAlert(dataAlert);
      animeListShow();
      $("#editAnime").removeAttr('disabled');

    } else {
      var message = response.responseJSON.pesan
      console.log(response);
      var dataAlert = {
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : message,
      }
      $("#editAnime").removeAttr('disabled');
      openAlert(dataAlert);
    }
  }
  var beforeSendAction = function(){
    console.log("Loading..")
  }
  var errorAction = function(response){
    var message = response.responseJSON.pesan
    console.log(response)
    var dataAlert = {
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : message,
    }
    $("#editAnime").removeAttr('disabled');
    openAlert(dataAlert);
  }
  
  if($('[name="anime_mal_id"]').val() == "" || $('[name="anime_title"]').val() == ""){
    openAlert({
      alertType : "warning",
      alertTitle : "Warning",
      alertMessage : "Tidak bisa mengirim form kosong",
    });
  } else {
    // send ajax
    ajaxSendJSON(url, type, anime_data, beforeSendAction, successAction, errorAction);
  }
}

function editAnime(){
  $('#editAnime').on("click", function(){
    var anime_id = $(this).attr("data-id");
    editAnimeAction(anime_id);
    $(this).attr('disabled', '');
  })
}

function showPlayListAction(anime_mal_id){
  if(typeof(anime_mal_id === "undefined") || anime_mal_id == "" || anime_mal_id === null){
    anime_mal_id = $('[name="anime_mal_id"]').val();
  }
  
  var param = "anime_mal_id";
  var type = "GET";
  var url = "api/animes/APL?"+param+"="+anime_mal_id;
  var successAction = function(response){
    // console.log("result anime list: ",response)
    if(response.status === true){
      var html = "";
      var dataAPL = response.data;
      var j = 1;
      var arr_360 = [];
      var arr_480 = [];
      var arr_720 = [];
      var arr_1080 = [];
      
      console.log("total list", dataAPL);
      

      // html += "<ul>";
     
      for(var i = 0; i < dataAPL.length; i++){
        // console.log("testtsd",dataAPL[i].anime_play_quality);
        if(dataAPL[i].anime_play_quality == "1"){
          arr_360.push(dataAPL[i])
        }
        if(dataAPL[i].anime_play_quality == "2"){
          arr_480.push(dataAPL[i]);
        }
        if(dataAPL[i].anime_play_quality == "3"){
          arr_720.push(dataAPL[i])          
        }
        if(dataAPL[i].anime_play_quality == "4"){
          arr_1080.push(dataAPL[i]);
        }
      }
      
      // console.log("test kuality 1:", arr_360);
      // console.log("test kuality 2:", arr_480);
      // console.log("test kuality 3:", arr_720);
      // console.log("test kuality 4:", arr_1080);
      // console.log(arr_360);
      
      
      
      var nothing = "<div class='text-center'><span>Tidak ada playlist</span></div>";
      
      if(arr_360.length > 0){
        html += "<ul>";
        for(var i = 0; i < arr_360.length; i++){
          html += "<li><a class='apl-preview' data-toggle='modal' data-target='#modalPlayList' href='javascript:void(0)' data-mal-id='"+arr_360[i].anime_mal_id+"' data-play-id='"+arr_360[i].play_id+"' data-pub='"+arr_360[i].published+"' data-thumb='"+arr_360[i].anime_thumb+"' data-url='"+arr_360[i].anime_play_link+"' data-quality='"+arr_360[i].anime_play_quality+"'>"+arr_360[i].anime_play_title+"</a></li>";      
        }
        html += "</ul>";
        $("#playListShow1").html(html);
      } else {
        $("#playListShow1").html(nothing);
      }
      
      html = "";
      
      if(arr_480.length > 0){
        html += "<ul>";
        for(var i = 0; i < arr_480.length; i++){
          html += "<li><a class='apl-preview' data-toggle='modal' data-target='#modalPlayList' href='javascript:void(0)' data-mal-id='"+arr_480[i].anime_mal_id+"' data-play-id='"+arr_480[i].play_id+"' data-pub='"+arr_480[i].published+"' data-thumb='"+arr_480[i].anime_thumb+"' data-url='"+arr_480[i].anime_play_link+"' data-quality='"+arr_480[i].anime_play_quality+"'>"+arr_480[i].anime_play_title+"</a></li>";      
        }
        html += "</ul>";
        $("#playListShow2").html(html);
      } else {
        $("#playListShow2").html(nothing);
      }
      
      html = "";
      
      
      if(arr_720.length > 0){
        html += "<ul>";
        for(var i = 0; i < arr_720.length; i++){
          html += "<li><a class='apl-preview' data-toggle='modal' data-target='#modalPlayList' href='javascript:void(0)' data-mal-id='"+arr_720[i].anime_mal_id+"' data-play-id='"+arr_720[i].play_id+"' data-pub='"+arr_720[i].published+"' data-thumb='"+arr_720[i].anime_thumb+"' data-url='"+arr_720[i].anime_play_link+"' data-quality='"+arr_720[i].anime_play_quality+"'>"+arr_720[i].anime_play_title+"</a></li>";      
        }
        html += "</ul>";
        $("#playListShow3").html(html);
      } else {
        $("#playListShow3").html(nothing);
      }
      
      html = "";
      
      if(arr_1080.length > 0){
        html += "<ul>";
        for(var i = 0; i < arr_1080.length; i++){
          html += "<li><a class='apl-preview' data-toggle='modal' data-target='#modalPlayList' href='javascript:void(0)' data-mal-id='"+arr_1080[i].anime_mal_id+"' data-play-id='"+arr_1080[i].play_id+"' data-pub='"+arr_1080[i].published+"' data-thumb='"+arr_1080[i].anime_thumb+"' data-url='"+arr_1080[i].anime_play_link+"' data-quality='"+arr_1080[i].anime_play_quality+"'>"+arr_1080[i].anime_play_title+"</a></li>";      
        }
        html += "</ul>";
        $("#playListShow4").html(html);
      } else {
        $("#playListShow4").html(nothing);
      }
      
      html = "";
      
      // html += "<li><a class='apl-preview' data-toggle='modal' data-target='#modalPlayList' href='javascript:void(0)' data-mal-id='"+dataAPL[i].anime_mal_id+"' data-play-id='"+dataAPL[i].play_id+"' data-pub='"+dataAPL[i].published+"' data-thumb='"+dataAPL[i].anime_thumb+"' data-
      setTimeout(aplPreview(), 500);
    }
    else {
      console.log(response)
      $("#playListShow").html("<div class='text-center'><span>Tidak ada playlist</span></div>");
    }
  }
  var beforeSendAction = function(){
    console.log("Loading to get playlist..")
  }
  var errorAction = function(response){
    console.log(response)
    $("#playListShow").html("<div class='text-center'><span>Tidak ada playlist</span></div>");
  }

  ajaxSendJSON(url, type, {}, beforeSendAction, successAction, errorAction);

}

function aplPreviewAction(anime_title, title, url, mal_id, quality, thumb){
  $.fn.hasValue = function(){
    if(this.val() != ""){
      this.siblings("label").addClass("has-val");
    }
  }
  
  var modal_title = anime_title + " : " + title;
  var video_wrapper = '<video class="js-player" controls crossorigin oncontextmenu="return false;" controlsList="nodownload" playsinline><source src="'+url+'" type="video/mp4"></video>';
  $('#modalPlayListTitle').text(modal_title);
  $('#playlist-video').html(video_wrapper);
  $('#play_link').val(url).hasValue();
  $('#play_quality').val(quality).hasValue();
  $('#play_title').val(title).hasValue();
  $('#anime_thumb').val(thumb).hasValue();
  $('#play_mal_id').val(mal_id);

}
function aplPreview(){
  $('.apl-preview').on('click', function(){
    var title = $(this).text();
    var url = $(this).attr('data-url');
    var anime_title = $('[name="anime_title"]').val();
    var play_id = $(this).attr('data-play-id'); 
    var mal_id = $(this).attr('data-mal-id');
    var quality = $(this).attr("data-quality");
    var thumb = $(this).attr("data-thumb");
    setTimeout(function(){
      var player = new Plyr('.js-player');  
    },500)
    

    $('#editAPL').attr('data-id', play_id);
    $('#deleteAPL').attr('data-id', play_id);
    aplPreviewAction(anime_title, title, url, mal_id, quality, thumb);
  })
  $('.modal-close').on('click', function(){
    $('#playlist-video').html("");
  })
}

function editAPLAction(play_id){
  var url = "api/animes/APL";
  var type = "PUT";
  var data = {
    play_id : play_id,
    anime_mal_id : $('#play_mal_id').val(),
    anime_play_title : $('#play_title').val(),
    anime_play_quality : $('#play_quality').val(),
    anime_play_link : $('#play_link').val(),
    anime_thumb  : $('#anime_thumb').val(),
  }

  var successAction = function(response){
    if(response.status === true){
      openAlert({
        alertType : "success",
        alertTitle : "Sukses!!",
        alertMessage : "Playlist berhasil diedit"
      });
      showPlayListAction($('#play_mal_id').val());
    } else {
      console.log(response);
      openAlert({
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : "Tidak bisa mengedit, Cek konsol"
      });
    }
  }
  var beforeSendAction = function(){
    console.log('loading to edit playlist..')
  }
  var errorAction = function(response){
    console.log(response);
    openAlert({
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : "Tidak bisa mengedit, Cek konsol"
    });
  }
  console.log(data);
  ajaxSendJSON(url, type, data, beforeSendAction, successAction, errorAction);
}

function editAPL(){
  $('#editAPL').on('click', function(){
    var play_id = $(this).attr('data-id');
    editAPLAction(play_id);
  })
}

function deleteAPLAction(play_id){
  var type = "DELETE";
  var params = "play_id";
  var url = "api/animes/APL?"+params+"="+play_id;
  var successAction = function(response){
    if(response.status === true){
      openAlert({
        alertType : "success",
        alertTitle : "Sukses!!",
        alertMessage : "Playlist berhasil dihapus"
      });
      showPlayListAction($('#play_mal_id').val());
      $('#modalPlayList').modal('hide');
    } else {
      console.log(response);
      openAlert({
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : "Tidak bisa menghapus, Cek konsol"
      });
    }
  }
  var beforeSendAction = function(){
    console.log("Loading untuk penghapusan..")
  }
  var errorAction = function(response){
    console.log(response)
    openAlert({
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : "Tidak bisa menghapus, Cek konsol"
    });
  }

  ajaxSendJSON(url, type, {}, beforeSendAction, successAction, errorAction);
}

function deleteAPL(){
  $("#deleteAPL").on('click', function(){
    var play_id = $(this).attr('data-id');
    console.log(play_id);
    deleteAPLAction(play_id)
  })
}
function showDownloadListAction(anime_mal_id) {
  if(typeof(anime_mal_id === "undefined") || anime_mal_id == "" || anime_mal_id === null) {
    anime_mal_id = $('[name="anime_mal_id"]').val();
  }

  var param = "anime_mal_id";
  var type  = "GET";
  var url   = "api/animes/Download?"+param+"="+anime_mal_id;
  var successAction = function(response) {
    if(response.status === true) {
      console.log(response);
      var html  = "";
      var SendDownloadData  = response.data;
      var j = 1;

      html += "<ul>";

      for(var i = 0; i < SendDownloadData.length; i++) {
        html +="<li><a class='Download-preview' data-toggle='modal' data-target='#modalDownloadList' href='javascript:void(0)' data-mal-id='"+SendDownloadData[i].anime_mal_id+"' data-download-id='"+SendDownloadData[i].anime_download_id+"' data-url='"+SendDownloadData[i].anime_download_link+"' data-size='"+SendDownloadData[i].anime_download_size+"' data-kualitas='"+SendDownloadData[i].anime_download_quality+"'>"+SendDownloadData[i].anime_download_name_server+"</a></li>";
      }
      // console.log(html);
      html += "</ul>";

      for(var i = 0; i < SendDownloadData.length; i++) {
        var kualitas = SendDownloadData[i].anime_download_quality;
          if(kualitas == 1) {
            $("#DownloadListShow1").html(html);
          }
          if(kualitas == 2) {
            $("#DownloadListShow2").html(html);
          }
          if(kualitas == 3) {
            $("#DownloadListShow3").html(html);
          }
          if(kualitas == 4) {
            $("#DownloadListShow4").html(html);
          }
      }
      setTimeout(dwlPreview(), 500);
    }
     else {
       console.log(response);
       $("#DownloadListShow").html("<div class='text-center'><span>Tidak ada DownloadList</span></div>"); 
     }
  }
  var beforeSendAction = function(response) {
    console.log("Loading to get DownloadList..");
  }
  var errorAction = function(response) {
    console.log("masukss")
    console.log(response);
    $("#DownloadListShow").html("<div class='text-center'><span>Tidak ada DownloadList</span></div>");
  }

  //sendAJAX_DATA
  ajaxSendJSON(url+"&anime_download_quality=1", type, {}, beforeSendAction, successAction, errorAction);
  ajaxSendJSON(url+"&anime_download_quality=2", type, {}, beforeSendAction, successAction, errorAction);
  ajaxSendJSON(url+"&anime_download_quality=3", type, {}, beforeSendAction, successAction, errorAction);
  ajaxSendJSON(url+"&anime_download_quality=4", type, {}, beforeSendAction, successAction, errorAction);

  //EndShowDownloadListAction
}

function deleteDL(){
  $('.delete-download').on('click', function(){
    $(this).parent().parent().remove()
  });
}

function addAnimeDownloadFileAction(){
  var dL_htmlDOM = '<div class="dL-block"><div class="form-group"><input class="form-control download-anime-title" type="text" name="anime_download_name_server"/><label>Name Server</label></div><div class="form-group"><input class="form-control download-anime-link" type="text" name="anime_download_link"/><label>link</label></div><div class="form-group"><input class="form-control download-anime-size" type="text" name="anime_download_size"/><label>Size</label></div><div class="form-group"><input class="form-control download-anime-kualitas" type="text" name="anime_download_quality"/><label>Quality</label></div><div class="form-group text-right"><button class="btn btn-bahaya delete-download">Delete</button> </div><div style="border-bottom:2px dashed #bbb;" class="mb-4"></div></div>'
  $('#AnimeDownloadFile').append(dL_htmlDOM);
  console.log(dL_htmlDOM);
  setTimeout(googleInputHasValue, 500 );
  deleteDL();
  
}

function addAnimeDownloadFile(){
  $("#addAnimeDownload").on("click", function(){
    addAnimeDownloadFileAction();
  })
}

function addDownloadList(){
  var url = "api/animes/downloadlist";
  var anime_mal_id = $('[name="anime_mal_id"]').val();
  var type = "POST";
  var arr_dL_title = [];
  var arr_dL_link = [];
  var arr_dL_size = [];
  var arr_dL_quality = [];
  var emptyVal = false;
  var succesAction = function(response) {
    if(response.status === true){
      openAlert({
        alertType   : "Success",
        alertTitle  : "Berhasil",
      alertMessage  : "List Download Berhasil ditambah"
      });
      showDownloadListAction(anime_mal_id);
    } else {
      console.log(response);
      openAlert({
        alertType     : "danger",
        alertTitle    : "Gagal",
        alertMessage  : "Tidak bisa menambahkan DownloadList, Cek Console lu cok!"
      });
    }
  }
  var beforeSendAction = function() {

  }
  var errorAction = function(response){
    console.log(response);
    openAlert({
      alertType     : "danger",
      alertTitle    : "Gagal!!",
      alertMessage  : "Tidak bisa menambahan playlist, cek console!"
    });
  }

  $('.download-anime-title').each(function(){
    var value = $(this).val();
    if(value  ==  ""){
      emptyVal  = true;
    } else {
      arr_dL_title.push(value);
    }
  });

  $('.download-anime-link').each(function(){
    var value = $(this).val();
    if(value == ""){
      emptyVal = true;
    } else {
      arr_dL_link.push(value);
    }
  });
  
  $('.download-anime-size').each(function(){
    var value = $(this).val();
    if(value == ""){
      emptyVal = true;
    } else {
      arr_dL_size.push(value);
    }
  });
    
  $('.download-anime-kualitas').each(function(){
    var value = $(this).val();
    if(value == ""){
      emptyVal = true;
    } else {
      arr_dL_quality.push(value)
    }
  });
  
  var dL_send_data = {
    anime_mal_id  : $('[name="anime_mal_id"]').val(),
      dL_send_data  : {
       dL_title   :  arr_dL_title,
       dL_link    :  arr_dL_link,
       dL_size    :  arr_dL_size,
       dL_quality :  arr_dL_quality
    }
  }

   if(emptyVal == 1){
     openAlert({
       alertType    : "warning",
       alertTitle   : "Warning!",
       alertMessage : "Isi Semua Form DownloadList"
     });
   } else {
     //ajaxSendJSON()
     if($('[name="anime_mal_id"]').val() == ""){
       openAlert  ({
       alertType    : "warning",
       alertTitle   : "Warning!",
       alertMessage : "Isi juga Mal Idnya"
      });
     } else {
       console.log(dL_send_data);
       ajaxSendJSON(url, type, dL_send_data, beforeSendAction, succesAction, errorAction);
     }
   }
  //SELESAI tutup
}
function animeSaveDownload(){
  $("#saveDownloadAnime").on("click", function(){
    addDownloadList();
  });
}
//TASK
//Buat show Download List [done]
//Edit Download List [pending]

function dwlPreviewAction(anime_title, title, url, mal_id, quality, sizex) {
  $.fn.hasValue = function() {
    if(this.val() != "") {
      this.siblings("label").addClass("has-val");
    }
  }
 
  var modal_title = anime_title + " : " +quality;
  $('#modalDownloadTitle').text(modal_title);
  $('#download_server').val(title).hasValue();
  $('#download_link').val(url).hasValue();
  $('#download_quality').val(quality).hasValue();
  $('#download_size').val(sizex).hasValue();
  $('#download_mal_id').val(mal_id);
}

function dwlPreview() {
  //Kirim data ke modal
  $('.Download-preview').on('click', function() {
    var title = $(this).text();
    var url = $(this).attr('data-url');
    var anime_title = $('[name="anime_title"]').val();
    var anime_download_id = $(this).attr('data-download-id');
    var sizex = $(this).attr('data-size');
    var quality = $(this).attr('data-kualitas');
    var mal_id = $(this).attr('data-mal-id');
    
    $('#editDownload').attr('data-id', anime_download_id);
    $('#deleteDL').attr('data-id', anime_download_id);
    dwlPreviewAction(anime_title, title, url, mal_id, quality, sizex);
  });
  $('.modal-close').on('click', function(){
    // $('#downloadBOX').html("<!--ISINYA DOWNLOAD BOX-->");
  });
  // console.log(dwlPreview);
}
function editDWLAction(anime_download_id){
  var url = "api/animes/downloadlist";
  var type = "PUT";
  var data = {
    anime_download_id : anime_download_id,
    anime_mal_id : $('#download_mal_id').val(),
    anime_download_quality : $('#download_quality').val(),
    anime_download_name_server : $('#download_server').val(),
    anime_download_link : $('#download_link').val(),
    anime_download_size : $('#download_size').val(),
  }

  var successAction = function(response){
    console.log(response)
    if(response.status === true){
      openAlert({
        alertType : "success",
        alertTitle : "Sukses!!",
        alertMessage : "DownloadList berhasil diedit"
      });
      showDownloadListAction($('#download_mal_id').val());
    } else {
      // console.log(response);
      openAlert({
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : "Tidak bisa mengedit, Cek konsol GOBLOK"
      });
    }
  }
  var beforeSendAction = function(){
    console.log('Proses ngedit..')
  }
  var errorAction = function(response){
    // console.log(response);
    openAlert({
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : "Tidak bisa mengedit, Cek konsol"
    });
  }
  console.log(data);
  ajaxSendJSON(url, type, data, beforeSendAction, successAction, errorAction);
}

function editDownload() {
  $('#editDownload').on('click', function(){
    var anime_download_id = $(this).attr('data-id');
    editDWLAction(anime_download_id);
  });
}

function deleteDWLAction(anime_download_id){
  var type = "DELETE";
  var params = "anime_download_id";
  var url = "api/animes/Download?"+params+"="+anime_download_id;
  var successAction = function(response){
    if(response.status === true){
      openAlert({
        alertType : "success",
        alertTitle : "Sukses!!",
        alertMessage : "Download list berhasil dihapus"
      });
      showDownloadListAction($('#download_mal_id').val());
      $('#modalDownloadList').modal('hide');
    } else {
      console.log(response);
      openAlert({
        alertType : "danger",
        alertTitle : "Gagal!!",
        alertMessage : "Tidak bisa menghapus, Cek konsol"
      });
    }
  }
  var beforeSendAction = function(){
    console.log("Loading untuk penghapusan..")
  }
  var errorAction = function(response){
    console.log(response)
    openAlert({
      alertType : "danger",
      alertTitle : "Gagal!!",
      alertMessage : "Tidak bisa menghapus, Cek konsol"
    });
  }

  ajaxSendJSON(url, type, {}, beforeSendAction, successAction, errorAction);
}

function deleteDWL(){
  $("#deleteDL").on('click', function(){
    var anime_download_id = $(this).attr('data-id');
    deleteDWLAction(anime_download_id)
  })
}
$(document).ready(function(){
	grabber();
  AddAnime();
  resetForm();
  animeListShow();
  deleteAnimelist();
  addAnimePlayListForm();
  deleteAPLB();
  animeAddPlayList();
  selectAnime();
  editAnime();
  aplPreview();
  editAPL();
  deleteAPL();

  addAnimeDownloadFile();
  deleteDL();
  animeSaveDownload();
  // showDownloadListAction();
  dwlPreviewAction();
  dwlPreview();
  // console.log(dwlPreview);
  editDownload();
  deleteDWL();
});