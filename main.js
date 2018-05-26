const star = function(x, y) {
    let element = document.createElement('img')
    element.src = 'star.png'
    element.className = 'test'
    element.style.top = y + 'px'
    element.style.left = x + 'px'
    document.querySelector('.game').appendChild(element)

    let width = 50
    let height = 50
    let rotation = 0
    let connected = false
    return {
        update() {
            //element.style.transform = `rotate(${rotation}deg)`
            rotation += 5
        },
        toggleSelected() {
            this.connected = !this.connected
            if(this.connected) element.src = 'selectedstar.png'
            else element.src = 'star.png'
        },
        shiftLocation() {
            //shift star location
        },
        get connected() {
            return connected
        },
        set connected(value) {
            connected = value
        },
        get x() { return x }, get y() { return y },
        get width() { return width}, get height() { return height }
    }
}

const starManager = (function() {
    stars = [star(100, 100), star(200, 200)]
    stars[0].connected = true
    return {
        toggleSelectedStar() {
            stars.forEach((star) => {
                star.toggleSelected()
            })
        },
        respawnStar() {
            let angleToNewStar = Math.floor(Math.random() * (360 - 90 + 1) + 90)
            let degreesToRotate = player.currentRotation > 0 ? angleToNewStar - player.currentRotation : 360 - (angleToNewStar - Math.abs(player.currentRotation))
            if(degreesToRotate < 0) degreesToRotate = 360 + degreesToRotate
            console.log(degreesToRotate)

            //Pick a random angle (0-360) to spawn the star at relative to the host star
            //Work out the amount of degrees the player has to turn to reach the new star
            //

        },
        get connectedStar() {
            return stars.find((star) => star.connected == true)
        },
        get unconnectedStar() {
            return stars.find((star) => star.connected == false)
        }
    }
})()

const player = (function() {
    let element = document.createElement('img')
    element.src = 'player.png'
    element.className = 'player'
    
    let basePositionx, basePositiony
    let hitboxPositionx, hitboxPositiony
    let hitboxWidthAndHeight = 5

    let currentHeight = 140
    let heightChangeSpeed = 5
    let heightChangeDirection = 0

    let currentRotation = 0
    let rotatingClockwise = true
    let rotationSpeed = 5
    let degreesPerSecond = rotationSpeed * 60

    function checkCollision() {
        var collidingX = (starManager.unconnectedStar.x < hitboxPositionx + hitboxWidthAndHeight && starManager.unconnectedStar.x + starManager.unconnectedStar.width > hitboxPositionx)
        var collidingY = (starManager.unconnectedStar.y < hitboxPositiony + hitboxWidthAndHeight && starManager.unconnectedStar.y + starManager.unconnectedStar.width > hitboxPositiony)
        return collidingX && collidingY
    }
    function setPosition() {
        basePositionx = starManager.connectedStar.x + 25
        basePositiony = starManager.connectedStar.y + 25
        element.style.top = basePositiony + 'px'
        element.style.left = basePositionx + 'px'
    }
    function changeHostStar() {
        setPosition()
        rotatingClockwise = !rotatingClockwise
        currentRotation += 180
    }

    function changeHeightOn(event) {
        if(event.which == 38) heightChangeDirection = 1
        if(event.which == 40) heightChangeDirection = -1
    }
    function changeHeightOff(event) {
        if(event.which == 38 && heightChangeDirection != -1) heightChangeDirection = 0
        if(event.which == 40 && heightChangeDirection != 1) heightChangeDirection = 0
    }

    return {
        init() {
            document.addEventListener("keydown", changeHeightOn)
            document.addEventListener("keyup", changeHeightOff)

            setPosition()
            document.querySelector('.game').appendChild(element)
        },
        update() {
            if(checkCollision()) {
                starManager.toggleSelectedStar()
                changeHostStar()
                currentRotation = currentRotation % 360
                starManager.respawnStar()
            }
            
            currentHeight += heightChangeSpeed * heightChangeDirection
            if(currentHeight < 50) currentHeight = 50
            element.style.height = currentHeight + 'px'

            if(rotatingClockwise) currentRotation += rotationSpeed
            else currentRotation -= rotationSpeed
            currentRotation = currentRotation % 360
            element.style.transform = `rotate(${currentRotation}deg)`            
            hitboxPositionx = basePositionx + (Math.sin(currentRotation / 180 * Math.PI)) * currentHeight * -1
            hitboxPositiony = basePositiony + (Math.cos(currentRotation / 180 * Math.PI)) * currentHeight
        },
        get currentRotation() { return currentRotation }
    }
})()

player.init()

setInterval(() => {
    requestAnimationFrame(() => {
        player.update()
        stars.forEach((star) => star.update())
    })
}, 1000 / 60)