#pragma strict

class WaveInfo extends System.Object {
	var shieldCount : int;
	var batonCount : int;
	var sprayCount : int;
	var bombCount : int;
	var coinBonus : int;
}

var uiController : UIController;
var citizenPrefab : GameObject;
var shieldPrefab : GameObject;
var batonPrefab : GameObject;
var sprayPrefab : GameObject;
var bombPrefab : GameObject;
var policeGroup : GameObject;
var citizenGroup : GameObject;
var spawnWait : float;
var readyWait : float;
var exitWait : float;
var waveDuration : float;
var coin : int;
var citizenPrice : int;
var waves : WaveInfo[];

function Start () {

	initCitizen();
	coinAdd(0); // update UI
	// iterate waves
	for (var i=0; i<waves.length; ++i) {
		var readyInfo = ["Wave "+(i+1), "占领广场"+waveDuration+"秒\nOccupy square for "+waveDuration+" seconds", "Ready"];
		var coinBonus = waves[i].coinBonus;
		
		// spawn enemy
		yield WaitForSeconds(spawnWait);
		SpawnWave(waves[i]);
		// notify player to get ready
		yield WaitForSeconds(readyWait);
		yield uiController.ShowNotification(readyInfo);
		// start this wave
		Debug.Log("start wave " + i);
		policeGroup.BroadcastMessage("Attack");
		for (var t=waveDuration; t>0; ) {
			t -= Time.deltaTime;
			// update count down
			uiController.UpdateCountDown(t);
			// game over check
			if (CitizenController.insideCount == 0) {
				policeGroup.BroadcastMessage("Halt");
				citizenGroup.BroadcastMessage("Halt");
				yield uiController.ShowNotification(["阵地失守\nDefense fail"]);
				yield WaitForSeconds(2);
				Application.LoadLevel("game over");
			}
			yield;
		}
		// wave completion
		coinAdd(coinBonus);
		uiController.ShowNotification(["干的漂亮！\nExcellent!", "获得"+coinBonus+"黄丝带\nBonus "+coinBonus+" ribbon"]);
		// halt enemy and retreat
		policeGroup.BroadcastMessage("Halt");
		yield WaitForSeconds(exitWait);
		policeGroup.BroadcastMessage("Exit");
	}
	// win the game
	yield WaitForSeconds(3);
	Application.LoadLevel("you win");
}

// spawn a citizen at random position in bottom area
function SpawnCitizen () {
	var pointA = Vector2(-3.503f, -3.5f);
	var pointB = Vector2(3.504f, -3.5f);
	var position = Vector2.Lerp(pointA, pointB, Random.value);
	
	coinAdd(-citizenPrice);
	var c : GameObject = Instantiate(citizenPrefab, position, Quaternion.identity);
	c.transform.parent = citizenGroup.transform;
	yield WaitForSeconds(0.2f);
	c.SendMessage("Attack");
}

function initCitizen () {
	// instantiate citizen
	yield WaitForSeconds(1);
	var space = 0.6f + 0.037f;
	for (var i=0; i<12; ++i) {
		var position = Vector2(-3.503f + i * space, 1.6f);
		var c : GameObject = Instantiate(citizenPrefab, position, Quaternion.identity);
		c.transform.parent = citizenGroup.transform;
	}
	// start behaviour
	yield WaitForSeconds(1);
	citizenGroup.BroadcastMessage("Attack");
}

// spawn wave enemy
// row 1, size 12, type shield/baton/spray
// rest rows can have any size, type shield/bomb
function SpawnWave (info : WaveInfo) {
	var enemyCount = 12 + info.shieldCount + info.bombCount;
	var prefabs = new GameObject[enemyCount];
	var enemys = new GameObject[enemyCount];
	
	// init prefab list, row 1, then rest
	var i : int;
	var j = 0;
	for (i=0; i<info.batonCount; ++i) prefabs[j++] = batonPrefab;
	for (i=0; i<info.sprayCount; ++i) prefabs[j++] = sprayPrefab;
	while (j < 12) prefabs[j++] = shieldPrefab;
	for (i=0; i<info.bombCount; ++i) prefabs[j++] = bombPrefab;
	for (i=0; i<info.shieldCount; ++i) prefabs[j++] = shieldPrefab;
	
	// shuffle prefab list
	shuffleArray(prefabs, 0, 12);
	shuffleArray(prefabs, 12, enemyCount);
	
	// instantiate prefab list
	for (i=0; i<enemyCount; ++i) {
		enemys[i] = Instantiate(prefabs[i], gridPosition(i), Quaternion.identity);
		enemys[i].transform.parent = policeGroup.transform;
	}
	
	// apply physics joint to row 1
	for (i=0; i<12; ++i) {
		var sj : SliderJoint2D = enemys[i].AddComponent(SliderJoint2D);
		sj.angle = 90f;
		sj.collideConnected = true;
		sj.connectedAnchor = enemys[i].transform.position;
	}
	for (i=0; i<11; ++i) {
		var dj : DistanceJoint2D = enemys[i].AddComponent(DistanceJoint2D);
		dj.distance = 0.6f + 0.037f;
		dj.collideConnected = true;
		dj.connectedBody = enemys[i+1].rigidbody2D;		
	}
}

// earn or spend coins
function coinAdd (n : int) {
	coin += n;
	uiController.UpdateCoin(coin);
	uiController.SetBuyButton(coin >= citizenPrice);
}

// shuffle prefab array, from index p to q-1
function shuffleArray (array : GameObject[], p : int, q : int) {
	var i : int;
	var j : int;
	var tmp : GameObject;
	for (i=p; i<q; ++i) {
		j = Random.Range(i, q);
		tmp = array[i];
		array[i] = array[j];
		array[j] = tmp;
	}
}

// calculate position for grid number n
function gridPosition (n : int) {
	var space = 0.6f + 0.037f;
	var x = -3.503f + (n % 12) * space;
	var y = 2.5f + (n / 12) * space;
	return Vector2(x, y);
}