(function()
{
    // Game Variables
    let stage;
    let playerstats;
    let assets;
    let slotMachineBackground;
    // Game Buttons
    let spinButton;
    let bet1Button;
    let betMaxButton;
    let resetButton;
    let quitButton;
    // Game Labels
    let jackPotLabel;
    let creditLabel;
    let winningsLabel;
    let betLabel;
    let leftReel;
    let middleReel;
    let rightReel;
    let betLine;
    let tiles = [];
    let reelContainers = [];
    let NUM_REELS = 3
    // symbol tallies
    let grapes = 0;
    let bananas = 0;
    let oranges = 0;
    let cherries = 0;
    let bars = 0;
    let bells = 0;
    let sevens = 0;
    let blanks = 0;
    let manifest = 
    [
        { id: "background", src: "./Assets/images/background.png" },
        { id: "banana", src: "./Assets/images/banana.gif" },
        { id: "bar", src: "./Assets/images/bar.gif" },
        { id: "bell", src: "./Assets/images/bell.gif" },
        { id: "bet_line", src: "./Assets/images/bet_line.gif" },
        { id: "bet1Button", src: "./Assets/images/bet1Button.png" },
        { id: "betMaxButton", src: "./Assets/images/betMaxButton.png" },
        { id: "blank", src: "./Assets/images/blank.gif" },
        { id: "cherry", src: "./Assets/images/cherry.gif" },
        { id: "grapes", src: "./Assets/images/grapes.gif" },
        { id: "orange", src: "./Assets/images/orange.gif" },
        { id: "seven", src: "./Assets/images/seven.gif" },
        { id: "spinButton", src: "./Assets/images/spinButton.png" },
        { id: "resetButton", src: "./Assets/images/resetButton.png"},
        { id: "quitButton", src: "./Assets/images/quitButton.png"},
    ];
    // Player Stats
    let playerBet = 10;
    let winnings = 0;
    let credits = 1000;
    let jackpot = 10000000;
    let win = 0;
    let loss = 0;
    let winRatio =0;
    let turn =0;
    let spinResult;
    
   
    // This function triggers first and "Preloads" all the assets
    function Preload() {
        assets = new createjs.LoadQueue();
        assets.installPlugin(createjs.Sound);
        assets.on("complete", Start);
        assets.loadManifest(manifest);
    }
    // This function triggers after everything has been preloaded
    // This function is used for config and initialization
    function Start() {
        console.log("App Started...");
        let canvas = document.getElementById("canvas");
        stage = new createjs.Stage(canvas);
        createjs.Ticker.framerate = 60; // 60 FPS or 16.667 ms
        createjs.Ticker.on("tick", Update);
        stage.enableMouseOver(20);
        Config.Globals.AssetManifest = assets;
        Main();
    }
    // called every frame
    function Update() {
        stage.update();
    }
    /* Utility function to check if a value falls within a range of bounds */
    function checkRange(value, lowerBounds, upperBounds) {
        if (value >= lowerBounds && value <= upperBounds) {
            return value;
        }
        else {
            return !value;
        }
    }
    
    function jackPotCheck() 
    {
        // compare two random values 
        let tryJackPot = Math.floor(Math.random() * 51 + 1);
        let winJackPot = Math.floor(Math.random() * 51 + 1);
        if (tryJackPot == winJackPot) 
        {
            alert("Congratulations! You Won $" + jackpot + " Jackpot!!");
            credits += jackpot;
            winnings += jackpot;
            jackpot = 1000;
            updateJackpot();
        }
    }
    // Function displaying message if player wins
    function displayWinMessage()
    {
        credits += winnings;
        console.log("You Won: $" + winnings);
        jackPotCheck();
    }
     // Function displaying message if player loses
     function displayLossMessage()
     {
         credits -= playerBet;
         console.log("You Lost!")
     }
     //Function displaying player stats on console
    /* When this function is called it determines the betLine results.
    e.g. Bar - Orange - Banana */
    function Reels() {
        var betLine = [" ", " ", " "];
        var outCome = [0, 0, 0];
        for (var spin = 0; spin < 3; spin++) {
            outCome[spin] = Math.floor((Math.random() * 65) + 1);
            switch (outCome[spin]) {
                case checkRange(outCome[spin], 1, 27): // 41.5% probability
                    betLine[spin] = "blank";
                    blanks++;
                    break;
                case checkRange(outCome[spin], 28, 37): // 15.4% probability
                    betLine[spin] = "grapes";
                    grapes++;
                    break;
                case checkRange(outCome[spin], 38, 46): // 13.8% probability
                    betLine[spin] = "banana";
                    bananas++;
                    break;
                case checkRange(outCome[spin], 47, 54): // 12.3% probability
                    betLine[spin] = "orange";
                    oranges++;
                    break;
                case checkRange(outCome[spin], 55, 59): //  7.7% probability
                    betLine[spin] = "cherry";
                    cherries++;
                    break;
                case checkRange(outCome[spin], 60, 62): //  4.6% probability
                    betLine[spin] = "bar";
                    bars++;
                    break;
                case checkRange(outCome[spin], 63, 64): //  3.1% probability
                    betLine[spin] = "bell";
                    bells++;
                    break;
                case checkRange(outCome[spin], 65, 65): //  1.5% probability
                    betLine[spin] = "seven";
                    sevens++;
                    break;
            }
        }
        return betLine;
    }
    function buildInterface() {
        // Slot Machine Background
        slotMachineBackground = new Core.GameObject("background", Config.Screen.CENTER_X, Config.Screen.CENTER_Y, true);
        stage.addChild(slotMachineBackground);      
        // Buttons
        spinButton = new UIObjects.Button("spinButton", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(spinButton);
        quitButton = new UIObjects.Button("quitButton", Config.Screen.CENTER_X - 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(quitButton);
        bet1Button = new UIObjects.Button("bet1Button", Config.Screen.CENTER_X - 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(bet1Button);
        betMaxButton = new UIObjects.Button("betMaxButton", Config.Screen.CENTER_X + 67, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(betMaxButton);
        resetButton = new UIObjects.Button("resetButton", Config.Screen.CENTER_X + 135, Config.Screen.CENTER_Y + 176, true);
        stage.addChild(resetButton);
        // Labels
        jackPotLabel = new UIObjects.Label("10000000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 175, true);
        stage.addChild(jackPotLabel);
        creditLabel = new UIObjects.Label("1000", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X - 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(creditLabel);
        winningsLabel = new UIObjects.Label("0", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X + 94, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(winningsLabel);
        betLabel = new UIObjects.Label("0", "20px", "Consolas", "#FF0000", Config.Screen.CENTER_X, Config.Screen.CENTER_Y + 108, true);
        stage.addChild(betLabel);
        // Reel GameObjects
        leftReel = new Core.GameObject("bell", Config.Screen.CENTER_X - 79, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(leftReel);
        middleReel = new Core.GameObject("banana", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(middleReel);
        rightReel = new Core.GameObject("bar", Config.Screen.CENTER_X + 78, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(rightReel);
        // Bet Line
        betLine = new Core.GameObject("bet_line", Config.Screen.CENTER_X, Config.Screen.CENTER_Y - 12, true);
        stage.addChild(betLine);
    }
    function interfaceLogic() 
    {
        spinButton.on("click", () => {
            // reel test
            let reels = Reels();
            // example of how to replace the images in the reels
            leftReel.image = assets.getResult(reels[0]);
            middleReel.image = assets.getResult(reels[1]);
            rightReel.image = assets.getResult(reels[2]);
            determineWinnings();
        });
        bet1Button.on("click", () => {
            console.log("bet1Button Button Clicked");
            playerBet = 1;
            console.log("Bet Changed to: " + playerBet);
            betLabel.text = playerBet.toString();
        });
        betMaxButton.on("click", () => {
            console.log("betMaxButton Button Clicked");
            playerBet = 50;
            console.log("Bet Changed to: " + playerBet);
            betLabel.text = playerBet.toString();
        });
        quitButton.on("click", () => {
            console.log("quitButton Button Clicked");
            spins = 0;
            win = 0;
            loss = 0;
            jackpotWins = 0;
            jackpot = 10000000;
            playerBet = 0;
            winnings = 0;
            credits = 0000;
            //spinButton.addEventListener("click", spinButton);
            alert("Thank You For Playing the Game!")
            betLabel.text = playerBet.toString();
            creditLabel.text = credits.toString();
            winningsLabel.text = winnings.toString();
        });
        resetButton.on("click", () => {
            console.log("resetButton Button Clicked");
            spins = 0;
            win = 0;
            loss = 0;
            jackpotWins = 0;
            jackpot = 10000000;
            playerBet = 1;
            winnings = 0;
            credits = 1000;
            //spinButton.addEventListener("click", spinButton);
            betLabel.text = playerBet.toString();
            creditLabel.text = credits.toString();
            winningsLabel.text = winnings.toString();
        });
    }
    // This function calculates the player's winnings, if any 
    /* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (blanks == 0) {
        if (grapes == 3) {
            winnings = betAmount * 10;
        } else if (lemons == 3) {
            winnings = betAmount * 20;
        } else if (oranges == 3) {
            winnings = betAmount * 30;
        } else if (cherries == 3) {
            winnings = betAmount * 40;
        } else if (bars == 3) {
            winnings = betAmount * 50;
        } else if (bells == 3) {
            winnings = betAmount * 75;
        } else if (sevens == 3) {
            winnings = betAmount * 100;
        } else if (grapes == 2) {
            winnings = betAmount * 2;
        } else if (lemons == 2) {
            winnings = betAmount * 2;
        } else if (oranges == 2) {
            winnings = betAmount * 3;
        } else if (cherries == 2) {
            winnings = betAmount * 4;
        } else if (bars == 2) {
            winnings = betAmount * 5;
        } else if (bells == 2) {
            winnings = betAmount * 10;
        } else if (sevens == 2) {
            winnings = betAmount * 20;
        } else {
            winnings = betAmount * 1;
        }
        if (sevens == 1) {
            winnings = betAmount * 5;
        }
        win++;
        winningText.text = "Winnings: " + winnings.toString();
    } else {
        loss++;
    }
}
    // app logic goes here
    function Main() 
    {
        buildInterface();
        interfaceLogic();
        gameLoop();
    }
    window.addEventListener("load", Preload);
})();    
//# sourceMappingURL=app.js.map