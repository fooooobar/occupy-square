#pragma strict

function Update () {
	if (Input.GetButtonDown("Fire1") || Input.GetButtonDown("Jump")) {
		Application.LoadLevel("main");
	}
}
