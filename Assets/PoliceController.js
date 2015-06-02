/*
common police behaviour
start, halt, exit
*/

#pragma strict

function Start () {

    // play enter transition
    var s = 0.5f;
    while(s < 1f) {
        s = Mathf.Clamp(s + 5f * Time.deltaTime, 0.5f, 1f);
        transform.localScale = Vector3.one * s;
        yield;
    }
}

// exit scene
function Exit () {
	// clean detached object
	var c : Blast = GetComponent(Blast);
	if(c) Destroy(c.projectile.gameObject);
	
	// remove components except sprite
	Destroy(GetComponent(SliderJoint2D));
	Destroy(GetComponent(DistanceJoint2D));
	Destroy(collider2D);
	Destroy(rigidbody2D);
	Destroy(GetComponent(Push));
	Destroy(GetComponent(Beat));
	Destroy(GetComponent(Shoot));
	Destroy(GetComponent(Blast));
	
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
