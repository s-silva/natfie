<?php
	include_once("../../general/basics.php");
	
	$dobvy = 0;
	$dobvm = 0;
	$dobvd = 0;
	
	$av = basics::get_userdob_from_id($_SESSION['uid']);
	
	$genderid = basics::get_usergenderid_from_id($_SESSION['uid']);
	
	if(!$av)
	{
		$dobvy = 01;
		$dobvm = 0;
		$dobvd = 0;
	}else{
		$dobvy = $av[0];
		$dobvm = $av[1];
		$dobvd = $av[2];
	}
	
?>
	<table><tr style='width: 400px;'><td style='width: 120px;'>First Name:</td><td><input style='width: 300px;'  class='dialogbox_inputsettings'  id='stgd_fname' value='<?php echo basics::get_userfname_from_id($_SESSION['uid']); ?>'/></td></tr>
	<tr style='width: 400px;'><td style='width: 120px;'>Middle Name:</td><td><input style='width: 300px;'  class='dialogbox_inputsettings'  id='stgd_mname' /></td></tr>
	<tr style='width: 400px;'><td style='width: 120px;'>Last Name:</td><td><input style='width: 300px;' class='dialogbox_inputsettings'  id='stgd_lname' value='<?php echo basics::get_userlname_from_id($_SESSION['uid']); ?>'/></td></tr>

	<tr style='width: 400px;'><td style='width: 120px;'>Gender:</td><td>
		<select name="ugender" style='border: 1px solid #efefef; font-size: 11px;' id='stgd_gender'>
			<option value="0" <?php if($genderid == 0) echo "selected";?> ></option>
			<option value="1" <?php if($genderid == 1) echo "selected";?> >Male</option>
			<option value="2" <?php if($genderid == 2) echo "selected";?> >Female</option>
		</select>
	<tr style='width: 400px;'><td style='width: 120px;'>Birthday:</td><td>
		<select name="bmonth" style='border: 1px solid #efefef; font-size: 11px;' id='stgd_bmonth'>
			<option value="0" <?php if($dobvm == 0) echo "selected";?> ></option>
			<option value="1" <?php if($dobvm == 1) echo "selected";?> >January</option>
			<option value="2" <?php if($dobvm == 2) echo "selected";?> >February</option>
			<option value="3" <?php if($dobvm == 3) echo "selected";?> >March</option>
			<option value="4" <?php if($dobvm == 4) echo "selected";?> >April</option>
			<option value="5" <?php if($dobvm == 5) echo "selected";?> >May</option>
			<option value="6" <?php if($dobvm == 6) echo "selected";?> >June</option>
			<option value="7" <?php if($dobvm == 7) echo "selected";?> >July</option>
			<option value="8" <?php if($dobvm == 8) echo "selected";?> >August</option>
			<option value="9" <?php if($dobvm == 9) echo "selected";?> >September</option>
			<option value="10" <?php if($dobvm == 10) echo "selected";?> >October</option>
			<option value="11" <?php if($dobvm == 11) echo "selected";?> >November</option>
			<option value="12" <?php if($dobvm == 12) echo "selected";?> >December</option>
		</select>
		
		<select name="bday" style='border: 1px solid #efefef; font-size: 11px;' id='stgd_bday'>
			<?php echo "<option value='0'></option>"; for($i=1; $i<=31; $i++) if($i != $dobvd){ echo "<option value='$i'>$i</option>"; }else{ echo "<option value='$i' selected>$i</option>";}?>
		</select>
		
		<select name="byear" style='border: 1px solid #efefef; font-size: 11px;' id='stgd_byear'>
			<?php echo "<option value='0'></option>"; for($i=2008; $i>=1900; $i--) if($i != $dobvy){ echo "<option value='$i'>$i</option>"; }else{ echo "<option value='$i' selected>$i</option>";} ?>
		</select>
	
	</td></tr>

	<tr style='width: 400px;'><td style='width: 120px;'>Description:</td><td><input style='width: 300px;' class='dialogbox_inputsettings'  id='stgd_dsc' value='<?php echo basics::unescapestr(basics::get_userdsc_from_id($_SESSION['uid'])); ?>'/></td></tr>
	<tr style='width: 400px;'><td style='width: 120px;'>Email Address:</td><td><input style='width: 300px;' class='dialogbox_inputsettings'  id='stgd_email' value='<?php echo basics::get_useremail_from_id($_SESSION['uid']); ?>'/></td></tr>

	
	<tr style='width: 400px;'><td style='width: 120px;'>Confirm Password:</td><td><input style='width: 300px;'  class='dialogbox_inputsettings' id='stgd_cpass'/></td></tr>

	</table>
<?php
?>