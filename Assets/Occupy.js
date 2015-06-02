/*
Occupy Behaviour
keep pushing
*/

#pragma strict

var force : float;

function Attack () {
	while (enabled) {
		rigidbody2D.AddForce(Vector3.up * force);
		yield WaitForFixedUpdate();
	}
}

function Halt () {
	enabled = false;
}
