<?
/* fatlady is used to validate the configuration for the specific service.
 * FATLADY_prefix was defined to the path of Session Data.
 * 3 variables should be returned for the result:
 * FATLADY_result, FATLADY_node & FATLADY_message. */
include "/htdocs/phplib/fatlady/PHYINF/phyinf.php";
fatlady_phyinf($FATLADY_prefix, "WAN-1");
?>