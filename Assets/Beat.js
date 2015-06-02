/*
Beat Behaviour
attack on contact
attack needs load time
*/

#pragma strict

var fireRate : float;
var damage : float;
var weaponEffect : WeaponEffect;
private var loaded : boolean = true;

function OnCollisionStay2D(coll: Collision2D) {
	var o = coll.gameObject;
	var dir = -coll.contacts[0].normal;
	if(loaded && enabled && o.tag == "Citizen") {
		weaponEffect.Hit(dir);
		o.SendMessage("ApplyDamage", damage);
		loaded = false;
		yield WaitForSeconds(fireRate);
		loaded = true;
	}
}

function Halt () {
	enabled = false;
}
