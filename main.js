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
            element.style.transform = `rotate(${rotation}deg)`
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
            let x, y, degreesToRotate
            do {
                let angleToNewStar = Math.floor(Math.random() * (360 + 1))
                let differenceBetweenAngles = Math.abs(player.currentRotation - angleToNewStar)
                if(player.rotatingClockwise) {
                    if(player.currentRotation < angleToNewStar) degreesToRotate = differenceBetweenAngles
                    else degreesToRotate = 360 - differenceBetweenAngles
                }
                else {
                    if(player.currentRotation < angleToNewStar) degreesToRotate = 360 - differenceBetweenAngles    
                    else degreesToRotate = differenceBetweenAngles
                }
                
                let minimumPossiblePlayerHeightByStar = (player.currentHeight - (degreesToRotate / player.degreesPerSecond) * player.heightChangePerSecond) + 50
                let maximumPossiblePlayerHeightByStar = (player.currentHeight + (degreesToRotate / player.degreesPerSecond) * player.heightChangePerSecond) - 50
                let distanceToNewStar = Math.floor(Math.abs(Math.random() - Math.random()) * (1 + maximumPossiblePlayerHeightByStar - minimumPossiblePlayerHeightByStar) + minimumPossiblePlayerHeightByStar);
            
                x = this.connectedStar.x + ((Math.sin((360 - angleToNewStar) / 180 * Math.PI)) * distanceToNewStar)
                y = this.connectedStar.y + ((Math.cos((360 - angleToNewStar) / 180 * Math.PI)) * distanceToNewStar)
                console.log(angleToNewStar, player.currentRotation, degreesToRotate)
            } while(x < 50 || x > window.innerWidth - 50 || y < 50 || y > window.innerHeight - 50)
            this.unconnectedStar.shiftLocation(x, y)

            for(let i = 0; i < 360; i ++) {
                if(i == 270) {
                    let element = document.createElement('div')
                    element.className = 'test'
                    element.style.top = this.connectedStar.y + 25 + ((Math.cos((360 - i) / 180 * Math.PI)) * 200) + 'px'
                    element.style.left = this.connectedStar.x + 25 + ((Math.sin((360 -i) / 180 * Math.PI)) * 200) + 'px'
                    document.querySelector('.game').appendChild(element)
                }
            }

            /*
            let element = document.createElement('div')
            element.className = 'test'
            element.style.top = y + 'px'
            element.style.left = x + 'px'
            document.querySelector('.game').appendChild(element)
            */
           //stars are spawning on top of the host star
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
    let heightChangePerSecond = heightChangeSpeed * 60

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
                //rotationSpeed = 0
                //currentHeight = 50
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
        get currentRotation() { return currentRotation }, get currentHeight() { return currentHeight },
        get rotatingClockwise() { return rotatingClockwise },
        get degreesPerSecond() { return degreesPerSecond }, get heightChangePerSecond() { return heightChangePerSecond }
    }
})()

player.init()

setInterval(() => {
    requestAnimationFrame(() => {
        player.update()
        stars.forEach((star) => star.update())
    })
}, 1000 / 60)