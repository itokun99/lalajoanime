<!DOCTYPE html>
<html>
<head>
	<title><?= $page_title;?></title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" type="text/css" href="<?= base_url();?>assets/plugins/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="<?= base_url();?>assets/plugins/fontawesome/css/all.min.css" />
    <link rel="stylesheet" type="text/css" href="<?= base_url();?>assets/plugins/datatables/datatables.css" />
    <link rel="stylesheet" type="text/css" href="<?= base_url();?>assets/plugins/datatables/DataTables-1.10.18/css/dataTables.bootstrap4.css" />
    <link rel="stylesheet" type="text/css" href="<?= base_url();?>assets/plugins/datatables/Responsive-2.2.2/css/responsive.bootstrap4.css" />
    <link rel="stylesheet" type="text/css" href="<?= base_url();?>assets/plugins/datatables/RowReorder-1.2.4/css/rowReorder.bootstrap4.css" />
    <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Lato" />
    <link rel="stylesheet" type="text/css" href="<?= base_url();?>assets/css/main.css" />

    <!-- script -->
    <script type="text/javascript" src="<?= base_url();?>assets/plugins/jquery/jquery.min.js"></script>
    <!-- script -->
    
	<style type="text/css">

/* BASIC */

html {
  background-color: #56baed;
}

body {
  font-family: "Poppins", sans-serif;
  height: 100vh;
}
body {
    background-size: 5%;
    background: #2ecb71 url(https://1.bp.blogspot.com/-yOReWG5sWFY/XCI-2CJtsWI/AAAAAAAAEM0/sg98cL51_ecjPeF2oSfu0VhF0IqJpZQtwCLcBGAs/bg3.png);
    -webkit-animation: loopnavbg-data-v-c423aec0 350s linear infinite;
    animation: loopnavbg-data-v-c423aec0 350s linear infinite;
    -webkit-animation: loopnavbg-data-v-c423aec0 350s linear infinite;
    animation: loopnavbg-data-v-c423aec0 350s linear infinite;
    animation: loopingbackg 350s linear infinite;
}@-webkit-keyframes loopingbackg{to{background-position:0 -3e3px}}
@keyframes loopingbackg {to{background-position:0 -3e3px}}
a {
  color: #92badd;
  display:inline-block;
  text-decoration: none;
  font-weight: 400;
}

h2 {
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  display:inline-block;
  margin: 40px 8px 10px 8px; 
  color: #cccccc;
}



/* STRUCTURE */

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column; 
  justify-content: center;
  width: 100%;
  min-height: 100%;
  padding: 20px;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  background: #fff;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  position: relative;
  padding: 0px;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
  text-align: center;
}

#formFooter {
  background-color: #f6f6f6;
  border-top: 1px solid #dce8f1;
  padding: 25px;
  text-align: center;
  -webkit-border-radius: 0 0 10px 10px;
  border-radius: 0 0 10px 10px;
}

input[type=button]:hover, input[type=submit]:hover, input[type=reset]:hover  {
  background-color: #39ace7;
}

input[type=button]:active, input[type=submit]:active, input[type=reset]:active  {
  -moz-transform: scale(0.95);
  -webkit-transform: scale(0.95);
  -o-transform: scale(0.95);
  -ms-transform: scale(0.95);
  transform: scale(0.95);
}

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

.fadeIn {
  opacity:0;
  -webkit-animation:fadeIn ease-in 1;
  -moz-animation:fadeIn ease-in 1;
  animation:fadeIn ease-in 1;

  -webkit-animation-fill-mode:forwards;
  -moz-animation-fill-mode:forwards;
  animation-fill-mode:forwards;

  -webkit-animation-duration:1s;
  -moz-animation-duration:1s;
  animation-duration:1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 1s;
  -moz-animation-delay: 1s;
  animation-delay: 1s;
}

/* Simple CSS3 Fade-in Animation */
.underlineHover:after {
  display: block;
  left: 0;
  bottom: -10px;
  width: 0;
  height: 2px;
  background-color: #56baed;
  content: "";
  transition: width 0.2s;
}

#icon {
  width:30%;
}

	</style>
</head>
<body>