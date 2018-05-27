const star = function(x, y) {
    let element = document.createElement('img')
    element.src = 'star.png'
    element.className = 'star'
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
        shiftLocation(xNew, yNew) {
            x = xNew
            y = yNew
            element.style.top = y + 'px'
            element.style.left = x + 'px'
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
    stars = [star(300, 300), star(400, 400)]
    stars[0].connected = true
    return {
        toggleSelectedStar() {
            stars.forEach((star) => {
                star.toggleSelected()
            })
        },
        respawnStar() {
            let angleToNewStar = Math.floor(Math.random() * (360 + 1))
            let differenceBetweenAngles = Math.abs(player.currentRotation - angleToNewStar)
            let degreesToRotate
            if(player.rotatingClockwise) {
                if(player.currentRotation < angleToNewStar) degreesToRotate = differenceBetweenAngles
                else degreesToRotate = 360 - differenceBetweenAngles
            }
            else {
                if(player.currentRotation < angleToNewStar) degreesToRotate = 360 - differenceBetweenAngles    
                else degreesToRotate = differenceBetweenAngles
            }
            console.log('------')
            console.log('current rotation', player.currentRotation)
            console.log('angle to new star', angleToNewStar)
            console.log('degrees to rotate', degreesToRotate)
            console.log(player.currentRotation < 0 ? 'clockwise' : 'anticlockwise')
            
            let x = this.connectedStar.x + ((Math.sin(angleToNewStar / 180 * Math.PI)) * 200 * -1)
            let y = this.connectedStar.y + ((Math.cos(angleToNewStar / 180 * Math.PI)) * 200)
            let element = document.createElement('div')
            element.className = 'test'
            element.style.top = y + 'px'
            element.style.left = x + 'px'
            document.querySelector('.game').appendChild(element)
            //let x = otherStar.x + ((Math.sin(angleFromOtherStar / 180 * Math.PI)) * distanceFromOtherStar * -1)
            //let y = otherStar.y + ((Math.cos(angleFromOtherStar / 180 * Math.PI)) * distanceFromOtherStar)
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
    let rotatingClockwise = false
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
                rotationSpeed = 0
                currentHeight = 50
            }

            currentHeight += heightChangeSpeed * heightChangeDirection
            if(currentHeight < 50) currentHeight = 50
            element.style.height = currentHeight + 'px'

            if(rotatingClockwise) currentRotation += rotationSpeed
            else currentRotation -= rotationSpeed
            currentRotation = currentRotation % 360
            if(currentRotation == -5) currentRotation = 355
            element.style.transform = `rotate(${currentRotation}deg)`            
            hitboxPositionx = basePositionx + (Math.sin(currentRotation / 180 * Math.PI)) * currentHeight * -1
            hitboxPositiony = basePositiony + (Math.cos(currentRotation / 180 * Math.PI)) * currentHeight
        },
        get currentRotation() { return currentRotation }, get rotatingClockwise() { return rotatingClockwise }
    }
})()

player.init()

setInterval(() => {
    requestAnimationFrame(() => {
        player.update()
        stars.forEach((star) => star.update())
    })
}, 1000 / 60)