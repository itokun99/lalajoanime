<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_controller
{
	public function __construct()
	{
		parent::__construct();
		$this->load->library('form_validation');
		$this->load->library('session');

		$isLogin = 	$this->session->userdata('userLogin');
		
		if(isset($isLogin)){
     		redirect('dashboard');
    	}

	}
	public function index()
	{ 
		$this->form_validation->set_rules('email', 'Email', 'trim|required|valid_email');
		$this->form_validation->set_rules('password', 'Password', 'trim|required');
		
		if( $this->form_validation->run() == false) {

			$data["page_title"] = 'Login';
			$this->load->view('template/auth_header', $data);
			$this->load->view('content/auth/login');
			$this->load->view('template/auth_footer');	

		} else {
			$this->_login();
		}
	}


	private function _login()
	{
		$email = $this->input->post('email');
		$password = $this->input->post('password');

		$user = $this->db->get_where('user', ['email' => $email])->row_array();

			//usernya ada
		if($user) {
			//Jika User aktif
			if($user['is_active'] == 1) {
				//Check Passowrdnya
				if(password_verify($password, $user['password'])) {
					// $data = [
					// 	'email' => $user['email'],
					// 	'role_id' => $user['role_id']
					// ];
					//data di simpan kedalam session
					$this->session->set_userdata("userLogin",$user);
					redirect('dashboard');
				} else {

					$this->session->set_flashdata('message', '<div class="alert alert-danger" role="alert">Password Salah !</div>');
					redirect('login');
				}
			}
		} else {
			//usernya gak ada
			$this->session->set_flashdata('message', '<div class="alert alert-danger" role="alert">Email ini belum pernah terdaftar</div>');
			redirect('auth');
		}
	}
//daftar
	public function regis()
	{
		$this->form_validation->set_rules('name', 'Name', 'required|trim');
		$this->form_validation->set_rules('email', 'Email', 'required|trim|valid_email|is_unique[user.email]', ['is_unique' => 'This Email has already registered! ']);

		$this->form_validation->set_rules('password1', 'Password', 'required|trim|min_length[3]|matches[password2]');

		$this->form_validation->set_rules('password2', 'Password', 'required|trim|matches[password1]');



		if( $this->form_validation->run() == false){
			
		$data["page_title"] = 'Registration';
		$this->load->view('template/auth_header', $data);
		$this->load->view('auth/regis');
		$this->load->view('template/auth_footer');

		} else {
			$data = [
				'name' => htmlspecialchars($this->input->post('name', true)),
				'email' => htmlspecialchars($this->input->post('email', true)),
				'image' => 'default.jpg',
				'password' => password_hash($this->input->post('password1'),PASSWORD_DEFAULT),
				'role_id'	=> 2,
				'is_active'	=> 1,
				'date_created' => time()
		];
			$this->db->insert('user', $data);
			$this->session->set_flashdata('message', '<div class="alert alert-success" role="alert">Selamat akun anda berhasil di buat</div>');
			redirect('auth');
		}

	}

	public function logout()
	{
		$this->session->unset_userdata($data);
		$this->session->unset_userdata('email');
		$this->session->unset_userdata('role_id');

		$this->session->set_flashdata('message', '<div class="alert alert-success" role="alert">Berhasil keluar akun!</div>');
			redirect('auth');
	}
	public function block()
	{
		echo 'Gabisa Akses!';
	}
}