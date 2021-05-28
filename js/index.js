const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
canvas.addEventListener('wheel', evt => evt.preventDefault());

function createWall(coord1, coord2){
    let normalVector = new BABYLON.Vector3(coord2[1] - coord1[1], 0, - (coord2[0] - coord1[0]));
    const abstractPlane = BABYLON.Plane.FromPositionAndNormal(new BABYLON.Vector3(0, 0, 0), normalVector);
    const plane = BABYLON.MeshBuilder.CreatePlane("plane", {sourcePlane: abstractPlane, sideOrientation: BABYLON.Mesh.DOUBLESIDE});

    let scale = Math.sqrt(Math.pow(coord2[1] - coord1[1], 2) + Math.pow(coord2[0] - coord1[0], 2));

    plane.scaling = new BABYLON.Vector3(scale, 1, 1);
    plane.position = new BABYLON.Vector3((coord2[0] + coord1[0]) / 2, 0, (coord2[1] + coord1[1]) / 2);

    return plane;
}

function addHorizontalWalls(scene, scheme){
    let height = scheme.length;
    let width = scheme[0].length;
    let index1, index2;
    activeWall = false;

    for (let i = 0; i < height; i++){
        if (scheme[i][0] == "0"){
            activeWall = true;
            index1 = [i, -1];
        }
        for (let j = 0; j < width; j++){
            if (scheme[i][j] == "0"){
                if (!activeWall)
                    index1 = [i, j];
                activeWall = true;
            }
            if (scheme[i][j] == "V"){
                if (activeWall){
                    index2 = [i, j - 1];
                    scene.addGeometry(createWall(index1, index2));
                }
                activeWall = false; 
            }
        }
        if (activeWall)
            scene.addGeometry(createWall(index1, [i, width]));
        activeWall = false;
    }
    scene.addGeometry(createWall([-1, -1], [-1, width]));
    scene.addGeometry(createWall([height, -1], [height, width]));
}

function addVerticalWalls(scene, scheme){
    let height = scheme.length;
    let width = scheme[0].length;
    let index1, index2;
    activeWall = false;

    for (let j = 0; j < width; j++){
        if (scheme[0][j] == "0"){
            activeWall = true;
            index1 = [-1, j];
        }
        for (let i = 0; i < height; i++){
            if (scheme[i][j] == "0"){
                if (!activeWall)
                    index1 = [i, j];
                activeWall = true;
            }
            if (scheme[i][j] == "V"){
                if (activeWall){
                    index2 = [i - 1, j];
                    scene.addGeometry(createWall(index1, index2));
                }
                activeWall = false; 
            }
        }
        if (activeWall)
            scene.addGeometry(createWall(index1, [height, j]));
        activeWall = false;
    }
    scene.addGeometry(createWall([-1, -1], [height, -1]));
    scene.addGeometry(createWall([-1, width], [height, width]));
}

function addWalls(scene){
    let mazeGen = new PrimGenerator(100, 100);
    let scheme = mazeGen.generateMaze();

    addHorizontalWalls(scene, scheme);
    addVerticalWalls(scene, scheme);    
}

// Add your code here matching the playground format
const createScene = function () {
    const scene = new BABYLON.Scene(engine);
    
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);

    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));

    return scene;
};

const scene = createScene(); //Call the createScene function

addWalls(scene);

function showWorldAxis(size) {
    var makeTextPlane = function(text, color, size) {
        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 50, scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, "bold 36px Arial", color , "transparent", true);
        var plane = BABYLON.Mesh.CreatePlane("TextPlane", size, scene, true);
        plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
        plane.material.backFaceCulling = false;
        plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
        plane.material.diffuseTexture = dynamicTexture;
    return plane;
     };
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
      BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0), 
      new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ], scene);
    axisX.color = new BABYLON.Color3(1, 0, 0);
    var xChar = makeTextPlane("X", "red", size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);
    var axisY = BABYLON.Mesh.CreateLines("axisY", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95, 0), 
        new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95, 0)
        ], scene);
    axisY.color = new BABYLON.Color3(0, 1, 0);
    var yChar = makeTextPlane("Y", "green", size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
        BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0 , -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3( 0, 0.05 * size, size * 0.95)
        ], scene);
    axisZ.color = new BABYLON.Color3(0, 0, 1);
    var zChar = makeTextPlane("Z", "blue", size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
};

showWorldAxis(1);

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
        
    engine.resize();
});

