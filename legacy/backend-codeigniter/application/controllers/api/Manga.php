<?php
use Restserver\Libraries\REST_Controller;
defined('BASEPATH') OR exit('No direct script access allowed');

// This can be removed if you use __autoload() in config.php OR use Modular Extensions
/** @noinspection PhpIncludeInspection */
//To Solve File REST_Controller not found
require APPPATH . 'libraries/REST_Controller.php';
require APPPATH . 'libraries/Format.php';
class Manga extends REST_Controller {
    function __construct(){
        parent::__construct();
        $this->responseJSON = [
            "author" => "Dev Code Pelajar",
            "info" => "API MAL Manga v.1",
        ];
    }

    public static function translate($source, $target, $text){
      // Request translation
      $response = self::requestTranslation($source, $target, $text);

      // Get translation text
      // $response = self::getStringBetween("onmouseout=\"this.style.backgroundColor='#fff'\">", "</span></div>", strval($response));

      // Clean translation
      $translation = self::getSentencesFromJSON($response);
      return $translation;
    }

    protected static function getSentencesFromJSON($json){
        $sentencesArray = json_decode($json, true);
        $sentences = "";
        foreach ($sentencesArray["sentences"] as $s) {
            $sentences .= isset($s["trans"]) ? $s["trans"] : '';
        }
        return $sentences;
    }

    protected static function requestTranslation($source, $target, $text){

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

    public function getManga_get(){
        $manga_id = $this->get('id');
        $source = "https://myanimelist.net/manga";
        
        if($manga_id === NULL || $manga_id == ""){
            $this->responseJSON['status'] = FALSE;
            $this->responseJSON['message'] = "Membutuhkan 1 ID";
            $this->response($this->responseJSON, REST_Controller::HTTP_OK);
        } else {
            $url = "$source/$manga_id";
            $html = $this->curl->simple_get($url);

            $title = '/<h1 class=\"h1\">\s*<span itemprop=\"name\">\s*(.*?)\s*<\/span>\s*<\/h1>/i';
            $english = '/<div class=\"spaceit_pad\">\s*<span class=\"dark_text\">English:<\/span>\s*(.*?)\s*<\/div>/i';
            $synonyms = '/<div class=\"spaceit_pad\">\s*<span class=\"dark_text\">Synonyms:<\/span>\s*(.*?)\s*<\/div>/i';
            $japanese = '/<div class=\"spaceit_pad\">\s*<span class=\"dark_text\">Japanese:<\/span>\s*(.*?)\s*<\/div>/i';
            $type = '/<div>\s*<span class=\"dark_text\">Type:<\/span>\s*<a href=\"\s*(.*?)\s*\">\s*(.*?)\s*<\/a>\s*<\/div>/i';
            $volumes = '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Volumes:<\/span>\s*(.*?)\s*<\/div>/i';
            $chapters = '/<div>\s*<span class=\"dark_text\">Chapters:<\/span>\s*(.*?)\s*<\/div>/i';
            $status = '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Status:<\/span>\s*(.*?)\s*<\/div>/i';
            $published = '/<div>\s*<span class=\"dark_text\">Published:<\/span>\s*(.*?)\s*<\/div>/i';
            $genres = '/<div class=\"spaceit\">\s*<span class=\"dark_text\">Genres:<\/span>\s*(.*?)\s*<\/div>/i';
            $author = '/<div>\s*<span class=\"dark_text\">Authors:<\/span>\s*(.*?)\s*<\/div>/i';
            $score = '/<span itemprop=\"ratingValue\">\s*(.*?)\s*<\/span>/i';
            $synopsis = "'\s*<\s*span \s*itemprop=\"description\">(.*?)<'si";
            $poster = "/<img.*?src=[\"'](?<url>.*?)[\"'].*?class=\"ac\".*?>/";


            //manga_title
            $match = preg_match($title, $html, $data );
            if($match){
                $manga_title = $data[1];
            } else {
                $manga_title = "";
            }

            //english
            $match = preg_match($english, $html, $data );
            if($match){
                $english = $data[1];
            } else {
                $english = "";
            }
            
            //sinonim
            $match = preg_match($synonyms, $html, $data );
            if($match){
                $synonyms = $data[1];
            } else {
                $synonyms = "";
            }

            //jepang
            $match = preg_match($japanese, $html, $data );
            if($match){
                $japanese = $data[1];
            } else {
                $japanese = "";
            }

            //tipe
            $match = preg_match($type, $html, $data );
            if($match){
                $type = $data[2];
            } else {
                $type = "";
            }

            //volume
            $match = preg_match($volumes, $html, $data );
            if($match){
                $volumes = $data[1];
            } else {
                $volumes = "";
            }

            //chapter
            $match = preg_match($chapters, $html, $data );
            if($match){
                $chapters = $data[1];
            } else {
                $chapters = "";
            }

            //status
            $match = preg_match($status, $html, $data );
            if($match){
                $status = $data[1];
            } else {
                $status = "";
            }

            //published
            $match = preg_match($published, $html, $data );
            if($match){
                $published = $data[1];
            } else {
                $published = "";
            }

            //genre
            $match = preg_match($genres, $html, $data );
            if($match){
                $genres = $data[1];
                $gen_patern = '/<a.*?>\s*(.*?)\s*<\/a>/i';
                if(preg_match_all($gen_patern, $genres, $res)){
                    $genres = $res[1];
                    $genres = implode(', ', $genres);
                }
            } else {
                $genres = "";
            }

            //author
            $match = preg_match($author, $html, $data );
            if($match){
                $author = $data[1];
                $gen_patern = '/<a.*?>\s*(.*?)\s*<\/a>/i';
                if(preg_match_all($gen_patern, $author, $res)){
                    $author = $res[1];
                    $author = implode(', ', $author);
                }
            } else {
                $author = "";
            }

            //skor
            $match = preg_match($score, $html, $data );
            if($match){
                $score = $data[1];
            } else {
                $score = "";
            }

            //sinopsis
            $match = preg_match($synopsis, $html, $data );
            if($match){
                $synopsis = implode(' ', $data);
                $sin_patern = array('/\[.*\]/i', '/\(.*\)/i', '/<br \/>/i', '/<span itemprop=\"description\">/i' , '/</i' , '/\s{2,}/i', '/[\t\r\n]/i');
                $synopsis = preg_replace($sin_patern, " ", $synopsis);
                $synopsis = preg_replace('/\s{1,}$/i', "", $synopsis);
                $synopsis = $this->translate('en', 'id', $synopsis);
                $synopsis = str_replace('& quot;', '"', $synopsis);
                $synopsis = str_replace('&quot;', '"', $synopsis);
                $synopsis = str_replace('&quot ;', '"', $synopsis);
                $synopsis = str_replace('&Quot ;', '"', $synopsis);
                $synopsis = str_replace('& Quot ;', '"', $synopsis);
                $synopsis = str_replace('& Quot;', '"', $synopsis);

            } else {
                $synopsis = "";
            }

            //poster
            $match = preg_match($poster, $html, $data);
            if($match){
                $poster = $data["url"];
            } else {
                $poster = "";
            }
            
            $result = [
                "id" => $manga_id,
                "title" => $manga_title,
                "english" => $english,
                "synonims" => $synonyms,
                "japanese" => $japanese,
                "type" => $type,
                "volumes" => $volumes,
                "chapters" => $chapters,
                "status" => $status,
                "publish" => $published,
                "genres" => $genres,
                "author" => $author,
                "score" => $score,
                "poster" => $poster,
                "synopsis" => $synopsis
            ];

            if(isset($result) && !empty($result)){
                $this->responseJSON['status'] = TRUE;
                $this->responseJSON['message'] = "Berhasil didapatkan";
                $this->responseJSON['data'] = $result;
                $this->response($this->responseJSON, REST_Controller::HTTP_OK);
            } else {
                $this->responseJSON['status'] = FALSE;
                $this->responseJSON['message'] = "Informasi tidak ditemukan/tidak ada";
                $this->response($this->responseJSON, REST_Controller::HTTP_OK);
            }
        }
    }
}