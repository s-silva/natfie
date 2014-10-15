<?php
	include_once("../../general/basics.php");
	
?>
	<table><tr style='width: 400px;'><td style='width: 120px;'>Email Address:</td><td><input style='width: 300px;'  class='dialogbox_inputsettings'  name='cnamegpsbx_fname' value='<?php echo basics::get_useremail_from_id($_SESSION['uid']); ?>'/></td></tr>
	<tr style='width: 400px;'><td style='width: 120px;'>Confirm Password:</td><td><input style='width: 300px;'  class='dialogbox_inputsettings' name='cnamegpsbx_fname'/></td></tr>

	</table>
	
	<div style='max-width: 600px; margin-top: 10px; color: #888888;'>Make sure the new email address is valid, we send a reset message to the previous email account and a validation check to the new email account. Until you validate the new account, some features of the site won't be avaliable for you.</div>
	<div style='max-width: 600px; color: #888888;'>If you're giving away the previous account to another person, please make sure to delete the reset message.</div>
<?php
?>