<?php 
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
//To Solve File REST_Controller not found
require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';

class User extends REST_Controller {

  function __construct(){
    parent::__construct();
    $this->load->model('UserModel', "user");
  }

  // get admin list from API
  public function getadmin_get(){
    $id = $this->get("id");

    if($id === NULL){
      $users = $this->user->getUser();
    } else {
      $users = $this->user->getUser($id);
    }

    if(count($users) > 0){
      $this->response([
        "status" => TRUE,
        "pesan" => "SUCCESS",
        "data" => $users
      ], REST_Controller::HTTP_OK);
    } else {
      $this->response([
        "status" => FALSE,
        "pesan" => "NOT FOUND"
      ], REST_Controller::HTTP_OK);
    }
  }

  //create admin function
  public function createadmin_post(){
    // get post data from registration form
    $name = $this->post("user_name");
    $email = $this->post("user_email");
    $password = $this->post("user_password");

    //set current date
    $date = date('Y-m-d H:i:s');

    //set default image
    $image = "https://scontent.fcgk18-1.fna.fbcdn.net/v/t1.0-9/43163738_978108175725515_968455111669972992_n.jpg?_nc_cat=103&_nc_ht=scontent.fcgk18-1.fna&oh=d600e6439a7200031419a1ea250242b1&oe=5D36496D";

    // check admin email is exist
    $checkAdmin = $this->user->checkUserEmail($email);
    if($checkAdmin > 0){
      //response bad request for existing email
      $this->response([
        "status" => FALSE,
        "pesan" => "Email sudah dipakai!",
        "data" => $checkAdmin
      ], REST_Controller::HTTP_OK);
    } else {
      //create hashing password when not exitiong email
      $password = password_hash(base64_encode($password), PASSWORD_DEFAULT);

      // set insert data
      $insertdata = [
        "name" => $name,
        "email" => $email,
        "password" => $password,
        "date_created" => $date,
        "role_id" => 2,
        "image" => $image
      ];

      // call method of create an admin
      $createAdmin = $this->user->createAdmin($insertdata);
      if($createAdmin > 0){
        // response success for admin save in database
        $this->response([
          "status" => TRUE,
          "pesan" => "Registrasi berhasil, tunggu konfirmasi admin"
        ], REST_Controller::HTTP_OK);
      } else {
        // response bad request for failed registration 
        $this->response([
          "status" => FALSE,
          "pesan" => "Registrasi gagal, kesalahan server"
        ], REST_Controller::HTTP_OK);
      }
    }
  }

  // API login admin
  public function loginadmin_post(){
    $email = $this->post('user_email');
    $password = $this->post('user_password');

    // check admin email is exist
    $checkAdmin = $this->user->checkUserAdmin($email);
    
    if($checkAdmin == 0){
      // if not exist return bad request
      $this->response([
        "status" => FALSE,
        "pesan" => "Akun tidak ditemukan!",
        "data" => $checkAdmin,
      ], REST_Controller::HTTP_OK);
    } else {
      // if exist get User data by Email from user model
      $user = $this->user->getUserByEmail($email);
      $user_password = $user[0]['password'];

      // verify match password user
      $verify = password_verify($password, $user_password);

      if($verify){
        // if match store data for send the response to client side
        $user_data = [
          "user_id" => $user[0]["id"],
          "user_name" => $user[0]['name'],
          "user_email" => $user[0]['email'],
          "user_image" => $user[0]['image']
        ];

        //set the success response
        $this->response([
          "status" => TRUE,
          "pesan" => "Login Sukses",
          "data" => $user_data
        ], REST_Controller::HTTP_OK);
      } else {
        // response bad request for password don't match
        $this->response([
          "status" => FALSE,
          "pesan" => "Email/Password Salah!",
          "data" => $verify
        ], REST_Controller::HTTP_OK);
      }
    }
  }
}