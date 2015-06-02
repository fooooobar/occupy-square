/*
Blast Behaviour
attack randomly
attack needs load time
*/

#pragma strict

var fireRate : float;
var projectile : BombController;
var weaponEffect : WeaponEffect;

function Attack () {
	yield WaitForSeconds(Random.value * 5f);
	while (enabled) {
		var target = randomTarget();
		if (target) {
			var p = target.transform.position + Random.insideUnitCircle;
			weaponEffect.Hit(p - transform.position);
			projectile.Strike(p);
		}
		yield WaitForSeconds(fireRate);
	}
}

function randomTarget () {
	var targets = GameObject.FindGameObjectsWithTag("Citizen");
	if (targets.length > 0) return targets[Random.Range(0, targets.length)];
	else return null;
}

function Halt () {
	enabled = false;
}
