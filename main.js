const starManager = (function() {
    let stars = []
    function pickSpawnLocation() {
        let x = Math.floor(Math.random() * (window.innerWidth + 1))
        let y = Math.floor(Math.random() * (window.innerHeight + 1))
        return [x, y]
    }
    function collidingWithPlayer(star) {
        var collidingX = (star.x < player.x + player.width && star.x + star.width > player.x)
        var collidingY = (star.y < player.y + player.width && star.y + star.width > player.y)
        return collidingX && collidingY
    }
    function shiftStar() {
        getConnectedStar().shift(...pickSpawnLocation())
        stars.forEach((star) => star.connected = !star.connected)
    }
    function getUnconnectedStar() {
        return stars.find((star) => !star.connected)
    }
    function getConnectedStar() {
        return stars.find((star) => star.connected)
    }
    return {
        init: function init() {
            stars.push(star(500, 500))
            stars.push(star(200, 200))
            stars[1].connected = true
            stars.forEach((star) => star.init())
        },
        update: function update() {
            stars.forEach((star) => {
                requestAnimationFrame(star.update)
            })
            if(collidingWithPlayer(getUnconnectedStar())) {
                shiftStar()
                player.setHostStar(getConnectedStar())
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
        select: function select() {
            element.src = 'selectedstar.png'
        },
        deselect: function deselect() {
            element.src = 'star.png'
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
    let sizeChange = 0
    function changeSizeOn(event) {
        if(event.which == 38) {
            sizeChange = 1
        }
        if(event.which == 40) {
            sizeChange = -1
        }
    }
    function changeSizeOff() {
        if(event.which == 38 && sizeChange != -1) {
            sizeChange = 0
        }
        if(event.which == 40 && sizeChange != 1) {
            sizeChange = 0
        }
    }
    function setHostStar(star) {
        x = star.x + 25
        y = star.y + 25
    }
    return {
        width, height,
        init: function init() {
            document.addEventListener("keydown", changeSizeOn)
            document.addEventListener("keyup", changeSizeOff)

            document.querySelector('.game').appendChild(element)
            setTimeout(() => setHostStar(starManager.requestConnectedStar()), 1000)
        },
        update: function update() {
            height += 5 * sizeChange
            if(height < 50) height = 50 
            element.style.height = height + "px"
            if(rotatingClockwise) rotation += 5
            else rotation -= 5
            rotation = rotation % 360
            element.style.transformOrigin = 'top'
            element.style.transform = `rotate(${rotation}deg)`
            element.style.top = y + "px"
            element.style.left = x + "px"
            collisionx = x + ((Math.sin(rotation / 180 * Math.PI)) * height * -1)
            collisiony = y + height * (Math.cos(rotation / 180 * Math.PI))
        },
        get x() {
            return collisionx
        },
        get y() {
            return collisiony
        },
        setHostStar
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
setInterval(starManager.update, 1000 / 60)

requestAnimationFrame(function temporary() {
    player.update()
    testimage.update()
    requestAnimationFrame(temporary)
})


//Need a menu

//Need a game screen

//Need a death screen


//Need a player
//Need a star factory
//Need a star generator


//The player needs to be able to press the up and down arrows
//The player needs to be able to turn around the stars
//The player needs collision detection with the stars
//The player needs to be able to notify the star generator when it connects with a new star
//The star generator needs to pick the location of a new star
