#pragma strict

function Start () {
	var m = System.DateTime.Now.Month;
	if (m<5||m>6) Destroy(gameObject);
}
