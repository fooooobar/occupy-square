/*
Poison behaviour
apply poison on contact
limited lifetime
*/

#pragma strict

var lifetime : float;
var duration : float;
var damage : float;

function Start () {
	Destroy(gameObject, lifetime);
}

function OnTriggerStay2D(other: Collider2D) {
	var o = other.gameObject;
	if (o.tag == "Citizen") {
		o.SendMessage("ApplyPoison", this);
	}
}
