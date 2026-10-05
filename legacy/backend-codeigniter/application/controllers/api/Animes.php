<?php 
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
//To Solve File REST_Controller not found
require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class Animes extends REST_Controller {

  //load model disini
  public function __construct(){
    date_default_timezone_set("Asia/Bangkok");
    parent::__construct();
    // header('Access-Control-Allow-Origin: *');
    // header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    // header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

    $this->load->model('AnimesModel');
  }
  
  // buat fungsi api controller disini nanti tinggal copas aja
  public function index_get(){
    $anime_id = $this->get('anime_id');
    $anime_mal_id = $this->get('anime_mal_id');
    $order_by = $this->get('order_by');
    $listed = $this->get('listed');
    $genre = $this->get('genre');
    $limit = $this->get('limit');
    $limit_offset = $this->get('limit_offset');


    if($anime_id === NULL && $anime_mal_id === NULL) {
      $animes = $this->AnimesModel->getAnimes(NULL, NULL, $order_by, $listed, $genre, $limit, $limit_offset);
    } else {
      $animes = $this->AnimesModel->getAnimes($anime_id, $anime_mal_id, $order_by, $listed, $genre, $limit, $limit_offset);
    }
    
    if($animes) {
      for($i = 0; $i < count($animes); $i++){
        $animes[$i]["anime_play_data"] = [];
        $animes[$i]["anime_play_data"]["play360"] = [];
        $animes[$i]["anime_play_data"]["play480"] = [];
        $animes[$i]["anime_play_data"]["play720"] = [];
        $animes[$i]["anime_play_data"]["play1080"] = [];
        $anime360data = $this->AnimesModel->getAPL($animes[$i]["anime_mal_id"], '1');
        $anime480data = $this->AnimesModel->getAPL($animes[$i]["anime_mal_id"], '2');
        $anime720data = $this->AnimesModel->getAPL($animes[$i]["anime_mal_id"], '3');
        $anime1080data = $this->AnimesModel->getAPL($animes[$i]["anime_mal_id"], '4');
        if(count($anime360data) > 0){
          $animes[$i]["anime_play_data"]["play360"] = $anime360data;
        }
        if(count($anime480data) > 0) {
          $animes[$i]["anime_play_data"]["play480"] = $anime480data;          
        }
        if(count($anime720data) > 0) {
          $animes[$i]["anime_play_data"]["play720"] = $anime720data;          
        }
        if(count($anime1080data) > 0) {
          $animes[$i]["anime_play_data"]["play1080"] = $anime1080data;          
        }
      }
      // print_r($animes);
      $this->response([
        "status" => true,
        "statusCode" => 200,
        "pesan" => "Data sukses",
        "data" => $animes,
      ], REST_Controller::HTTP_OK);
    } else {
      $this->response([
        "status" => false,
        "pesan" => "Tidak ada di Database",
        "statusCode" => 404
      ], REST_Controller::HTTP_NOT_FOUND);
    }
  }


  public function getanimelist_get(){
    $id = $this->get('');
    
    if($id === NULL || $id == ""){
      $anime = $this->AnimesModel->getAnimesMiniList();
    } else {
      $anime = $this->AnimesModel->getAnimesMiniList($id);      
    }
    if(count($anime) > 0){
      $this->response([
        "status" => TRUE,
        "pesan" => "SUCCESS",
        "data" => $anime
      ], REST_Controller::HTTP_OK);
    } else {
      $this->response([
        "status" => FALSE,
        "pesan" => "NOT FOUND",
      ], REST_Controller::HTTP_OK);
    }
  }
  
  public function index_delete(){
    $anime_id = $this->query('anime_id');
    
    if($anime_id === NULL){
      $this->response([
        "status" => false,
        "pesan" => "Harus ada 1 ID",
        "anime_id" => $anime_id,
      ], REST_Controller::HTTP_BAD_REQUEST);
    } else {
      if( $this->AnimesModel->deleteAnimes($anime_id) > 0 ) {
        $this->response([
          "status" => true,
          "anime_id" => $anime_id,
          "pesan" => "Data anime dengan berhasil di hapus",
        ], REST_Controller::HTTP_OK);
      } else {
        // anime_id not found
        $this->response([
          "status" => false,
          "pesan" => "ID dari Anime tidak ditemukan",
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    }
  }
  public function index_post(){
    $anime_title = $this->post("anime_title");
    $anime_mal_id = $this->post("anime_mal_id");

    $anime_data = [
      "anime_mal_id" => $this->post("anime_mal_id"),
      "anime_title" => $this->post("anime_title"),
      "anime_poster" => $this->post("anime_poster"),
      "anime_alternative" => $this->post("anime_alternative"),
      "anime_type" => $this->post("anime_type"),
      "anime_status" => $this->post("anime_status"),
      "anime_score" => $this->post("anime_score"),
      "anime_studios" => $this->post("anime_studios"),
      "anime_duration" => $this->post("anime_duration"),
      "anime_episode" => $this->post("anime_episode"),
      "anime_genre" => $this->post("anime_genre"),
      "anime_release" => $this->post("anime_release"),
      "anime_trailer" => $this->post("anime_trailer"),
      "anime_sinopsis" => $this->post("anime_sinopsis"),
    ];

    $cekExist = $this->AnimesModel->checkAnimeMalId($anime_mal_id);
    if($cekExist == 1){
        $message = 'Anime '. $anime_title. ' sudah ada';
        $this->response([
            'status' => false,
            'pesan' => $message ,
        ], REST_Controller::HTTP_BAD_REQUEST);
    } else {
      $insertAnime = $this->AnimesModel->addAnimes($anime_data);
      if($insertAnime > 0) {
        $this->response([
          "status" => true,
          "pesan" => "Data anime telah berhasil ditambahkan",
          "anime_title" => $anime_title,
        ], REST_Controller::HTTP_CREATED);
      } else {
        $this->response([
          "status" => false,
          "pesan" => "Gagal menambahkan data",
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    }
  }

  public function index_put(){
    $anime_id = $this->put("anime_id");
    $anime_data = [
      "anime_mal_id" => $this->put("anime_mal_id"),
      "anime_title" => $this->put("anime_title"),
      "anime_poster" => $this->put("anime_poster"),
      "anime_alternative" => $this->put("anime_alternative"),
      "anime_type" => $this->put("anime_type"),
      "anime_status" => $this->put("anime_status"),
      "anime_score" => $this->put("anime_score"),
      "anime_studios" => $this->put("anime_studios"),
      "anime_duration" => $this->put("anime_duration"),
      "anime_episode" => $this->put("anime_episode"),
      "anime_genre" => $this->put("anime_genre"),
      "anime_release" => $this->put("anime_release"),
      "anime_trailer" => $this->put("anime_trailer"),
      "anime_sinopsis" => $this->put("anime_sinopsis"),
    ];
    
    $update = $this->AnimesModel->updateAnimes($anime_data, $anime_id);

    if($update > 0) {
      $anime_title = $this->put("anime_title");
      $pesan = "Data anime ".$anime_title." telah berhasil diedit";
      $this->response([
        "status" => true,
        "pesan" => $pesan,
      ], REST_Controller::HTTP_OK);
    } else {
      $this->response([
        "status" => false,
        "pesan" => "Gagal mengedit data",
      ], REST_Controller::HTTP_BAD_REQUEST);
    }

  }

  public function APL_get(){
    $mal_id = $this->get('anime_mal_id');
    $quality = $this->get('anime_play_quality');
    if($mal_id === NULL){
      $this->response([
        "status" => false,
        "pesan" => "Membutuhkan 1 MAL ID",
      ], REST_Controller::HTTP_BAD_REQUEST);
    }else if($quality === NULL || $quality == ""){
      $get_apl = $this->AnimesModel->getAPL($mal_id, NULL);
    } else {
      $get_apl = $this->AnimesModel->getAPL($mal_id, $quality);
    }

    if($get_apl){
      $this->response([
        "status" => true,
        "pesan" => "Data APL berhasil",
        "data" => $get_apl,
      ], REST_Controller::HTTP_OK);
    } else {
      $this->response([
        "status" => false,
        "pesan" => "Data Tidak ditemukan atau belum ditambahkan",
      ], REST_Controller::HTTP_NOT_FOUND);
    }
  }

  public function APL_post(){
    $mal_id = $this->post('anime_mal_id');
    $apl_data = $this->post('apl_data');
    
    $checkMAL = $this->AnimesModel->checkAnimeMalId($mal_id);

    if($checkMAL == 1){
      $test =  count($apl_data['apl_title']);
      $countErr = 0;
      for($i = 0; $i < count($apl_data['apl_title']); $i++){
        $updateDate = date('Y-m-d H:i:s');
        $apl = [
          'anime_mal_id' => $mal_id,
          'anime_play_title' => $apl_data['apl_title'][$i],
          'anime_play_quality' => $apl_data['apl_quality'][$i],
          'anime_play_link' => $apl_data['apl_link'][$i],
          'anime_thumb' => $apl_data['apl_thumb'][$i],
        ];
        
        $anime_data = [
          'date_update' => $updateDate,
        ];
        $insertAPL = $this->AnimesModel->addAPL($apl);
        if($insertAPL <= 0){
          $countErr++;
        }
      }
      if($countErr == 0) {
        $dateUpdated = $this->AnimesModel->updateAnimes($anime_data, NULL, $mal_id);
        $this->response([
          "status" => true,
          "pesan" => "Semua Playlist berhasil ditambahkan",
        ], REST_Controller::HTTP_CREATED);
      } else {
        $this->response([
          "status" => false,
          "pesan" => "Gagal menambahkan Anime Play List",
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    } else {
      $this->response([
        "status" => false,
        "pesan" => "Playlist tidak bisa ditambahkan karena Anime tidak ada"
      ], REST_Controller::HTTP_NOT_FOUND);
    }
  }

  public function APL_put(){
    $play_id = $this->put('play_id');
    $anime_mal_id = $this->put('anime_mal_id');
    $anime_play_title = $this->put('anime_play_title');
    $anime_play_quality = $this->put('anime_play_quality');
    $anime_play_link = $this->put('anime_play_link');
    $anime_thumb = $this->put('anime_thumb');

    $apl = [
      'anime_mal_id' => $anime_mal_id,
      'anime_play_title' => $anime_play_title,
      'anime_play_quality' => $anime_play_quality,
      'anime_play_link' => $anime_play_link,
      'anime_thumb' => $anime_thumb
    ];

    $checkMAL = $this->AnimesModel->checkAnimeMalId($anime_mal_id);

    if($checkMAL == 1){
      $editAPL = $this->AnimesModel->editAPL($play_id, $apl);
      
      if($editAPL > 0){
        $this->response([
          'status' => true,
          'pesan' => 'Playlist berhasil diedit',
        ], REST_Controller::HTTP_OK);
      } else {
        $this->response([
          'status' => false,
          'pesan' => 'Playlist gagal diedit'
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    } else {
      $this->response([
        'status' => false,
        'pesan' => 'Anime MAL ID tidak ditemukan'
      ], REST_Controller::HTTP_NOT_FOUND);
    }
  }

  public function APL_delete(){
    $play_id = $this->query('play_id');

    if($play_id === NULL){
      $this->response([
        "status" => false,
        "pesan" => "Tidak menerima Play ID untuk menghapus Playlist ini"
      ], REST_Controller::HTTP_BAD_REQUEST);
    } else {
      $deleteAPL = $this->AnimesModel->deleteAPL($play_id);

      if($deleteAPL > 0){
        $this->response([
          "status" => true,
          "pesan" => "Playlist Berhasil dihapus",
        ], REST_Controller::HTTP_OK);
      } else {
        $this->response([
          "status" => false,
          "pesan" => "Gagal Menghapus playlist",
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    }
  }

  //Download
  public function Download_get() {
    $mal_id = $this->get('anime_mal_id');
    $downloadNime = $this->get('anime_download_quality');

    if($mal_id === NULL ){
		  $this->response([
		  	"status" => false,
		  	"pesan" => "Gak ada id mal yang cocok",
		], REST_Controller::HTTP_BAD_REQUEST);
    } else {
       $Download_get = $this->AnimesModel->getDownload($mal_id, $downloadNime);
	  if(count($Download_get) > 0){
		  $this->response([
			  "status" => true,
				"pesan" => "Sukses",
				"data" => $Download_get,
		], REST_Controller::HTTP_OK);
		} else {
			$this->response([
				"status" => false,
				"pesan" => "NOT_FOUND",
				"data" => $Download_get,
		  	], REST_Controller::HTTP_NOT_FOUND);
		  }
	  }
  }

  public function Download_delete(){
    $dlwn_id = $this->query('anime_download_id');

    if($dlwn_id === NULL){
      $this->response([
        "status" => false,
        "pesan" => "Gagal Menghapus File Download"
      ], REST_Controller::HTTP_BAD_REQUEST);
    } else {
      $deleteDownload = $this->AnimesModel->deleteDownload($dlwn_id);

      if($deleteDownload > 0){
        $this->response([
          "status" => true,
          "pesan" => "File Download Berhasil Di Hapus",
        ], REST_Controller::HTTP_OK);
      } else {
        $this->response([
          "status" => false,
          "pesan" => "Tidak ada ID yang Cocok",
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    }
  }

  public function Download_post(){
    $mal_id = $this->post('anime_mal_id');
    $dL_send_data = $this->post('dL_send_data');
    
    $checkMAL = $this->AnimesModel->checkAnimeMalId($mal_id);

    if($checkMAL == 1){
      $test =  count($dL_send_data['dL_title']);
      $countErr = 0;

      for($i = 0; $i < count($dL_send_data['dL_title']); $i++){
        $dwnld = [
          'anime_mal_id' => $mal_id,
          'anime_download_name_server' => $dL_send_data['dL_title'][$i],
          'anime_download_link' => $dL_send_data['dL_link'][$i],
          'anime_download_size' => $dL_send_data['dL_size'][$i],
          'anime_download_quality' => $dL_send_data['dL_quality'][$i]
        ];
        $insertDownload = $this->AnimesModel->addDownload($dwnld);
        if($insertDownload <= 0){
          $countErr++;
        }
      }
      if($countErr == 0) {
        $this->response([
          "status" => true,
          "pesan" => "File Download berhasil ditambahkan",
        ], REST_Controller::HTTP_CREATED);
      } else {
        $this->response([
          "status" => false,
          "pesan" => "Gagal menambahkan File Download",
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    } else {
      $this->response([
        "status" => false,
        "pesan" => "File Download tidak bisa ditambahkan karena Anime tidak ada"
      ], REST_Controller::HTTP_NOT_FOUND);
    }
  }
  
  public function Download_put(){

    $anime_download_id = $this->put('anime_download_id');
    $anime_mal_id = $this->put('anime_mal_id');
    $anime_download_name_server = $this->put('anime_download_name_server');
    $anime_download_link = $this->put('anime_download_link');
    $anime_download_size = $this->put('anime_download_size');
    $anime_download_quality = $this->put('anime_download_quality');

    $DWL = [
      'anime_download_id' => $anime_download_id,
      'anime_mal_id' => $anime_mal_id,
      'anime_download_name_server'  => $anime_download_name_server,
      'anime_download_link' => $anime_download_link,
      'anime_download_size' => $anime_download_size,
      'anime_download_quality' => $anime_download_quality,
    ];

    $checkMAL = $this->AnimesModel->checkAnimeMalId($anime_mal_id);

    if($checkMAL == 1){
      $editDwnld = $this->AnimesModel->editDwnld($anime_download_id, $DWL);
      if($editDwnld > 0){
        $this->response([
          'status' => true,
          'pesan' => 'File Download berhasil diedit',
        ], REST_Controller::HTTP_OK);
      } else {
        $this->response([
          'status' => false,
          'pesan' => 'File Download gagal diedit'
        ], REST_Controller::HTTP_BAD_REQUEST);
      }
    } else {
      $this->response([
        'status' => false,
        'pesan' => 'Anime MAL ID tidak ditemukan'
      ], REST_Controller::HTTP_NOT_FOUND);
    }
  }

  
  public function AutoGrabCounter_get(){
    $counter = $this->AnimesModel->AnimeCounter();
    if(isset($counter)){
      $this->response([
        "status" => true,
        "data" => $counter
      ], REST_Controller::HTTP_OK);
    } else {
      $this->response([
        "status" => false,
        "data" => "Data Base Error"
      ], REST_Controller::HTTP_BAD_REQUEST);
    }
  }

  public function AutoGrabCounter2_get(){
    $counter = $this->AnimesModel->AnimeCounter2();
    if(isset($counter)){
      $this->response([
        "status" => true,
        "data" => $counter
      ], REST_Controller::HTTP_OK);
    } else {
      $this->response([
        "status" => false,
        "data" => "Data Base Error"
      ], REST_Controller::HTTP_BAD_REQUEST);
    }
  }
}