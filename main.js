// get the canvas elements
const carCanvas=document.getElementById("carCanvas");
carCanvas.width=window.innerWidth/2;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=window.innerWidth/2;

// get the canvas contexts
const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

// create a road 
const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

// create 1000 number of AI cars
const N=1000;
const cars=generateCars(N);

// let the best car be the first car and other cars be mutated versions of the best car
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.2);
        }
    }
}

// create some dummy cars having a random color which is deter,mined by the getRandomColor function in utils.js
const traffic=[
    new Car(road.getLaneCenter(1),-100,45,75,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-300,40,75,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-300,45,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-500,50,75,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-500,45,80,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-700,45,75,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-700,45,75,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-150,40,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-450,50,80,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1300,40,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1000,40,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-800,40,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-1400,45,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-1200,50,80,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2)-50,-150,40,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2)+100,-450,50,80,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1)-45,-1300,40,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1)+90,-1000,40,70,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2)-100,-1200,50,80,"DUMMY",2,getRandomColor()),
];

animate();

// saves the best car's brain to local storage
function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

// deletes the best car's brain from local storage
function discard(){
    localStorage.removeItem("bestBrain");
}

// create N number of AI cars
function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,50,80,"AI"));
    }
    return cars;
}

function animate(time){

    // animate dummy cars (trafffic) who have no brain and sensor 
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders,[]);
    }
    // animate AI cars who have brain and sensor 
    for(let i=0;i<cars.length;i++){
        cars[i].update(road.borders,traffic);
    }

    // set the best car to the car who is the farthest (least y value) (y axis in computer graphics is inverted)
    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));

    // set the height of the canvas to the height of the window
  // we are setting the height of the car canvas here and not with the width because whenever the dimension of the canvas is changed, canvas is cleared and as its in animation function, it serems like car is moving because of requestAnimationFrame. If we set the height out side this function, with the width, the car wil leave a trail wherever it moves
    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    // save the car context
    carCtx.save();

    // translate the canvas (just vertically) by an amount = y position of the best car + 70% of the height of the car canvas
    // this will create the effect of car moving down the road
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    // draw the road and cars
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2; //reduce the opacity of the AI cars other than the best car
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1; //reset the opacity to 1 for the best car
    bestCar.draw(carCtx,true);

    //restore the car context
    // By saving and restoring the state, you ensure that modifications made within one section do not affect subsequent drawing operations
    carCtx.restore();

    // creating neural network visualiser and a dynamic effect where the dash pattern of lines in the visualisation appears to shift or animate over time.
    networkCtx.lineDashOffset=-time/50; //negative value to make the dash pattern move to the top (representing the feed forward)
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    //calls the animate function again and again with the updated values so that it appears like animation
    requestAnimationFrame(animate);
}