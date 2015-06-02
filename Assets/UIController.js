#pragma strict

var overlay : UI.Image;
var notification : UI.Text;
var notificationTime : float;
var countdown : UI.Text;
var coin : UI.Text;
var buyCitizen : UI.Button;

private var displayCoin : int = 0;
private var actualCoin : int = 0;

// add number rolling effect for coins
function Start () {
	while (true) {
		if (displayCoin != actualCoin) {
			var diff = Mathf.Abs(actualCoin - displayCoin);
			var sign = Mathf.Sign(actualCoin - displayCoin);
			var minStep = 10;
			var delta = 0;
			if (minStep < diff) delta = Mathf.Clamp(diff/5, minStep, diff);
			else delta = diff;
			displayCoin += sign * delta;
			coin.text = displayCoin.ToString();
		}
		yield WaitForSeconds(0.03f);
	}
}

// pop up text(s) to indicate game events
function ShowNotification (text : String[]) {
	var speed = 0.1f;
	var size : float;
	var t : float;
	
	showOverlay(text.length * notificationTime);
	notification.enabled = true;
	for (var i=0; i<text.length; ++i) {
		notification.text = text[i];
		size = 1;
		for (t=0; t<notificationTime; ) {
			size += speed * Time.deltaTime;
			t += Time.deltaTime;
			notification.transform.localScale = Vector3.one * size;
			yield;
		}
	}
	notification.enabled = false;
}

// update countdown timer on top right of screen
function UpdateCountDown (time : float) {
	var displayTime = Mathf.CeilToInt(time);
	var displayText = displayTime==0 ? "" : displayTime.ToString();
	countdown.text = displayText;
}

// update coin number on top left of screen
function UpdateCoin (n : int) {
	actualCoin = n;
}

// set active state for buy button
function SetBuyButton (b : boolean) {
	buyCitizen.interactable = b;
}

// fade in and out the overlay background
function showOverlay (duration : float) {
	var timeTransition = 0.15f;
	var speed = 2f;
	var alpha = 0f;
	var t : float;
	
	overlay.enabled = true;
	for (t=0; t<timeTransition; ) {
		alpha += speed * Time.deltaTime;
		t += Time.deltaTime;
		//overlay.color.a = alpha;
		overlay.color = Color(0, 0, 0, alpha);
		yield;
	}
	yield WaitForSeconds(duration - 2 * timeTransition);
	for (t=0; t<timeTransition; ) {
		alpha -= speed * Time.deltaTime;
		t += Time.deltaTime;
		overlay.color = Color(0, 0, 0, alpha);
		yield;
	}
	overlay.enabled = false;
}
