<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class AnimeGrabModel extends CI_Controller {

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

  private $html;
	private $dir = '.matte';
  public $anime;
  private $parent;
	private $pattern;
  private $data;
  // use vendor\Statickidz\GoogleTranslate;

  
  public function __construct(){
		// $this->parent  = $parent;
		$this->pattern = [
      'anime_title' => '/<h1 class=\"h1\">\s*<span itemprop=\"name\">\s*(.*?)\s*<\/span>\s*<\/h1>/i',
			'image' => "/<img.*?src=[\"'](?<url>.*?)[\"'].*?class=\"ac\".*?>/",
			'pv' => "'<div class=\"video-promotion\"><a class=\"iframe js-fancybox-video video-unit promotion\" href=\"\s*(?P<url>\S+)\s*\"(.*?)>(.*?)</a>'si",
			'synopsis'  => "'\s*<\s*span \s*itemprop=\"description\">(.*?)<'si",
			'english'   => '/<div class=\"spaceit_pad\">\s*<span class=\"dark_text\">English:<\/span>\s*(.*?)\s*<\/div>/i',
			'synonyms'  => '/<div class=\"spaceit_pad\">\s*<span class=\"dark_text\">Synonyms:<\/span>\s*(.*?)\s*<\/div>/i',
			'japanese'  => '/<div class=\"spaceit_pad\">\s*<span class=\"dark_text\">Japanese:<\/span>\s*(.*?)\s*<\/div>/i',
			'type'      => '/<div>\s*<span class=\"dark_text\">Type:<\/span>\s*(.*?)\s*<\/div>/i',
			'episode'   => '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Episodes:<\/span>\s*(.*?)\s*<\/div>/i',
			'status'    => '/<div>\s*<span class=\"dark_text\">Status:<\/span>\s*(.*?)\s*<\/div>/i',
			'aired'     => '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Aired:<\/span>\s*(.*?)\s*<\/div>/i',
			'premiered' => '/<div>\s*<span class=\"dark_text\">Premiered:<\/span>\s*(.*?)\s*<\/div>/i',
			'broadcast' => '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Broadcast:<\/span>\s*(.*?)\s*<\/div>/i',
			'producer'  => '/<div>\s*<span class=\"dark_text\">Producers:<\/span>\s*(.*?)\s*<\/div>/i',
			'licensor'  => '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Licensors:<\/span>\s*(.*?)\s*<\/div>/i',
			'studio'    => '/<div>\s*<span class=\"dark_text\">Studios:<\/span>\s*(.*?)\s*<\/div>/i',
			'source'    => '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Source:<\/span>\s*(.*?)\s*<\/div>/i',
			'genre'     => '/<div>\s*<span class=\"dark_text\">Genres:<\/span>\s*(.*?)\s*<\/div>/i',
			'duration'  => '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Duration:<\/span>\s*(.*)\s*<\/div>/i',
			'rating'    => '/<div>\s*<span class=\"dark_text\">Rating:<\/span>\s*(.*?)\s*<\/div>/i',
			'score'     => '/<span itemprop=\"ratingValue\">\s*(.*?)\s*<\/span>/i',
		];
  }
  
  public static function translate($source, $target, $text)
  {
      // Request translation
      $response = self::requestTranslation($source, $target, $text);

      // Get translation text
      // $response = self::getStringBetween("onmouseout=\"this.style.backgroundColor='#fff'\">", "</span></div>", strval($response));

      // Clean translation
      $translation = self::getSentencesFromJSON($response);

      return $translation;
  }

  /**
   * Internal function to make the request to the translator service
   *
   * @internal
   *
   * @param string $source
   *            Original language taken from the 'translate' function
   * @param string $target
   *            Target language taken from the ' translate' function
   * @param string $text
   *            Text to translate taken from the 'translate' function
   *
   * @return object[] The response of the translation service in JSON format
   */
  protected static function requestTranslation($source, $target, $text)
  {

      // Google translate URL
      $url = "https://translate.google.com/translate_a/single?client=at&dt=t&dt=ld&dt=qca&dt=rm&dt=bd&dj=1&hl=es-ES&ie=UTF-8&oe=UTF-8&inputm=2&otf=2&iid=1dd3b944-fa62-4b55-b330-74909a99969e";

      $fields = array(
          'sl' => urlencode($source),
          'tl' => urlencode($target),
          'q' => urlencode($text)
      );

      // URL-ify the data for the POST
      $fields_string = "";
      foreach ($fields as $key => $value) {
          $fields_string .= $key . '=' . $value . '&';
      }

      rtrim($fields_string, '&');

      // Open connection
      $ch = curl_init();

      // Set the url, number of POST vars, POST data
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_POST, count($fields));
      curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      curl_setopt($ch, CURLOPT_ENCODING, 'UTF-8');
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
      curl_setopt($ch, CURLOPT_USERAGENT, 'AndroidTranslate/5.3.0.RC02.130475354-53000263 5.1 phone TRANSLATE_OPM5_TEST_1');

      // Execute post
      $result = curl_exec($ch);

      // Close connection
      curl_close($ch);

      return $result;
  }

  /**
   * Dump of the JSON's response in an array
   *
   * @param string $json
   *            The JSON object returned by the request function
   *
   * @return string A single string with the translation
   */
  protected static function getSentencesFromJSON($json){
      $sentencesArray = json_decode($json, true);
      $sentences = "";

      foreach ($sentencesArray["sentences"] as $s) {
          $sentences .= isset($s["trans"]) ? $s["trans"] : '';
      }

      return $sentences;
  }

	public function pv(){
		if(preg_match($this->pattern['pv'], $this->html(), $pv)){
			if($this->valid($pv["url"])){
			return $pv["url"];
		}
		else{
			return '';
		}
	}else{
		return '';
	}


  }
  public function anime_title(){
		if(preg_match($this->pattern['anime_title'], $this->html(), $anime_title)){
			if($this->valid($anime_title[1])){
				return $anime_title[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function image(){
		if(preg_match($this->pattern['image'], $this->html(), $image)){
			if($this->valid($image["url"])){
				return $image["url"];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function english(){
		if(preg_match($this->pattern['english'], $this->html(), $english)){
			if($this->valid($english[1])){
				return $english[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function synonyms(){
		if(preg_match($this->pattern['synonyms'], $this->html(), $synonyms)){
			if($this->valid($synonyms[1])){
				return $synonyms[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function japanese(){
		if(preg_match($this->pattern['japanese'], $this->html(), $japanese)){
			if($this->valid($japanese[1])){
				return $japanese[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function type(){
		if(preg_match($this->pattern['type'], $this->html(), $type)){
			if($this->valid($type[1])){
				return $this->escape($type[1], 'a', 1);
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function episode(){
		if(preg_match($this->pattern['episode'], $this->html(), $episode)){
			if($this->valid($episode[1])){
				return (int) $episode[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function status(){
		if(preg_match($this->pattern['status'], $this->html(), $status)){
			if($this->valid($status[1])){
				return $status[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function aired(){
		if(preg_match($this->pattern['aired'], $this->html(), $aired)){
			if($this->valid($aired[1])){
				return $aired[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function premiered(){
		if(preg_match($this->pattern['premiered'], $this->html(), $premiered)){
			if($this->valid($premiered[1])){
				return $this->escape($premiered[1], 'a', 1);
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function broadcast(){
		if(preg_match($this->pattern['broadcast'], $this->html(), $broadcast)){
			if($this->valid($broadcast[1])){
				return $broadcast[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function producer(){
		if(preg_match($this->pattern['producer'], $this->html(), $producer)){
			if($this->valid($producer[1])){
				return implode( ', ', $this->escape($producer[1], 'a', 2));
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function licensor(){
		if(preg_match($this->pattern['licensor'], $this->html(), $licensor)){
			if($this->valid($licensor[1])){
				return implode(',', $this->escape($licensor[1], 'a', 2));
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function studio(){
		if(preg_match($this->pattern['studio'], $this->html(), $studio)){
			if($this->valid($studio[1])){
				return implode(',', $this->escape($studio[1], 'a', 2));
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function source(){
		if(preg_match($this->pattern['source'], $this->html(), $source)){
			if($this->valid($source[1])){
				return $source[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function genre(){
		if(preg_match($this->pattern['genre'], $this->html(), $genre)){
			if($this->valid($genre[1])){
				return implode( ', ', $this->escape($genre[1], 'a', 2) );
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function duration(){
		if(preg_match($this->pattern['duration'], $this->html(), $duration)){
			if($this->valid($duration[1])){
				return $duration[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function rating(){
		if(preg_match($this->pattern['rating'], $this->html(), $rating)){
			if($this->valid($rating[1])){
				return $rating[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function score(){
		if(preg_match($this->pattern['score'], $this->html(), $score)){
			if($this->valid($score[1])){
				return (float) $score[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function synopsis(){
		if(preg_match($this->pattern['synopsis'], $this->html(), $synopsis)){
			if($this->valid($synopsis[1])){
				return $this->translate('en', 'id', $this->escape($synopsis[1], 'clean', 3));
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function published(){
		if(preg_match($this->pattern['published'], $this->html(), $published)){
			if($this->valid($published[1])){
				return $published[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
		public function author(){
		if(preg_match($this->pattern['author'], $this->html(), $author)){
			if($this->valid($author[1])){
				return $author[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function serialization(){
		if(preg_match($this->pattern['serialization'], $this->html(), $serialization)){
			if($this->valid($serialization[1])){
				return $serialization[1];
			}else{
				return '';
			}
		}else{
			return '';
		}
	}
	public function getUrl($url, $renew = false){
		$id = explode('/', parse_url($url)['path'])[2];
    $this->id = $id;
    // print_r($this->id);
		if($this->check($id) && !$renew){
			$this->data = (array) json_decode($this->open($id));
		}elseif($this->check($id) && $renew || !$this->check($id) && !$renew || !$this->check($id) && $renew){
			$this->curl($url);
			foreach($this->pattern as $method => $pattern){
				$this->data[$method] = $this->{$method}();
			}
		}
		return $this;
	}
	public function result($json = false, $save = false, $pretty = false){
		if($save){
			$data = $this->data;
      $this->save($this->id, json_encode($data));
      
    }
    // echo "test";
		return $this->data;
	}
  
  
  public function curl($url){
		$debug = [
			'status' => false
		];
		$init = curl_init();
		curl_setopt($init, CURLOPT_URL, $url);
		curl_setopt($init, CURLOPT_RETURNTRANSFER, true);
		$exec = curl_exec($init);
		if($exec){
			$this->html = $exec;
			$debug['status'] = true;
		}else{
			$exec = file_get_contents($url);
			if($exec){
				$this->html = $exec;
				$debug['status'] = true;
			}
		}
		curl_close($init);
		return $debug;
	}
	public function escape($string, $tag, $mode = 1){
		switch($tag){
			case 'a':
				$pattern = '/<a.*?>\s*(.*?)\s*<\/a>/i';
			break;
			case 'clean':
				$pattern = array('/\[.*\]/i', '/\(.*\)/i', '/<br \/>/i', '/\s{2,}/i', '/[\t\r\n]/i');
			break;
		}
		switch($mode){
			case 1:
				if(preg_match($pattern, $string, $match)){
					return $match[1];
				}
			break;
			case 2:
				if(preg_match_all($pattern, $string, $matches)){
					return $matches[1];
				}
			break;
			case 3:
				$string = preg_replace($pattern, ' ', $string);
				$string = preg_replace('/\s{1,}$/i', '', $string);
				return $string;
			break;
		}
	}
	public function valid($string){
		if(preg_match('/^(Unknown|Not yet aired|None found|N\/A|Not available|\?)/i', $string, $valid)){
			return false;
		}else{
			return true;
		}
	}
	public function html(){
		return $this->html;
	}
	public function save($file, $data){
		if(!is_dir($this->dir)){
			mkdir($this->dir);
			file_put_contents($this->dir . '/' . $file, $data);
		}else{
			file_put_contents($this->dir . '/' . $file, $data);
		}
	}
	public function open($file){
		return file_get_contents($this->dir . '/' . $file);
	}
	public function check($file){
		return file_exists($this->dir . '/' . $file);
	}

  public function getAnime($id = "") {
    error_reporting(1);
		$mal_url = "https://myanimelist.net/anime/";

		if(!isset($id) || $id == "" || $id === null || !$id ){
			$status = false;
			return $status;
		} else {
      $link = "$mal_url/$id";
			$anime_grab_result = $this->getUrl($link)->result(true);
			return $anime_grab_result;
		}

  }
  
}
