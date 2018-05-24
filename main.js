const starManager = (function() {
    let stars = []
    function collidingWithPlayer(star) {
        var collidingX = (star.x < player.x + player.width && star.x + star.width > player.x)
        var collidingY = (star.y < player.y + player.width && star.y + star.width > player.y)
        return collidingX && collidingY
    }
    function shiftStar() {
        stars.forEach((star) => star.connected = !star.connected)
    }
    function getUnconnectedStar() {
        return stars.filter((star) => !star.connected)
    }
    return {
        init: function init() {
            stars.push(star(500, 500))
            stars.push(star(200, 200))
            stars[0].connected = true
            stars.forEach((star) => star.init())
        },
        registerStar: function registerStar(star) {
            stars.push(star)
        },
        update: function update() {
            stars.forEach((star) => {
                requestAnimationFrame(star.update)
                if(collidingWithPlayer(getUnconnectedStar())) shiftStar()
            })
        }

    }
})()

const star = (x, y) => {
    let element = document.createElement('img')
    element.src = 'star.png'
    element.className = 'star'
    element.style.top = y + "px"
    element.style.left = x + "px"
    let [width, height] = [25, 25]
    let rotation = 0
    let connected = false
    return {
        x, y, connected,
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
        }
    }
}

const player = (function() {
    let x, y
    let [width, height] = [25, 25]
    return {
        update: function update() {
        },
        get x() {
            return x
        },
        get y() {
            return y
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

setInterval(starManager.update, 1000 / 60)

starManager.init()

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
