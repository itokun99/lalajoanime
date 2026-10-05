<div class="wrapper fadeInDown">
  <div id="formContent">
    <!-- Icon -->
    <div class="fadeIn first">
      <img src="https://4.bp.blogspot.com/-HeWKPFHc2sU/XEMbK5ZaA-I/AAAAAAAACRY/4MRNrmRl9CEAZPZLpdJcgtcrfJHi_7SfwCLcBGAs/s1600/codepelajar-logo.png" id="icon" alt="User Icon" />
    </div>
    <!-- Login Form -->
    <form class="flat-card-body" method="post" action="<?= base_url('auth'); ?>">
      <?= $this->session->flashdata('message'); ?>
      <!-- GROUP FIELD-->
      <div class="form-group">
          <input type="text" id="login" class="fadeIn second form-control" name="email">
          <label>Email</label>
           <?= form_error('email', '<small class="text-danger pl-3">', '</small>')?>
      </div>
      <!-- GROUP FIELD-->
      <div class="form-group">
          <input type="password" id="password" class="fadeIn second form-control" name="password">
          <label>Password</label>
          <?= form_error('password', '<small class="text-danger pl-3">', '</small>')?>
     </div>
     <!--Button-->
      <button type="submit" class="fadeIn fourth btn btn-block btn-dark">Login</button>
    </form>
    <!-- Remind Passowrd -->
    <div id="formFooter">
      <p>Do not have an account? <a class="underlineHover" href="auth/regis">Register</a> </p>
    </div>

  </div>
</div>