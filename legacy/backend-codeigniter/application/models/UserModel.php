<?php 
class UserModel extends CI_Model {
  public function getUser($id = NULL){
    $this->db->select('id, name, email, image');
    $this->db->from('user');
    $this->db->where('is_active', 1);
    if($id !== NULL){
      $this->db->where("id", $id);
    }

    $user = $this->db->get();
    return $user->result_array();
  }

  public function checkUserEmail($email){
    $user = $this->db->get_where('user', ["email" => $email]);
    return $user->num_rows();
  }

  public function createAdmin($data){
    $this->db->insert('user', $data);
    return $this->db->affected_rows();
  }

  public function getUserByEmail($email){
    $user = $this->db->get_where('user', ["email" => $email]);
    return $user->result_array();
  }

  public function checkUserAdmin($email){
    $user = $this->db->get_where('user', ["email" => $email, "role_id" => 2, 'role_id' => 1]);
    return $user->num_rows();
  }
}