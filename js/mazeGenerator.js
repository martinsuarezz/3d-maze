function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class PrimGenerator{
    constructor(height, width) {
        this.height = height;
        this.width = width;
        this.initializeVariables();
    }

    initializeVariables(){
        this.matrix = [];
        let row = [];
        this.walls = []

        for (let i = 0; i < this.width; i++)
            row.push("0");

        for (let j = 0; j < this.height; j++)
            this.matrix.push(row.slice());
    }

    isOutOfBounds(x, y){
        if (x < 0 || y < 0 || x >= this.height || y >= this.width)
            return true;
        return false;
    }
    
    markVisited(x, y){
        if (this.isOutOfBounds(x, y))
            return;
        this.matrix[x][y] = "V";
    }

    isVisited(x, y){
        if (this.isOutOfBounds(x, y))
            return false;
        return this.matrix[x][y] == "V";
    }

    dividesOnlyOneVisited(x, y){
        let visited = 0;
        visited += this.isVisited(x - 1, y);
        visited += this.isVisited(x + 1, y);
        visited += this.isVisited(x, y - 1);
        visited += this.isVisited(x, y + 1);
        return visited == 1;
    }

    getOpposingVisited(x, y){
        if (this.isVisited(x - 1, y))
            return [x + 1, y];
        if (this.isVisited(x + 1, y))
            return [x - 1, y];
        if (this.isVisited(x, y - 1))
            return [x, y + 1];
        if (this.isVisited(x, y + 1))
            return [x, y - 1];
    }

    addAdjacenteWallsToList(x, y){
        for (let i = -1; i <= 1; i++){
            for (let j = -1; j <= 1; j++){
                if (i == j || (i != 0 && j != 0))
                    continue;
                if (this.isOutOfBounds(x + i, y + j))
                    continue;
                this.walls.push([x + i, y + j]);
            }
        }
    }

    wallsAreEqual(wall1, wall2){
        return wall1[0] == wall2[0] && wall1[1] == wall2[1];
    }

    removeWalls(wall){
        let indexes = [];
        for (let i = 0; i < this.walls.length; i++){
            if (this.wallsAreEqual(wall, this.walls[i]))
                indexes.push(i);
        }

        while (indexes.length > 0){
            let i = indexes.pop();
            this.walls.splice(i, 1);
        }
    }

    generateMaze(){
        this.initializeVariables();
        let x = getRandomInt(0, this.width);
        let y = getRandomInt(0, this.height);
        x = 2, y = 0;
        this.markVisited(x, y);
        this.addAdjacenteWallsToList(x, y);
        while (this.walls.length > 0){
            let i = getRandomInt(0, this.walls.length);
            let wall = this.walls[i];
            if (this.dividesOnlyOneVisited(...wall)){
                let oposingTile = this.getOpposingVisited(...wall);
                this.markVisited(...oposingTile);
                this.markVisited(...wall);
                this.addAdjacenteWallsToList(...oposingTile);
            }

            this.removeWalls(this.walls[i]);
        }
        return this.matrix;
    }
    
}