<?php 
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
//To Solve File REST_Controller not found
require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class AnimeGrabber extends REST_Controller {
  function __construct(){
    parent::__construct();
    $this->load->model('AnimeGrabModel');
  }

  public function index_get(){
    $id = $this->get('id');

    if($id === "" || $id === null){
      $this->response([
        "status" => false,
        "pesan" => "Wajib memasukan MAL ID-nya"
      ], REST_Controller::HTTP_BAD_REQUEST);
    } else {
      $result_data = $this->AnimeGrabModel->getAnime($id);
      
      if($result_data === false){
        $this->response([
          "status" => false,
          "pesan" => "Anime dengan MAL ID tersebut tidak ditemukan"
        ], REST_Controller::HTTP_BAD_REQUEST);
      } else {
        $this->response([
          "status" => true,
          "pesan" => "Info Anime Berhasil didapatkan",
          "anime_info" => $result_data,
        ], REST_Controller::HTTP_OK);
      }

    }
  }
}