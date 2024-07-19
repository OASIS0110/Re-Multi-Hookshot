//@ts-check
import { world } from '@minecraft/server'

/**
 * @param {import ('@minecraft/server').Entity} entity entity
 * @param {String} scoreboard scoreboard object name
 * @returns {number|null}
 */
export function getScore(entity, scoreboard) {
	const value = world.scoreboard.getObjective(scoreboard)?.getScore(entity);
	return value ?? null;
}

/**
 * 
 * @param {import ('@minecraft/server').Entity} entity entity
 * @param {String} scoreboard scoreboard object name
 * @param {Number} score add number
 */
export function addScore(entity, scoreboard, score) {
	world.scoreboard.getObjective(scoreboard)?.addScore(entity, score);
}

/**
 * @param {import ('@minecraft/server').Entity} entity entity
 * @param {String} scoreboard scoreboard object name
 * @param {Number} score set number
 */
export function setScore(entity, scoreboard, score) {
	world.scoreboard.getObjective(scoreboard)?.setScore(entity, score);
}

/**
 * @param {import ('@minecraft/server').Entity} entity entity
 * @param {String} scoreboard scoreboard object name
 */
export function resetScore(entity, scoreboard) {
	world.scoreboard.getObjective(scoreboard)?.removeParticipant(entity)
}