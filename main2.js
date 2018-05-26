const starManager = (function() {
    let stars = []
    function pickSpawnLocation(shiftingStar, otherStar) {
        /*
        let distanceFromOtherStar = 0
        do {
            distanceFromOtherStar = Math.floor(Math.random() * (200 - 50 + 1) + 50)
        } while(distanceFromOtherStar < player.height + 40 && distanceFromOtherStar > player.height)
        let angleFromOtherStar = Math.floor(Math.random() * 360 + 1)
        let x = otherStar.x + ((Math.sin(angleFromOtherStar / 180 * Math.PI)) * distanceFromOtherStar * -1)
        let y = otherStar.y + ((Math.cos(angleFromOtherStar / 180 * Math.PI)) * distanceFromOtherStar)
        console.log(angleFromOtherStar)
        return [x, y]
        */

        let playerSpeed = player.rotationSpeed * 60
        console.log(playerSpeed)
        let playerAngle = player.degreesToZero 
        console.log(playerAngle)

        //return [x, y]
        //player speed = rotation * 60
        //new star angle - player angle = angle from player to star
        //multiply player extend rate by (player rotation speed / degrees to rotate)

        //calculate angle from player to star 
        //place star within the range the player can extend to during the time it takes to rotate to the star
        //When player is rotating, angle is from 0-360 or 0 - -360 depending on direction
        //rotation is = 0 when the player is facing down
        //anglefromotherstar is from 0 (straight down) to the new star
    }
    function collidingWithPlayer(star) {
        var collidingX = (star.x < player.x + player.width && star.x + star.width > player.x)
        var collidingY = (star.y < player.y + player.width && star.y + star.width > player.y)
        return collidingX && collidingY
    }
    function shiftStar() {
        getConnectedStar().shift(...pickSpawnLocation(getConnectedStar(), getUnconnectedStar()))
        stars.forEach((star) => {
            star.connected = !star.connected
            star.toggleSelect()
        })
    }
    function getUnconnectedStar() {
        return stars.find((star) => !star.connected)
    }
    function getConnectedStar() {
        return stars.find((star) => star.connected)
    }
    return {
        init: function init() {
            stars.push(star(300, 300))
            stars.push(star(200, 200))
            stars[1].connected = true
            stars[1].toggleSelect()
            stars.forEach((star) => star.init())
        },
        update: function update() {
            stars.forEach((star) => {
                requestAnimationFrame(star.update)
            })
            if(collidingWithPlayer(getUnconnectedStar())) {
                shiftStar()
                player.changeHostStar(getConnectedStar())
            }

        },
        requestConnectedStar: getConnectedStar
    }
})()

const star = (x, y) => {
    let element = document.createElement('img')
    element.src = 'star.png'
    element.className = 'star'
    element.style.top = y + "px"
    element.style.left = x + "px"
    let [width, height] = [50, 50]
    let rotation = 0
    let connected = false
    return {
        x, y, connected, width, height,
        init: function init() {
            document.querySelector('.game').appendChild(element)
        },
        update: function update() {
            element.style.transform = `rotate(${rotation}deg)`
            rotation += 5
        },
        toggleSelect: function toggleSelect() {
            if(this.connected) element.src = 'selectedstar.png'
            else element.src = 'star.png'
        },
        shift: function shift(xNew, yNew) {
            this.x = xNew
            this.y = yNew
            element.style.top = this.y + "px"
            element.style.left = this.x + "px"
        }
    }
}

const player = (function() {
    let element = document.createElement('img')
    element.src = 'player.png'
    element.className = 'player'
    let [x, y] = [100, 100]
    let collisionx, collisiony
    let [width, height] = [5, 75]
    element.style.width = width + "px"
    element.style.height = height + "px"
    element.style.top = y + "px"
    element.style.left = x + "px"
    let rotatingClockwise = true
    let rotation = 0
    let rotationSpeed = 5
    let sizeChangeSpeed = 5
    let sizeChangeDirection = 0
    function changeSizeOn(event) {
        if(event.which == 38) sizeChangeDirection = 1
        if(event.which == 40) sizeChangeDirection = -1
    }
    function changeSizeOff(event) {
        if(event.which == 38 && sizeChangeDirection != -1) sizeChangeDirection = 0
        if(event.which == 40 && sizeChangeDirection != 1) sizeChangeDirection = 0
    }
    function changeHostStar(star) {
        x = star.x + 25
        y = star.y + 25
        rotatingClockwise = !rotatingClockwise
        rotation += 180
    }
    return {
        width, height, sizeChangeSpeed, rotationSpeed,
        init: function init() {
            document.addEventListener("keydown", changeSizeOn)
            document.addEventListener("keyup", changeSizeOff)

            document.querySelector('.game').appendChild(element)
            changeHostStar(starManager.requestConnectedStar())
            rotation = 0
        },
        update: function update() {
            height += sizeChangeSpeed * sizeChangeDirection
            if(height < 50) height = 50 
            element.style.height = height + "px"
            if(rotatingClockwise) rotation += rotationSpeed
            else rotation -= rotationSpeed
            rotation = rotation % 360
            element.style.transformOrigin = 'top'
            element.style.transform = `rotate(${rotation}deg)`
            collisionx = x + ((Math.sin(rotation / 180 * Math.PI)) * height * -1)
            collisiony = y + height * (Math.cos(rotation / 180 * Math.PI))
        },
        get x() {
            return collisionx
        },
        get y() {
            return collisiony
        },
        get degreesToZero() {
            if(rotatingClockwise == true) {
                return 360 - rotation
            }
            else {
                return 360 + rotation
            }
        },
        get rotationDirection() {
            return rotatingClockwise
        },
        changeHostStar
    }
})()

const testimage = (function() {
    let element = document.createElement('div')
    element.className = 'test'
    document.querySelector('.game').appendChild(element)
    return {
        update: function update() {
            element.style.top = player.y + "px"
            element.style.left = player.x + "px"
        }
    }
})()

const gameManager = (function() {
    const gameDiv = document.querySelector('.game')
    function appendButtonToGame(callback, classtoSet, text) {
        let button = document.createElement('button')
        button.className = classtoSet
        button.addEventListener('click', callback)
        button.textContent = text
        gameDiv.appendChild(button)
    }

    function setState(state) {
        if(state == 'menu')
            setStateToMenu()
        else if(state == 'game')
            setStateToGame()
        else if(state == 'retry')
            setStateToRetry()
        else throw new Error('Invalid state')
    }
    function setStateToMenu() {
        gameDiv.innerHTML = ''
        var startGame = () => {
            setStateToGame()
        }
        appendButtonToGame(startGame, 'startButton', 'Play')
    }
    function setStateToGame() {
        gameDiv.innerHTML = ''

    }
    function setStateToRetry() {
        var retryGame = () => {

        }
    }
    return {
        setState
    }
}())

starManager.init()
player.init()

setInterval(() => {
    requestAnimationFrame(() => {
        player.update()
        testimage.update()
        starManager.update()
    })
}, 1000 / 60)

/*
setInterval(() => {
    player.update()
    testimage.update()
}, 100)
*/