/*
Shoot Behaviour
attack on contact
attack needs load time
*/

#pragma strict

var fireRate : float;
var poisonPrefab : Transform;
var poisonDelay : float;
var weaponEffect : WeaponEffect;
private var loaded : boolean = true;

function OnCollisionStay2D(coll: Collision2D) {
	var o = coll.gameObject;
	var dir = -coll.contacts[0].normal;
	if(loaded && enabled && o.tag == "Citizen") {
		weaponEffect.Hit(dir);
		castPoison();
		loaded = false;
		yield WaitForSeconds(fireRate);
		loaded = true;
	}
}

function castPoison () {
	yield WaitForSeconds(poisonDelay);
	var poison : Transform = Instantiate(poisonPrefab);
	poison.parent = weaponEffect.transform;
	poison.localPosition = Vector3.zero;
	poison.localRotation = Quaternion.identity;
}

function Halt () {
	enabled = false;
}
