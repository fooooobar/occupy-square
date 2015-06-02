/*
Weapon visual effect
Rotate & show weapon sprite
*/

#pragma strict

var particleEffect : ParticleSystem;
var duration : float;

function Hit (dir: Vector2) {
	// show sprite
	transform.localRotation = Quaternion.FromToRotation(Vector2.up, dir);
	renderer.enabled = true;
	
	// play particle effect
	if(particleEffect != null) particleEffect.Play();
	
	// hide sprite
	yield WaitForSeconds(duration);
	renderer.enabled = false;
}