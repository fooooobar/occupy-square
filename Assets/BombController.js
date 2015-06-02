/*
Bomb fly and explode
*/

#pragma strict

var parent : Transform;
var speed : float;
var poisonPrefab : Transform;
var poisonDelay : float;

var faceRenderer : Renderer;
var sparkEffect : ParticleSystem;
var smokeEffect : ParticleSystem;

function Start () {
	// detach from parent at start
	transform.parent = null;
}

function Strike (targetPosition: Vector2) {
	// reset position and show
	transform.position = parent.position;
	faceRenderer.enabled = true;
	yield;
	
	// move towards target
	var p = transform.position;
	while(p != targetPosition) {
		p = Vector3.MoveTowards(p, targetPosition, speed * Time.deltaTime);
		transform.position = p;
		yield;
	}
	
	// instantiate poison
	castPoison();
	
	// play explosion effect
	faceRenderer.enabled = false;
	sparkEffect.Play();
	smokeEffect.Play();
}

function castPoison () {
	yield WaitForSeconds(poisonDelay);
	Instantiate(poisonPrefab, transform.position, Quaternion.identity);
}
