/*
Coin behaviour
add coin on click
needs to be pos.z < 0 to be clickable
*/

#pragma strict

var quantity : int;
var lifetime : float;

function Start () {
	// schedule destroy after lifetime
	Destroy(gameObject, lifetime);
	// play jump and pop animation, then cute effect
	var pos = transform.position;
	var point = [pos, pos + Vector2(0, 0.25f), pos];
	var scale = [Vector3.one * 0.3f, Vector3.one * 0.7f, Vector3.one];
	yield lerpTransition(point[0], point[1], scale[0], scale[1], 0.2f);
	yield lerpTransition(point[1], point[2], scale[1], scale[2], 0.2f);
	while (true) {
		yield WaitForSeconds(lifetime/3);
		yield playCuteEffect (0.8f, 0.1f);
	}
}

// change scale.x/y like marsh mellow
function playCuteEffect (duration: float, magnitude: float) {
	var w = duration/2;
	for (var t=0f; t<duration; ) {
		t = Mathf.Clamp(t+Time.deltaTime, t, duration);
		var px = (Mathf.PingPong(w/2 + t, w) - w/2) / w * 2;
		var py = (Mathf.PingPong(w*1.5f + t, w) - w/2) / w * 2;
		transform.localScale = Vector3(1+px*magnitude, 1+py*magnitude, 1);
		yield;
	}
}

// interpolate position and scale
function lerpTransition (startPosition: Vector3, endPosition: Vector3, startScale:Vector3, endScale:Vector3, duration:float) {
	var t : float;
	var fraction : float;
	var p : Vector3;
	var s : Vector3;
	for (t=0; t<duration; ) {
		t += Time.deltaTime;
		fraction = t / duration;
		p = Vector3.Lerp(startPosition, endPosition, fraction);
		s = Vector3.Lerp(startScale, endScale, fraction);
		transform.localPosition = p;
		transform.localScale = s;
		yield;
	}
}

// pick up coin when clicked
function OnMouseUpAsButton () {
	var gameController = GameObject.FindWithTag("GameController");
	gameController.SendMessage("coinAdd", quantity);
	Destroy(gameObject);
}
