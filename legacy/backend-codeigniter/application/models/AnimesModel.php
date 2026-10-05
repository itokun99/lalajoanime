<?php 

class AnimesModel extends CI_Model {

  public function getAnimesMiniList($id = NULL){
      $this->db->select('anime_id, anime_mal_id, anime_title');
      $this->db->from('animes');
      $this->db->order_by('anime_title', 'asc');
      if($id !== NULL){
        $this->db->where('anime_id', $id);
      }
      $anime = $this->db->get();
      return $anime->result_array();
  }

  public function getAnimes($anime_id = NULL, $anime_mal_id = NULL, $order_by = NULL, $listed = NULL, $genre = NULL, $limit = NULL, $limit_offset = NULL){
    
    if($order_by === NULL && $listed === NULL){
      $this->db->order_by('anime_id','asc');      
    } else if($order_by !== NULL && $listed === NULL){
      $this->db->order_by($order_by,'asc');            
    } else if($order_by === NULL && $listed !== NULL){
      $this->db->order_by('anime_id',$listed);                  
    } else {
      $this->db->order_by($order_by,$listed);
    }

    if($limit !== NULL && $limit_offset !== NULL){
      $this->db->limit($limit, $limit_offset);
    } else if($limit !== NULL && $limit_offset === NULL ){
      $this->db->limit($limit);
    } else if($limit === NULL && $limit_offset !== NULL) {
      $this->db->limit(99999 , $limit_offset);
    }
    
    if($anime_id === NULL && $anime_mal_id === NULL){
      if($genre === NULL){
        return $this->db->get('animes')->result_array();
      } else {
        $this->db->like('anime_genre', $genre);
        return $this->db->get('animes')->result_array();        
      }
    } else if($anime_id === NULL || $anime_id === "") {
      if($genre === NULL){
        return $this->db->get_where('animes', ["anime_mal_id" => $anime_mal_id])->result_array(); 
      } else {
        $this->db->like('anime_genre', $genre);
        return $this->db->get_where('animes', ["anime_mal_id" => $anime_mal_id])->result_array();
      }
    } else if($anime_mal_id === NULL || $anime_mal_id === ""){
      if($genre === NULL){
        return $this->db->get_where('animes', ["anime_id" => $anime_id])->result_array();              
      } else {
        $this->db->like('anime_genre', $genre);        
        return $this->db->get_where('animes', ["anime_id" => $anime_id])->result_array();      
      }
    } else {
      if($genre === NULL){
        return $this->db->get_where('animes', ["anime_id" => $anime_id, "anime_mal_id" => $anime_mal_id])->result_array();
      } else {
        $this->db->like('anime_genre', $genre);        
        return $this->db->get_where('animes', ["anime_id" => $anime_id, "anime_mal_id" => $anime_mal_id])->result_array();        
      }
    }
  }
  
  public function getAnimesShortByName($anime_id = NULL, $anime_mal_id = NULL){
    $this->db->order_by('anime_title', 'asc');
    if($anime_id === NULL && $anime_mal_id === NULL){
      return $this->db->get('animes')->result_array();
    } else if($anime_id === NULL || $anime_id === "") {
      return $this->db->get_where('animes', ["anime_mal_id" => $anime_mal_id])->result_array();
    } else if($anime_mal_id === NULL || $anime_mal_id === ""){
      return $this->db->get_where('animes', ["anime_id" => $anime_id])->result_array();      
    } else {
      return $this->db->get_where('animes', ["anime_id" => $anime_id, "anime_mal_id" => $anime_mal_id])->result_array();         
    }
  }

  public function deleteAnimes($anime_id){
    $this->db->delete("animes", ["anime_id" => $anime_id]);
    return $this->db->affected_rows();
  }

  public function addAnimes($anime_data){
    $this->db->insert('animes', $anime_data);
    return $this->db->affected_rows();
  }

  public function updateAnimes($anime_data, $anime_id = NULL, $anime_mal_id = NULL){
    if($anime_id === NULL || $anime_id == ""){
      $this->db->update("animes", $anime_data, ["anime_mal_id" => $anime_mal_id]); 
    } else if($anime_mal_id === NULL || $anime_mal_id == ""){
      $this->db->update("animes", $anime_data, ["anime_id" => $anime_id]);
    } else {
      $this->db->update("animes", $anime_data, ["anime_id" => $anime_id, "anime_mal_id" => $anime_mal_id]);      
    }
    return $this->db->affected_rows();
  }
  public function checkAnimeMalId($anime_mal_id){
    return $this->db->get_where('animes',['anime_mal_id' => $anime_mal_id])->num_rows();
  }
  public function checkAvailableAnimeOnPlayList($anime_mal_id){
    $apl = $this->db->get_where('anime_playlist',['anime_mal_id' => $anime_mal_id])->num_rows();
  }
  public function getAPL($anime_mal_id = NULL, $quality = NULL){
      $this->db->order_by("published", "DESC");
      if($quality === NULL || $quality == "") {
        $apl = $this->db->get_where('anime_playlist', ['anime_mal_id' => $anime_mal_id])->result_array();  
      } else {
        $apl = $this->db->get_where('anime_playlist', ['anime_mal_id' => $anime_mal_id, 'anime_play_quality' => $quality])->result_array();
      }
      return $apl;  
  }
  public function addAPL($apl) {
    $this->db->insert("anime_playlist", $apl);
    return $this->db->affected_rows();
  }
  public function editAPL($play_id,$apl){
    $this->db->update("anime_playlist", $apl, ['play_id' => $play_id] );
    return $this->db->affected_rows();
  }
  public function deleteAPL($play_id){
    $this->db->delete("anime_playlist", ["play_id" => $play_id]);
    return $this->db->affected_rows();
  }

  
  public function getDownload($mal_id, $quality){
    if($quality === NULL){
      $data = $this->db->get_where('anime_download', ['anime_mal_id' => $mal_id]);
    } else {
      $data = $this->db->get_where('anime_download', ['anime_mal_id' => $mal_id, 'anime_download_quality' => $quality]);
    }
    return $data->result_array();
  }

  public function deleteDownload($dlwn_id){
    $this->db->delete("anime_download", ["anime_download_id" => $dlwn_id]);
    return $this->db->affected_rows();
  }

  public function addDownload($dwnld) {
    $this->db->insert("anime_download", $dwnld);
    return $this->db->affected_rows();
  }

  //PUT
  public function editDwnld($anime_download_id, $DWL){
    $this->db->update("anime_download", $DWL, ['anime_download_id' => $anime_download_id] );
    return $this->db->affected_rows();
  }


  public function AnimeCounter(){
    $count = $this->db->query("SELECT COUNT(anime_mal_id) FROM animes")->result_array();
    return $count[0]['COUNT(anime_mal_id)'];
  }
  public function AnimeCounter2(){
    $count = $this->db->query("SELECT COUNT(*) FROM anime_counter")->result_array();
    $data = [
      'counter' => 1
    ];
    $this->db->insert('anime_counter', $data);
    return $count[0]['COUNT(*)'];
  }
}