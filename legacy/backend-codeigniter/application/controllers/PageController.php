<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class PageController extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */

	public function __construct(){
		parent::__construct();
		$this->load->library('session');
		
		$isLogin = $this->session->userdata("userLogin");
		if(!isset($isLogin)){
			redirect('login');
		}
}
	// untuk buat load kontennya

	// DASHBOARD
	public function dashboard_index(){
		$data["page_title"] = 'Dashboard';
		$this->load->view('template/head', $data);
		$this->load->view('content/dashboard/index', $data);
		$this->load->view('template/footer', $data);
	}

	// ANIME
	public function anime_index(){
		$data["page_title"] = 'Anime List';
		$this->load->view('template/head', $data);
		$this->load->view('content/anime/index', $data);
		$this->load->view('template/footer', $data);
		
	}
	public function anime_genre(){
		$data["page_title"] = 'Genre List';
		$this->load->view('template/head', $data);	
		$this->load->view('content/anime/genre-list', $data);
		$this->load->view('template/footer', $data);
		
	}

	// POST / ARTICLE PAGE
	public function post_index(){
		$data["page_title"] = "Article Post";
		$this->load->view('template/head', $data);
		$this->load->view('content/post/index', $data);
		$this->load->view('template/footer', $data);
	}

	// SETTING
	public function setting_index(){
		$data["page_title"] = 'Setting';
		$this->load->view('template/head', $data);
		$this->load->view('content/setting/index', $data);
		$this->load->view('template/footer', $data);
	}

	
	// ADDITiONAL
	public function logout(){
		$this->session->unset_userdata('userLogin');
		redirect('login');
	}
}
