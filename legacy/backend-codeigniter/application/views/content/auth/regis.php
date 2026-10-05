<div class="wrapper fadeInDown">
  <div id="formContent">
    <!-- Tabs Titles -->

    <!-- Icon -->
    <div class="fadeIn first">
      <img src="https://4.bp.blogspot.com/-HeWKPFHc2sU/XEMbK5ZaA-I/AAAAAAAACRY/4MRNrmRl9CEAZPZLpdJcgtcrfJHi_7SfwCLcBGAs/s1600/codepelajar-logo.png" id="icon" alt="User Icon" />
    </div>
 <?= $this->session->flashdata('message'); ?>
    <!-- Login Form -->
    <form class="flat-card-body" method="post" action="<?= base_url('auth/regis'); ?>">
      <div class="form-group">
          <input type="text" id="name" class="fadeIn second form-control" name="name" autocomplete="off" value="<?= set_value('name');?>">
          <label>Full Name</label>
           <?= form_error('email', '<small class="text-danger pl-3">', '</small>')?>
      </div>
      <div class="form-group">
          <input type="text" id="login" class="fadeIn second form-control" name="email" autocomplete="off" value="<?= set_value('name');?>">
          <label>Email</label>
           <?= form_error('email', '<small class="text-danger pl-3">', '</small>')?>
      </div>

      <div class="form-group">
          <input type="password" id="password1" class="fadeIn second form-control" name="password1">
          <label>Password</label>
          <?= form_error('password1', '<small class="text-danger pl-3">', '</small>')?>
     </div>

     <div class="form-group">
          <input type="password" id="password2" class="fadeIn second form-control" name="password2">
          <label>Repeat Password</label>
     </div>

      <button type="submit" class="fadeIn fourth btn btn-block btn-dark">Register</button>
    </form>
    <!-- Remind Passowrd -->
    <div id="formFooter">
      <p>Already have an account?  <a href="<?= base_url() ?>">Login</a></p>
    </div>

  </div>
</div>