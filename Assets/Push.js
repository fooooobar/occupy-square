/*
Push Behaviour
push repeatedly
*/

#pragma strict

var force : float;
var pushTime : float;
var restTime : float;

function Attack () {
	while (enabled) {
		for (var t=0f; t<pushTime; ) {
			rigidbody2D.AddForce(Vector3.down * force);
			t += Time.deltaTime;
			yield WaitForFixedUpdate();
		}
		yield WaitForSeconds(restTime);
	}
}

function Halt () {
	enabled = false;
}
