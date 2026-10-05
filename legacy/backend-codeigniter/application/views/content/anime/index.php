<!--MODAL Download-->
<div class="modal fade" id="modalDownloadList" tabindex="-1" role="dialog" aria-labelledby="modalDownloadList" aria-hidden="true">
   <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
         <div class="modal-header">
            <h5 class="modal-title" id="modalDownloadTitle"></h5>
            <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
            </button>
         </div>
         <div class="modal-body">
            <!-- <div id="downloadBOX" class="downloadList-modal">
            
            </div> -->
            <!-- <input type="hidden" id="anime_download_id"/> -->
            <input type="hidden" id="download_mal_id"/>
            <div id="downloadProperty">
               <div class="form-group">
                  <input type="text" id="download_server" class="form-control"/>
                  <label class="has-val">Name Server</label>
               </div>
               <div class="form-group">
                  <input type="text" id="download_link" class="form-control"/>
                  <label class="has-val">Server LINK</label>
               </div>
               <div class="form-group">
                  <input type="text" id="download_size" class="form-control"/>
                  <label class="has-val">Size File</label>
               </div>
               <div class="form-group">
                  <input type="text" id="download_quality" class="form-control"/>
                  <label class="has-val">Quality</label>
               </div>
            </div>
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close" data-dismiss="modal">Close</button>
            <button id="editDownload" type="button" class="btn btn-pertama">Edit</button>
            <button  id="deleteDL" type="button" class="btn btn-bahaya">Delete</button>
         </div>
      </div>
   </div> 
</div>
<!-- breadcrumbs -->
<div class="col-12 col-sm-12 col-md-12 col-lg-12">
   <div class="breadcrumbs">
      <ul>
         <li><a href="dashboard">Home</a></li>
         /
         <li class="current"><a href="#">Anime List</a></li>
      </ul>
   </div>
</div>
<!-- breadcrumbs -->
<!-- content-->
<div id="parent" class="col-12 col-sm-12 col-md-12 col-lg-12">
   <div class="row">
      <div class="col-12 col-sm-12 col-md-12 col-lg-8">
         <div class="flat-card mb-4">
            <div class="flat-card-header">
               <h4 class="flat-card-title">Add Anime</h4>
            </div>
            <div class="flat-card-body">
               <div>
                  <div class="row">
                     <div class="col-12 col-sm-12 col-md-8 col-lg-8">
                        <div class="form-group">
                           <input type="text" class="form-control" name="anime_mal_id" value="" />
                           <label>Input MAL ID</label>
                        </div>
                     </div>
                     <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="form-group">
                           <input id="generate_mal" type="button" class="btn btn-block btn-pertama" value="Generate" />
                        </div>
                     </div>
                     <div class="col-12 col-sm-12 col-md-8 col-lg-8">
                        <div class="form-group">
                           <input type="text" class="form-control" name="anime_title" value="" />
                           <label>Judul Anime</label>
                        </div>
                        <div class="form-group">
                           <input type="text" class="form-control" name="anime_alternative" value="" />
                           <label>Judul Alternative</label>
                        </div>
                        <div class="form-group">
                           <input type="text" class="form-control" name="anime_genre" value="" />
                           <label>Genre</label>
                        </div>
                        <div class="row">
                           <div class="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_type" value="" />
                                 <label>Tipe</label>
                              </div>
                           </div>
                           <div class="col-12 col-sm-6 col-md-6 col-lg-6">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_status" value="" />
                                 <label>Status</label>
                              </div>
                           </div>
                           <div class="col-12 col-sm-6 col-md-4 col-lg-4">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_score" value="" />
                                 <label>Skor</label>
                              </div>
                           </div>
                           <div class="col-12 col-sm-6 col-md-4 col-lg-4">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_episode" value="" />
                                 <label>Jum eps</label>
                              </div>
                           </div>
                           <div class="col-12 col-sm-6 col-md-4 col-lg-4">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_duration" value="" />
                                 <label>Durasi</label>
                              </div>
                           </div>
                           <div class="col-12 col-sm-12 col-md-6 col-lg-6">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_release" value="" />
                                 <label>Rilis</label>
                              </div>
                           </div>
                           <div class="col-12 col-sm-12 col-md-6 col-lg-6">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_studios" value="" />
                                 <label>Studio</label>
                              </div>
                           </div>
                           <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_trailer" value="" />
                                 <label>Trailer</label>
                              </div>
                           </div>
                           <div class="col-12">
                              <div class="form-group">
                                 <input type="text" class="form-control" name="anime_poster" value="" />
                                 <label>Poster</label>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div class="col-12 col-sm-12 col-md-4 col-lg-4">
                        <div class="cover-pic form-group">
                           <img class="w-100" src="https://cdn.myanimelist.net/images/anime/1993/93837.jpg" />
                        </div>
                     </div>
                     <div class="col-12 col-sm-12 col-md-12 col-lg-12">
                        <div class="form-group">
                           <textarea style="resize:none; min-height: 150px" class="form-control" name="anime_sinopsis" id="sinop"></textarea>
                           <label>Sinopsis</label>
                        </div>
                     </div>
                  </div>
                  <!-- <textarea name="anime_sinopsis" id="sinop">Ketik sinopsis disini!</textarea> -->
               </div>
            </div>
            <div class="flat-card-footer">
               <div class="w-100">
                  <button type="button" class="btn btn-pertama" id="addAnime">Add</button>
                  <button type="button" class="btn btn-pertama d-none" id="editAnime">Edit</button>
                  <button type="button" class="btn btn-bahaya" id="resetAnime">Reset</button>
               </div>
            </div>
         </div>
      </div>
      <!--SIDE NOTIF-->
      <div class="col-12 col-sm-12 col-md-6 col-lg-4">
         <div class="flat-card mb-4">
            <div class="flat-card-header" data-toggle="collapse" data-target="#animePlayListBody">
               <h4 class="flat-card-title">Add Player List</h4>
            </div>
            <div id="animePlayListBody" class="collapse show">
               <div class="flat-card-body"  style="max-height:300px; overflow-y:auto">
                  <div id="animePlayListForm">
                     <div class="aplf-block">
                        <div class="form-group">
                           <input class="form-control play-anime-title" type="text" name="anime_play_title" />
                           <label>Eps Title</label>
                        </div>
                        <div class="form-group">
                           <input class="form-control play-anime-quality" type="text" name="anime_play_quality" />
                           <label>Quality</label>
                        </div>
                        <div class="form-group">
                           <input class="form-control play-anime-link" type="text" name="anime_play_link" />
                           <label>Player Link</label>
                        </div>
                        <div class="form-group">
                           <input class="form-control anime_thumb" type="text" name="anime_thumb" />
                           <label>Thumbnail</label>
                        </div>
                        <div class="form-group text-right">
                           <button class="btn btn-danger delete-play">Delete</button>
                        </div>
                        <div style="border-bottom:2px dashed #bbb;" class="mb-4"></div>
                     </div>
                  </div>
               </div>
               <div class="flat-card-footer">
                  <div class="text-right">
                     <button class="btn btn-pertama" id="addAnimePlayList">Add</button>
                     <button class="btn btn-pertama" id="saveAnimePlayList">Save</button>
                  </div>
               </div>
            </div>
         </div>
		 	<!--DOWNLOAD BATCH-->
         <div class="flat-card mb-4">
            <div class="flat-card-header" data-toggle="collapse" data-target="#animeDownloadBody">
               <h4 class="flat-card-title">add DownloadList</h4>
            </div>
            <div id="animeDownloadBody" class="collapse">
               <div class="flat-card-body" style="max-height:300px; overflow-y:auto">
                  <div id="AnimeDownloadFile">
                     <div class="dL-block">
                        <div class="form-group">
                           <input class="form-control download-anime-title" type="text" name="anime_download_name_server"/>
                           <label>Name Server</label>
                        </div>
                        <div class="form-group">
                           <input class="form-control download-anime-link" type="text" name="anime_download_link" />
                           <label>link</label>
                        </div>
                        <div class="form-group">
                           <input class="form-control download-anime-size" type="text" name="anime_download_size" />
                           <label>Size</label>
                        </div>
                        <div class="form-group">
                           <input class="form-control download-anime-kualitas" type="text" name="anime_download_quality" />
                           <label>Resolusi</label>
                        </div>
                     </div>
                  </div>
               </div>
               <div class="flat-card-footer">
                  <div class="text-right">
                     <button class="btn btn-pertama" id="addAnimeDownload">Add</button>
                     <button class="btn btn-pertama" id="saveDownloadAnime">Save</button>
                  </div>
               </div>
            </div>
         </div>
         <!--END Download-->
         <div class="flat-card mb-4">
            <div class="flat-card-header" data-toggle="collapse" data-target="#PlayListBody0">
               <h4 class="flat-card-title">Playlist Quality</h4>
            </div>
            <div id="PlayListBody0" class="collapse">
               <div class="flat-card-body">
                  <div class="flat-card mb-4">
                     <div class="flat-card-header" data-toggle="collapse" data-target="#PlayListBody1">
                        <h4 class="flat-card-title">360p</h4>
                     </div>
                     <div id="PlayListBody1" class="collapse show">
                        <div class="flat-card-body">
                           <div class="playListShow" id="playListShow1">
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="flat-card mb-4">
                     <div class="flat-card-header" data-toggle="collapse" data-target="#PlayListBody2">
                        <h4 class="flat-card-title">480p</h4>
                     </div>
                     <div id="PlayListBody2" class="collapse show">
                        <div class="flat-card-body">
                           <div class="playListShow" id="playListShow2">
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="flat-card mb-4">
                     <div class="flat-card-header" data-toggle="collapse" data-target="#PlayListBody3">
                        <h4 class="flat-card-title">720p</h4>
                     </div>
                     <div id="PlayListBody3" class="collapse show">
                        <div class="flat-card-body">
                           <div class="playListShow" id="playListShow3">
                           </div>
                        </div>
                     </div>
                  </div>
                  <div class="flat-card mb-4">
                     <div class="flat-card-header" data-toggle="collapse" data-target="#PlayListBody4">
                        <h4 class="flat-card-title">1080p</h4>
                     </div>
                     <div id="PlayListBody4" class="collapse show">
                        <div class="flat-card-body">
                           <div class="playListShow" id="playListShow4">
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div class="flat-card mb-4">
    <div class="flat-card-header" data-toggle="collapse" data-target="#DLBody0">
        <h4 class="flat-card-title">Download LIST Quality</h4>
    </div>
    <div id="DLBody0" class="collapse">
        <div class="flat-card-body">
            <div class="flat-card mb-4">
                <div class="flat-card-header" data-toggle="collapse" data-target="#DLBody01">
                    <h4 class="flat-card-title">360p</h4>
                </div>
                <div id="DLBody01" class="collapse show">
                    <div class="flat-card-body">
                        <div class="DownloadListShow" id="DownloadListShow1">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flat-card mb-4">
                <div class="flat-card-header" data-toggle="collapse" data-target="#DLBody02">
                    <h4 class="flat-card-title">480p</h4>
                </div>
                <div id="DLBody02" class="collapse show">
                    <div class="flat-card-body">
                        <div class="DownloadListShow" id="DownloadListShow2">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flat-card mb-4">
                <div class="flat-card-header" data-toggle="collapse" data-target="#DLBody03">
                    <h4 class="flat-card-title">720p</h4>
                </div>
                <div id="DLBody03" class="collapse show">
                    <div class="flat-card-body">
                        <div class="DownloadListShow" id="DownloadListShow3">
                        </div>
                    </div>
                </div>
            </div>
            <div class="flat-card mb-4">
                <div class="flat-card-header" data-toggle="collapse" data-target="#DLBody04">
                    <h4 class="flat-card-title">1080p</h4>
                </div>
                <div id="DLBody04" class="collapse show">
                    <div class="flat-card-body">
                        <div class="DownloadListShow" id="DownloadListShow4">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
      </div>
      <div class="col-12 col-sm-12 col-md-12 col-lg-12">
         <div class="flat-card">
            <div class="flat-card-header" data-toggle="collapse" data-target="#animeListBody">
               <h4 class="flat-card-title">Anime List</h4>
            </div>
            <div id="animeListBody" class="collapse show">
               <div class="flat-card-body">
                  <div id="animeListShow" class="table-responsive">
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</div>
<!-- Modal -->
<div class="modal fade" id="modalPlayList" tabindex="-1" role="dialog" aria-labelledby="modalPlayList" aria-hidden="true">
   <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
      <div class="modal-content">
         <div class="modal-header">
            <h5 class="modal-title" id="modalPlayListTitle">Anime Title : Episode 1</h5>
            <button type="button" class="close modal-close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
         </div>
         <div class="modal-body">
            <div class="playlist-modal">
               <div id="playlist-video" class="mb-4" data-class="playlist-video embed-responsive embed-responsive-16by9 mb-4">
                  <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/zpOULjyy-n8?rel=0" allowfullscreen></iframe>
               </div>
               <input type="hidden" id="play_mal_id" />
               <div id="playlist-property">
                  <div class="form-group">
                     <input type="text" id="play_title" class="form-control" />
                     <label>Title</label>
                  </div>
                  <div class="form-group">
                     <input type="text" id="play_quality" class="form-control" />
                     <label>Quality</label>
                  </div>
                  <div class="form-group">
                     <input type="text" id="play_link" class="form-control" />
                     <label>URL</label>
                  </div>
                  <div class="form-group">
                     <input type="text" id="anime_thumb" class="form-control" />
                     <label>thumbnail</label>
                  </div>
               </div>
            </div>
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-secondary modal-close" data-dismiss="modal">Close</button>
            <button id="editAPL" type="button" class="btn btn-pertama">Edit</button>
            <button id="deleteAPL" type="button" class="btn btn-bahaya">Delete</button>				
         </div>   
      </div>
   </div>
</div>
</div>
<!-- content -->
<script type="text/javascript">
   $("#saveAnimePlayList").click(function(){
   $("#addAnime").removeAttr('disabled')
   
   });
</script>
<?php include "plyr.php" ;?>
<script src="<?=base_url();?>assets/plugins/plyrio/js/plyr.js"></script>

<!-- <script>const players = Array.from(document.querySelectorAll('.js-player')).map(player => new Plyr(player));</script> -->
<script src="assets/js/anime-list.js"></script>