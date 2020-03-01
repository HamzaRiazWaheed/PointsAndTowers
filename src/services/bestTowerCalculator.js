/**
 * GET Difference between the points
 * @param {Number} c1, A coordinate  
 * @param {Number} c2, A coordinate
 * @returns {Number} Distance between points on same Axis
*/
const getDistanceBetweenPointandTowerCoordinate = (c1,c2) => {
    return Math.abs((c1 - c2))
}

/**
 * Get the distance between a point and a tower
 * @param {Array} point, as [x,y], 2d location of a Point 
 * @param {Array} tower, as [x,y] 
 * @returns {Number} String line Distance Between the Point and Tower
 */
const getDistanceBetweenAPointAndATower = (point, tower) => {
    // get The Distance on X-axis.
    const distanceX = getDistanceBetweenPointandTowerCoordinate(point[0], tower[0])
    const distanceY = getDistanceBetweenPointandTowerCoordinate(point[1], tower[1])

    // Using the Pythagorean Theorem a^2 + b^2 = c^2
    // The Hypotenous will be the straight path from the tower to this point.
    // Hypotenous is square root of c
    return Math.sqrt((Math.pow(distanceX, 2) + Math.pow(distanceY, 2)))
}

/**
 * Get the power of a Tower relative a Point
 * @param {Number} towersReach Towers specified reach
 * @param {Number} distanceFromTheTower String line Distance Between the Point and Tower
 * @returns {Number} Power of the Tower relative to a point 
 */
const getPowerOfATowerRelativeToAPoint = (towersReach, distanceFromTheTower) => {
    return distanceFromTheTower > towersReach ? 0 : Math.pow((towersReach - distanceFromTheTower), 2)
}

/**
 * Get the best Tower for A point based on its relative Power to that Point
 * @param {Array} point The point to detect for
 * @param {[Array], [Array]} AllTowers All the towers availabel for checking 
 * @returns [Array] The best tower with its power relative to this point  [Number,Number,Number,Number] ([x,y,reach, power])
 * if No Tower is available then and Empty Array []
 */
const getTheBestTowerForAPoint = (point , AllTowers) => {
    console.log('# Checking for The Point: ', point.toString())
    let bestTower = AllTowers[0]
    let bestPower = 0 
    AllTowers.forEach(tower => {
        const towersReach = tower[2]
        const distanceFromTower = getDistanceBetweenAPointAndATower(point, tower)
        const towersPowerRelativeToThisPoint = getPowerOfATowerRelativeToAPoint(towersReach, distanceFromTower)

        if( towersPowerRelativeToThisPoint > bestPower ) {
            bestTower =  tower
            bestPower = towersPowerRelativeToThisPoint
        }

    })

    bestPower > 0 ? console.log(`Best link station for point ${point.toString()} is ${[bestTower[0], bestTower[1]]} with power ${bestPower}`) :  console.log(`No link station within reach for point ${point.toString()}`)

    return bestPower > 0 ? [...bestTower, bestPower] : []

}

export default getTheBestTowerForAPoint;
