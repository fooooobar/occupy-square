/*
common citizen bahaviour
start, exit, take damage
*/

#pragma strict

var health : float;
var painDuration : float;
var faceRenderer : SpriteRenderer;
var coinPrefab : GameObject;
var coinWait : float;
static var insideCount : int = 0;
private var pain : int = 0;
private var onPoison : boolean = false;
private var inside : boolean = false;

function Start () {
	
    // play enter transition
    var s = 0.5f;
    while(s < 1f) {
        s = Mathf.Clamp(s + 5f * Time.deltaTime, 0.5f, 1f);
        transform.localScale = Vector3.one * s;
        yield;
    }
    
    // drop coin repeatedly
    while (true) {
    	yield WaitForSeconds(coinWait);
    	var position = transform.position + Vector3(0, 0, -0.1f); // to fix raycast problem
    	Instantiate(coinPrefab, position, Quaternion.identity);
    }
}

// increment inside count when move/spawn inside main area
function OnTriggerEnter2D(other: Collider2D) {
	var o = other.gameObject;
	if (o.tag == "MainArea") {
		inside = true;
		++insideCount;
	}
}

// decrement inside count when move outside main area
function OnTriggerExit2D(other: Collider2D) {
	var o = other.gameObject;
	if (o.tag == "MainArea") {
		inside = false;
		--insideCount;
	}
}

// reduce health and step back when attacked
function ApplyDamage (damage : float) {
	health = health - damage;
	if (health > 0) {
		addPain();
		yield WaitForFixedUpdate();
		rigidbody2D.velocity = Vector2(0, -6);
		yield WaitForSeconds(painDuration);
		reducePain();
	}
	else Exit();
}

// reduce health for a time period when poisoned
function ApplyPoison (poison : Poison) {
	var t = 0f;
	var damage = poison.damage;
	var duration = poison.duration;
	if (!onPoison) {
		addPain();
		onPoison = true;
		// keep damaging till death or time up
		while (health > 0 && t < duration) {
			health -= damage * Time.deltaTime;
			t += Time.deltaTime;
			if (health > 0) yield;
			else Exit();
		}
		reducePain();
		onPoison = false;
	}
}

// change face color when painful
function addPain () {
	if (pain++ == 0) faceRenderer.color = Color.red;
}
function reducePain () {
	if (--pain == 0) faceRenderer.color = Color.white;
}

// exit scene
function Exit () {
	// decrement inside count when exit inside main area, to fix "onTriggerExit () not triggered on destroy" problem
	if (inside) --insideCount;
	
	// remove components except sprite
	Destroy(collider2D);
	Destroy(rigidbody2D);
	Destroy(GetComponent(Occupy));
	
    // play exit transition
    var s = 1f;
    while(s > 0.5f) {
        s = Mathf.Clamp(s - 5f * Time.deltaTime, 0.5f, 1f);
        transform.localScale = Vector3.one * s;
        yield;
    }
    
    // destroy from scene
    Destroy(gameObject);
}
