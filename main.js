const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 300;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 500;


const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');
const road = new Road(carCanvas.width/2,carCanvas.width*0.9);
const n = 1000;
const car = generateCars(n);
let bestcar = car[0];
if(localStorage.getItem("bestcar")){
    for(let i=0;i<car.length;i++){
        car[i].brain = JSON.parse(localStorage.getItem("bestcar"));
        if(i!=0){
            NeuralNetwork.mutate(car[i].brain,0.15);
        }
    }
}
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2),
];

animate();

function save(){
    localStorage.setItem("bestcar",JSON.stringify(bestcar.brain));
}

function generateCars(N){
    const cars = [];
    for(let i=0;i<N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50, "AI",3));
    }
    return cars;
}
function discard(){
    localStorage.removeItem("bestcar");
}

function animate(time){ 
    for(let i=0;i<traffic.length;i++){
        traffic[i].update(road.borders);
    }
    for(let i=0;i<car.length;i++){
        car[i].update(road.borders,traffic);
    }
    bestcar = car.find(c=>c.y==Math.min(...car.map(c=>c.y)));
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    carCtx.translate(0,-bestcar.y+carCanvas.height*0.7);
    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx,'red');
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<car.length;i++){
        car[i].draw(carCtx,'blue');
    }
    carCtx.globalAlpha=1;
    bestcar.draw(carCtx,'blue',true);
    carCtx.restore();
    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestcar.brain);
    requestAnimationFrame(animate);
}